import React, { useEffect, useMemo, useState } from 'react';
import {
  CodeLanguage,
  DifficultyLevel,
  INITIAL_PROBLEMS,
  Problem,
  TrackId,
  TRACK_METADATA,
} from './data/problems';
import { EvaluationReport, runAndEvaluateCode } from './utils/evaluator';
import { ProblemBankView } from './components/ProblemBankView';
import {
  SkillProgressView,
  SubmissionRecord,
} from './components/SkillProgressView';
import { ContentAndArchitectureView } from './components/ContentAndArchitectureView';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  FileSpreadsheet,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  Timer,
  XCircle,
} from 'lucide-react';

type ActiveNavTab = 'workspace' | 'bank' | 'progress' | 'content';
type LeftPanelTab = 'problem' | 'dataset' | 'submissions';

const WORKFLOW_STAGE_META: Record<
  number,
  { label: string; input: string; process: string; output: string }
> = {
  1: {
    label: '1. Chọn bài',
    input: 'Track + Difficulty',
    process: 'Tìm problem phù hợp năng lực',
    output: 'Problem Detail',
  },
  2: {
    label: '2. Đọc đề',
    input: 'Problem + Dataset',
    process: 'Phân tích yêu cầu, constraints & schema',
    output: 'Hiểu rõ Input → Output',
  },
  3: {
    label: '3. Coding',
    input: 'Problem Schema',
    process: 'Viết hàm solve(dataset) bằng Python / TS',
    output: 'Source Code',
  },
  4: {
    label: '4. Run',
    input: 'Source Code + Dataset',
    process: 'Thực thi trong Sandbox an toàn',
    output: 'Execution Result',
  },
  5: {
    label: '5. Evaluate',
    input: 'Result + Test Cases',
    process: 'So sánh Expected Output & Rules',
    output: 'Score + Feedback / Hint',
  },
  6: {
    label: '6. Progress',
    input: 'Score + History',
    process: 'Cập nhật Skill Matrix & Tiến độ',
    output: 'Learning Progress',
  },
  7: {
    label: '7. Next',
    input: 'Current Status',
    process: 'Recommendation Engine gợi ý bài kế tiếp',
    output: 'Next Problem',
  },
};

