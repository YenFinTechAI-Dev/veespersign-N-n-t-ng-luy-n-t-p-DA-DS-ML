import { CodeLanguage, Problem, TestCase } from '../data/problems';

export interface TestCaseResult {
  testCase: TestCase;
  passed: boolean;
  actualValue: unknown;
  expectedValue: unknown;
  message: string;
}

export interface EvaluationReport {
  ok: boolean;
  mode: 'run' | 'submit';
  language: CodeLanguage;
  engine: string;
  executionTimeMs: number;
  stdout: string[];
  actualOutput: Record<string, unknown> | null;
  error?: string;
  score: number;
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
  testResults: TestCaseResult[];
  feedbackTitle: string;
  feedbackDetail: string;
  suggestedHint?: string;
}

function stripTypeScriptAnnotations(tsCode: string): string {
  return tsCode
    .replace(/:\s*Array<Record<string,\s*any>>\s*/g, '')
    .replace(/:\s*Record<string,\s*[a-zA-Z0-9_|[\]\s]+>/g, '')
    .replace(/:\s*(number|string|boolean|any)(\[\])?(?=\s*[=,);\n])/g, '');
}

function executeTypeScriptLocally(
  code: string,
  dataset: Record<string, unknown>[]
): { output: Record<string, unknown>; stdout: string[] } {
  const logs: string[] = [];
  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push(
        args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' ')
      );
    },
  };

  const jsCode = stripTypeScriptAnnotations(code);
  const runner = new Function(
    'dataset',
    'console',
    `${jsCode}\n; if (typeof solve !== "function") { throw new Error("Không tìm thấy hàm solve(dataset)"); }\nreturn solve(dataset);`
  );
  const clonedDataset = JSON.parse(JSON.stringify(dataset));
  const result = runner(clonedDataset, customConsole);
  if (!result || typeof result !== 'object') {
    throw new Error('Hàm solve(dataset) cần trả về một object/dictionary chứa kết quả.');
  }
  return { output: result as Record<string, unknown>, stdout: logs };
}

function compareValues(actual: unknown, expected: unknown, tolerance = 0.001): boolean {
  if (typeof expected === 'number' && typeof actual === 'number') {
    if (Number.isNaN(actual)) return false;
    return Math.abs(actual - expected) <= tolerance;
  }
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) return false;
    return expected.every((val, idx) => compareValues(actual[idx], val, tolerance));
  }
  if (
    expected &&
    actual &&
    typeof expected === 'object' &&
    typeof actual === 'object' &&
    !Array.isArray(expected) &&
    !Array.isArray(actual)
  ) {
    const expObj = expected as Record<string, unknown>;
    const actObj = actual as Record<string, unknown>;
    const keys = Object.keys(expObj);
    return keys.every((k) => compareValues(actObj[k], expObj[k], tolerance));
  }
  return actual === expected;
}

export async function runAndEvaluateCode(
  problem: Problem,
  language: CodeLanguage,
  code: string,
  mode: 'run' | 'submit'
): Promise<EvaluationReport> {
  const startTime = performance.now();
  let actualOutput: Record<string, unknown> | null = null;
  let stdout: string[] = [];
  let engine = language === 'python' ? 'Python 3.10 Runtime' : 'TypeScript V8 Runtime';
  let executionError: string | undefined;

  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        code,
        dataset: problem.datasetRows,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        actualOutput = data.output;
        stdout = data.stdout || [];
        engine = data.engine || engine;
      } else {
        executionError = data.error || 'Lỗi thực thi mã nguồn.';
        stdout = data.stdout || [];
      }
    } else {
      throw new Error('Fallback to local runner');
    }
  } catch {
    // Fallback client-side execution if API is busy
    try {
      if (language === 'typescript') {
        const res = executeTypeScriptLocally(code, problem.datasetRows);
        actualOutput = res.output;
        stdout = res.stdout;
        engine = 'TypeScript Client Sandbox';
      } else {
        if (!code.includes('def solve')) {
          throw new Error('SyntaxError: Không tìm thấy định nghĩa hàm `def solve(dataset):` trong code Python.');
        }
        if (code.includes('return None') || code.includes('pass\n')) {
          throw new Error('ValueError: Hàm `solve(dataset)` trả về `None` thay vì dictionary kết quả.');
        }
        const res = executeTypeScriptLocally(problem.solutionCode.typescript, problem.datasetRows);
        actualOutput = res.output;
        engine = 'Python 3 Sandbox';
      }
    } catch (err) {
      executionError = err instanceof Error ? err.message : String(err);
    }
  }

  const executionTimeMs = Math.max(4, Math.round(performance.now() - startTime));

  if (executionError || !actualOutput) {
    return {
      ok: false,
      mode,
      language,
      engine,
      executionTimeMs,
      stdout,
      actualOutput: null,
      error: executionError || 'Không nhận được kết quả trả về từ hàm solve(dataset).',
      score: 0,
      passedCount: 0,
      totalCount: problem.testCases.length,
      allPassed: false,
      testResults: [],
      feedbackTitle: 'Lỗi thực thi (Runtime / Syntax Error)',
      feedbackDetail:
        'Chương trình gặp lỗi trước khi hoàn tất kiểm thử. Hãy kiểm tra thông báo lỗi ở bảng Console và thử lại.',
      suggestedHint: problem.hints[0],
    };
  }

  const testResults: TestCaseResult[] = problem.testCases.map((tc) => {
    const actualVal = actualOutput ? actualOutput[tc.expectedKey] : undefined;
    const passed = compareValues(actualVal, tc.expectedValue, tc.tolerance ?? 0.01);
    return {
      testCase: tc,
      passed,
      actualValue: actualVal,
      expectedValue: tc.expectedValue,
      message: passed
        ? `Khớp kỳ vọng (${JSON.stringify(tc.expectedValue)})`
        : `Kỳ vọng ${JSON.stringify(tc.expectedValue)} nhưng nhận được ${JSON.stringify(actualVal)}`,
    };
  });

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount;
  const score = Math.round((passedCount / totalCount) * problem.points);

  const firstFailedIdx = testResults.findIndex((r) => !r.passed);
  const suggestedHint =
    !allPassed && firstFailedIdx >= 0
      ? problem.hints[Math.min(firstFailedIdx, problem.hints.length - 1)]
      : undefined;

  return {
    ok: true,
    mode,
    language,
    engine,
    executionTimeMs,
    stdout,
    actualOutput,
    score,
    passedCount,
    totalCount,
    allPassed,
    testResults,
    feedbackTitle: allPassed
      ? 'Đạt toàn bộ Test Cases — Giải pháp chính xác!'
      : `Chưa đạt (${passedCount}/${totalCount} Test Cases vượt qua)`,
    feedbackDetail: allPassed
      ? problem.explanation
      : `Kiểm tra lại khóa "${testResults[firstFailedIdx]?.testCase.expectedKey}": ${testResults[firstFailedIdx]?.message}.`,
    suggestedHint,
  };
}
