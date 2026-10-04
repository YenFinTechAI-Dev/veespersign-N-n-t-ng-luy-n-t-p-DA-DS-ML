import React from 'react';
import {
  CodeLanguage,
  Problem,
  TrackId,
  TRACK_METADATA,
} from '../data/problems';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  TrendingUp,
} from 'lucide-react';

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemCode: string;
  problemTitle: string;
  track: TrackId;
  language: CodeLanguage;
  score: number;
  maxPoints: number;
  allPassed: boolean;
  executionTimeMs: number;
  timestamp: string;
  code: string;
}

interface SkillProgressViewProps {
  problems: Problem[];
  solvedProblemIds: string[];
  bestScores: Record<string, number>;
  submissions: SubmissionRecord[];
  recommendedProblem: Problem;
  onSelectProblem: (problemId: string, startInterview?: boolean) => void;
}

export const SkillProgressView: React.FC<SkillProgressViewProps> = ({
  problems,
  solvedProblemIds,
  bestScores,
  submissions,
  recommendedProblem,
  onSelectProblem,
}) => {
  const totalPointsPossible = problems.reduce((acc, p) => acc + p.points, 0);
  const totalPointsEarned = Object.values(bestScores).reduce((acc, s) => acc + s, 0);
  const completionPct =
    problems.length > 0
      ? Math.round((solvedProblemIds.length / problems.length) * 100)
      : 0;

  const skillMap: Record<string, { total: number; solved: number; track: TrackId }> = {};
  for (const p of problems) {
    const isSolved = solvedProblemIds.includes(p.id);
    for (const sk of p.skills) {
      if (!skillMap[sk]) {
        skillMap[sk] = { total: 0, solved: 0, track: p.track };
      }
      skillMap[sk].total += 1;
      if (isSolved) {
        skillMap[sk].solved += 1;
      }
    }
  }

  const skillEntries = Object.entries(skillMap);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs text-sky-400 font-medium mb-1">
              Hồ sơ Năng lực & Tiến độ Học tập (Step 6 · Progress)
            </p>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
              Theo dõi Kỹ năng DA / DS / ML & Lịch sử Chấm bài
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
              Điểm số và kỹ năng được cập nhật tự động sau mỗi lần nộp bài thành công. Hệ thống phân tích các chủ đề chưa hoàn thiện để gợi ý bài tập tiếp theo sát với năng lực hiện tại.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">Bài tập hoàn thành</div>
              <div className="text-2xl font-semibold text-slate-100 tabular-nums mt-1">
                {solvedProblemIds.length} / {problems.length}{' '}
                <span className="text-xs font-normal text-emerald-400">
                  ({completionPct}%)
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Tổng điểm tích lũy</div>
              <div className="text-2xl font-semibold text-sky-400 tabular-nums mt-1">
                {totalPointsEarned.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {totalPointsPossible.toLocaleString()} pts
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Tổng lượt chấm bài</div>
              <div className="text-2xl font-semibold text-slate-100 tabular-nums mt-1">
                {submissions.length}{' '}
                <span className="text-xs font-normal text-slate-400">lần nộp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111827] border border-sky-500/40 rounded-lg p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Recommendation Engine (Step 7 · Next Problem)
              </span>
              <span className="font-mono tabular-nums">{recommendedProblem.code}</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              {recommendedProblem.title}
            </h2>
            <div className="text-xs text-slate-400">
              <span>{TRACK_METADATA[recommendedProblem.track].name}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{recommendedProblem.difficulty}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="tabular-nums">{recommendedProblem.points} pts</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="tabular-nums">{recommendedProblem.estimatedMinutes} phút</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {recommendedProblem.summary}
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400 truncate">
              Kỹ năng mở khóa: <span className="text-slate-200">{recommendedProblem.skills.join(' · ')}</span>
            </div>
            <button
              onClick={() => onSelectProblem(recommendedProblem.id, false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              Giải bài này ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['DA', 'DS', 'ML'] as TrackId[]).map((trackId) => {
          const trackProblems = problems.filter((p) => p.track === trackId);
          const solvedInTrack = trackProblems.filter((p) =>
            solvedProblemIds.includes(p.id)
          );
          const pct =
            trackProblems.length > 0
              ? Math.round((solvedInTrack.length / trackProblems.length) * 100)
              : 0;
          const earnedInTrack = trackProblems.reduce(
            (sum, p) => sum + (bestScores[p.id] || 0),
            0
          );
          const maxInTrack = trackProblems.reduce((sum, p) => sum + p.points, 0);

          return (
            <div
              key={trackId}
              className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-sky-400">
                    Track · {trackId}
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 mt-0.5">
                    {TRACK_METADATA[trackId].name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {TRACK_METADATA[trackId].roleTarget}
                  </p>
                </div>
                <div className="text-right tabular-nums">
                  <div className="text-lg font-semibold text-slate-100">{pct}%</div>
                  <div className="text-xs text-slate-400">
                    {solvedInTrack.length}/{trackProblems.length} bài
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Điểm đạt được</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {earnedInTrack} / {maxInTrack} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Ma trận Kỹ năng Thực chiến
              </h2>
            </div>
            <span className="text-xs text-slate-400 tabular-nums">
              {skillEntries.filter(([, v]) => v.solved > 0).length}/{skillEntries.length} kỹ năng
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {skillEntries.map(([skillName, info]) => {
              const pct = Math.round((info.solved / info.total) * 100);
              return (
                <div key={skillName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">
                      {skillName}{' '}
                      <span className="text-slate-500 font-normal">· {info.track}</span>
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {info.solved}/{info.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-sky-500' : 'bg-slate-800'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Lịch sử Nộp bài & Chấm điểm (Submission History)
              </h2>
            </div>
            <span className="text-xs text-slate-400 tabular-nums">
              {submissions.length} bản ghi
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center space-y-3 my-auto">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-medium text-slate-300">
                Chưa có lượt nộp bài nào được ghi nhận
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Hãy chọn một bài tập trong Workspace và nhấn &ldquo;Submit & Chấm bài&rdquo; để lưu điểm số và mở khóa kỹ năng.
              </p>
              <button
                onClick={() => onSelectProblem(recommendedProblem.id, false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 text-slate-950 rounded-md hover:bg-sky-400 transition-colors"
              >
                Bắt đầu bài tập đầu tiên
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400">
                    <th className="py-3 px-4 font-medium">Bài tập</th>
                    <th className="py-3 px-4 font-medium">Ngôn ngữ</th>
                    <th className="py-3 px-4 font-medium">Trạng thái</th>
                    <th className="py-3 px-4 font-medium text-right">Điểm số</th>
                    <th className="py-3 px-4 font-medium text-right">Thời gian chạy</th>
                    <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-xs">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{sub.problemTitle}</div>
                        <div className="text-slate-500 font-mono mt-0.5">
                          {sub.problemCode} · {sub.track} · {sub.timestamp}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {sub.language === 'python' ? 'Python 3' : 'TypeScript'}
                      </td>
                      <td className="py-3 px-4">
                        {sub.allPassed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">
                            ▲ Cần sửa lại
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                        {sub.score} / {sub.maxPoints}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                        {sub.executionTimeMs} ms
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectProblem(sub.problemId, false)}
                          className="text-sky-400 hover:text-sky-300 font-medium whitespace-nowrap"
                        >
                          Mở lại
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
