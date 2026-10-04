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
  Database,
  FileCode2,
  Layers,
  Plus,
  Server,
  Terminal,
} from 'lucide-react';

interface ContentAndArchitectureViewProps {
  problems: Problem[];
  onPublishProblem: (newProblem: Problem) => void;
  onSelectProblem: (problemId: string) => void;
}

const WORKFLOW_STEPS_TABLE = [
  {
    step: '01. Chọn bài',
    input: 'Track (DA / DS / ML) + Level (Beginner / Intermediate / Advanced)',
    process: 'Truy vấn Problem Service lọc bài tập phù hợp năng lực & mục tiêu',
    output: 'Problem Detail + Dataset Metadata',
  },
  {
    step: '02. Đọc đề',
    input: 'Problem Statement + Dataset thực tế',
    process: 'Hiển thị Business Context, Requirements, Constraints & bảng dữ liệu',
    output: 'Người học nắm rõ Input → Output schema',
  },
  {
    step: '03. Coding',
    input: 'Problem Schema + Starter Template',
    process: 'Người học viết hàm solve(dataset) bằng Python 3 hoặc TypeScript',
    output: 'Source Code hoàn chỉnh',
  },
  {
    step: '04. Run',
    input: 'Source Code + Sample Dataset',
    process: 'Code Runner thực thi trong môi trường cô lập (Sandbox)',
    output: 'Execution Result (Stdout + Returned Dict)',
  },
  {
    step: '05. Evaluate',
    input: 'Execution Result + Test Cases (Public & Hidden)',
    process: 'Evaluator đối chiếu Expected Output, dung sai số học & ràng buộc',
    output: 'Score + Detailed Feedback / Hint',
  },
  {
    step: '06. Progress',
    input: 'Score + Submission History',
    process: 'User/Progress Service cập nhật điểm số, lịch sử và ma trận kỹ năng',
    output: 'Learning Progress & Skill Mastery',
  },
  {
    step: '07. Next',
    input: 'Current Status + Skill Gaps',
    process: 'Recommendation Engine phân tích kỹ năng còn thiếu để gợi ý bài kế tiếp',
    output: 'Recommended Next Problem',
  },
];

const WORKFLOW_PRINCIPLES = [
  {
    index: '01',
    title: 'Bắt đầu từ Problem, không bắt đầu từ công nghệ',
    detail:
      'Mọi bài tập và tính năng đều xuất phát từ bài toán nghiệp vụ thực tế (doanh thu, phễu chuyển đổi, phát hiện gian lận) trước khi chọn công cụ.',
  },
  {
    index: '02',
    title: 'Xác định Input → Process → Output trước khi code',
    detail:
      'Định nghĩa rõ cấu trúc bảng dữ liệu đầu vào, phép biến đổi thống kê/thuật toán và định dạng từ điển kết quả đầu ra.',
  },
  {
    index: '03',
    title: 'Mỗi bước tạo ra một Output đưa sang bước tiếp theo',
    detail:
      'Chuỗi khép kín: Chọn bài → Đọc đề → Viết code → Thực thi → Chấm điểm → Lưu tiến độ → Gợi ý bài mới.',
  },
  {
    index: '04',
    title: 'Xác định Dependency: bước nào phải xảy ra trước bước nào',
    detail:
      'Làm sạch nhiễu trước khi tính trung vị; chuẩn hóa Min-Max trước khi đo khoảng cách Euclidean trong KNN.',
  },
  {
    index: '05',
    title: 'Tách biệt User Flow khỏi System Architecture',
    detail:
      'Trải nghiệm người học mượt mà ở tầng giao diện trong khi Problem Service, Code Runner và Evaluator vận hành độc lập phía sau.',
  },
  {
    index: '06',
    title: 'Chỉ quyết định Framework, Database, API sau khi Workflow rõ ràng',
    detail:
      'Kiến trúc TypeScript + Python 3 Sandbox phục vụ trực tiếp nhu cầu chấm điểm tự động trên tập dữ liệu thực.',
  },
];

