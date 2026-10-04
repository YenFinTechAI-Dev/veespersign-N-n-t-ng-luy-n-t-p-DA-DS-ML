import React, { useEffect, useMemo, useState } from 'react';
import {
  DifficultyLevel,
  Problem,
  ProblemSource,
  TrackId,
  TRACK_METADATA,
} from '../data/problems';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Flame,
  Globe2,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface ProblemBankViewProps {
  problems: Problem[];
  solvedProblemIds: string[];
  bestScores: Record<string, number>;
  selectedTrack: TrackId | 'ALL';
  selectedDifficulty: DifficultyLevel | 'ALL';
  onChangeTrack: (track: TrackId | 'ALL') => void;
  onChangeDifficulty: (diff: DifficultyLevel | 'ALL') => void;
  onSelectProblem: (problemId: string, startInterview?: boolean) => void;
}

const ALL_COMPANIES = ['All', 'Google', 'Meta', 'Amazon', 'Shopee', 'Grab', 'Apple', 'Tesla', 'Jane Street'];

const SOURCE_CONFIG: Record<
  ProblemSource,
  { label: string; bg: string; text: string; border: string }
> = {
  LeetCode: {
    label: 'LeetCode',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  HackerRank: {
    label: 'HackerRank',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  StrataScratch: {
    label: 'StrataScratch',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  DataLemur: {
    label: 'DataLemur',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  Kaggle: {
    label: 'Kaggle',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  InterviewQuery: {
    label: 'InterviewQuery',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  Codeforces: {
    label: 'Codeforces',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
};

export const ProblemBankView: React.FC<ProblemBankViewProps> = ({
  problems,
  solvedProblemIds,
  bestScores,
  selectedTrack,
  selectedDifficulty,
  onChangeTrack,
  onChangeDifficulty,
  onSelectProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'ALL' | ProblemSource>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'UNSOLVED'>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedTrack,
    selectedDifficulty,
    selectedSource,
    selectedCategory,
    statusFilter,
    companyFilter,
    searchQuery,
  ]);

  // Extract unique categories across all problems
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => {
      if (p.categoryGroup) set.add(p.categoryGroup);
    });
    return Array.from(set).sort();
  }, [problems]);

  // Extract unique sources available
  const availableSources = useMemo(() => {
    const set = new Set<ProblemSource>();
    problems.forEach((p) => {
      if (p.source) set.add(p.source);
    });
    return Array.from(set);
  }, [problems]);

  const solvedCount = solvedProblemIds.length;
  const totalCount = problems.length;
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const solvedEasy = problems.filter((p) => p.difficulty === 'Easy' && solvedProblemIds.includes(p.id)).length;
  const medCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const solvedMed = problems.filter((p) => p.difficulty === 'Medium' && solvedProblemIds.includes(p.id)).length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;
  const solvedHard = problems.filter((p) => p.difficulty === 'Hard' && solvedProblemIds.includes(p.id)).length;

  const filteredProblems = problems.filter((p) => {
    if (selectedTrack !== 'ALL' && p.track !== selectedTrack) return false;
    if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
    if (selectedSource !== 'ALL' && p.source !== selectedSource) return false;
    if (selectedCategory !== 'ALL' && p.categoryGroup !== selectedCategory) return false;

    const isSolved = solvedProblemIds.includes(p.id);
    if (statusFilter === 'SOLVED' && !isSolved) return false;
    if (statusFilter === 'UNSOLVED' && isSolved) return false;
    if (companyFilter !== 'All' && !p.companies?.includes(companyFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchCategory = p.categoryGroup?.toLowerCase().includes(q);
      const matchSource = p.source?.toLowerCase().includes(q);
      const matchSourceRef = p.sourceRef?.toLowerCase().includes(q);
      const matchSkill = p.skills.some((s) => s.toLowerCase().includes(q));
      const matchComp = p.companies?.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchCode || matchTopic || matchCategory || matchSource || matchSourceRef || matchSkill || matchComp;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProblems.length);
  const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Stats & Track Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Progress Circle & Summary */}
        <div className="md:col-span-4 bg-[#11161d] border border-slate-800 rounded-xl p-5 flex items-center gap-5 shadow-sm">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800/80"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-400 transition-all duration-500"
                strokeDasharray={`${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                {solvedCount}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                /{totalCount}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Easy
              </span>
              <span className="font-mono text-slate-300 tabular-nums">{solvedEasy}/{easyCount}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${easyCount ? (solvedEasy / easyCount) * 100 : 0}%` }} />
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Medium
              </span>
              <span className="font-mono text-slate-300 tabular-nums">{solvedMed}/{medCount}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${medCount ? (solvedMed / medCount) * 100 : 0}%` }} />
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Hard
              </span>
              <span className="font-mono text-slate-300 tabular-nums">{solvedHard}/{hardCount}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full" style={{ width: `${hardCount ? (solvedHard / hardCount) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        {/* 3 Track Focus Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['DA', 'DS', 'ML'] as TrackId[]).map((tId) => {
            const meta = TRACK_METADATA[tId];
            const isSelected = selectedTrack === tId;
            const count = problems.filter((p) => p.track === tId).length;
            const solved = problems.filter((p) => p.track === tId && solvedProblemIds.includes(p.id)).length;
            return (
              <button
                key={tId}
                type="button"
                onClick={() => onChangeTrack(isSelected ? 'ALL' : tId)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500/70 ring-1 ring-sky-500/40 shadow-sm'
                    : 'bg-[#11161d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-medium">
                  <span className="font-bold">Track · {meta.shortName}</span>
                  <span className="text-slate-400 tabular-nums font-semibold">{solved}/{count}</span>
                </div>
                <div className="text-sm font-bold text-slate-100 mt-1">
                  {meta.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source Classification Bar: "Lấy từ tất cả các nguồn trên mạng & chia nhóm" */}
      <div className="bg-[#11161d] border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
        {/* Source Badges Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-sky-400" /> Nguồn bài tập từ các nền tảng hàng đầu:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {filteredProblems.length} bài tập hiển thị
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <button
              onClick={() => setSelectedSource('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedSource === 'ALL'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              Tất cả nguồn ({problems.length})
            </button>

            {availableSources.map((source) => {
              const conf = SOURCE_CONFIG[source] || {
                label: source,
                bg: 'bg-slate-800',
                text: 'text-slate-300',
                border: 'border-slate-700',
              };
              const count = problems.filter((p) => p.source === source).length;
              const isSelected = selectedSource === source;

              return (
                <button
                  key={source}
                  onClick={() => setSelectedSource(isSelected ? 'ALL' : source)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? `${conf.bg} ${conf.text} ${conf.border} ring-1 ring-current font-bold`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{conf.label}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-900/80 font-mono opacity-80">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Group Selector */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Nhóm chuyên đề / Phân loại:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Tất cả chuyên đề
            </button>

            {availableCategories.map((cat) => {
              const count = problems.filter((p) => p.categoryGroup === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat} <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Filter Toolbar: Track, Difficulty, Status, Search */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Track Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              {(['ALL', 'DA', 'DS', 'ML'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeTrack(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    selectedTrack === t
                      ? 'bg-slate-800 text-slate-100 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'ALL' ? 'All Tracks' : t}
                </button>
              ))}
            </div>

            {/* Difficulty Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => onChangeDifficulty(d)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedDifficulty === d
                      ? 'bg-slate-800 text-slate-100 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d === 'ALL' ? 'All Difficulty' : d}
                </button>
              ))}
            </div>

            {/* Status Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              {(['ALL', 'UNSOLVED', 'SOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-slate-800 text-slate-100 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'Status: All' : st === 'SOLVED' ? 'Solved' : 'Todo'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài tập, thuật toán, mã code, công ty..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Company Tags Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            <Building2 className="w-3 h-3" /> Công ty:
          </span>
          {ALL_COMPANIES.map((c) => (
            <button
              key={c}
              onClick={() => setCompanyFilter(c)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                companyFilter === c
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* LeetCode & HackerRank-style Problem Table */}
      <div className="bg-[#11161d] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-sm font-semibold text-slate-200">
              Không tìm thấy bài tập phù hợp với bộ lọc
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hãy thử nới lỏng bộ lọc Nguồn, Track, Chuyên đề hoặc từ khóa tìm kiếm.
            </p>
            <button
              onClick={() => {
                onChangeTrack('ALL');
                onChangeDifficulty('ALL');
                setSelectedSource('ALL');
                setSelectedCategory('ALL');
                setStatusFilter('ALL');
                setCompanyFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
                  <th className="py-3 px-3.5 w-12 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold">Tên bài & Nguồn trích xuất</th>
                  <th className="py-3 px-3 font-semibold">Nhóm chuyên đề</th>
                  <th className="py-3 px-3 font-semibold">Track</th>
                  <th className="py-3 px-3 font-semibold">Tỉ lệ Pass</th>
                  <th className="py-3 px-3 font-semibold">Độ khó</th>
                  <th className="py-3 px-4 font-semibold">Công ty phỏng vấn</th>
                  <th className="py-3 px-4 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {paginatedProblems.map((problem) => {
                  const isSolved = solvedProblemIds.includes(problem.id);
                  const sourceConf = (problem.source && SOURCE_CONFIG[problem.source]) || {
                    label: problem.source || 'Online',
                    bg: 'bg-slate-800',
                    text: 'text-slate-300',
                    border: 'border-slate-700',
                  };

                  return (
                    <tr
                      key={problem.id}
                      className="hover:bg-slate-900/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectProblem(problem.id, false)}
                    >
                      {/* Status */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        )}
                      </td>

                      {/* Title, Source & Topic */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors text-sm">
                            {problem.code}. {problem.title}
                          </span>
                          {/* Source Badge */}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${sourceConf.bg} ${sourceConf.text} ${sourceConf.border}`}
                          >
                            {problem.sourceRef || sourceConf.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-slate-300">{problem.topic}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-500 font-mono">{problem.datasetName}</span>
                        </div>
                      </td>

                      {/* Category Group */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-medium">
                          {problem.categoryGroup || 'General'}
                        </span>
                      </td>

                      {/* Track */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-slate-300">
                        {problem.track}
                      </td>

                      {/* Acceptance */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono tabular-nums text-slate-400">
                        {problem.acceptanceRate || '74.2%'}
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-semibold">
                        <span
                          className={
                            problem.difficulty === 'Easy'
                              ? 'text-emerald-400'
                              : problem.difficulty === 'Medium'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Companies */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          {problem.companies?.slice(0, 3).map((comp) => (
                            <span
                              key={comp}
                              className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onSelectProblem(problem.id, false)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-sky-500/15 text-sky-300 hover:bg-sky-500 hover:text-slate-950 border border-sky-500/30 rounded-lg transition-all shadow-sm"
                          >
                            Luyện tập
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="py-3 px-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>
                Hiển thị <strong className="text-slate-200">{filteredProblems.length > 0 ? startIndex + 1 : 0}</strong> -{' '}
                <strong className="text-slate-200">{endIndex}</strong> trong tổng số{' '}
                <strong className="text-sky-400 font-mono">{filteredProblems.length}</strong> bài tập
              </span>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <span>Số bài/trang:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 font-medium"
              >
                Trước
              </button>

              <span className="px-3 py-1 font-mono text-slate-200">
                {validCurrentPage} / {totalPages}
              </span>

              <button
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};