export function App() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem('df_problems_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROBLEMS.length) {
          return parsed;
        }
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_PROBLEMS;
  });

  const [activeNav, setActiveNav] = useState<ActiveNavTab>('workspace');
  const [selectedTrack, setSelectedTrack] = useState<TrackId | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    DifficultyLevel | 'ALL'
  >('ALL');

  const [currentProblemId, setCurrentProblemId] = useState<string>(
    INITIAL_PROBLEMS[0].id
  );
  const [language, setLanguage] = useState<CodeLanguage>('python');
  const [leftTab, setLeftTab] = useState<LeftPanelTab>('problem');
  const [workflowStep, setWorkflowStep] = useState<number>(2);

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('df_codemap_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('df_solved_v1');
      return saved ? JSON.parse(saved) : ['da-beg-01'];
    } catch {
      return ['da-beg-01'];
    }
  });

  const [bestScores, setBestScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('df_scores_v1');
      return saved ? JSON.parse(saved) : { 'da-beg-01': 100 };
    } catch {
      return { 'da-beg-01': 100 };
    }
  });

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('df_submissions_v1');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sub-init-1',
              problemId: 'da-beg-01',
              problemCode: 'DA-101',
              problemTitle: INITIAL_PROBLEMS[0].title,
              track: 'DA',
              language: 'python',
              score: 100,
              maxPoints: 100,
              allPassed: true,
              executionTimeMs: 18,
              timestamp: 'Hôm nay · 09:45',
              code: INITIAL_PROBLEMS[0].solutionCode.python,
            },
          ];
    } catch {
      return [];
    }
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evaluationReport, setEvaluationReport] =
    useState<EvaluationReport | null>(null);
  const [unlockedHintCount, setUnlockedHintCount] = useState<number>(0);

  const [datasetFilter, setDatasetFilter] = useState<string>('');
  const [datasetFormat, setDatasetFormat] = useState<'table' | 'json'>('table');

  const [interviewMode, setInterviewMode] = useState<boolean>(false);
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState<number>(
    25 * 60
  );

  useEffect(() => {
    try {
      localStorage.setItem('df_problems_v1', JSON.stringify(problems));
      localStorage.setItem('df_codemap_v1', JSON.stringify(codeMap));
      localStorage.setItem('df_solved_v1', JSON.stringify(solvedProblemIds));
      localStorage.setItem('df_scores_v1', JSON.stringify(bestScores));
      localStorage.setItem('df_submissions_v1', JSON.stringify(submissions));
    } catch {
      // ignore storage error
    }
  }, [problems, codeMap, solvedProblemIds, bestScores, submissions]);

  useEffect(() => {
    if (!interviewMode) return;
    const timer = setInterval(() => {
      setInterviewSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewMode]);

  const currentProblem = useMemo(
    () =>
      problems.find((p) => p.id === currentProblemId) || problems[0],
    [problems, currentProblemId]
  );

  const codeKey = `${currentProblem.id}_${language}`;
  const currentCode =
    codeMap[codeKey] !== undefined
      ? codeMap[codeKey]
      : currentProblem.starterCode[language];

  const handleCodeChange = (nextCode: string) => {
    setCodeMap((prev) => ({
      ...prev,
      [codeKey]: nextCode,
    }));
    if (workflowStep < 3) {
      setWorkflowStep(3);
    }
  };

  const recommendedProblem = useMemo(() => {
    const sameTrackUnsolved = problems.find(
      (p) =>
        p.track === currentProblem.track &&
        p.id !== currentProblem.id &&
        !solvedProblemIds.includes(p.id)
    );
    if (sameTrackUnsolved) return sameTrackUnsolved;

    const anyUnsolved = problems.find(
      (p) => p.id !== currentProblem.id && !solvedProblemIds.includes(p.id)
    );
    if (anyUnsolved) return anyUnsolved;

    const currentIdx = problems.findIndex((p) => p.id === currentProblem.id);
    return problems[(currentIdx + 1) % problems.length];
  }, [problems, currentProblem, solvedProblemIds]);

  const selectProblem = (problemId: string, startInterview = false) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;
    setCurrentProblemId(problemId);
    setEvaluationReport(null);
    setUnlockedHintCount(0);
    setDatasetFilter('');
    setLeftTab('problem');
    setWorkflowStep(2);
    setActiveNav('workspace');
    if (startInterview) {
      setInterviewMode(true);
      setInterviewSecondsLeft(target.estimatedMinutes * 60);
    }
  };

  const handleExecute = async (mode: 'run' | 'submit') => {
    setIsRunning(true);
    setWorkflowStep(mode === 'run' ? 4 : 5);

    const report = await runAndEvaluateCode(
      currentProblem,
      language,
      currentCode,
      mode
    );
    setEvaluationReport(report);
    setIsRunning(false);

    if (mode === 'submit') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const newSub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        problemId: currentProblem.id,
        problemCode: currentProblem.code,
        problemTitle: currentProblem.title,
        track: currentProblem.track,
        language,
        score: report.score,
        maxPoints: currentProblem.points,
        allPassed: report.allPassed,
        executionTimeMs: report.executionTimeMs,
        timestamp: `Hôm nay · ${timeStr}`,
        code: currentCode,
      };
      setSubmissions((prev) => [newSub, ...prev]);

      setBestScores((prev) => ({
        ...prev,
        [currentProblem.id]: Math.max(prev[currentProblem.id] || 0, report.score),
      }));

      if (report.allPassed) {
        if (!solvedProblemIds.includes(currentProblem.id)) {
          setSolvedProblemIds((prev) => [...prev, currentProblem.id]);
        }
        setWorkflowStep(7);
      } else {
        setWorkflowStep(5);
        if (unlockedHintCount === 0) {
          setUnlockedHintCount(1);
        }
      }
    }
  };

  const handleResetStarter = () => {
    setCodeMap((prev) => ({
      ...prev,
      [codeKey]: currentProblem.starterCode[language],
    }));
    setEvaluationReport(null);
    setWorkflowStep(3);
  };

  const handleLoadSolution = () => {
    if (interviewMode) return;
    setCodeMap((prev) => ({
      ...prev,
      [codeKey]: currentProblem.solutionCode[language],
    }));
    setWorkflowStep(3);
  };

  const handleIntroduceBugForDemo = () => {
    const buggyCode =
      language === 'python'
        ? `def solve(dataset):\n    # Giả lập kết quả sai để kiểm thử nhánh Wrong -> Error / Hint -> Try Again\n    return {\n        "${currentProblem.testCases[0].expectedKey}": -999\n    }\n`
        : `function solve(dataset: Array<Record<string, any>>) {\n  // Giả lập kết quả sai để kiểm thử nhánh Wrong -> Error / Hint -> Try Again\n  return {\n    ${currentProblem.testCases[0].expectedKey}: -999,\n  };\n}\n`;
    setCodeMap((prev) => ({
      ...prev,
      [codeKey]: buggyCode,
    }));
    setWorkflowStep(3);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const filteredDatasetRows = useMemo(() => {
    if (!datasetFilter.trim()) return currentProblem.datasetRows;
    const q = datasetFilter.toLowerCase();
    return currentProblem.datasetRows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? 'null')
          .toLowerCase()
          .includes(q)
      )
    );
  }, [currentProblem.datasetRows, datasetFilter]);

  const codeLineCount = useMemo(
    () => Math.max(12, currentCode.split('\n').length),
    [currentCode]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-30">
        <a
          href="#workspace"
          onClick={(e) => {
            e.preventDefault();
            setActiveNav('workspace');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap"
        >
          DataForge
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveNav('workspace')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeNav === 'workspace'
                ? 'text-slate-100 underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveNav('bank')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeNav === 'bank'
                ? 'text-slate-100 underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Problem Bank
          </button>
          <button
            onClick={() => setActiveNav('progress')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeNav === 'progress'
                ? 'text-slate-100 underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Skill Progress
          </button>
          <button
            onClick={() => setActiveNav('content')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeNav === 'content'
                ? 'text-slate-100 underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-100'
            }`}
          >
            Content & Workflow
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextMode = !interviewMode;
              setInterviewMode(nextMode);
              if (nextMode) {
                setInterviewSecondsLeft(currentProblem.estimatedMinutes * 60);
                setActiveNav('workspace');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap tabular-nums ${
              interviewMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            {interviewMode
              ? `Interview · ${formatTimer(interviewSecondsLeft)}`
              : 'Interview Mode'}
          </button>

          <button
            onClick={() => selectProblem(recommendedProblem.id, false)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap"
          >
            Bài tiếp theo ({recommendedProblem.code})
          </button>
        </div>
      </header>

      <div className="flex md:hidden items-center justify-around border-b border-slate-800 bg-slate-950 px-3 py-2 text-xs">
        {(
          [
            { id: 'workspace', label: 'Workspace' },
            { id: 'bank', label: 'Problem Bank' },
            { id: 'progress', label: 'Progress' },
            { id: 'content', label: 'Workflow' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`px-2.5 py-1 rounded font-medium ${
              activeNav === item.id
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeNav === 'bank' && (
        <ProblemBankView
          problems={problems}
          solvedProblemIds={solvedProblemIds}
          bestScores={bestScores}
          selectedTrack={selectedTrack}
          selectedDifficulty={selectedDifficulty}
          onChangeTrack={setSelectedTrack}
          onChangeDifficulty={setSelectedDifficulty}
          onSelectProblem={selectProblem}
        />
      )}

      {activeNav === 'progress' && (
        <SkillProgressView
          problems={problems}
          solvedProblemIds={solvedProblemIds}
          bestScores={bestScores}
          submissions={submissions}
          recommendedProblem={recommendedProblem}
          onSelectProblem={selectProblem}
        />
      )}

      {activeNav === 'content' && (
        <ContentAndArchitectureView
          problems={problems}
          onPublishProblem={(newProb) => {
            setProblems((prev) => [...prev, newProb]);
          }}
          onSelectProblem={(pid) => selectProblem(pid, false)}
        />
      )}

      {activeNav === 'workspace' && (
        <div className="flex-1 flex flex-col max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 gap-4">
          <div className="bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {Object.entries(WORKFLOW_STAGE_META).map(([stepNumStr, meta]) => {
                const stepNum = Number(stepNumStr);
                const isCurrent = workflowStep === stepNum;
                const isCompleted = workflowStep > stepNum;
                return (
                  <React.Fragment key={stepNum}>
                    <button
                      onClick={() => {
                        setWorkflowStep(stepNum);
                        if (stepNum === 1) setActiveNav('bank');
                        if (stepNum === 6) setActiveNav('progress');
                        if (stepNum === 7) selectProblem(recommendedProblem.id, false);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'bg-sky-500 text-slate-950 font-semibold'
                          : isCompleted
                          ? 'text-emerald-400 hover:bg-slate-900'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isCompleted ? `✓ ${meta.label}` : meta.label}
                    </button>
                    {stepNum < 7 && (
                      <span className="text-slate-700 text-xs select-none">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800/80">
              <span className="text-slate-500">Input:</span>
              <span className="text-slate-200">
                {WORKFLOW_STAGE_META[workflowStep]?.input}
              </span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-500">Output:</span>
              <span className="text-sky-400">
                {WORKFLOW_STAGE_META[workflowStep]?.output}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-lg px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                {(['ALL', 'DA', 'DS', 'ML'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTrack(t);
                      const firstMatch = problems.find(
                        (p) =>
                          (t === 'ALL' || p.track === t) &&
                          (selectedDifficulty === 'ALL' ||
                            p.difficulty === selectedDifficulty)
                      );
                      if (firstMatch) selectProblem(firstMatch.id, interviewMode);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      selectedTrack === t
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'All Tracks' : t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setSelectedDifficulty(lvl);
                        const firstMatch = problems.find(
                          (p) =>
                            (selectedTrack === 'ALL' ||
                              p.track === selectedTrack) &&
                            (lvl === 'ALL' || p.difficulty === lvl)
                        );
                        if (firstMatch) selectProblem(firstMatch.id, interviewMode);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                        selectedDifficulty === lvl
                          ? 'bg-slate-800 text-slate-100 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl === 'ALL' ? 'All Levels' : lvl}
                    </button>
                  )
                )}
              </div>

              <select
                value={currentProblem.id}
                onChange={(e) => selectProblem(e.target.value, interviewMode)}
                aria-label="Chọn bài tập"
                className="px-3 py-1.5 text-xs font-medium bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {problems
                  .filter(
                    (p) =>
                      (selectedTrack === 'ALL' || p.track === selectedTrack) &&
                      (selectedDifficulty === 'ALL' ||
                        p.difficulty === selectedDifficulty)
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} ({p.difficulty})
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2 tabular-nums">
              <span className="font-mono text-sky-400 font-semibold">
                {currentProblem.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>{TRACK_METADATA[currentProblem.track].name}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  currentProblem.difficulty === 'Beginner'
                    ? 'text-emerald-400'
                    : currentProblem.difficulty === 'Intermediate'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }
              >
                {currentProblem.difficulty}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Điểm cao nhất:{' '}
                <strong className="text-slate-200">
                  {bestScores[currentProblem.id] || 0}/{currentProblem.points} pts
                </strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-lg flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLeftTab('problem')}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      leftTab === 'problem'
                        ? 'bg-slate-800 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Đề bài & Yêu cầu
                  </button>
                  <button
                    onClick={() => setLeftTab('dataset')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      leftTab === 'dataset'
                        ? 'bg-slate-800 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
                    Dataset ({currentProblem.datasetRows.length})
                  </button>
                  <button
                    onClick={() => setLeftTab('submissions')}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      leftTab === 'submissions'
                        ? 'bg-slate-800 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Lịch sử (
                    {
                      submissions.filter(
                        (s) => s.problemId === currentProblem.id
                      ).length
                    }
                    )
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto space-y-5 max-h-[680px]">
                {leftTab === 'problem' && (
                  <>
                    <div>
                      <div className="text-xs text-slate-400">
                        <span>{currentProblem.topic}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{currentProblem.interviewTag}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {currentProblem.estimatedMinutes} phút
                        </span>
                      </div>
                      <h1 className="text-xl font-semibold text-slate-100 mt-1 leading-snug">
                        {currentProblem.title}
                      </h1>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-800/80 pt-4">
                      <h2 className="text-xs font-semibold text-sky-400">
                        01. Ngữ cảnh Nghiệp vụ & Phỏng vấn
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {currentProblem.businessContext}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-800/80 pt-4">
                      <h2 className="text-xs font-semibold text-sky-400">
                        02. Yêu cầu Tính toán (Requirements)
                      </h2>
                      <ul className="space-y-2 text-sm text-slate-200 list-disc pl-4">
                        {currentProblem.requirements.map((req, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
                      <h2 className="text-xs font-semibold text-sky-400">
                        03. Đặc tả Input → Output & Constraints
                      </h2>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-md space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Input: </span>
                          <span className="text-slate-200">
                            {currentProblem.inputDescription}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Output: </span>
                          <span className="text-slate-200">
                            {currentProblem.outputDescription}
                          </span>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-400 font-medium block mb-1">
                            Ví dụ Cấu trúc Output kỳ vọng:
                          </span>
                          <pre className="p-2.5 bg-[#0B0F17] border border-slate-800/90 rounded font-mono text-xs text-emerald-300 overflow-x-auto tabular-nums">
                            {JSON.stringify(currentProblem.expectedOutput, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <ul className="space-y-1 text-xs text-slate-400 list-disc pl-4 pt-1">
                        {currentProblem.constraints.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-amber-400 inline-flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                          04. Gợi ý từng bước (Progressive Hints)
                        </h2>
                        {interviewMode ? (
                          <span className="text-xs text-amber-400">
                            Đang khóa trong Interview Mode
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              setUnlockedHintCount((prev) =>
                                Math.min(prev + 1, currentProblem.hints.length)
                              )
                            }
                            disabled={
                              unlockedHintCount >= currentProblem.hints.length
                            }
                            className="text-xs text-sky-400 hover:text-sky-300 disabled:text-slate-600 font-medium"
                          >
                            {unlockedHintCount < currentProblem.hints.length
                              ? `Mở gợi ý (${unlockedHintCount}/${currentProblem.hints.length})`
                              : 'Đã mở toàn bộ gợi ý'}
                          </button>
                        )}
                      </div>

                      {!interviewMode && unlockedHintCount > 0 && (
                        <div className="space-y-2">
                          {currentProblem.hints
                            .slice(0, unlockedHintCount)
                            .map((hint, i) => (
                              <div
                                key={i}
                                className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-xs text-amber-200 leading-relaxed"
                              >
                                <strong className="font-semibold">
                                  Hint {i + 1}:
                                </strong>{' '}
                                {hint}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {leftTab === 'dataset' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-sky-400 font-semibold">
                          {currentProblem.datasetName}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                          {currentProblem.datasetRows.length} bản ghi ×{' '}
                          {currentProblem.datasetColumns.length} trường dữ liệu
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                        <button
                          onClick={() => setDatasetFormat('table')}
                          className={`px-2.5 py-1 text-xs rounded ${
                            datasetFormat === 'table'
                              ? 'bg-slate-800 text-slate-100 font-medium'
                              : 'text-slate-400'
                          }`}
                        >
                          Bảng (Table)
                        </button>
                        <button
                          onClick={() => setDatasetFormat('json')}
                          className={`px-2.5 py-1 text-xs rounded ${
                            datasetFormat === 'json'
                              ? 'bg-slate-800 text-slate-100 font-medium'
                              : 'text-slate-400'
                          }`}
                        >
                          JSON Raw
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-300">
                        Cấu trúc Cột (Dataset Schema)
                      </div>
                      <div className="divide-y divide-slate-800/70 border border-slate-800 rounded bg-slate-950 text-xs">
                        {currentProblem.datasetColumns.map((col) => (
                          <div
                            key={col.name}
                            className="px-3 py-2 flex items-center justify-between gap-2"
                          >
                            <span className="font-mono text-sky-300 font-medium">
                              {col.name}
                            </span>
                            <span className="text-slate-400 text-right">
                              {col.description}{' '}
                              <span className="font-mono text-slate-500">
                                ({col.type})
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={datasetFilter}
                        onChange={(e) => setDatasetFilter(e.target.value)}
                        placeholder="Lọc nhanh dòng dữ liệu trong bảng..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {datasetFormat === 'table' ? (
                      <div className="overflow-x-auto border border-slate-800 rounded">
                        <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                          <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                              {currentProblem.datasetColumns.map((c) => (
                                <th
                                  key={c.name}
                                  className="py-2 px-2.5 font-medium whitespace-nowrap"
                                >
                                  {c.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/70">
                            {filteredDatasetRows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-slate-900/60 text-slate-200"
                              >
                                {currentProblem.datasetColumns.map((c) => {
                                  const val = row[c.name];
                                  return (
                                    <td
                                      key={c.name}
                                      className="py-2 px-2.5 whitespace-nowrap"
                                    >
                                      {val === null || val === undefined ? (
                                        <span className="text-amber-400 italic">
                                          null
                                        </span>
                                      ) : (
                                        String(val)
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 overflow-x-auto max-h-80 tabular-nums">
                        {JSON.stringify(filteredDatasetRows, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {leftTab === 'submissions' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300">
                      Lịch sử nộp bài của {currentProblem.code}
                    </div>
                    {submissions.filter((s) => s.problemId === currentProblem.id)
                      .length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">
                        Bạn chưa nộp bài tập này. Hãy nhấn &ldquo;Submit & Chấm bài&rdquo; sau khi viết code.
                      </p>
                    ) : (
                      submissions
                        .filter((s) => s.problemId === currentProblem.id)
                        .map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-md flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="font-medium text-slate-200">
                                {sub.allPassed ? (
                                  <span className="text-emerald-400">
                                    ✓ Correct ({sub.score}/{sub.maxPoints} pts)
                                  </span>
                                ) : (
                                  <span className="text-amber-400">
                                    ▲ Wrong ({sub.score}/{sub.maxPoints} pts)
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-500 font-mono mt-0.5 tabular-nums">
                                {sub.language === 'python'
                                  ? 'Python 3'
                                  : 'TypeScript'}{' '}
                                · {sub.executionTimeMs}ms · {sub.timestamp}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setLanguage(sub.language);
                                setCodeMap((prev) => ({
                                  ...prev,
                                  [`${currentProblem.id}_${sub.language}`]:
                                    sub.code,
                                }));
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 rounded whitespace-nowrap"
                            >
                              Khôi phục Code
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-950/70">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                      <button
                        onClick={() => setLanguage('python')}
                        className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                          language === 'python'
                            ? 'bg-sky-500 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Python 3.10
                      </button>
                      <button
                        onClick={() => setLanguage('typescript')}
                        className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                          language === 'typescript'
                            ? 'bg-sky-500 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        TypeScript
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleIntroduceBugForDemo}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 rounded transition-colors whitespace-nowrap"
                      title="Thử nghiệm nhánh Wrong -> Error / Hint -> Try Again"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Test nhánh Sai (Wrong)
                    </button>

                    {!interviewMode && (
                      <button
                        onClick={handleLoadSolution}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        Lời giải mẫu
                      </button>
                    )}

                    <button
                      onClick={handleResetStarter}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded transition-colors whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="relative flex bg-[#090D14] font-mono text-xs leading-6 min-h-[300px] max-h-[380px] overflow-y-auto">
                  <div
                    aria-hidden="true"
                    className="select-none py-3 px-3 text-right text-slate-600 bg-[#0B0F17] border-r border-slate-800/80 tabular-nums"
                  >
                    {Array.from({ length: codeLineCount }).map((_, idx) => (
                      <div key={idx}>{idx + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={currentCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleExecute('run');
                      }
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const updated =
                          currentCode.substring(0, start) +
                          '    ' +
                          currentCode.substring(end);
                        handleCodeChange(updated);
                      }
                    }}
                    spellCheck={false}
                    aria-label="Trình soạn thảo mã nguồn"
                    className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-6 focus:outline-none resize-none w-full overflow-x-auto"
                    rows={codeLineCount}
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/80">
                  <div className="text-xs text-slate-400 font-mono">
                    Dataset gắn kèm:{' '}
                    <span className="text-slate-200">
                      {currentProblem.datasetName}
                    </span>{' '}
                    · Phím tắt: <kbd className="text-slate-300">Ctrl+Enter</kbd>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleExecute('run')}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-md transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 text-sky-400" />
                      {isRunning ? 'Đang chạy...' : 'Run Code (Step 4)'}
                    </button>

                    <button
                      onClick={() => handleExecute('submit')}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-md transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit & Chấm bài (Step 5)
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex-1 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-slate-100">
                      Kết quả Thực thi & Đánh giá Test Cases (Evaluator)
                    </h2>
                  </div>

                  {evaluationReport && (
                    <div className="text-xs font-mono text-slate-400 tabular-nums">
                      <span>{evaluationReport.engine}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{evaluationReport.executionTimeMs} ms</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span
                        className={
                          evaluationReport.allPassed
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        Score: {evaluationReport.score}/{currentProblem.points} pts
                      </span>
                    </div>
                  )}
                </div>

                {!evaluationReport ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="text-xs font-medium text-slate-300">
                      Sẵn sàng thực thi mã nguồn {language === 'python' ? 'Python 3' : 'TypeScript'}
                    </div>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Nhấn <strong>Run Code</strong> để kiểm tra kết quả đầu ra trên tập dữ liệu{' '}
                      <code className="text-slate-300">{currentProblem.datasetName}</code>, hoặc nhấn{' '}
                      <strong>Submit & Chấm bài</strong> để chấm điểm tự động và lưu tiến độ.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border ${
                        evaluationReport.allPassed
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-amber-950/30 border-amber-500/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {evaluationReport.allPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <span
                              className={`text-sm font-semibold ${
                                evaluationReport.allPassed
                                  ? 'text-emerald-300'
                                  : 'text-amber-300'
                              }`}
                            >
                              {evaluationReport.feedbackTitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {evaluationReport.feedbackDetail}
                          </p>
                        </div>

                        {evaluationReport.allPassed ? (
                          <button
                            onClick={() =>
                              selectProblem(recommendedProblem.id, false)
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-md transition-colors whitespace-nowrap shrink-0"
                          >
                            Next Problem: {recommendedProblem.code}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={handleLoadSolution}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded transition-colors whitespace-nowrap shrink-0"
                          >
                            Khôi phục code đúng & Thử lại (Try Again)
                          </button>
                        )}
                      </div>

                      {!evaluationReport.allPassed &&
                        evaluationReport.suggestedHint && (
                          <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong>Gợi ý sửa lỗi (Hint):</strong>{' '}
                              {evaluationReport.suggestedHint}
                            </div>
                          </div>
                        )}
                    </div>

                    {evaluationReport.error && (
                      <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded font-mono text-xs text-rose-200 whitespace-pre-wrap">
                        {evaluationReport.error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5 space-y-1.5">
                        <div className="text-xs font-medium text-slate-400">
                          Output trả về từ <code className="text-slate-200">solve(dataset)</code>
                        </div>
                        <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-sky-300 overflow-x-auto tabular-nums">
                          {evaluationReport.actualOutput
                            ? JSON.stringify(
                                evaluationReport.actualOutput,
                                null,
                                2
                              )
                            : '// Không có dữ liệu trả về'}
                        </pre>
                      </div>

                      <div className="md:col-span-7 space-y-2">
                        <div className="text-xs font-medium text-slate-400">
                          Chi tiết Kiểm thử ({evaluationReport.passedCount}/
                          {evaluationReport.totalCount} Test Cases)
                        </div>
                        <div className="space-y-2">
                          {evaluationReport.testResults.map((tr) => (
                            <div
                              key={tr.testCase.id}
                              className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-start justify-between gap-3 text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                                  {tr.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  )}
                                  <span>{tr.testCase.name}</span>
                                  {tr.testCase.isHidden && (
                                    <span className="text-slate-500 font-normal">
                                      · Hidden Case
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-400 pl-5">
                                  {tr.testCase.description}
                                </div>
                              </div>
                              <div className="font-mono text-right shrink-0 tabular-nums">
                                <span
                                  className={
                                    tr.passed
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                                  }
                                >
                                  {tr.passed ? 'PASS' : 'FAIL'}
                                </span>
                                <div className="text-slate-500">
                                  Actual: {JSON.stringify(tr.actualValue)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800/80 px-6 py-4 mt-auto text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          DataForge — Nền tảng luyện tập Data Analytics, Data Science & Machine Learning theo hướng thực tế và phỏng vấn.
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveNav('workspace')}
            className="hover:text-slate-300"
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveNav('bank')}
            className="hover:text-slate-300"
          >
            Problem Bank
          </button>
          <button
            onClick={() => setActiveNav('progress')}
            className="hover:text-slate-300"
          >
            Skill Progress
          </button>
          <button
            onClick={() => setActiveNav('content')}
            className="hover:text-slate-300"
          >
            Content Workflow
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
