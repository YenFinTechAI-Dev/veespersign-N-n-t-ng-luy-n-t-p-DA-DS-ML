import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function stripTypeScriptAnnotations(tsCode: string): string {
  return tsCode
    .replace(/:\s*Array<Record<string,\s*any>>\s*/g, '')
    .replace(/:\s*Record<string,\s*[a-zA-Z0-9_|[\]\s]+>/g, '')
    .replace(/:\s*(number|string|boolean|any)(\[\])?(?=\s*[=,);\n])/g, '');
}

async function runPythonCode(
  code: string,
  dataset: unknown[]
): Promise<{ ok: boolean; output?: unknown; stdout: string[]; error?: string }> {
  return new Promise((resolve) => {
    const runnerScript = `
import sys, json, io, traceback

dataset = json.loads(sys.stdin.read())
stdout_buffer = io.StringIO()
old_stdout = sys.stdout
sys.stdout = stdout_buffer

try:
    namespace = {}
    user_code = ${JSON.stringify(code)}
    exec(user_code, namespace)
    if "solve" not in namespace:
        raise RuntimeError("Không tìm thấy hàm def solve(dataset): trong mã nguồn Python.")
    result = namespace["solve"](dataset)
    sys.stdout = old_stdout
    logs = [line for line in stdout_buffer.getvalue().splitlines() if line.strip()]
    print(json.dumps({"ok": True, "output": result, "stdout": logs}))
except Exception as e:
    sys.stdout = old_stdout
    logs = [line for line in stdout_buffer.getvalue().splitlines() if line.strip()]
    tb = traceback.format_exc(limit=2)
    print(json.dumps({"ok": False, "error": f"{type(e).__name__}: {str(e)}", "stdout": logs, "traceback": tb}))
`;

    const py = spawn('python3', ['-c', runnerScript]);
    let out = '';
    let err = '';

    const timer = setTimeout(() => {
      py.kill('SIGKILL');
      resolve({
        ok: false,
        stdout: [],
        error: 'TimeoutError: Quá thời gian thực thi cho phép (3000ms). Kiểm tra vòng lặp vô hạn.',
      });
    }, 3000);

    py.stdout.on('data', (chunk) => {
      out += chunk.toString();
    });

    py.stderr.on('data', (chunk) => {
      err += chunk.toString();
    });

    py.on('close', () => {
      clearTimeout(timer);
      try {
        const lastLine = out.trim().split('\n').pop() || '';
        const parsed = JSON.parse(lastLine);
        resolve(parsed);
      } catch {
        resolve({
          ok: false,
          stdout: [],
          error: err.trim() || 'Lỗi thực thi Python.',
        });
      }
    });

    py.stdin.write(JSON.stringify(dataset));
    py.stdin.end();
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', runtime: 'Python 3.10 + TypeScript Engine' });
  });

  app.post('/api/execute', async (req, res) => {
    const { language, code, dataset } = req.body || {};
    if (!code || !Array.isArray(dataset)) {
      res.status(400).json({ ok: false, error: 'Thiếu mã nguồn hoặc dataset.' });
      return;
    }

    if (language === 'python') {
      const result = await runPythonCode(code, dataset);
      res.json({
        ...result,
        engine: 'Python 3.10 Sandbox',
      });
      return;
    }

    try {
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
      const jsCode = stripTypeScriptAnnotations(String(code));
      const fn = new Function(
        'dataset',
        'console',
        `${jsCode}\n; if (typeof solve !== "function") { throw new Error("Không tìm thấy hàm solve(dataset)"); }\nreturn solve(dataset);`
      );
      const output = fn(JSON.parse(JSON.stringify(dataset)), customConsole);
      res.json({
        ok: true,
        output,
        stdout: logs,
        engine: 'TypeScript Node Sandbox',
      });
    } catch (e) {
      res.json({
        ok: false,
        stdout: [],
        error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
        engine: 'TypeScript Node Sandbox',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