export const ContentAndArchitectureView: React.FC<ContentAndArchitectureViewProps> = ({
  problems,
  onPublishProblem,
  onSelectProblem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'curation' | 'architecture'>('curation');
  const [curationStage, setCurationStage] = useState<number>(1);
  const [title, setTitle] = useState('Phân tích Tỷ lệ Giữ chân Khách hàng Tháng thứ 3 (Cohort Retention)');
  const [track, setTrack] = useState<TrackId>('DA');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [topic, setTopic] = useState('Cohort & Retention Analytics');
  const [skillsInput, setSkillsInput] = useState('Cohort Analysis, Retention Rate, User Lifecycle');
  const [interviewTag, setInterviewTag] = useState('Subscription Analytics Interview');
  const [summary, setSummary] = useState(
    'Tính tỷ lệ người dùng còn hoạt động ở tháng thứ 3 (M3 Retention) và doanh thu trung bình trên mỗi người dùng giữ chân thành công.'
  );
  const [expectedKey, setExpectedKey] = useState('m3_retention_pct');
  const [expectedVal, setExpectedVal] = useState('60');
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNumber = 400 + problems.length;
    const code = `${track}-${nextNumber}`;
    const newId = `${track.toLowerCase()}-custom-${Date.now()}`;
    const numericExpected = Number(expectedVal);

    const newProblem: Problem = {
      id: newId,
      code,
      title: title.trim() || 'Bài tập tùy chỉnh mới',
      track,
      difficulty,
      source: 'InterviewQuery',
      sourceRef: 'Community Curation',
      categoryGroup: 'Custom Curated Cases',
      topic: topic.trim() || 'Applied Data Case',
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      interviewTag: interviewTag.trim() || 'Custom Curated Problem',
      companies: ['Community'],
      acceptanceRate: '75.0%',
      estimatedMinutes: 20,
      points: difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 200,
      summary: summary.trim(),
      businessContext:
        'Bài tập được đóng gói thông qua Content Workflow (Collect → Classify → Tag Difficulty/Skill → Curate → Publish).',
      requirements: [
        `Tính toán chỉ số \`${expectedKey}\` từ tập dữ liệu đầu vào.`,
        'Làm tròn kết quả số thập phân đến 2 chữ số.',
      ],
      constraints: [
        'Hàm solve(dataset) phải trả về dictionary/object chứa khóa kết quả.',
      ],
      inputDescription: 'Danh sách bản ghi cohort_users.csv.',
      outputDescription: `Dict chứa khóa \`${expectedKey}\`.`,
      datasetName: 'cohort_users.csv',
      datasetColumns: [
        { name: 'user_id', type: 'string', description: 'Mã người dùng' },
        { name: 'active_m3', type: 'number', description: '1 nếu còn hoạt động ở tháng thứ 3, 0 nếu rời bỏ' },
        { name: 'mrr_usd', type: 'number', description: 'Doanh thu thuê bao tháng (USD)' },
      ],
      datasetRows: [
        { user_id: 'U-01', active_m3: 1, mrr_usd: 49 },
        { user_id: 'U-02', active_m3: 1, mrr_usd: 99 },
        { user_id: 'U-03', active_m3: 0, mrr_usd: 0 },
        { user_id: 'U-04', active_m3: 1, mrr_usd: 79 },
        { user_id: 'U-05', active_m3: 0, mrr_usd: 0 },
      ],
      starterCode: {
        python: `def solve(dataset):
    active_count = sum(row["active_m3"] for row in dataset)
    retention_pct = round((active_count / len(dataset)) * 100, 2)
    return {
        "${expectedKey}": retention_pct
    }
`,
        typescript: `function solve(dataset: Array<Record<string, any>>) {
  const activeCount = dataset.reduce((s, r) => s + Number(r.active_m3), 0);
  const retentionPct = Number(((activeCount / dataset.length) * 100).toFixed(2));
  return {
    ${expectedKey}: retentionPct,
  };
}
`,
      },
      solutionCode: {
        python: `def solve(dataset):
    active_count = sum(row["active_m3"] for row in dataset)
    retention_pct = round((active_count / len(dataset)) * 100, 2)
    return {
        "${expectedKey}": retention_pct
    }
`,
        typescript: `function solve(dataset: Array<Record<string, any>>) {
  const activeCount = dataset.reduce((s, r) => s + Number(r.active_m3), 0);
  const retentionPct = Number(((activeCount / dataset.length) * 100).toFixed(2));
  return {
    ${expectedKey}: retentionPct,
  };
}
`,
      },
      expectedOutput: {
        [expectedKey]: Number.isNaN(numericExpected) ? expectedVal : numericExpected,
      },
      testCases: [
        {
          id: 'tc-custom-1',
          name: `Kiểm tra chỉ số ${expectedKey}`,
          description: `Đảm bảo ${expectedKey} khớp giá trị kỳ vọng ${expectedVal}`,
          expectedKey,
          expectedValue: Number.isNaN(numericExpected) ? expectedVal : numericExpected,
          tolerance: 0.01,
        },
      ],
      hints: [
        'Đếm tổng số bản ghi có `active_m3 == 1` rồi chia cho `len(dataset)` và nhân 100.',
      ],
      explanation:
        'Bài tập đã được kiểm duyệt qua quy trình Content Workflow và xuất bản trực tiếp vào kho bài tập.',
    };

    onPublishProblem(newProblem);
    setPublishSuccess(newProblem.id);
    setCurationStage(5);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs text-sky-400 font-medium mb-1">
            Quy trình Nội dung & Kiến trúc Hệ thống
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Content Curation Pipeline & System Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Quản trị quy trình biên soạn bài tập thực tế (Collect → Classify → Tag → Curate → Publish) và giám sát luồng dữ liệu Input → Process → Output toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          <button
            onClick={() => setActiveSubTab('curation')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'curation'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Content Workflow (Biên soạn bài tập)
          </button>
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'architecture'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Architecture & Nguyên tắc
          </button>
        </div>
      </div>

      {activeSubTab === 'curation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Pipeline Xuất bản Bài tập (Section 4)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Chuẩn hóa bài toán từ nguồn thực tế thành bài tập có bộ dữ liệu và test cases chấm tự động.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  stage: 1,
                  title: '01. Collect Problems',
                  desc: 'Thu thập bài toán từ tình huống phỏng vấn thực tế hoặc dự án doanh nghiệp.',
                },
                {
                  stage: 2,
                  title: '02. Classify Track (DA / DS / ML)',
                  desc: 'Phân loại bài toán vào đúng nhánh chuyên môn Data Analytics, Data Science hoặc Machine Learning.',
                },
                {
                  stage: 3,
                  title: '03. Tag Difficulty + Topic + Skill',
                  desc: 'Gán cấp độ (Beginner / Intermediate / Advanced), chủ đề và kỹ năng cốt lõi.',
                },
                {
                  stage: 4,
                  title: '04. Review & Curate Dataset',
                  desc: 'Chuẩn bị bảng dữ liệu mẫu, starter code Python/TypeScript và test case đối chiếu.',
                },
                {
                  stage: 5,
                  title: '05. Publish Problem',
                  desc: 'Xuất bản vào Problem Bank để học viên luyện tập và chấm điểm tự động.',
                },
              ].map((item) => {
                const isActive = curationStage === item.stage;
                const isDone = curationStage > item.stage;
                return (
                  <button
                    key={item.stage}
                    type="button"
                    onClick={() => setCurationStage(item.stage)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-sky-500/10 border-sky-500/50 text-slate-100'
                        : isDone
                        ? 'bg-slate-900/70 border-emerald-500/30 text-slate-300'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        {isDone ? '✓ Đã cấu hình' : isActive ? '● Đang biên tập' : 'Chờ'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Biên soạn & Xuất bản Bài tập Mới vào Problem Bank
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bài tập sau khi xuất bản sẽ có thể chạy code Python 3 & TypeScript ngay trong Workspace.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                Kho hiện tại: {problems.length} bài tập
              </span>
            </div>

            <form onSubmit={handlePublish} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  1. Tiêu đề bài tập (Collect Problem Statement)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setCurationStage(1);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    2. Phân nhánh chuyên môn (Track)
                  </label>
                  <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md">
                    {(['DA', 'DS', 'ML'] as TrackId[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTrack(t);
                          setCurationStage(2);
                        }}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                          track === t
                            ? 'bg-sky-500 text-slate-950 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t} ({TRACK_METADATA[t].name.split(' ')[1]})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    3. Độ khó (Difficulty)
                  </label>
                  <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md">
                    {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map(
                      (lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setDifficulty(lvl);
                            setCurationStage(3);
                          }}
                          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                            difficulty === lvl
                              ? 'bg-slate-800 text-slate-100 font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Chủ đề (Topic)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setCurationStage(3);
                    }}
                    className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Kỹ năng đánh giá (Skills, phân cách dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => {
                      setSkillsInput(e.target.value);
                      setCurationStage(3);
                    }}
                    className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  4. Tóm tắt yêu cầu & Ngữ cảnh phỏng vấn (Review / Curate)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    setCurationStage(4);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Interview Tag
                  </label>
                  <input
                    type="text"
                    value={interviewTag}
                    onChange={(e) => setInterviewTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Test Case Output Key
                  </label>
                  <input
                    type="text"
                    value={expectedKey}
                    onChange={(e) => {
                      setExpectedKey(e.target.value);
                      setCurationStage(4);
                    }}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-sky-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Expected Value
                  </label>
                  <input
                    type="text"
                    value={expectedVal}
                    onChange={(e) => {
                      setExpectedVal(e.target.value);
                      setCurationStage(4);
                    }}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-emerald-300 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Dataset đính kèm: <code className="text-slate-200">cohort_users.csv</code> (5 dòng)
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-md transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Publish Problem vào Kho bài tập
                </button>
              </div>
            </form>

            {publishSuccess && (
              <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Đã xuất bản bài tập mới thành công vào Problem Bank!</span>
                </div>
                <button
                  onClick={() => onSelectProblem(publishSuccess)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400 transition-colors whitespace-nowrap"
                >
                  Mở bài tập trong Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-6">
            <h2 className="text-base font-semibold text-slate-100 mb-1">
              Kiến trúc Hệ thống (System Architecture — Section 5)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Mô hình tách biệt tầng giao diện người học (Frontend TypeScript) và tầng xử lý dịch vụ (Problem Service, Code Runner, Evaluator, Progress Database).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                  <span>Tầng 1 · Client UI</span>
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  Frontend / Web UI (TypeScript)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hiển thị Problem Statement, Interactive Dataset Grid, Code Editor (Python & TS) và bảng Feedback trực quan.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span>Tầng 2 · Core Services</span>
                  <Server className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  Problem & Progress Service
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Phân phối bài tập theo Track/Level, quản lý dataset, lưu lịch sử nộp bài và tính toán Recommendation tiếp theo.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
                  <span>Tầng 3 · Sandbox Execution</span>
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  Code Runner (Python 3 & TS)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Thực thi hàm <code className="text-slate-200">solve(dataset)</code> trong môi trường an toàn có giới hạn thời gian (Timeout 3000ms).
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-purple-400 font-medium">
                  <span>Tầng 4 · Automated Grading</span>
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  Evaluator & Skill Database
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Đối chiếu kết quả với Public & Hidden Test Cases, chấm điểm, sinh gợi ý (Hint) và cập nhật hồ sơ kỹ năng.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-slate-100">
                Bảng Đặc tả Luồng Input → Process → Output của một Bài tập (Section 3)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400">
                    <th className="py-3 px-4 font-medium">Bước (Step)</th>
                    <th className="py-3 px-4 font-medium">Input (Đầu vào)</th>
                    <th className="py-3 px-4 font-medium">Process (Xử lý)</th>
                    <th className="py-3 px-4 font-medium">Output (Đầu ra)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-xs">
                  {WORKFLOW_STEPS_TABLE.map((row) => (
                    <tr key={row.step} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                        {row.step}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">{row.input}</td>
                      <td className="py-3 px-4 text-slate-300">{row.process}</td>
                      <td className="py-3 px-4 text-sky-300 font-mono">{row.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-semibold text-slate-100">
                6 Nguyên tắc Thiết kế Workflow Cốt lõi (Section 7)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKFLOW_PRINCIPLES.map((p) => (
                <div
                  key={p.index}
                  className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-lg space-y-1.5"
                >
                  <div className="text-xs font-mono text-sky-400">{p.index}. Nguyên tắc</div>
                  <h3 className="text-sm font-semibold text-slate-100">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
