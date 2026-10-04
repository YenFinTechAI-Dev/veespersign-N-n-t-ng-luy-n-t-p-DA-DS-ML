import React, { useState } from 'react';
import {
  DifficultyLevel,
  Problem,
  TrackId,
  TRACK_METADATA,
} from '../data/problems';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Timer,
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'UNSOLVED'>('ALL');

  const filteredProblems = problems.filter((p) => {
    if (selectedTrack !== 'ALL' && p.track !== selectedTrack) return false;
    if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
    const isSolved = solvedProblemIds.includes(p.id);
    if (statusFilter === 'SOLVED' && !isSolved) return false;
    if (statusFilter === 'UNSOLVED' && isSolved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchSkill = p.skills.some((s) => s.toLowerCase().includes(q));
      const matchDataset = p.datasetName.toLowerCase().includes(q);
      return matchTitle || matchCode || matchTopic || matchSkill || matchDataset;
    }
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs text-sky-400 font-medium mb-1">
            Kho bài tập Thực tế & Phỏng vấn (Step 1 · Choose Track & Problem)
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Problem Bank — Luyện tập DA / DS / ML
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Chọn nhánh chuyên môn (Data Analytics, Data Science, Machine Learning), lọc theo cấp độ từ Beginner đến Advanced và giải trực tiếp trên bộ dữ liệu thực.
          </p>
        </div>

        <div className="text-xs text-slate-400 tabular-nums">
          Hiển thị <span className="text-slate-100 font-semibold">{filteredProblems.length}</span> / {problems.length} bài tập · Đã hoàn thành{' '}
          <span className="text-emerald-400 font-semibold">{solvedProblemIds.length}</span> bài
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['DA', 'DS', 'ML'] as TrackId[]).map((tId) => {
          const meta = TRACK_METADATA[tId];
          const isSelected = selectedTrack === tId;
          const count = problems.filter((p) => p.track === tId).length;
          const solved = problems.filter(
            (p) => p.track === tId && solvedProblemIds.includes(p.id)
          ).length;

          return (
            <button
              key={tId}
              type="button"
              onClick={() => onChangeTrack(isSelected ? 'ALL' : tId)}
              className={`text-left p-5 rounded-lg border transition-colors ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500/60'
                  : 'bg-[#111827] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-sky-400 font-semibold">
                  Track · {meta.shortName}
                </span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {solved}/{count} hoàn thành
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 mt-1">
                {meta.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {meta.description}
              </p>
              <div className="text-xs text-slate-500 mt-3 truncate">
                {meta.coreSkills.join(' · ')}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md">
            {(['ALL', 'DA', 'DS', 'ML'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTrack(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTrack === t
                    ? 'bg-sky-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'Tất cả Track' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md">
            {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onChangeDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedDifficulty === d
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d === 'ALL' ? 'Mọi cấp độ' : d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md">
            {(
              [
                { id: 'ALL', label: 'Tất cả' },
                { id: 'UNSOLVED', label: 'Chưa giải' },
                { id: 'SOLVED', label: 'Đã hoàn thành' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài, mã số, kỹ năng, dataset..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-sm font-medium text-slate-200">
              Không tìm thấy bài tập khớp bộ lọc hiện tại
            </div>
            <p className="text-xs text-slate-400">
              Hãy thử đặt lại bộ lọc Track / Difficulty hoặc xóa từ khóa tìm kiếm.
            </p>
            <button
              onClick={() => {
                onChangeTrack('ALL');
                onChangeDifficulty('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400">
                  <th className="py-3.5 px-4 font-medium">Mã</th>
                  <th className="py-3.5 px-4 font-medium">Bài tập & Kỹ năng trọng tâm</th>
                  <th className="py-3.5 px-4 font-medium">Track · Cấp độ</th>
                  <th className="py-3.5 px-4 font-medium">Dataset</th>
                  <th className="py-3.5 px-4 font-medium text-right">Điểm số</th>
                  <th className="py-3.5 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {filteredProblems.map((problem) => {
                  const isSolved = solvedProblemIds.includes(problem.id);
                  const bestScore = bestScores[problem.id] ?? 0;

                  return (
                    <tr
                      key={problem.id}
                      className="hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span>{problem.code}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-md">
                        <div className="font-semibold text-slate-100 text-sm">
                          {problem.title}
                        </div>
                        <div className="text-slate-400 mt-1">
                          <span>{problem.topic}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{problem.skills.join(' / ')}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="text-slate-500">{problem.interviewTag}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-slate-200 font-medium">
                          {problem.track} ·{' '}
                          <span
                            className={
                              problem.difficulty === 'Beginner'
                                ? 'text-emerald-400'
                                : problem.difficulty === 'Intermediate'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="text-slate-500 tabular-nums mt-0.5">
                          ~{problem.estimatedMinutes} phút
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <div>{problem.datasetName}</div>
                        <div className="text-slate-500 tabular-nums mt-0.5">
                          {problem.datasetRows.length} dòng × {problem.datasetColumns.length} cột
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            bestScore === problem.points
                              ? 'text-emerald-400 font-semibold'
                              : bestScore > 0
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }
                        >
                          {bestScore} / {problem.points} pts
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onSelectProblem(problem.id, true)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded transition-colors whitespace-nowrap"
                            title="Mở trong chế độ Phỏng vấn tính giờ"
                          >
                            <Timer className="w-3.5 h-3.5 text-amber-400" />
                            Interview
                          </button>
                          <button
                            onClick={() => onSelectProblem(problem.id, false)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded transition-colors whitespace-nowrap"
                          >
                            Luyện tập
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
