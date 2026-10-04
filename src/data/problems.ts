export type TrackId = 'DA' | 'DS' | 'ML';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type CodeLanguage = 'python' | 'typescript';
export type ProblemSource =
  | 'StrataScratch'
  | 'DataLemur'
  | 'LeetCode'
  | 'HackerRank'
  | 'Kaggle'
  | 'InterviewQuery'
  | 'Codeforces';

export interface DatasetColumn {
  name: string;
  type: 'number' | 'string' | 'boolean';
  description: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  isHidden?: boolean;
  expectedKey: string;
  expectedValue: unknown;
  tolerance?: number;
}

export interface Problem {
  id: string;
  code: string;
  title: string;
  track: TrackId;
  difficulty: DifficultyLevel;
  source?: ProblemSource;
  sourceRef?: string;
  categoryGroup?: string;
  topic: string;
  skills: string[];
  interviewTag: string;
  companies: string[];
  acceptanceRate: string;
  estimatedMinutes: number;
  points: number;
  summary: string;
  businessContext: string;
  requirements: string[];
  constraints: string[];
  inputDescription: string;
  outputDescription: string;
  datasetName: string;
  datasetColumns: DatasetColumn[];
  datasetRows: Record<string, string | number | boolean | null>[];
  starterCode: {
    python: string;
    typescript: string;
  };
  solutionCode: {
    python: string;
    typescript: string;
  };
  expectedOutput: Record<string, unknown>;
  testCases: TestCase[];
  hints: string[];
  explanation: string;
}

export const TRACK_METADATA: Record<
  TrackId,
  {
    id: TrackId;
    name: string;
    shortName: string;
    description: string;
    coreSkills: string[];
    roleTarget: string;
  }
> = {
  DA: {
    id: 'DA',
    name: 'Data Analytics',
    shortName: 'DA',
    description:
      'Phân tích chỉ số kinh doanh, phễu chuyển đổi, phân khúc khách hàng RFM và trực quan hóa quyết định sản phẩm.',
    coreSkills: ['Data Wrangling', 'Cohort & Funnel Metrics', 'KPI Attribution', 'Business Reporting'],
    roleTarget: 'Data Analyst / Product Analyst / BI Engineer',
  },
  DS: {
    id: 'DS',
    name: 'Data Science',
    shortName: 'DS',
    description:
      'Làm sạch dữ liệu thực tế, xử lý ngoại lai (Outliers), kiểm định giả thuyết A/B Testing và chọn lọc đặc trưng thống kê.',
    coreSkills: ['Statistical Inference', 'A/B Testing', 'Outlier & Imputation', 'Feature Correlation'],
    roleTarget: 'Data Scientist / Decision Scientist / Quantitative Analyst',
  },
  ML: {
    id: 'ML',
    name: 'Machine Learning',
    shortName: 'ML',
    description:
      'Xây dựng thuật toán học máy từ gốc, đánh giá mô hình phân loại bất cân bằng, chuẩn hóa đặc trưng và tối ưu hóa Gradient Descent.',
    coreSkills: ['Evaluation Metrics', 'Feature Scaling & KNN', 'Gradient Descent', 'Model Diagnostics'],
    roleTarget: 'Machine Learning Engineer / Applied AI Scientist',
  },
};

