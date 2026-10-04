import React, { useEffect, useMemo, useState } from 'react';
import {
  ALL_INITIAL_PROBLEMS,
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
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Database,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Flame,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Terminal,
  Timer,
  Trophy,
  XCircle,
} from 'lucide-react';

type ActiveNavTab = 'bank' | 'workspace' | 'progress' | 'content';
type LeftPanelTab = 'description' | 'dataset' | 'editorial' | 'submissions';
type ConsoleTab = 'testcases' | 'result';

export function App() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem('df_problems_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= ALL_INITIAL_PROBLEMS.length) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return ALL_INITIAL_PROBLEMS;
  });

  const [activeNav, setActiveNav] = useState<ActiveNavTab>('bank');
  const [selectedTrack, setSelectedTrack] = useState<TrackId | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'ALL'>('ALL');

  const [currentProblemId, setCurrentProblemId] = useState<string>(ALL_INITIAL_PROBLEMS[0].id);
  const [language, setLanguage] = useState<CodeLanguage>('python');
  const [leftTab, setLeftTab] = useState<LeftPanelTab>('description');
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('testcases');
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('df_codemap_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('df_solved_v2');
      return saved ? JSON.parse(saved) : ['da-101'];
    } catch {
      return ['da-101'];
    }
  });

  const [bestScores, setBestScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('df_scores_v2');
      return saved ? JSON.parse(saved) : { 'da-101': 100 };
    } catch {
      return { 'da-101': 100 };
    }
  });

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('df_submissions_v2');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sub-1',
              problemId: 'da-101',
              problemCode: 'DA-101',
              problemTitle: INITIAL_PROBLEMS[0].title,
              track: 'DA',
              language: 'python',
              score: 100,
              maxPoints: 100,
              allPassed: true,
              executionTimeMs: 12,
              timestamp: '10:15 AM',
              code: INITIAL_PROBLEMS[0].solutionCode.python,
            },
          ];
    } catch {
      return [];
    }
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [unlockedHintCount, setUnlockedHintCount] = useState<number>(0);

  const [datasetFilter, setDatasetFilter] = useState<string>('');
  const [datasetFormat, setDatasetFormat] = useState<'table' | 'json'>('table');

  const [interviewMode, setInterviewMode] = useState<boolean>(false);
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState<number>(25 * 60);

  useEffect(() => {
    try {
      localStorage.setItem('df_problems_v3', JSON.stringify(problems));
      localStorage.setItem('df_codemap_v2', JSON.stringify(codeMap));
      localStorage.setItem('df_solved_v2', JSON.stringify(solvedProblemIds));
      localStorage.setItem('df_scores_v2', JSON.stringify(bestScores));
      localStorage.setItem('df_submissions_v2', JSON.stringify(submissions));
    } catch {
      // ignore
    }
  }, [problems, codeMap, solvedProblemIds, bestScores, submissions]);

  useEffect(() => {
    if (!interviewMode) return;
    const timer = setInterval(() => {
      setInterviewSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewMode]);

  const currentProblemIndex = useMemo(
    () => problems.findIndex((p) => p.id === currentProblemId),
    [problems, currentProblemId]
  );

  const currentProblem = useMemo(
    () => problems[currentProblemIndex] || problems[0],
    [problems, currentProblemIndex]
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
  };

  const recommendedProblem = useMemo(() => {
    const unsolvedInTrack = problems.find(
      (p) => p.track === currentProblem.track && p.id !== currentProblem.id && !solvedProblemIds.includes(p.id)
    );
    if (unsolvedInTrack) return unsolvedInTrack;
    const anyUnsolved = problems.find((p) => p.id !== currentProblem.id && !solvedProblemIds.includes(p.id));
    if (anyUnsolved) return anyUnsolved;
    return problems[(currentProblemIndex + 1) % problems.length];
  }, [problems, currentProblem, solvedProblemIds, currentProblemIndex]);

  const selectProblem = (problemId: string, startInterview = false) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;
    setCurrentProblemId(problemId);
    setEvaluationReport(null);
    setUnlockedHintCount(0);
    setDatasetFilter('');
    setLeftTab('description');
    setConsoleTab('testcases');
    setActiveCaseIdx(0);
    setActiveNav('workspace');
    if (startInterview) {
      setInterviewMode(true);
      setInterviewSecondsLeft(target.estimatedMinutes * 60);
    }
  };

  const navigateProblem = (direction: 'prev' | 'next') => {
    const nextIdx =
      direction === 'prev'
        ? (currentProblemIndex - 1 + problems.length) % problems.length
        : (currentProblemIndex + 1) % problems.length;
    selectProblem(problems[nextIdx].id, interviewMode);
  };

  const handleExecute = async (mode: 'run' | 'submit') => {
    setIsRunning(true);
    setConsoleTab('result');

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
      const timeStr = now.toLocaleTimeString('en-US', {
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
        timestamp: timeStr,
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
      } else {
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
  };

  const handleLoadSolution = () => {
    if (interviewMode) return;
    setCodeMap((prev) => ({
      ...prev,
      [codeKey]: currentProblem.solutionCode[language],
    }));
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
    () => Math.max(16, currentCode.split('\n').length),
    [currentCode]
  );

  const totalPoints = Object.values(bestScores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-slate-100 font-sans">
      {/* Clean LeetCode-style Top Header */}
      <header className="h-12 border-b border-slate-800 bg-[#161b22] px-4 flex items-center justify-between text-xs sticky top-0 z-30">
        <div className="flex items-center gap-6">
          {/* Brand */}
          <button
            onClick={() => setActiveNav('bank')}
            className="flex items-center gap-2 font-bold tracking-tight text-slate-100 hover:text-white"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-sky-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xs">
              ⚡
            </div>
            <span className="text-sm">DataForge</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 font-medium text-slate-400">
            <button
              onClick={() => setActiveNav('bank')}
              className={`transition-colors ${
                activeNav === 'bank' ? 'text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setActiveNav('workspace')}
              className={`transition-colors ${
                activeNav === 'workspace' ? 'text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveNav('progress')}
              className={`transition-colors ${
                activeNav === 'progress' ? 'text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Progress & Skills
            </button>
            <button
              onClick={() => setActiveNav('content')}
              className={`transition-colors ${
                activeNav === 'content' ? 'text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Workflow Studio
            </button>
          </nav>
        </div>

        {/* Right Stats & Action Bar */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1 text-amber-400 font-mono font-medium">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>4 Days</span>
          </div>

          {/* Points */}
          <div className="hidden sm:flex items-center gap-1 text-slate-300 font-mono tabular-nums">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>{totalPoints} pts</span>
          </div>

          {/* Interview Mode Button */}
          <button
            onClick={() => {
              const nextMode = !interviewMode;
              setInterviewMode(nextMode);
              if (nextMode) {
                setInterviewSecondsLeft(currentProblem.estimatedMinutes * 60);
                setActiveNav('workspace');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              interviewMode
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            {interviewMode ? formatTimer(interviewSecondsLeft) : 'Interview'}
          </button>

          {/* Quick Solve Next */}
          <button
            onClick={() => selectProblem(recommendedProblem.id, false)}
            className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded text-xs transition-colors whitespace-nowrap"
          >
            Solve Next
          </button>
        </div>
      </header>

      {/* Main View Router */}
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
        <div className="flex-1 flex flex-col bg-[#0d1117]">
          {/* Sub-header for Current Problem Navigation (LeetCode IDE Header) */}
          <div className="h-10 border-b border-slate-800 bg-[#161b22] px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveNav('bank')}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Problem List</span>
              </button>

              <span className="text-slate-700">|</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateProblem('prev')}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                  title="Previous Problem"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigateProblem('next')}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                  title="Next Problem"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 font-medium flex-wrap">
                <span className="text-slate-100 font-bold">{currentProblem.code}. {currentProblem.title}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    currentProblem.difficulty === 'Easy'
                      ? 'text-emerald-400'
                      : currentProblem.difficulty === 'Medium'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 border border-slate-700 text-sky-300">
                  {currentProblem.sourceRef || currentProblem.source}
                </span>
                <span className="text-slate-500 font-mono text-xs">({currentProblem.track})</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExecute('run')}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-sky-400" />
                <span>Run</span>
              </button>
              <button
                onClick={() => handleExecute('submit')}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Split 2-Pane Editor Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
            {/* LEFT PANE (Problem Statement / Dataset / Editorial / Submissions) */}
            <div className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-[#0d1117] min-h-0 overflow-hidden">
              {/* Tab Header */}
              <div className="h-9 border-b border-slate-800 bg-[#161b22] px-3 flex items-center gap-1 text-xs shrink-0">
                <button
                  onClick={() => setLeftTab('description')}
                  className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${
                    leftTab === 'description'
                      ? 'bg-[#0d1117] text-slate-100 border-t-2 border-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setLeftTab('dataset')}
                  className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    leftTab === 'dataset'
                      ? 'bg-[#0d1117] text-slate-100 border-t-2 border-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-3 h-3 text-sky-400" />
                  Dataset ({currentProblem.datasetRows.length})
                </button>
                <button
                  onClick={() => setLeftTab('editorial')}
                  className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    leftTab === 'editorial'
                      ? 'bg-[#0d1117] text-slate-100 border-t-2 border-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  Editorial
                </button>
                <button
                  onClick={() => setLeftTab('submissions')}
                  className={`px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${
                    leftTab === 'submissions'
                      ? 'bg-[#0d1117] text-slate-100 border-t-2 border-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Submissions
                </button>
              </div>

              {/* Tab Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
                {leftTab === 'description' && (
                  <>
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="font-mono text-sky-400 font-semibold">{currentProblem.code}</span>
                        <span>·</span>
                        <span>{currentProblem.topic}</span>
                        <span>·</span>
                        <span className="tabular-nums">~{currentProblem.estimatedMinutes} mins</span>
                      </div>
                      <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                        {currentProblem.title}
                      </h1>

                      {/* Difficulty + Source + Category + Companies Tags */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 ${
                            currentProblem.difficulty === 'Easy'
                              ? 'text-emerald-400'
                              : currentProblem.difficulty === 'Medium'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {currentProblem.difficulty}
                        </span>

                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                          Nguồn: {currentProblem.sourceRef || currentProblem.source}
                        </span>

                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300">
                          {currentProblem.categoryGroup || currentProblem.topic}
                        </span>

                        {currentProblem.companies?.map((comp) => (
                          <span key={comp} className="text-xs text-slate-400 px-2 py-0.5 rounded bg-[#161b22] border border-slate-800">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Business Context */}
                    <div className="p-3.5 bg-[#161b22] border border-slate-800 rounded-lg space-y-1.5 text-xs">
                      <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Business Context / Interview Case
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {currentProblem.businessContext}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Task Requirements
                      </div>
                      <ul className="space-y-1.5 text-slate-300 text-xs list-disc pl-4 leading-relaxed">
                        {currentProblem.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Example Box */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Expected Output Example
                      </div>
                      <div className="bg-[#161b22] border border-slate-800 rounded-lg p-3 text-xs font-mono">
                        <span className="text-slate-400 block mb-1 text-[11px] font-sans">
                          Returned Dictionary:
                        </span>
                        <pre className="text-emerald-400 tabular-nums">
                          {JSON.stringify(currentProblem.expectedOutput, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Constraints */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Constraints
                      </div>
                      <ul className="space-y-1 text-slate-400 text-xs list-disc pl-4 font-mono">
                        {currentProblem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {leftTab === 'dataset' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs text-sky-400 font-semibold">
                          {currentProblem.datasetName}
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          {currentProblem.datasetRows.length} rows × {currentProblem.datasetColumns.length} columns
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-[#161b22] p-0.5 rounded border border-slate-800 text-xs">
                        <button
                          onClick={() => setDatasetFormat('table')}
                          className={`px-2 py-0.5 rounded ${
                            datasetFormat === 'table' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400'
                          }`}
                        >
                          Table
                        </button>
                        <button
                          onClick={() => setDatasetFormat('json')}
                          className={`px-2 py-0.5 rounded ${
                            datasetFormat === 'json' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400'
                          }`}
                        >
                          JSON
                        </button>
                      </div>
                    </div>

                    {/* Filter row */}
                    <input
                      type="text"
                      value={datasetFilter}
                      onChange={(e) => setDatasetFilter(e.target.value)}
                      placeholder="Quick filter rows in dataset..."
                      className="w-full px-3 py-1.5 text-xs bg-[#161b22] border border-slate-800 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                    />

                    {datasetFormat === 'table' ? (
                      <div className="overflow-x-auto border border-slate-800 rounded bg-[#161b22]">
                        <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/70">
                              {currentProblem.datasetColumns.map((col) => (
                                <th key={col.name} className="py-2 px-3 font-medium whitespace-nowrap">
                                  {col.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {filteredDatasetRows.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/60 text-slate-300">
                                {currentProblem.datasetColumns.map((col) => (
                                  <td key={col.name} className="py-1.5 px-3 whitespace-nowrap">
                                    {row[col.name] === null ? (
                                      <span className="text-amber-400 italic">null</span>
                                    ) : (
                                      String(row[col.name])
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <pre className="p-3 bg-[#161b22] border border-slate-800 rounded font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
                        {JSON.stringify(filteredDatasetRows, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {leftTab === 'editorial' && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-[#161b22] border border-slate-800 rounded-lg space-y-2 text-xs">
                      <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4" />
                        Optimal Approach & Complexity Analysis
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {currentProblem.explanation}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-200">
                        Step-by-Step Hints
                      </div>
                      {currentProblem.hints.map((hint, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
                          <strong className="text-amber-400">Hint {idx + 1}:</strong> {hint}
                        </div>
                      ))}
                    </div>

                    {!interviewMode && (
                      <div className="pt-2">
                        <button
                          onClick={handleLoadSolution}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Load Reference Solution Code into Editor
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {leftTab === 'submissions' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300">
                      Submissions for {currentProblem.code}
                    </div>
                    {submissions.filter((s) => s.problemId === currentProblem.id).length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No submissions yet. Write your code and click Submit.
                      </div>
                    ) : (
                      submissions
                        .filter((s) => s.problemId === currentProblem.id)
                        .map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 bg-[#161b22] border border-slate-800 rounded flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold flex items-center gap-1.5">
                                {sub.allPassed ? (
                                  <span className="text-emerald-400">Accepted</span>
                                ) : (
                                  <span className="text-rose-400">Wrong Answer</span>
                                )}
                                <span className="text-slate-500">· {sub.language}</span>
                              </div>
                              <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                                {sub.executionTimeMs} ms · {sub.timestamp}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setLanguage(sub.language);
                                setCodeMap((prev) => ({
                                  ...prev,
                                  [`${currentProblem.id}_${sub.language}`]: sub.code,
                                }));
                              }}
                              className="px-2.5 py-1 text-[11px] bg-slate-800 text-sky-400 hover:bg-slate-700 rounded"
                            >
                              Restore Code
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANE: Code Editor + LeetCode-style Testcase / Result Drawer */}
            <div className="lg:col-span-7 flex flex-col bg-[#0d1117] min-h-0 overflow-hidden">
              {/* Editor Toolbar */}
              <div className="h-9 border-b border-slate-800 bg-[#161b22] px-3 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#0d1117] p-0.5 rounded border border-slate-800">
                    <button
                      onClick={() => setLanguage('python')}
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium transition-colors ${
                        language === 'python'
                          ? 'bg-slate-800 text-slate-100 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Python 3.10
                    </button>
                    <button
                      onClick={() => setLanguage('typescript')}
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium transition-colors ${
                        language === 'typescript'
                          ? 'bg-slate-800 text-slate-100 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      TypeScript
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    onClick={handleResetStarter}
                    className="p-1 hover:text-slate-200 rounded hover:bg-slate-800 flex items-center gap-1 text-[11px]"
                    title="Reset to starter code"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Input Area with Line Numbers */}
              <div className="flex-1 relative flex bg-[#090d13] font-mono text-xs leading-6 overflow-y-auto min-h-[300px]">
                <div
                  aria-hidden="true"
                  className="select-none py-3 px-3 text-right text-slate-600 bg-[#0d1117] border-r border-slate-800/80 tabular-nums shrink-0"
                >
                  {Array.from({ length: codeLineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
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
                  className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-6 focus:outline-none resize-none w-full overflow-x-auto whitespace-pre"
                  rows={codeLineCount}
                />
              </div>

              {/* Bottom Testcase & Test Result Drawer (LeetCode Style) */}
              <div className="h-64 border-t border-slate-800 bg-[#161b22] flex flex-col shrink-0">
                {/* Console Tabs */}
                <div className="h-8 border-b border-slate-800 px-3 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConsoleTab('testcases')}
                      className={`px-3 py-1 font-medium text-xs transition-colors ${
                        consoleTab === 'testcases' ? 'text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Testcase
                    </button>
                    <button
                      onClick={() => setConsoleTab('result')}
                      className={`px-3 py-1 font-medium text-xs transition-colors flex items-center gap-1.5 ${
                        consoleTab === 'result' ? 'text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>Test Result</span>
                      {evaluationReport && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            evaluationReport.allPassed ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Shortcuts: <kbd className="text-slate-400">Ctrl+Enter</kbd> to Run
                  </div>
                </div>

                {/* Console Content */}
                <div className="flex-1 overflow-y-auto p-4 text-xs">
                  {consoleTab === 'testcases' && (
                    <div className="space-y-3">
                      {/* Case selector pills */}
                      <div className="flex items-center gap-2">
                        {currentProblem.testCases.map((tc, idx) => (
                          <button
                            key={tc.id}
                            onClick={() => setActiveCaseIdx(idx)}
                            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                              activeCaseIdx === idx
                                ? 'bg-slate-800 text-slate-100 font-semibold'
                                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Case details */}
                      {currentProblem.testCases[activeCaseIdx] && (
                        <div className="bg-[#0d1117] p-3 rounded border border-slate-800 font-mono space-y-1.5 text-xs">
                          <div className="text-slate-400 text-[11px]">
                            {currentProblem.testCases[activeCaseIdx].name}
                          </div>
                          <div className="text-slate-300">
                            Expected Key:{' '}
                            <span className="text-sky-400">
                              {currentProblem.testCases[activeCaseIdx].expectedKey}
                            </span>
                          </div>
                          <div className="text-slate-300">
                            Expected Value:{' '}
                            <span className="text-emerald-400 tabular-nums">
                              {JSON.stringify(currentProblem.testCases[activeCaseIdx].expectedValue)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {consoleTab === 'result' && (
                    <div>
                      {!evaluationReport ? (
                        <div className="text-slate-400 text-center py-8">
                          Run code to view output and testcase evaluation results.
                        </div>
                      ) : (
                        <div className="space-y-3 font-mono">
                          {/* Result status banner */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold">
                              {evaluationReport.allPassed ? (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" /> Accepted
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1.5">
                                  <XCircle className="w-4 h-4" /> Wrong Answer
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 tabular-nums">
                              Runtime: {evaluationReport.executionTimeMs} ms · Score: {evaluationReport.score}/{currentProblem.points} pts
                            </div>
                          </div>

                          {/* Error if any */}
                          {evaluationReport.error && (
                            <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded text-rose-300 text-xs">
                              {evaluationReport.error}
                            </div>
                          )}

                          {/* Testcase pass matrix */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {evaluationReport.testResults.map((tr, i) => (
                              <div
                                key={tr.testCase.id}
                                className={`p-2 rounded border text-xs ${
                                  tr.passed
                                    ? 'bg-[#0d1117] border-emerald-500/30'
                                    : 'bg-[#0d1117] border-rose-500/30'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-200">
                                    Case {i + 1}: {tr.testCase.name}
                                  </span>
                                  <span className={tr.passed ? 'text-emerald-400' : 'text-rose-400'}>
                                    {tr.passed ? 'PASS' : 'FAIL'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 truncate">
                                  Actual: <span className="text-sky-300">{JSON.stringify(tr.actualValue)}</span> | Exp: {JSON.stringify(tr.expectedValue)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