export const INITIAL_PROBLEMS: Problem[] = [
  // ===================== DA TRACK =====================
  {
    id: 'da-101',
    code: 'DA-101',
    title: 'Phân tích Doanh thu Thực thu & AOV (Net Revenue)',
    track: 'DA',
    difficulty: 'Easy',
    source: 'DataLemur',
    sourceRef: 'DataLemur #12',
    categoryGroup: 'Product & Revenue Metrics',
    topic: 'Product & Revenue Analytics',
    skills: ['Data Filtering', 'KPI Aggregation', 'Category Grouping'],
    interviewTag: 'E-Commerce Analytics Screen',
    companies: ['Shopee', 'Amazon', 'Tiki'],
    acceptanceRate: '78.5%',
    estimatedMinutes: 15,
    points: 100,
    summary:
      'Lọc các đơn hàng hoàn tất (completed), tính tổng doanh thu ròng, giá trị đơn hàng trung bình (AOV) và xác định danh mục sản phẩm mang lại doanh thu cao nhất.',
    businessContext:
      'Trong báo cáo vận hành tuần của sàn thương mại điện tử, cần bóc tách các đơn hàng hoàn tất để tính chính xác doanh thu thực thu (loại bỏ đơn hủy/hoàn tiền) và xác định ngành hàng dẫn đầu.',
    requirements: [
      'Chỉ tính các bản ghi có trạng thái `status == "completed"`.',
      'Tính `total_revenue`: tổng `order_value` (làm tròn 2 chữ số).',
      'Tính `aov`: trung bình `order_value` trên mỗi đơn hoàn tất (làm tròn 2 chữ số).',
      'Xác định `top_category`: ngành hàng có tổng doanh thu lớn nhất.',
      'Đếm `completed_count`: số lượng đơn hàng hoàn tất.',
    ],
    constraints: [
      'Độ phức tạp thời gian: O(N) với N là số dòng đơn hàng.',
      'Trả về dictionary/object có 4 keys: total_revenue, aov, top_category, completed_count.',
    ],
    inputDescription: 'Mảng các bản ghi giao dịch từ bảng `ecommerce_orders.csv`.',
    outputDescription: 'Dict chứa total_revenue, aov, top_category, completed_count.',
    datasetName: 'ecommerce_orders.csv',
    datasetColumns: [
      { name: 'order_id', type: 'string', description: 'Mã định danh đơn hàng' },
      { name: 'customer_id', type: 'string', description: 'Mã khách hàng' },
      { name: 'category', type: 'string', description: 'Ngành hàng' },
      { name: 'order_value', type: 'number', description: 'Giá trị đơn hàng (USD)' },
      { name: 'status', type: 'string', description: 'Trạng thái: completed, cancelled, refunded' },
    ],
    datasetRows: [
      { order_id: 'ORD-01', customer_id: 'C-101', category: 'Electronics', order_value: 420.5, status: 'completed' },
      { order_id: 'ORD-02', customer_id: 'C-102', category: 'Fashion', order_value: 85.0, status: 'completed' },
      { order_id: 'ORD-03', customer_id: 'C-103', category: 'Electronics', order_value: 310.0, status: 'cancelled' },
      { order_id: 'ORD-04', customer_id: 'C-101', category: 'Home', order_value: 195.5, status: 'completed' },
      { order_id: 'ORD-05', customer_id: 'C-104', category: 'Electronics', order_value: 540.0, status: 'completed' },
      { order_id: 'ORD-06', customer_id: 'C-105', category: 'Fashion', order_value: 120.0, status: 'refunded' },
      { order_id: 'ORD-07', customer_id: 'C-106', category: 'Home', order_value: 260.0, status: 'completed' },
      { order_id: 'ORD-08', customer_id: 'C-102', category: 'Fashion', order_value: 149.0, status: 'completed' },
    ],
    starterCode: {
      python: `def solve(dataset):
    completed = [r for r in dataset if r["status"] == "completed"]
    total_revenue = sum(r["order_value"] for r in completed)
    count = len(completed)
    aov = round(total_revenue / count, 2) if count > 0 else 0.0

    cats = {}
    for r in completed:
        c = r["category"]
        cats[c] = cats.get(c, 0.0) + r["order_value"]
    top_category = max(cats, key=cats.get)

    return {
        "total_revenue": round(total_revenue, 2),
        "aov": aov,
        "top_category": top_category,
        "completed_count": count
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const completed = dataset.filter((r) => r.status === "completed");
  const count = completed.length;
  const totalRevenue = completed.reduce((s, r) => s + Number(r.order_value), 0);
  const aov = count > 0 ? Number((totalRevenue / count).toFixed(2)) : 0;
  const cats: Record<string, number> = {};
  for (const r of completed) {
    cats[r.category] = (cats[r.category] || 0) + Number(r.order_value);
  }
  const topCategory = Object.entries(cats).sort((a, b) => b[1] - a[1])[0][0];
  return {
    total_revenue: Number(totalRevenue.toFixed(2)),
    aov,
    top_category: topCategory,
    completed_count: count,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    completed = [r for r in dataset if r["status"] == "completed"]
    total_revenue = sum(r["order_value"] for r in completed)
    count = len(completed)
    aov = round(total_revenue / count, 2) if count > 0 else 0.0
    cats = {}
    for r in completed:
        cats[r["category"]] = cats.get(r["category"], 0.0) + r["order_value"]
    return {
        "total_revenue": round(total_revenue, 2),
        "aov": aov,
        "top_category": max(cats, key=cats.get),
        "completed_count": count
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const completed = dataset.filter((r) => r.status === "completed");
  const count = completed.length;
  const totalRevenue = completed.reduce((s, r) => s + Number(r.order_value), 0);
  const aov = Number((totalRevenue / count).toFixed(2));
  const cats: Record<string, number> = {};
  for (const r of completed) cats[r.category] = (cats[r.category] || 0) + Number(r.order_value);
  const topCategory = Object.entries(cats).sort((a, b) => b[1] - a[1])[0][0];
  return {
    total_revenue: Number(totalRevenue.toFixed(2)),
    aov,
    top_category: topCategory,
    completed_count: count,
  };
}
`,
    },
    expectedOutput: {
      total_revenue: 1650,
      aov: 275,
      top_category: 'Electronics',
      completed_count: 6,
    },
    testCases: [
      { id: 'tc-1', name: 'Đếm đơn completed', description: 'Đếm đúng 6 đơn hợp lệ', expectedKey: 'completed_count', expectedValue: 6 },
      { id: 'tc-2', name: 'Tổng doanh thu ròng', description: 'Tổng đạt 1650.0 USD', expectedKey: 'total_revenue', expectedValue: 1650, tolerance: 0.01 },
      { id: 'tc-3', name: 'Giá trị AOV trung bình', description: 'AOV = 275.0 USD', expectedKey: 'aov', expectedValue: 275, tolerance: 0.01 },
      { id: 'tc-4', name: 'Top Category dẫn đầu', description: 'Electronics đạt doanh thu cao nhất', isHidden: true, expectedKey: 'top_category', expectedValue: 'Electronics' },
    ],
    hints: ['Lọc danh sách bằng status == "completed"', 'Dùng dictionary cộng dồn order_value theo category'],
    explanation: 'Việc loại bỏ đơn hủy/hoàn tiền giúp bảo vệ tính chính xác của chỉ số tài chính.',
  },

  {
    id: 'da-102',
    code: 'DA-102',
    title: 'Tỷ lệ Giữ chân Người dùng 7 Ngày (Day-7 Retention)',
    track: 'DA',
    difficulty: 'Easy',
    source: 'StrataScratch',
    sourceRef: 'StrataScratch #10319',
    categoryGroup: 'Funnel & Retention',
    topic: 'Product Growth & Retention',
    skills: ['Cohort Retention', 'Binary Flags', 'Ratio Calculation'],
    interviewTag: 'App Engagement Interview',
    companies: ['Meta', 'ByteDance', 'Grab'],
    acceptanceRate: '82.1%',
    estimatedMinutes: 15,
    points: 100,
    summary:
      'Đo lường tỷ lệ người dùng mới đăng ký quay lại ứng dụng vào ngày thứ 7 (D7 Retention Rate) và phân nhóm theo hệ điều hành iOS vs Android.',
    businessContext:
      'Đội ngũ Growth Product cần xác định nền tảng di động nào đang có trải nghiệm onboarding tốt hơn dựa trên tỷ lệ kích hoạt D7.',
    requirements: [
      'Tính `total_users`: tổng số user đăng ký.',
      'Tính `retained_users`: số user có `active_day_7 == 1`.',
      'Tính `overall_d7_retention_pct`: (retained / total) * 100 (làm tròn 2 chữ số).',
      'Tính `best_platform`: nền tảng (iOS hoặc Android) có tỷ lệ retention cao hơn.',
    ],
    constraints: ['Làm tròn retention percentage 2 chữ số thập phân.'],
    inputDescription: 'Bảng user_cohorts.csv chứa thông tin hệ điều hành và cờ active_day_7.',
    outputDescription: 'Dict chứa total_users, retained_users, overall_d7_retention_pct, best_platform.',
    datasetName: 'user_cohorts.csv',
    datasetColumns: [
      { name: 'user_id', type: 'string', description: 'Mã người dùng' },
      { name: 'platform', type: 'string', description: 'Nền tảng (iOS, Android)' },
      { name: 'active_day_7', type: 'number', description: '1 nếu đăng nhập lại ngày 7, 0 nếu không' },
    ],
    datasetRows: [
      { user_id: 'U-01', platform: 'iOS', active_day_7: 1 },
      { user_id: 'U-02', platform: 'Android', active_day_7: 0 },
      { user_id: 'U-03', platform: 'iOS', active_day_7: 1 },
      { user_id: 'U-04', platform: 'iOS', active_day_7: 1 },
      { user_id: 'U-05', platform: 'Android', active_day_7: 1 },
      { user_id: 'U-06', platform: 'Android', active_day_7: 0 },
      { user_id: 'U-07', platform: 'iOS', active_day_7: 0 },
      { user_id: 'U-08', platform: 'Android', active_day_7: 1 },
    ],
    starterCode: {
      python: `def solve(dataset):
    total = len(dataset)
    retained = sum(r["active_day_7"] for r in dataset)
    overall_pct = round((retained / total) * 100, 2)

    platform_stats = {}
    for r in dataset:
        p = r["platform"]
        if p not in platform_stats: platform_stats[p] = [0, 0]
        platform_stats[p][0] += r["active_day_7"]
        platform_stats[p][1] += 1

    rates = {p: s[0] / s[1] for p, s in platform_stats.items()}
    best_platform = max(rates, key=rates.get)

    return {
        "total_users": total,
        "retained_users": retained,
        "overall_d7_retention_pct": overall_pct,
        "best_platform": best_platform
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const total = dataset.length;
  const retained = dataset.reduce((s, r) => s + Number(r.active_day_7), 0);
  const overallPct = Number(((retained / total) * 100).toFixed(2));

  const stats: Record<string, [number, number]> = {};
  for (const r of dataset) {
    if (!stats[r.platform]) stats[r.platform] = [0, 0];
    stats[r.platform][0] += Number(r.active_day_7);
    stats[r.platform][1] += 1;
  }
  let best = "";
  let maxRate = -1;
  for (const [p, [ret, tot]] of Object.entries(stats)) {
    const rate = ret / tot;
    if (rate > maxRate) { maxRate = rate; best = p; }
  }
  return {
    total_users: total,
    retained_users: retained,
    overall_d7_retention_pct: overallPct,
    best_platform: best,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    total = len(dataset)
    retained = sum(r["active_day_7"] for r in dataset)
    overall_pct = round((retained / total) * 100, 2)
    stats = {}
    for r in dataset:
        p = r["platform"]
        stats[p] = stats.get(p, [0, 0])
        stats[p][0] += r["active_day_7"]
        stats[p][1] += 1
    best_platform = max(stats, key=lambda k: stats[k][0] / stats[k][1])
    return {
        "total_users": total,
        "retained_users": retained,
        "overall_d7_retention_pct": overall_pct,
        "best_platform": best_platform
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const total = dataset.length;
  const retained = dataset.reduce((s, r) => s + Number(r.active_day_7), 0);
  const overallPct = Number(((retained / total) * 100).toFixed(2));
  const stats: Record<string, [number, number]> = {};
  for (const r of dataset) {
    if (!stats[r.platform]) stats[r.platform] = [0, 0];
    stats[r.platform][0] += Number(r.active_day_7);
    stats[r.platform][1] += 1;
  }
  const best = Object.entries(stats).sort((a, b) => (b[1][0]/b[1][1]) - (a[1][0]/a[1][1]))[0][0];
  return {
    total_users: total,
    retained_users: retained,
    overall_d7_retention_pct: overallPct,
    best_platform: best,
  };
}
`,
    },
    expectedOutput: {
      total_users: 8,
      retained_users: 5,
      overall_d7_retention_pct: 62.5,
      best_platform: 'iOS',
    },
    testCases: [
      { id: 'tc-1', name: 'Đếm tổng người dùng giữ chân', description: '5/8 users active ngày 7', expectedKey: 'retained_users', expectedValue: 5 },
      { id: 'tc-2', name: 'Tỷ lệ retention chung', description: '62.50%', expectedKey: 'overall_d7_retention_pct', expectedValue: 62.5, tolerance: 0.01 },
      { id: 'tc-3', name: 'Nền tảng giữ chân tốt nhất', description: 'iOS đạt 75% (3/4) so với Android 50% (2/4)', isHidden: true, expectedKey: 'best_platform', expectedValue: 'iOS' },
    ],
    hints: ['Nhóm theo platform để so sánh tỷ lệ retained / total của từng hệ điều hành'],
    explanation: 'iOS giữ chân 75% người dùng sau 7 ngày, vượt trội so với Android (50%).',
  },

  {
    id: 'da-201',
    code: 'DA-201',
    title: 'Phân tích Phễu Chuyển đổi Onboarding (Funnel Bottleneck)',
    track: 'DA',
    difficulty: 'Medium',
    topic: 'Funnel & Product Analytics',
    skills: ['Funnel Conversion', 'Drop-off Attribution', 'Sequential Ratios'],
    interviewTag: 'Fintech Product Analytics Case',
    companies: ['Grab', 'Revolut', 'MoMo'],
    acceptanceRate: '65.2%',
    estimatedMinutes: 25,
    points: 150,
    summary:
      'Đo lường tỷ lệ chuyển đổi qua 4 bước mở tài khoản ví điện tử, xác định tỷ lệ chuyển đổi toàn phễu và tìm bước có tỷ lệ người dùng rời bỏ (drop-off rate) lớn nhất.',
    businessContext:
      'Ứng dụng Fintech nhận thấy số lượng người dùng nạp tiền lần đầu thấp hơn kỳ vọng. Nhóm Product cần tìm chính xác bước nào trong luồng eKYC đang làm mất nhiều khách hàng nhất.',
    requirements: [
      '4 bước theo thứ tự: `signup` → `kyc_submitted` → `kyc_verified` → `first_deposit`.',
      'Tính `overall_conversion_pct`: `(first_deposit_users / signup_users) * 100`.',
      'Tìm bước chuyển tiếp có drop-off cao nhất (`bottleneck_transition`).',
    ],
    constraints: ['Làm tròn tỷ lệ % đến 2 chữ số thập phân.'],
    inputDescription: 'Bảng onboarding_events.csv ghi nhận tiến trình từng bước.',
    outputDescription: 'Dict chứa signup_count, deposit_count, overall_conversion_pct, bottleneck_transition.',
    datasetName: 'onboarding_events.csv',
    datasetColumns: [
      { name: 'user_id', type: 'string', description: 'Mã user' },
      { name: 'signup', type: 'number', description: '1 nếu đăng ký' },
      { name: 'kyc_submitted', type: 'number', description: '1 nếu gửi ảnh' },
      { name: 'kyc_verified', type: 'number', description: '1 nếu duyệt thành công' },
      { name: 'first_deposit', type: 'number', description: '1 nếu nạp tiền' },
    ],
    datasetRows: [
      { user_id: 'U-01', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1 },
      { user_id: 'U-02', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0 },
      { user_id: 'U-03', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1 },
      { user_id: 'U-04', signup: 1, kyc_submitted: 0, kyc_verified: 0, first_deposit: 0 },
      { user_id: 'U-05', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0 },
      { user_id: 'U-06', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 0 },
      { user_id: 'U-07', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0 },
      { user_id: 'U-08', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1 },
      { user_id: 'U-09', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0 },
      { user_id: 'U-10', signup: 1, kyc_submitted: 0, kyc_verified: 0, first_deposit: 0 },
    ],
    starterCode: {
      python: `def solve(dataset):
    steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"]
    counts = {s: sum(r[s] for r in dataset) for s in steps}
    signup_count = counts["signup"]
    deposit_count = counts["first_deposit"]
    overall_pct = round((deposit_count / signup_count) * 100, 2)
    max_drop = -1
    bottleneck = ""
    for i in range(len(steps) - 1):
        c1, c2 = counts[steps[i]], counts[steps[i+1]]
        drop = 1 - c2 / c1
        if drop > max_drop:
            max_drop = drop
            bottleneck = f"{steps[i]} -> {steps[i+1]}"
    return {
        "signup_count": signup_count,
        "deposit_count": deposit_count,
        "overall_conversion_pct": overall_pct,
        "bottleneck_transition": bottleneck
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"];
  const counts: Record<string, number> = {};
  for (const s of steps) counts[s] = dataset.reduce((acc, r) => acc + Number(r[s]), 0);
  const signupCount = counts.signup;
  const depositCount = counts.first_deposit;
  const overallPct = Number(((depositCount / signupCount) * 100).toFixed(2));
  let maxDrop = -1;
  let bottleneck = "";
  for (let i = 0; i < steps.length - 1; i++) {
    const drop = 1 - counts[steps[i + 1]] / counts[steps[i]];
    if (drop > maxDrop) {
      maxDrop = drop;
      bottleneck = \`\${steps[i]} -> \${steps[i + 1]}\`;
    }
  }
  return {
    signup_count: signupCount,
    deposit_count: depositCount,
    overall_conversion_pct: overallPct,
    bottleneck_transition: bottleneck,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"]
    counts = {s: sum(r[s] for r in dataset) for s in steps}
    signup_count = counts["signup"]
    deposit_count = counts["first_deposit"]
    overall_pct = round((deposit_count / signup_count) * 100, 2)
    max_drop = -1
    bottleneck = ""
    for i in range(len(steps) - 1):
        drop = 1 - counts[steps[i+1]] / counts[steps[i]]
        if drop > max_drop:
            max_drop = drop
            bottleneck = f"{steps[i]} -> {steps[i+1]}"
    return {
        "signup_count": signup_count,
        "deposit_count": deposit_count,
        "overall_conversion_pct": overall_pct,
        "bottleneck_transition": bottleneck
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"];
  const counts: Record<string, number> = {};
  for (const s of steps) counts[s] = dataset.reduce((acc, r) => acc + Number(r[s]), 0);
  let maxDrop = -1, bottleneck = "";
  for (let i = 0; i < steps.length - 1; i++) {
    const drop = 1 - counts[steps[i + 1]] / counts[steps[i]];
    if (drop > maxDrop) { maxDrop = drop; bottleneck = \`\${steps[i]} -> \${steps[i + 1]}\`; }
  }
  return {
    signup_count: counts.signup,
    deposit_count: counts.first_deposit,
    overall_conversion_pct: Number(((counts.first_deposit / counts.signup) * 100).toFixed(2)),
    bottleneck_transition: bottleneck,
  };
}
`,
    },
    expectedOutput: {
      signup_count: 10,
      deposit_count: 3,
      overall_conversion_pct: 30,
      bottleneck_transition: 'kyc_submitted -> kyc_verified',
    },
    testCases: [
      { id: 'tc-1', name: 'Đếm hoàn thành phễu', description: '3 users hoàn tất nạp tiền', expectedKey: 'deposit_count', expectedValue: 3 },
      { id: 'tc-2', name: 'Tỷ lệ chuyển đổi toàn phễu', description: '30.0%', expectedKey: 'overall_conversion_pct', expectedValue: 30, tolerance: 0.01 },
      { id: 'tc-3', name: 'Điểm nghẽn lớn nhất', description: 'kyc_submitted -> kyc_verified mất 50%', isHidden: true, expectedKey: 'bottleneck_transition', expectedValue: 'kyc_submitted -> kyc_verified' },
    ],
    hints: ['Tính tỷ lệ rơi rụng bằng 1 - (next_step / curr_step) giữa các bước liên tiếp'],
    explanation: 'Điểm nghẽn rơi rụng 50% tại bước eKYC duyệt CCCD.',
  },

  {
    id: 'da-301',
    code: 'DA-301',
    title: 'Phân khúc Rủi ro Churn & ARR Exposure (B2B SaaS)',
    track: 'DA',
    difficulty: 'Hard',
    topic: 'Customer Retention & Health Scoring',
    skills: ['Composite Health Score', 'Churn Exposure', 'B2B Segmentation'],
    interviewTag: 'SaaS Revenue Operations Case',
    companies: ['Salesforce', 'Snowflake', 'HubSpot'],
    acceptanceRate: '51.8%',
    estimatedMinutes: 30,
    points: 200,
    summary:
      'Xây dựng chỉ số Customer Health Score từ tần suất đăng nhập, mức độ sử dụng và số ticket lỗi, tính tổng ARR có nguy cơ rời bỏ.',
    businessContext:
      'Đội ngũ Customer Success tại một công ty B2B SaaS cần danh sách cảnh báo sớm các doanh nghiệp có nguy cơ không gia hạn hợp đồng.',
    requirements: [
      'Công thức `health_score`: `100 - (days_since_last_login * 1.5) + (monthly_sessions * 1.2) - (support_tickets * 4.0)`.',
      'Tài khoản có nguy cơ rời bỏ nếu `health_score < 60`.',
      'Trả về danh sách `at_risk_accounts`, tổng `at_risk_arr` và `avg_health_score`.',
    ],
    constraints: ['Giữ nguyên thứ tự các tài khoản rủi ro.'],
    inputDescription: 'Bảng b2b_accounts.csv.',
    outputDescription: 'Dict chứa at_risk_accounts, at_risk_arr, avg_health_score.',
    datasetName: 'b2b_accounts.csv',
    datasetColumns: [
      { name: 'account_id', type: 'string', description: 'Mã tài khoản' },
      { name: 'days_since_last_login', type: 'number', description: 'Số ngày chưa đăng nhập' },
      { name: 'monthly_sessions', type: 'number', description: 'Phiên làm việc tháng' },
      { name: 'arr_usd', type: 'number', description: 'Doanh thu năm ARR' },
      { name: 'support_tickets', type: 'number', description: 'Số lỗi báo' },
    ],
    datasetRows: [
      { account_id: 'ACC-101', days_since_last_login: 2, monthly_sessions: 35, arr_usd: 48000, support_tickets: 1 },
      { account_id: 'ACC-102', days_since_last_login: 28, monthly_sessions: 4, arr_usd: 72000, support_tickets: 5 },
      { account_id: 'ACC-103', days_since_last_login: 5, monthly_sessions: 22, arr_usd: 36000, support_tickets: 2 },
      { account_id: 'ACC-104', days_since_last_login: 34, monthly_sessions: 2, arr_usd: 95000, support_tickets: 4 },
      { account_id: 'ACC-105', days_since_last_login: 10, monthly_sessions: 18, arr_usd: 60000, support_tickets: 1 },
      { account_id: 'ACC-106', days_since_last_login: 24, monthly_sessions: 5, arr_usd: 54000, support_tickets: 6 },
    ],
    starterCode: {
      python: `def solve(dataset):
    at_risk = []
    at_risk_arr = 0
    scores = []
    for r in dataset:
        s = 100.0 - r["days_since_last_login"] * 1.5 + r["monthly_sessions"] * 1.2 - r["support_tickets"] * 4.0
        scores.append(s)
        if s < 60.0:
            at_risk.append(r["account_id"])
            at_risk_arr += r["arr_usd"]
    return {
        "at_risk_accounts": at_risk,
        "at_risk_arr": at_risk_arr,
        "avg_health_score": round(sum(scores) / len(scores), 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const atRisk: string[] = [];
  let atRiskArr = 0;
  const scores: number[] = [];
  for (const r of dataset) {
    const s = 100 - Number(r.days_since_last_login) * 1.5 + Number(r.monthly_sessions) * 1.2 - Number(r.support_tickets) * 4.0;
    scores.push(s);
    if (s < 60) {
      atRisk.push(String(r.account_id));
      atRiskArr += Number(r.arr_usd);
    }
  }
  return {
    at_risk_accounts: atRisk,
    at_risk_arr: atRiskArr,
    avg_health_score: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    at_risk, at_risk_arr, scores = [], 0, []
    for r in dataset:
        s = 100.0 - r["days_since_last_login"] * 1.5 + r["monthly_sessions"] * 1.2 - r["support_tickets"] * 4.0
        scores.append(s)
        if s < 60.0:
            at_risk.append(r["account_id"])
            at_risk_arr += r["arr_usd"]
    return {
        "at_risk_accounts": at_risk,
        "at_risk_arr": at_risk_arr,
        "avg_health_score": round(sum(scores) / len(scores), 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const atRisk: string[] = [];
  let atRiskArr = 0;
  const scores = dataset.map((r) => {
    const s = 100 - Number(r.days_since_last_login) * 1.5 + Number(r.monthly_sessions) * 1.2 - Number(r.support_tickets) * 4.0;
    if (s < 60) { atRisk.push(String(r.account_id)); atRiskArr += Number(r.arr_usd); }
    return s;
  });
  return {
    at_risk_accounts: atRisk,
    at_risk_arr: atRiskArr,
    avg_health_score: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
  };
}
`,
    },
    expectedOutput: {
      at_risk_accounts: ['ACC-102', 'ACC-104', 'ACC-106'],
      at_risk_arr: 221000,
      avg_health_score: 79.33,
    },
    testCases: [
      { id: 'tc-1', name: 'Tài khoản nguy cơ rời bỏ', description: 'ACC-102, ACC-104, ACC-106', expectedKey: 'at_risk_accounts', expectedValue: ['ACC-102', 'ACC-104', 'ACC-106'] },
      { id: 'tc-2', name: 'Tổng ARR rủi ro', description: '221,000 USD', expectedKey: 'at_risk_arr', expectedValue: 221000 },
      { id: 'tc-3', name: 'Điểm sức khỏe trung bình', description: '79.33', isHidden: true, expectedKey: 'avg_health_score', expectedValue: 79.33, tolerance: 0.02 },
    ],
    hints: ['Nhớ kiểm tra ngưỡng health_score < 60'],
    explanation: 'Có tới 221,000 USD ARR nằm trong nhóm khách hàng rủi ro cao.',
  },

  // ===================== DS TRACK =====================
  {
    id: 'ds-101',
    code: 'DS-101',
    title: 'Làm sạch Cảm biến: Lọc Ngoại lai & Điền Trung vị',
    track: 'DS',
    difficulty: 'Easy',
    topic: 'Exploratory Data Analysis & Cleaning',
    skills: ['Outlier Filtering', 'Median Imputation', 'Robust Statistics'],
    interviewTag: 'Sensor Data Screen',
    companies: ['Apple', 'Tesla', 'Bosch'],
    acceptanceRate: '74.6%',
    estimatedMinutes: 20,
    points: 120,
    summary:
      'Xử lý tập dữ liệu nhiệt độ kho lạnh bị khuyết (null) và nhiễu phần cứng ngoài khoảng [-30°C, 50°C] bằng phương pháp điền trung vị.',
    businessContext:
      'Hệ thống IoT giám sát chuỗi cung ứng lạnh dược phẩm gửi dữ liệu về máy chủ, một số bị mất gói tin hoặc vọt số ảo do lỗi phần cứng.',
    requirements: [
      'Loại bỏ các dòng nhiệt độ khác null nhưng nằm ngoài [-30, 50] vào `outliers_removed`.',
      'Tính `median_used` trên các giá trị hợp lệ.',
      'Thay thế giá trị null bằng `median_used` và tính `cleaned_mean`.',
    ],
    constraints: ['Làm tròn 2 chữ số thập phân.'],
    inputDescription: 'Bảng iot_readings.csv.',
    outputDescription: 'Dict chứa median_used, cleaned_mean, outliers_removed, valid_records_count.',
    datasetName: 'iot_readings.csv',
    datasetColumns: [
      { name: 'sensor_id', type: 'string', description: 'Mã cảm biến' },
      { name: 'temperature_c', type: 'number', description: 'Nhiệt độ °C' },
    ],
    datasetRows: [
      { sensor_id: 'S-01', temperature_c: 4.2 },
      { sensor_id: 'S-02', temperature_c: 5.0 },
      { sensor_id: 'S-03', temperature_c: null },
      { sensor_id: 'S-04', temperature_c: 125.0 },
      { sensor_id: 'S-05', temperature_c: 3.8 },
      { sensor_id: 'S-06', temperature_c: 6.2 },
      { sensor_id: 'S-07', temperature_c: -85.0 },
      { sensor_id: 'S-08', temperature_c: 4.6 },
      { sensor_id: 'S-09', temperature_c: null },
    ],
    starterCode: {
      python: `def solve(dataset):
    outliers, valid, missing = 0, [], 0
    for r in dataset:
        t = r["temperature_c"]
        if t is None: missing += 1
        elif t < -30 or t > 50: outliers += 1
        else: valid.append(float(t))
    valid.sort()
    n = len(valid)
    median = valid[n // 2] if n % 2 == 1 else (valid[n // 2 - 1] + valid[n // 2]) / 2.0
    series = valid + [median] * missing
    return {
        "median_used": round(median, 2),
        "cleaned_mean": round(sum(series) / len(series), 2),
        "outliers_removed": outliers,
        "valid_records_count": len(series)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let outliers = 0, missing = 0;
  const valid: number[] = [];
  for (const r of dataset) {
    const t = r.temperature_c;
    if (t === null || t === undefined) missing++;
    else if (t < -30 || t > 50) outliers++;
    else valid.push(Number(t));
  }
  valid.sort((a, b) => a - b);
  const median = valid[Math.floor(valid.length / 2)];
  const series = [...valid, ...Array(missing).fill(median)];
  return {
    median_used: Number(median.toFixed(2)),
    cleaned_mean: Number((series.reduce((a, b) => a + b, 0) / series.length).toFixed(2)),
    outliers_removed: outliers,
    valid_records_count: series.length,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    outliers, valid, missing = 0, [], 0
    for r in dataset:
        t = r["temperature_c"]
        if t is None: missing += 1
        elif t < -30 or t > 50: outliers += 1
        else: valid.append(float(t))
    valid.sort()
    median = valid[len(valid)//2]
    series = valid + [median] * missing
    return {
        "median_used": round(median, 2),
        "cleaned_mean": round(sum(series) / len(series), 2),
        "outliers_removed": outliers,
        "valid_records_count": len(series)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let outliers = 0, missing = 0;
  const valid: number[] = [];
  for (const r of dataset) {
    const t = r.temperature_c;
    if (t === null || t === undefined) missing++;
    else if (t < -30 || t > 50) outliers++;
    else valid.push(Number(t));
  }
  valid.sort((a, b) => a - b);
  const median = valid[Math.floor(valid.length / 2)];
  const series = [...valid, ...Array(missing).fill(median)];
  return {
    median_used: Number(median.toFixed(2)),
    cleaned_mean: Number((series.reduce((a, b) => a + b, 0) / series.length).toFixed(2)),
    outliers_removed: outliers,
    valid_records_count: series.length,
  };
}
`,
    },
    expectedOutput: {
      median_used: 4.6,
      cleaned_mean: 4.71,
      outliers_removed: 2,
      valid_records_count: 7,
    },
    testCases: [
      { id: 'tc-1', name: 'Số lượng outlier bị lọc', description: '2 điểm dị thường (125 và -85)', expectedKey: 'outliers_removed', expectedValue: 2 },
      { id: 'tc-2', name: 'Giá trị trung vị tính được', description: '4.6°C', expectedKey: 'median_used', expectedValue: 4.6, tolerance: 0.01 },
      { id: 'tc-3', name: 'Trung bình sau làm sạch', description: '4.71°C', isHidden: true, expectedKey: 'cleaned_mean', expectedValue: 4.71, tolerance: 0.01 },
    ],
    hints: ['Tách riêng các bản ghi null trước khi kiểm tra ngưỡng nhiệt độ'],
    explanation: 'Trung vị bảo vệ tập dữ liệu khỏi bị sai lệch bởi các giá trị đo hỏng.',
  },

  {
    id: 'ds-201',
    code: 'DS-201',
    title: 'Kiểm định A/B Testing: Two-Proportion Z-Test & Uplift',
    track: 'DS',
    difficulty: 'Medium',
    topic: 'Statistical Hypothesis Testing',
    skills: ['A/B Testing', 'Pooled Standard Error', 'Z-Score'],
    interviewTag: 'Product Data Science Round',
    companies: ['Google', 'Meta', 'Netflix'],
    acceptanceRate: '62.4%',
    estimatedMinutes: 25,
    points: 160,
    summary:
      'Tổng hợp số liệu thử nghiệm A/B nhóm Control vs Treatment, tính mức tăng trưởng tương đối và kiểm định thống kê Pooled Z-Test ở mức ý nghĩa alpha = 0.05.',
    businessContext:
      'Đánh giá hiệu quả tính năng 1-Click Checkout để quyết định có triển khai toàn bộ người dùng hay không.',
    requirements: [
      'Tính `cr_control` và `cr_treatment`.',
      'Tính `relative_uplift_pct`.',
      'Tính `z_score` và quyết định `is_significant = (z_score >= 1.96)`.',
    ],
    constraints: ['cr làm tròn 4 chữ số, z_score làm tròn 2 chữ số.'],
    inputDescription: 'Bảng ab_experiment_groups.csv.',
    outputDescription: 'Dict chứa cr_control, cr_treatment, relative_uplift_pct, z_score, is_significant.',
    datasetName: 'ab_experiment_groups.csv',
    datasetColumns: [
      { name: 'day', type: 'string', description: 'Ngày' },
      { name: 'group', type: 'string', description: 'control hoặc treatment' },
      { name: 'visitors', type: 'number', description: 'Số lượng truy cập' },
      { name: 'conversions', type: 'number', description: 'Số chuyển đổi' },
    ],
    datasetRows: [
      { day: 'Day-1', group: 'control', visitors: 1500, conversions: 118 },
      { day: 'Day-1', group: 'treatment', visitors: 1500, conversions: 146 },
      { day: 'Day-2', group: 'control', visitors: 1800, conversions: 145 },
      { day: 'Day-2', group: 'treatment', visitors: 1800, conversions: 178 },
      { day: 'Day-3', group: 'control', visitors: 1700, conversions: 137 },
      { day: 'Day-3', group: 'treatment', visitors: 1700, conversions: 176 },
    ],
    starterCode: {
      python: `import math

def solve(dataset):
    vis_c = sum(r["visitors"] for r in dataset if r["group"] == "control")
    conv_c = sum(r["conversions"] for r in dataset if r["group"] == "control")
    vis_t = sum(r["visitors"] for r in dataset if r["group"] == "treatment")
    conv_t = sum(r["conversions"] for r in dataset if r["group"] == "treatment")
    cr_c, cr_t = conv_c / vis_c, conv_t / vis_t
    uplift = ((cr_t - cr_c) / cr_c) * 100.0
    p_pool = (conv_c + conv_t) / (vis_c + vis_t)
    se = math.sqrt(p_pool * (1.0 - p_pool) * (1.0 / vis_c + 1.0 / vis_t))
    z = (cr_t - cr_c) / se
    return {
        "cr_control": round(cr_c, 4),
        "cr_treatment": round(cr_t, 4),
        "relative_uplift_pct": round(uplift, 2),
        "z_score": round(z, 2),
        "is_significant": bool(z >= 1.96)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let vc = 0, cc = 0, vt = 0, ct = 0;
  for (const r of dataset) {
    if (r.group === "control") { vc += Number(r.visitors); cc += Number(r.conversions); }
    else { vt += Number(r.visitors); ct += Number(r.conversions); }
  }
  const crC = cc / vc, crT = ct / vt;
  const uplift = ((crT - crC) / crC) * 100;
  const pPool = (cc + ct) / (vc + vt);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / vc + 1 / vt));
  const z = (crT - crC) / se;
  return {
    cr_control: Number(crC.toFixed(4)),
    cr_treatment: Number(crT.toFixed(4)),
    relative_uplift_pct: Number(uplift.toFixed(2)),
    z_score: Number(z.toFixed(2)),
    is_significant: z >= 1.96,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def solve(dataset):
    vis_c = sum(r["visitors"] for r in dataset if r["group"] == "control")
    conv_c = sum(r["conversions"] for r in dataset if r["group"] == "control")
    vis_t = sum(r["visitors"] for r in dataset if r["group"] == "treatment")
    conv_t = sum(r["conversions"] for r in dataset if r["group"] == "treatment")
    cr_c, cr_t = conv_c / vis_c, conv_t / vis_t
    uplift = ((cr_t - cr_c) / cr_c) * 100.0
    p_pool = (conv_c + conv_t) / (vis_c + vis_t)
    se = math.sqrt(p_pool * (1.0 - p_pool) * (1.0 / vis_c + 1.0 / vis_t))
    z = (cr_t - cr_c) / se
    return {
        "cr_control": round(cr_c, 4),
        "cr_treatment": round(cr_t, 4),
        "relative_uplift_pct": round(uplift, 2),
        "z_score": round(z, 2),
        "is_significant": bool(z >= 1.96)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let vc = 0, cc = 0, vt = 0, ct = 0;
  for (const r of dataset) {
    if (r.group === "control") { vc += Number(r.visitors); cc += Number(r.conversions); }
    else { vt += Number(r.visitors); ct += Number(r.conversions); }
  }
  const crC = cc / vc, crT = ct / vt;
  const uplift = ((crT - crC) / crC) * 100;
  const pPool = (cc + ct) / (vc + vt);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / vc + 1 / vt));
  const z = (crT - crC) / se;
  return {
    cr_control: Number(crC.toFixed(4)),
    cr_treatment: Number(crT.toFixed(4)),
    relative_uplift_pct: Number(uplift.toFixed(2)),
    z_score: Number(z.toFixed(2)),
    is_significant: z >= 1.96,
  };
}
`,
    },
    expectedOutput: {
      cr_control: 0.08,
      cr_treatment: 0.1,
      relative_uplift_pct: 25,
      z_score: 3.49,
      is_significant: true,
    },
    testCases: [
      { id: 'tc-1', name: 'CR Treatment', description: '0.1000', expectedKey: 'cr_treatment', expectedValue: 0.1, tolerance: 0.0005 },
      { id: 'tc-2', name: 'Relative Uplift', description: '+25.0%', expectedKey: 'relative_uplift_pct', expectedValue: 25, tolerance: 0.05 },
      { id: 'tc-3', name: 'Z-Score kiểm định', description: '3.49 >= 1.96', isHidden: true, expectedKey: 'z_score', expectedValue: 3.49, tolerance: 0.03 },
    ],
    hints: ['Công thức sai số chuẩn p_pool = (c1 + c2) / (n1 + n2)'],
    explanation: 'Với Z = 3.49, thử nghiệm đạt ý nghĩa thống kê ở mức 95% tin cậy.',
  },

  {
    id: 'ds-301',
    code: 'DS-301',
    title: 'Chọn lọc Đặc trưng bằng Hệ số Tương quan Pearson',
    track: 'DS',
    difficulty: 'Hard',
    topic: 'Feature Engineering & Selection',
    skills: ['Pearson Correlation', 'Ranking', 'Credit Risk Scoring'],
    interviewTag: 'Quantitative Risk Modeling',
    companies: ['JPMorgan', 'Goldman Sachs', 'Stripe'],
    acceptanceRate: '49.3%',
    estimatedMinutes: 35,
    points: 220,
    summary:
      'Tính hệ số tương quan tuyến tính Pearson giữa 4 đặc trưng tài chính với biến vỡ nợ (default_flag) và chọn 2 biến quan trọng nhất theo |r|.',
    businessContext: 'Xây dựng mô hình chấm điểm tín dụng với các biến giải thích có tương quan mạnh nhất.',
    requirements: [
      'Tính hệ số tương quan Pearson r với `default_flag`.',
      'Lấy giá trị tuyệt đối |r| để xếp hạng.',
      'Trả về top 2 `selected_features` và `max_abs_correlation`.',
    ],
    constraints: ['Làm tròn 4 chữ số thập phân.'],
    inputDescription: 'Bảng credit_features.csv.',
    outputDescription: 'Dict chứa selected_features, max_abs_correlation, correlations.',
    datasetName: 'credit_features.csv',
    datasetColumns: [
      { name: 'debt_ratio', type: 'number', description: 'Tỷ lệ nợ' },
      { name: 'credit_utilization', type: 'number', description: 'Hạn mức dùng' },
      { name: 'late_payments_12m', type: 'number', description: 'Số lần trễ hạn' },
      { name: 'income_stability', type: 'number', description: 'Số năm công tác' },
      { name: 'default_flag', type: 'number', description: 'Vỡ nợ (1/0)' },
    ],
    datasetRows: [
      { debt_ratio: 0.22, credit_utilization: 0.18, late_payments_12m: 0, income_stability: 6.5, default_flag: 0 },
      { debt_ratio: 0.68, credit_utilization: 0.82, late_payments_12m: 3, income_stability: 1.2, default_flag: 1 },
      { debt_ratio: 0.31, credit_utilization: 0.29, late_payments_12m: 0, income_stability: 4.8, default_flag: 0 },
      { debt_ratio: 0.74, credit_utilization: 0.91, late_payments_12m: 4, income_stability: 0.8, default_flag: 1 },
      { debt_ratio: 0.27, credit_utilization: 0.35, late_payments_12m: 1, income_stability: 5.0, default_flag: 0 },
      { debt_ratio: 0.62, credit_utilization: 0.76, late_payments_12m: 2, income_stability: 2.0, default_flag: 1 },
      { debt_ratio: 0.35, credit_utilization: 0.25, late_payments_12m: 0, income_stability: 5.5, default_flag: 0 },
      { debt_ratio: 0.79, credit_utilization: 0.88, late_payments_12m: 3, income_stability: 1.5, default_flag: 1 },
    ],
    starterCode: {
      python: `import math

def r_calc(x, y):
    n = len(x)
    mx, my = sum(x)/n, sum(y)/n
    num = sum((x[i]-mx)*(y[i]-my) for i in range(n))
    den = math.sqrt(sum((x[i]-mx)**2 for i in range(n)) * sum((y[i]-my)**2 for i in range(n)))
    return num / den

def solve(dataset):
    feats = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"]
    y = [float(r["default_flag"]) for r in dataset]
    corr = {f: round(r_calc([float(r[f]) for r in dataset], y), 4) for f in feats}
    ranked = sorted(feats, key=lambda f: abs(corr[f]), reverse=True)
    return {
        "selected_features": ranked[:2],
        "max_abs_correlation": round(abs(corr[ranked[0]]), 4),
        "correlations": corr
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const feats = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"];
  const y = dataset.map((r) => Number(r.default_flag));
  const corr: Record<string, number> = {};
  for (const f of feats) {
    const x = dataset.map((r) => Number(r[f]));
    const n = x.length;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - mx) * (y[i] - my);
      dx += (x[i] - mx) ** 2;
      dy += (y[i] - my) ** 2;
    }
    corr[f] = Number((num / Math.sqrt(dx * dy)).toFixed(4));
  }
  const ranked = [...feats].sort((a, b) => Math.abs(corr[b]) - Math.abs(corr[a]));
  return {
    selected_features: ranked.slice(0, 2),
    max_abs_correlation: Number(Math.abs(corr[ranked[0]]).toFixed(4)),
    correlations: corr,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def r_calc(x, y):
    n = len(x)
    mx, my = sum(x)/n, sum(y)/n
    num = sum((x[i]-mx)*(y[i]-my) for i in range(n))
    den = math.sqrt(sum((x[i]-mx)**2 for i in range(n)) * sum((y[i]-my)**2 for i in range(n)))
    return num / den

def solve(dataset):
    feats = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"]
    y = [float(r["default_flag"]) for r in dataset]
    corr = {f: round(r_calc([float(r[f]) for r in dataset], y), 4) for f in feats}
    ranked = sorted(feats, key=lambda f: abs(corr[f]), reverse=True)
    return {
        "selected_features": ranked[:2],
        "max_abs_correlation": round(abs(corr[ranked[0]]), 4),
        "correlations": corr
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const feats = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"];
  const y = dataset.map((r) => Number(r.default_flag));
  const corr: Record<string, number> = {};
  for (const f of feats) {
    const x = dataset.map((r) => Number(r[f]));
    const n = x.length;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - mx) * (y[i] - my);
      dx += (x[i] - mx) ** 2;
      dy += (y[i] - my) ** 2;
    }
    corr[f] = Number((num / Math.sqrt(dx * dy)).toFixed(4));
  }
  const ranked = [...feats].sort((a, b) => Math.abs(corr[b]) - Math.abs(corr[a]));
  return {
    selected_features: ranked.slice(0, 2),
    max_abs_correlation: Number(Math.abs(corr[ranked[0]]).toFixed(4)),
    correlations: corr,
  };
}
`,
    },
    expectedOutput: {
      selected_features: ['credit_utilization', 'debt_ratio'],
      max_abs_correlation: 0.9806,
      correlations: {
        debt_ratio: 0.9693,
        credit_utilization: 0.9806,
        late_payments_12m: 0.898,
        income_stability: -0.9628,
      },
    },
    testCases: [
      { id: 'tc-1', name: 'Top 2 đặc trưng tương quan mạnh', description: 'credit_utilization & debt_ratio', expectedKey: 'selected_features', expectedValue: ['credit_utilization', 'debt_ratio'] },
      { id: 'tc-2', name: 'Độ lớn tương quan cao nhất', description: '0.9806', expectedKey: 'max_abs_correlation', expectedValue: 0.9806, tolerance: 0.001 },
    ],
    hints: ['Nhớ dùng abs(r) vì income_stability tương quan âm mạnh (-0.9628)'],
    explanation: 'credit_utilization và debt_ratio là 2 biến dự báo vỡ nợ tốt nhất.',
  },

  // ===================== ML TRACK =====================
  {
    id: 'ml-101',
    code: 'ML-101',
    title: 'Đánh giá Mô hình Phân loại Gian lận: Precision, Recall & F1',
    track: 'ML',
    difficulty: 'Easy',
    topic: 'Classification Evaluation Metrics',
    skills: ['Confusion Matrix', 'Precision', 'Recall', 'F1-Score'],
    interviewTag: 'ML Screening Assessment',
    companies: ['Stripe', 'PayPal', 'Visa'],
    acceptanceRate: '80.3%',
    estimatedMinutes: 20,
    points: 130,
    summary:
      'Chuyển đổi xác suất dự đoán (y_prob) thành nhãn tại ngưỡng threshold = 0.5, xây dựng Confusion Matrix (TP, FP, FN, TN) và tính Precision, Recall, F1-Score.',
    businessContext: 'Dữ liệu phát hiện gian lận rất mất cân bằng. Cần đánh giá mô hình bằng Precision và Recall.',
    requirements: [
      'Gán y_pred = 1 nếu y_prob >= 0.5, ngược lại 0.',
      'Đếm tp, fp, fn, tn.',
      'Tính precision, recall, f1_score.',
    ],
    constraints: ['Làm tròn 4 chữ số thập phân.'],
    inputDescription: 'Bảng fraud_predictions.csv.',
    outputDescription: 'Dict chứa tp, fp, fn, tn, precision, recall, f1_score.',
    datasetName: 'fraud_predictions.csv',
    datasetColumns: [
      { name: 'tx_id', type: 'string', description: 'Mã giao dịch' },
      { name: 'y_true', type: 'number', description: 'Nhãn thực tế' },
      { name: 'y_prob', type: 'number', description: 'Xác suất dự đoán' },
    ],
    datasetRows: [
      { tx_id: 'TX-01', y_true: 1, y_prob: 0.91 },
      { tx_id: 'TX-02', y_true: 0, y_prob: 0.12 },
      { tx_id: 'TX-03', y_true: 1, y_prob: 0.64 },
      { tx_id: 'TX-04', y_true: 0, y_prob: 0.58 },
      { tx_id: 'TX-05', y_true: 1, y_prob: 0.39 },
      { tx_id: 'TX-06', y_true: 0, y_prob: 0.08 },
      { tx_id: 'TX-07', y_true: 1, y_prob: 0.83 },
      { tx_id: 'TX-08', y_true: 0, y_prob: 0.24 },
      { tx_id: 'TX-09', y_true: 1, y_prob: 0.77 },
      { tx_id: 'TX-10', y_true: 0, y_prob: 0.19 },
    ],
    starterCode: {
      python: `def solve(dataset):
    tp = fp = fn = tn = 0
    for r in dataset:
        yt = int(r["y_true"])
        yp = 1 if float(r["y_prob"]) >= 0.5 else 0
        if yt == 1 and yp == 1: tp += 1
        elif yt == 0 and yp == 1: fp += 1
        elif yt == 1 and yp == 0: fn += 1
        else: tn += 1
    p = tp / (tp + fp) if (tp + fp) > 0 else 0
    rc = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * p * rc / (p + rc) if (p + rc) > 0 else 0
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "precision": round(p, 4), "recall": round(rc, 4), "f1_score": round(f1, 4)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of dataset) {
    const yt = Number(r.y_true);
    const yp = Number(r.y_prob) >= 0.5 ? 1 : 0;
    if (yt === 1 && yp === 1) tp++;
    else if (yt === 0 && yp === 1) fp++;
    else if (yt === 1 && yp === 0) fn++;
    else tn++;
  }
  const p = tp / (tp + fp);
  const rc = tp / (tp + fn);
  const f1 = (2 * p * rc) / (p + rc);
  return {
    tp, fp, fn, tn,
    precision: Number(p.toFixed(4)),
    recall: Number(rc.toFixed(4)),
    f1_score: Number(f1.toFixed(4)),
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    tp = fp = fn = tn = 0
    for r in dataset:
        yt, yp = int(r["y_true"]), (1 if float(r["y_prob"]) >= 0.5 else 0)
        if yt == 1 and yp == 1: tp += 1
        elif yt == 0 and yp == 1: fp += 1
        elif yt == 1 and yp == 0: fn += 1
        else: tn += 1
    p, rc = tp / (tp + fp), tp / (tp + fn)
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "precision": round(p, 4), "recall": round(rc, 4),
        "f1_score": round(2 * p * rc / (p + rc), 4)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of dataset) {
    const yt = Number(r.y_true), yp = Number(r.y_prob) >= 0.5 ? 1 : 0;
    if (yt === 1 && yp === 1) tp++;
    else if (yt === 0 && yp === 1) fp++;
    else if (yt === 1 && yp === 0) fn++;
    else tn++;
  }
  const p = tp / (tp + fp), rc = tp / (tp + fn);
  return {
    tp, fp, fn, tn,
    precision: Number(p.toFixed(4)),
    recall: Number(rc.toFixed(4)),
    f1_score: Number(((2 * p * rc) / (p + rc)).toFixed(4)),
  };
}
`,
    },
    expectedOutput: {
      tp: 4,
      fp: 1,
      fn: 1,
      tn: 4,
      precision: 0.8,
      recall: 0.8,
      f1_score: 0.8,
    },
    testCases: [
      { id: 'tc-1', name: 'Confusion matrix TP', description: 'TP = 4', expectedKey: 'tp', expectedValue: 4 },
      { id: 'tc-2', name: 'Precision', description: '0.8000', expectedKey: 'precision', expectedValue: 0.8, tolerance: 0.0001 },
      { id: 'tc-3', name: 'F1 Score', description: '0.8000', isHidden: true, expectedKey: 'f1_score', expectedValue: 0.8, tolerance: 0.0001 },
    ],
    hints: ['Kiểm tra TX-04 (y_true=0, y_prob=0.58) là False Positive'],
    explanation: 'Tại ngưỡng 0.5, mô hình đạt độ cân bằng 80% cả Precision lẫn Recall.',
  },

  {
    id: 'ml-201',
    code: 'ML-201',
    title: 'Chuẩn hóa Min-Max & Thuật toán KNN (K-Nearest Neighbors)',
    track: 'ML',
    difficulty: 'Medium',
    topic: 'Distance Algorithms & Preprocessing',
    skills: ['Min-Max Scaling', 'Euclidean Distance', 'KNN Voting'],
    interviewTag: 'Algorithms From Scratch',
    companies: ['Amazon', 'Microsoft', 'Uber'],
    acceptanceRate: '68.9%',
    estimatedMinutes: 30,
    points: 180,
    summary:
      'Chuẩn hóa 2 đặc trưng chi tiêu và tần suất về [0, 1], đo khoảng cách Euclidean tới query = [0.75, 0.80], và áp dụng KNN với k = 3.',
    businessContext: 'Các thuật toán dựa trên khoảng cách cần chuẩn hóa dữ liệu để tránh biến lớn áp đảo biến nhỏ.',
    requirements: [
      'Chuẩn hóa Min-Max: `(x - min) / (max - min)`.',
      'Đo khoảng cách tới `query = [0.75, 0.80]`.',
      'Lấy `k = 3` láng giềng gần nhất và bầu chọn `predicted_label`.',
    ],
    constraints: ['Làm tròn nearest_distance 4 chữ số.'],
    inputDescription: 'Bảng customer_vectors.csv.',
    outputDescription: 'Dict chứa nearest_neighbors, nearest_distance, predicted_label.',
    datasetName: 'customer_vectors.csv',
    datasetColumns: [
      { name: 'user_id', type: 'string', description: 'Mã khách' },
      { name: 'annual_spend_k', type: 'number', description: 'Chi tiêu năm (k USD)' },
      { name: 'visit_frequency', type: 'number', description: 'Số lần ghé' },
      { name: 'label', type: 'string', description: 'Phân loại' },
    ],
    datasetRows: [
      { user_id: 'U-101', annual_spend_k: 10, visit_frequency: 2, label: 'Standard' },
      { user_id: 'U-102', annual_spend_k: 42, visit_frequency: 18, label: 'Enterprise' },
      { user_id: 'U-103', annual_spend_k: 20, visit_frequency: 7, label: 'Standard' },
      { user_id: 'U-104', annual_spend_k: 50, visit_frequency: 22, label: 'Enterprise' },
      { user_id: 'U-105', annual_spend_k: 38, visit_frequency: 16, label: 'Enterprise' },
      { user_id: 'U-106', annual_spend_k: 18, visit_frequency: 6, label: 'Standard' },
    ],
    starterCode: {
      python: `import math

def solve(dataset):
    sp = [float(r["annual_spend_k"]) for r in dataset]
    vf = [float(r["visit_frequency"]) for r in dataset]
    min_s, max_s = min(sp), max(sp)
    min_v, max_v = min(vf), max(vf)
    dists = []
    for r in dataset:
        sn = (float(r["annual_spend_k"]) - min_s) / (max_s - min_s)
        vn = (float(r["visit_frequency"]) - min_v) / (max_v - min_v)
        d = math.sqrt((sn - 0.75)**2 + (vn - 0.80)**2)
        dists.append((d, r["user_id"], r["label"]))
    dists.sort(key=lambda x: x[0])
    top3 = dists[:3]
    votes = {}
    for _, _, l in top3: votes[l] = votes.get(l, 0) + 1
    return {
        "nearest_neighbors": [x[1] for x in top3],
        "nearest_distance": round(top3[0][0], 4),
        "predicted_label": max(votes, key=votes.get)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const sp = dataset.map((r) => Number(r.annual_spend_k));
  const vf = dataset.map((r) => Number(r.visit_frequency));
  const minS = Math.min(...sp), maxS = Math.max(...sp);
  const minV = Math.min(...vf), maxV = Math.max(...vf);
  const dists = dataset.map((r) => {
    const sn = (Number(r.annual_spend_k) - minS) / (maxS - minS);
    const vn = (Number(r.visit_frequency) - minV) / (maxV - minV);
    const dist = Math.sqrt((sn - 0.75) ** 2 + (vn - 0.80) ** 2);
    return { dist, id: String(r.user_id), label: String(r.label) };
  });
  dists.sort((a, b) => a.dist - b.dist);
  const top3 = dists.slice(0, 3);
  const votes: Record<string, number> = {};
  for (const x of top3) votes[x.label] = (votes[x.label] || 0) + 1;
  const pred = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  return {
    nearest_neighbors: top3.map((x) => x.id),
    nearest_distance: Number(top3[0].dist.toFixed(4)),
    predicted_label: pred,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def solve(dataset):
    sp = [float(r["annual_spend_k"]) for r in dataset]
    vf = [float(r["visit_frequency"]) for r in dataset]
    min_s, max_s, min_v, max_v = min(sp), max(sp), min(vf), max(vf)
    dists = []
    for r in dataset:
        sn = (float(r["annual_spend_k"]) - min_s) / (max_s - min_s)
        vn = (float(r["visit_frequency"]) - min_v) / (max_v - min_v)
        d = math.sqrt((sn - 0.75)**2 + (vn - 0.80)**2)
        dists.append((d, r["user_id"], r["label"]))
    dists.sort(key=lambda x: x[0])
    top3 = dists[:3]
    votes = {}
    for _, _, l in top3: votes[l] = votes.get(l, 0) + 1
    return {
        "nearest_neighbors": [x[1] for x in top3],
        "nearest_distance": round(top3[0][0], 4),
        "predicted_label": max(votes, key=votes.get)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const sp = dataset.map((r) => Number(r.annual_spend_k)), vf = dataset.map((r) => Number(r.visit_frequency));
  const minS = Math.min(...sp), maxS = Math.max(...sp), minV = Math.min(...vf), maxV = Math.max(...vf);
  const dists = dataset.map((r) => {
    const sn = (Number(r.annual_spend_k) - minS) / (maxS - minS);
    const vn = (Number(r.visit_frequency) - minV) / (maxV - minV);
    return { dist: Math.sqrt((sn - 0.75) ** 2 + (vn - 0.80) ** 2), id: String(r.user_id), label: String(r.label) };
  });
  dists.sort((a, b) => a.dist - b.dist);
  const top3 = dists.slice(0, 3);
  const votes: Record<string, number> = {};
  for (const x of top3) votes[x.label] = (votes[x.label] || 0) + 1;
  return {
    nearest_neighbors: top3.map((x) => x.id),
    nearest_distance: Number(top3[0].dist.toFixed(4)),
    predicted_label: Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0],
  };
}
`,
    },
    expectedOutput: {
      nearest_neighbors: ['U-102', 'U-105', 'U-104'],
      nearest_distance: 0.05,
      predicted_label: 'Enterprise',
    },
    testCases: [
      { id: 'tc-1', name: '3 láng giềng gần nhất', description: 'U-102, U-105, U-104', expectedKey: 'nearest_neighbors', expectedValue: ['U-102', 'U-105', 'U-104'] },
      { id: 'tc-2', name: 'Khoảng cách nhỏ nhất', description: '0.05', expectedKey: 'nearest_distance', expectedValue: 0.05, tolerance: 0.0005 },
      { id: 'tc-3', name: 'Bầu chọn nhãn', description: 'Enterprise', isHidden: true, expectedKey: 'predicted_label', expectedValue: 'Enterprise' },
    ],
    hints: ['U-102 sau chuẩn hóa là [0.80, 0.80], cách [0.75, 0.80] đúng 0.05'],
    explanation: '3 láng giềng gần nhất đều là Enterprise.',
  },

  {
    id: 'ml-301',
    code: 'ML-301',
    title: 'Tối ưu hóa Gradient Descent cho Hồi quy Tuyến tính (Linear Regression)',
    track: 'ML',
    difficulty: 'Hard',
    topic: 'Optimization & Numerical Methods',
    skills: ['Gradient Descent', 'MSE Partial Derivatives', 'Learning Rate'],
    interviewTag: 'Core ML Deep Dive',
    companies: ['Google DeepMind', 'OpenAI', 'Meta FAIR'],
    acceptanceRate: '43.7%',
    estimatedMinutes: 35,
    points: 250,
    summary:
      'Cài đặt hàm mất mát Mean Squared Error (MSE) và thực hiện 1 bước cập nhật Gradient Descent cho y_hat = w * x + b từ w = 0, b = 0 với learning_rate = 0.01.',
    businessContext: 'Phỏng vấn kỹ sư ML yêu cầu hiểu bản chất thuật toán tối ưu học máy từ con số 0.',
    requirements: [
      'Tính `initial_mse`.',
      'Tính đạo hàm `dw = (2/N)*sum(x*(y_hat - y))` và `db = (2/N)*sum(y_hat - y)`.',
      'Cập nhật `updated_w` và `updated_b`.',
      'Tính `updated_mse` sau bước cập nhật.',
    ],
    constraints: ['Dùng đúng hệ số 2/N trong công thức đạo hàm.'],
    inputDescription: 'Bảng demand_history.csv.',
    outputDescription: 'Dict chứa initial_mse, updated_w, updated_b, updated_mse.',
    datasetName: 'demand_history.csv',
    datasetColumns: [
      { name: 'ad_spend_k', type: 'number', description: 'Ngân sách x' },
      { name: 'units_sold', type: 'number', description: 'Sản lượng y' },
    ],
    datasetRows: [
      { ad_spend_k: 1.0, units_sold: 3.0 },
      { ad_spend_k: 2.0, units_sold: 5.0 },
      { ad_spend_k: 3.0, units_sold: 7.0 },
      { ad_spend_k: 4.0, units_sold: 9.0 },
      { ad_spend_k: 5.0, units_sold: 11.0 },
    ],
    starterCode: {
      python: `def solve(dataset):
    x = [float(r["ad_spend_k"]) for r in dataset]
    y = [float(r["units_sold"]) for r in dataset]
    n = len(x)
    w, b, lr = 0.0, 0.0, 0.01
    init_mse = sum((w*x[i] + b - y[i])**2 for i in range(n)) / n
    dw = (2.0 / n) * sum(x[i] * (w*x[i] + b - y[i]) for i in range(n))
    db = (2.0 / n) * sum((w*x[i] + b - y[i]) for i in range(n))
    uw = w - lr * dw
    ub = b - lr * db
    up_mse = sum((uw*x[i] + ub - y[i])**2 for i in range(n)) / n
    return {
        "initial_mse": round(init_mse, 2),
        "updated_w": round(uw, 4),
        "updated_b": round(ub, 4),
        "updated_mse": round(up_mse, 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const x = dataset.map((r) => Number(r.ad_spend_k));
  const y = dataset.map((r) => Number(r.units_sold));
  const n = x.length;
  const w = 0, b = 0, lr = 0.01;
  const initMse = y.reduce((s, yi) => s + yi * yi, 0) / n;
  const dw = (2 / n) * x.reduce((s, xi, i) => s + xi * (w * xi + b - y[i]), 0);
  const db = (2 / n) * y.reduce((s, yi, i) => s + (w * x[i] + b - yi), 0);
  const uw = w - lr * dw;
  const ub = b - lr * db;
  const upMse = x.reduce((s, xi, i) => s + (uw * xi + ub - y[i]) ** 2, 0) / n;
  return {
    initial_mse: Number(initMse.toFixed(2)),
    updated_w: Number(uw.toFixed(4)),
    updated_b: Number(ub.toFixed(4)),
    updated_mse: Number(upMse.toFixed(2)),
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    x = [float(r["ad_spend_k"]) for r in dataset]
    y = [float(r["units_sold"]) for r in dataset]
    n = len(x)
    w, b, lr = 0.0, 0.0, 0.01
    init_mse = sum((w*x[i] + b - y[i])**2 for i in range(n)) / n
    dw = (2.0 / n) * sum(x[i] * (w*x[i] + b - y[i]) for i in range(n))
    db = (2.0 / n) * sum((w*x[i] + b - y[i]) for i in range(n))
    uw, ub = w - lr * dw, b - lr * db
    up_mse = sum((uw*x[i] + ub - y[i])**2 for i in range(n)) / n
    return {
        "initial_mse": round(init_mse, 2),
        "updated_w": round(uw, 4),
        "updated_b": round(ub, 4),
        "updated_mse": round(up_mse, 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const x = dataset.map((r) => Number(r.ad_spend_k));
  const y = dataset.map((r) => Number(r.units_sold));
  const n = x.length;
  const initMse = y.reduce((s, yi) => s + yi * yi, 0) / n;
  const dw = (2 / n) * x.reduce((s, xi, i) => s + xi * (-y[i]), 0);
  const db = (2 / n) * y.reduce((s, yi) => s + (-yi), 0);
  const uw = -0.01 * dw, ub = -0.01 * db;
  const upMse = x.reduce((s, xi, i) => s + (uw * xi + ub - y[i]) ** 2, 0) / n;
  return {
    initial_mse: Number(initMse.toFixed(2)),
    updated_w: Number(uw.toFixed(4)),
    updated_b: Number(ub.toFixed(4)),
    updated_mse: Number(upMse.toFixed(2)),
  };
}
`,
    },
    expectedOutput: {
      initial_mse: 57,
      updated_w: 0.5,
      updated_b: 0.14,
      updated_mse: 32.87,
    },
    testCases: [
      { id: 'tc-1', name: 'Initial MSE', description: '57.0', expectedKey: 'initial_mse', expectedValue: 57, tolerance: 0.01 },
      { id: 'tc-2', name: 'Updated w', description: '0.5000', expectedKey: 'updated_w', expectedValue: 0.5, tolerance: 0.0005 },
      { id: 'tc-3', name: 'Updated MSE sau 1 bước', description: '32.87', isHidden: true, expectedKey: 'updated_mse', expectedValue: 32.87, tolerance: 0.02 },
    ],
    hints: ['dw = -50, db = -14 dẫn tới uw = 0.5, ub = 0.14'],
    explanation: 'MSE giảm 42.3% chỉ sau 1 bước Gradient Descent.',
  },

  {
    id: 'da-103',
    code: 'DA-103',
    title: 'Top Sản phẩm Bán chạy nhất theo Danh mục (Window Ranking)',
    track: 'DA',
    difficulty: 'Easy',
    topic: 'SQL / Pandas Aggregation & Window Rank',
    skills: ['Group By', 'Rank Sorting', 'Window Partition'],
    interviewTag: 'Product Analytics Assessment',
    companies: ['Shopee', 'Amazon', 'Lazada'],
    acceptanceRate: '84.2%',
    estimatedMinutes: 15,
    points: 100,
    summary: 'Tìm sản phẩm mang lại doanh thu cao nhất cho mỗi danh mục hàng hóa (tương đương ROW_NUMBER() OVER PARTITION BY category).',
    businessContext: 'Bộ phận Merchandising cần biết sản phẩm quán quân của mỗi ngành hàng để đưa lên banner trang chủ.',
    requirements: [
      'Gộp doanh thu theo từng `category` và `product_name`.',
      'Xác định sản phẩm có tổng doanh số cao nhất trong mỗi ngành hàng.',
      'Trả về danh sách các sản phẩm dẫn đầu theo thứ tự alphabet của ngành hàng.',
    ],
    constraints: ['Mỗi category chỉ chọn đúng 1 sản phẩm cao nhất.'],
    inputDescription: 'Bảng product_sales.csv gồm category, product_name, units_sold, unit_price.',
    outputDescription: 'Dict chứa top_products: mảng các tên sản phẩm chiến thắng.',
    datasetName: 'product_sales.csv',
    datasetColumns: [
      { name: 'category', type: 'string', description: 'Ngành hàng' },
      { name: 'product_name', type: 'string', description: 'Tên sản phẩm' },
      { name: 'units_sold', type: 'number', description: 'Số lượng bán' },
      { name: 'unit_price', type: 'number', description: 'Đơn giá (USD)' },
    ],
    datasetRows: [
      { category: 'Audio', product_name: 'Wireless Earbuds', units_sold: 120, unit_price: 50 },
      { category: 'Audio', product_name: 'Over-Ear Headphones', units_sold: 40, unit_price: 200 },
      { category: 'Fashion', product_name: 'Slim Jeans', units_sold: 80, unit_price: 45 },
      { category: 'Fashion', product_name: 'Leather Jacket', units_sold: 25, unit_price: 180 },
      { category: 'Home', product_name: 'Air Purifier', units_sold: 50, unit_price: 150 },
      { category: 'Home', product_name: 'Coffee Maker', units_sold: 60, unit_price: 90 },
    ],
    starterCode: {
      python: `def solve(dataset):
    totals = {}
    for r in dataset:
        c, p = r["category"], r["product_name"]
        rev = float(r["units_sold"]) * float(r["unit_price"])
        if c not in totals: totals[c] = {}
        totals[c][p] = totals[c].get(p, 0.0) + rev

    top_products = []
    for c in sorted(totals.keys()):
        best_p = max(totals[c], key=totals[c].get)
        top_products.append(best_p)

    return {"top_products": top_products}
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const totals: Record<string, Record<string, number>> = {};
  for (const r of dataset) {
    const c = String(r.category);
    const p = String(r.product_name);
    const rev = Number(r.units_sold) * Number(r.unit_price);
    if (!totals[c]) totals[c] = {};
    totals[c][p] = (totals[c][p] || 0) + rev;
  }
  const topProducts = Object.keys(totals).sort().map((c) => {
    return Object.entries(totals[c]).sort((a, b) => b[1] - a[1])[0][0];
  });
  return { top_products: topProducts };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    totals = {}
    for r in dataset:
        c, p = r["category"], r["product_name"]
        rev = float(r["units_sold"]) * float(r["unit_price"])
        if c not in totals: totals[c] = {}
        totals[c][p] = totals[c].get(p, 0.0) + rev
    top_products = [max(totals[c], key=totals[c].get) for c in sorted(totals.keys())]
    return {"top_products": top_products}
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const totals: Record<string, Record<string, number>> = {};
  for (const r of dataset) {
    const c = String(r.category), p = String(r.product_name);
    const rev = Number(r.units_sold) * Number(r.unit_price);
    if (!totals[c]) totals[c] = {};
    totals[c][p] = (totals[c][p] || 0) + rev;
  }
  const topProducts = Object.keys(totals).sort().map((c) => Object.entries(totals[c]).sort((a, b) => b[1] - a[1])[0][0]);
  return { top_products: topProducts };
}
`,
    },
    expectedOutput: {
      top_products: ['Over-Ear Headphones', 'Leather Jacket', 'Air Purifier'],
    },
    testCases: [
      { id: 'tc-1', name: 'Top sản phẩm theo danh mục', description: 'Over-Ear Headphones (8000), Leather Jacket (4500), Air Purifier (7500)', expectedKey: 'top_products', expectedValue: ['Over-Ear Headphones', 'Leather Jacket', 'Air Purifier'] },
    ],
    hints: ['Nhớ nhân units_sold * unit_price trước khi so sánh doanh thu'],
    explanation: 'Over-Ear Headphones (8000 USD) vượt qua Wireless Earbuds (6000 USD).',
  },

  {
    id: 'ds-102',
    code: 'DS-102',
    title: 'Làm mượt Chuỗi Thời gian (Moving Average Smoothing)',
    track: 'DS',
    difficulty: 'Easy',
    topic: 'Time Series & Trend Analysis',
    skills: ['Moving Average', 'Windowing', 'Noise Reduction'],
    interviewTag: 'Quantitative Finance Screen',
    companies: ['Citadel', 'Binance', 'Coinbase'],
    acceptanceRate: '79.1%',
    estimatedMinutes: 20,
    points: 110,
    summary: 'Tính đường trung bình động cửa sổ 3 ngày (3-Day Moving Average) cho chuỗi giá đóng cửa để lọc nhiễu dao động ngắn hạn.',
    businessContext: 'Làm mượt tín hiệu kỹ thuật để tránh báo động giả trong thuật toán giao dịch tự động.',
    requirements: [
      'Với chuỗi giá có độ dài N, tính trung bình động 3 điểm bắt đầu từ ngày thứ 3 (index 2): `(p[i-2] + p[i-1] + p[i]) / 3`.',
      'Trả về mảng `moving_avg_series` (làm tròn 2 chữ số) và `last_ma` (giá trị cuối cùng).',
    ],
    constraints: ['Chuỗi kết quả có độ dài N - 2.'],
    inputDescription: 'Bảng price_series.csv gồm ngày và giá đóng cửa.',
    outputDescription: 'Dict chứa moving_avg_series, last_ma.',
    datasetName: 'price_series.csv',
    datasetColumns: [
      { name: 'day', type: 'string', description: 'Ngày giao dịch' },
      { name: 'close_price', type: 'number', description: 'Giá đóng cửa' },
    ],
    datasetRows: [
      { day: 'D-01', close_price: 100 },
      { day: 'D-02', close_price: 106 },
      { day: 'D-03', close_price: 112 },
      { day: 'D-04', close_price: 104 },
      { day: 'D-05', close_price: 114 },
      { day: 'D-06', close_price: 124 },
    ],
    starterCode: {
      python: `def solve(dataset):
    prices = [float(r["close_price"]) for r in dataset]
    ma = []
    for i in range(2, len(prices)):
        avg = (prices[i-2] + prices[i-1] + prices[i]) / 3.0
        ma.append(round(avg, 2))
    return {
        "moving_avg_series": ma,
        "last_ma": ma[-1]
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const prices = dataset.map((r) => Number(r.close_price));
  const ma: number[] = [];
  for (let i = 2; i < prices.length; i++) {
    const avg = (prices[i - 2] + prices[i - 1] + prices[i]) / 3;
    ma.push(Number(avg.toFixed(2)));
  }
  return {
    moving_avg_series: ma,
    last_ma: ma[ma.length - 1],
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    prices = [float(r["close_price"]) for r in dataset]
    ma = [round((prices[i-2] + prices[i-1] + prices[i]) / 3.0, 2) for i in range(2, len(prices))]
    return {"moving_avg_series": ma, "last_ma": ma[-1]}
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const prices = dataset.map((r) => Number(r.close_price));
  const ma = prices.slice(2).map((_, idx) => Number(((prices[idx] + prices[idx + 1] + prices[idx + 2]) / 3).toFixed(2)));
  return { moving_avg_series: ma, last_ma: ma[ma.length - 1] };
}
`,
    },
    expectedOutput: {
      moving_avg_series: [106, 107.33, 110, 114],
      last_ma: 114,
    },
    testCases: [
      { id: 'tc-1', name: 'Chuỗi MA 3 ngày', description: '[106, 107.33, 110, 114]', expectedKey: 'moving_avg_series', expectedValue: [106, 107.33, 110, 114] },
      { id: 'tc-2', name: 'Giá trị MA cuối', description: '114.0', expectedKey: 'last_ma', expectedValue: 114, tolerance: 0.01 },
    ],
    hints: ['Cửa sổ 3 ngày bắt đầu từ ngày 3: D-01+D-02+D-03 / 3 = 106'],
    explanation: 'MA 3 ngày giúp khử nhiễu răng cưa của chuỗi giá.',
  },

  {
    id: 'ml-202',
    code: 'ML-202',
    title: 'Hàm Mất mát Binary Cross-Entropy (Log Loss Optimizer)',
    track: 'ML',
    difficulty: 'Medium',
    topic: 'Classification Loss & Probability',
    skills: ['Log Loss', 'Sigmoid', 'Loss Computation'],
    interviewTag: 'Deep Learning & ML Fundamentals',
    companies: ['Google', 'Meta', 'TikTok'],
    acceptanceRate: '61.5%',
    estimatedMinutes: 25,
    points: 170,
    summary: 'Tính hàm mất mát Log Loss (Binary Cross-Entropy) giữa nhãn thực tế y và xác suất dự đoán p từ mô hình phân loại.',
    businessContext: 'Log Loss là hàm mất mát nền tảng của Logistic Regression và các mạng nơ-ron phân loại nhị phân.',
    requirements: [
      'Công thức Log Loss cho N mẫu: `-(1/N) * sum(y * ln(p) + (1 - y) * ln(1 - p))`.',
      'Kẹp xác suất p trong khoảng `[1e-15, 1 - 1e-15]` để tránh lỗi log(0).',
      'Trả về `log_loss` làm tròn 4 chữ số thập phân.',
    ],
    constraints: ['Dùng log tự nhiên ln (math.log).'],
    inputDescription: 'Bảng model_probabilities.csv gồm y_true và y_pred_prob.',
    outputDescription: 'Dict chứa log_loss.',
    datasetName: 'model_probabilities.csv',
    datasetColumns: [
      { name: 'y_true', type: 'number', description: 'Nhãn 1 hoặc 0' },
      { name: 'y_pred_prob', type: 'number', description: 'Xác suất dự đoán' },
    ],
    datasetRows: [
      { y_true: 1, y_pred_prob: 0.90 },
      { y_true: 0, y_pred_prob: 0.10 },
      { y_true: 1, y_pred_prob: 0.80 },
      { y_true: 0, y_pred_prob: 0.20 },
      { y_true: 1, y_pred_prob: 0.35 },
    ],
    starterCode: {
      python: `import math

def solve(dataset):
    total_loss = 0.0
    n = len(dataset)
    eps = 1e-15
    for r in dataset:
        y = float(r["y_true"])
        p = max(eps, min(1 - eps, float(r["y_pred_prob"])))
        loss = y * math.log(p) + (1.0 - y) * math.log(1.0 - p)
        total_loss -= loss
    return {"log_loss": round(total_loss / n, 4)}
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const n = dataset.length;
  const eps = 1e-15;
  let totalLoss = 0;
  for (const r of dataset) {
    const y = Number(r.y_true);
    const p = Math.max(eps, Math.min(1 - eps, Number(r.y_pred_prob)));
    const loss = y * Math.log(p) + (1 - y) * Math.log(1 - p);
    totalLoss -= loss;
  }
  return { log_loss: Number((totalLoss / n).toFixed(4)) };
}
`,
    },
    solutionCode: {
      python: `import math

def solve(dataset):
    eps = 1e-15
    losses = []
    for r in dataset:
        y, p = float(r["y_true"]), max(eps, min(1-eps, float(r["y_pred_prob"])))
        losses.append(y * math.log(p) + (1.0 - y) * math.log(1.0 - p))
    return {"log_loss": round(-sum(losses) / len(dataset), 4)}
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const eps = 1e-15;
  const loss = dataset.reduce((s, r) => {
    const y = Number(r.y_true), p = Math.max(eps, Math.min(1 - eps, Number(r.y_pred_prob)));
    return s - (y * Math.log(p) + (1 - y) * Math.log(1 - p));
  }, 0);
  return { log_loss: Number((loss / dataset.length).toFixed(4)) };
}
`,
    },
    expectedOutput: {
      log_loss: 0.3396,
    },
    testCases: [
      { id: 'tc-1', name: 'Log Loss trung bình', description: '0.3396', expectedKey: 'log_loss', expectedValue: 0.3396, tolerance: 0.005 },
    ],
    hints: ['Nhớ kẹp xác suất bằng min(1 - 1e-15, max(1e-15, p))'],
    explanation: 'Mô hình dự đoán khá tốt ngoại trừ mẫu thứ 5 (y=1 nhưng p=0.35) làm tăng mất mát.',
  },
];

import { MORE_PROBLEMS } from './more_problems';
import { getExpandedProblemBank } from './expanded_problem_bank';

export const ALL_INITIAL_PROBLEMS: Problem[] = [
  ...INITIAL_PROBLEMS,
  ...MORE_PROBLEMS,
  ...getExpandedProblemBank(),
];

