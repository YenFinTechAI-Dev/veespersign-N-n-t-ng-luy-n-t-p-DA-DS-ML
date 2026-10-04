export type TrackId = 'DA' | 'DS' | 'ML';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CodeLanguage = 'python' | 'typescript';

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
  topic: string;
  skills: string[];
  interviewTag: string;
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
  {
    id: 'da-beg-01',
    code: 'DA-101',
    title: 'Phân tích Doanh thu Thực thu & Giá trị Đơn hàng Trung bình (AOV)',
    track: 'DA',
    difficulty: 'Beginner',
    topic: 'Product & Revenue Analytics',
    skills: ['Data Filtering', 'KPI Aggregation', 'Category Grouping'],
    interviewTag: 'E-Commerce Analytics Round 1',
    estimatedMinutes: 15,
    points: 100,
    summary:
      'Lọc các đơn hàng hoàn tất (completed), tính tổng doanh thu ròng, giá trị đơn hàng trung bình (AOV) và xác định danh mục sản phẩm mang lại doanh thu cao nhất.',
    businessContext:
      'Trong buổi họp vận hành tuần tại một sàn thương mại điện tử, Giám đốc Tăng trưởng cần báo cáo chính xác doanh thu thực thu (loại bỏ các đơn bị hủy hoặc hoàn tiền) để đánh giá hiệu quả chiến dịch khuyến mãi theo từng ngành hàng.',
    requirements: [
      'Chỉ tính các bản ghi có trường `status == "completed"`.',
      'Tính `total_revenue`: tổng `order_value` của các đơn hàng hợp lệ (làm tròn 2 chữ số thập phân).',
      'Tính `aov` (Average Order Value): trung bình `order_value` trên mỗi đơn hàng hợp lệ (làm tròn 2 chữ số thập phân).',
      'Xác định `top_category`: tên `category` có tổng doanh thu hợp lệ cao nhất.',
      'Đếm `completed_count`: tổng số đơn hàng hoàn tất.',
    ],
    constraints: [
      'Độ phức tạp thời gian yêu cầu: O(N) với N là số dòng trong bảng giao dịch.',
      'Không tính các đơn hàng có trạng thái "cancelled" hoặc "refunded".',
      'Kết quả trả về dưới dạng dictionary / object có đúng 4 khóa: total_revenue, aov, top_category, completed_count.',
    ],
    inputDescription: 'Danh sách `dataset` chứa các bản ghi đơn hàng từ bảng `ecommerce_orders`.',
    outputDescription:
      'Object/Dict gồm `total_revenue` (float), `aov` (float), `top_category` (string), và `completed_count` (int).',
    datasetName: 'ecommerce_orders.csv',
    datasetColumns: [
      { name: 'order_id', type: 'string', description: 'Mã định danh đơn hàng' },
      { name: 'customer_id', type: 'string', description: 'Mã khách hàng' },
      { name: 'category', type: 'string', description: 'Ngành hàng (Electronics, Home, Fashion)' },
      { name: 'order_value', type: 'number', description: 'Giá trị đơn hàng (USD)' },
      { name: 'status', type: 'string', description: 'Trạng thái: completed, cancelled, refunded' },
      { name: 'region', type: 'string', description: 'Khu vực địa lý (VN-South, VN-North)' },
    ],
    datasetRows: [
      { order_id: 'ORD-01', customer_id: 'C-101', category: 'Electronics', order_value: 420.5, status: 'completed', region: 'VN-South' },
      { order_id: 'ORD-02', customer_id: 'C-102', category: 'Fashion', order_value: 85.0, status: 'completed', region: 'VN-North' },
      { order_id: 'ORD-03', customer_id: 'C-103', category: 'Electronics', order_value: 310.0, status: 'cancelled', region: 'VN-South' },
      { order_id: 'ORD-04', customer_id: 'C-101', category: 'Home', order_value: 195.5, status: 'completed', region: 'VN-South' },
      { order_id: 'ORD-05', customer_id: 'C-104', category: 'Electronics', order_value: 540.0, status: 'completed', region: 'VN-North' },
      { order_id: 'ORD-06', customer_id: 'C-105', category: 'Fashion', order_value: 120.0, status: 'refunded', region: 'VN-South' },
      { order_id: 'ORD-07', customer_id: 'C-106', category: 'Home', order_value: 260.0, status: 'completed', region: 'VN-North' },
      { order_id: 'ORD-08', customer_id: 'C-102', category: 'Fashion', order_value: 149.0, status: 'completed', region: 'VN-North' },
    ],
    starterCode: {
      python: `def solve(dataset):
    """
    Input: dataset (list of dicts) từ bảng ecommerce_orders.csv
    Output: dict chứa total_revenue, aov, top_category, completed_count
    """
    completed_orders = [row for row in dataset if row["status"] == "completed"]
    total_revenue = sum(row["order_value"] for row in completed_orders)
    completed_count = len(completed_orders)
    aov = round(total_revenue / completed_count, 2) if completed_count > 0 else 0.0

    category_totals = {}
    for row in completed_orders:
        cat = row["category"]
        category_totals[cat] = category_totals.get(cat, 0.0) + row["order_value"]

    top_category = max(category_totals, key=category_totals.get)

    return {
        "total_revenue": round(total_revenue, 2),
        "aov": aov,
        "top_category": top_category,
        "completed_count": completed_count
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const completedOrders = dataset.filter((row) => row.status === "completed");
  const completedCount = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, row) => sum + Number(row.order_value), 0);
  const aov = completedCount > 0 ? Number((totalRevenue / completedCount).toFixed(2)) : 0;

  const categoryTotals: Record<string, number> = {};
  for (const row of completedOrders) {
    const cat = String(row.category);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(row.order_value);
  }

  let topCategory = "";
  let maxRev = -1;
  for (const [cat, rev] of Object.entries(categoryTotals)) {
    if (rev > maxRev) {
      maxRev = rev;
      topCategory = cat;
    }
  }

  return {
    total_revenue: Number(totalRevenue.toFixed(2)),
    aov,
    top_category: topCategory,
    completed_count: completedCount,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    completed_orders = [row for row in dataset if row["status"] == "completed"]
    total_revenue = sum(row["order_value"] for row in completed_orders)
    completed_count = len(completed_orders)
    aov = round(total_revenue / completed_count, 2) if completed_count > 0 else 0.0
    category_totals = {}
    for row in completed_orders:
        cat = row["category"]
        category_totals[cat] = category_totals.get(cat, 0.0) + row["order_value"]
    top_category = max(category_totals, key=category_totals.get)
    return {
        "total_revenue": round(total_revenue, 2),
        "aov": aov,
        "top_category": top_category,
        "completed_count": completed_count
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const completedOrders = dataset.filter((row) => row.status === "completed");
  const completedCount = completedOrders.length;
  const totalRevenue = completedOrders.reduce((s, r) => s + Number(r.order_value), 0);
  const aov = Number((totalRevenue / completedCount).toFixed(2));
  const categoryTotals: Record<string, number> = {};
  for (const row of completedOrders) {
    categoryTotals[row.category] = (categoryTotals[row.category] || 0) + Number(row.order_value);
  }
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0];
  return {
    total_revenue: Number(totalRevenue.toFixed(2)),
    aov,
    top_category: topCategory,
    completed_count: completedCount,
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
      {
        id: 'tc-1',
        name: 'Loại bỏ đơn Cancelled & Refunded',
        description: 'Đếm đúng 6 đơn hàng ở trạng thái completed',
        expectedKey: 'completed_count',
        expectedValue: 6,
      },
      {
        id: 'tc-2',
        name: 'Tính tổng doanh thu thực thu (Net Revenue)',
        description: 'Tổng order_value của 6 đơn hợp lệ đạt 1650.0',
        expectedKey: 'total_revenue',
        expectedValue: 1650,
        tolerance: 0.01,
      },
      {
        id: 'tc-3',
        name: 'Tính Average Order Value (AOV)',
        description: 'AOV = 1650 / 6 = 275.0 USD',
        expectedKey: 'aov',
        expectedValue: 275,
        tolerance: 0.01,
      },
      {
        id: 'tc-4',
        name: 'Xác định Top Category theo doanh thu',
        description: 'Electronics đạt 960.5 USD (cao hơn Home 455.5 và Fashion 234.0)',
        isHidden: true,
        expectedKey: 'top_category',
        expectedValue: 'Electronics',
      },
    ],
    hints: [
      'Hãy lọc danh sách đơn hàng bằng điều kiện `row["status"] == "completed"` trước khi tính tổng.',
      'Dùng cấu trúc từ điển `dict` (Python) hoặc `Record<string, number>` (TypeScript) để cộng dồn `order_value` theo từng `category`.',
      'Chia `total_revenue` cho `len(completed_orders)` và làm tròn 2 chữ số thập phân bằng `round(val, 2)`.',
    ],
    explanation:
      'Trong phân tích thương mại điện tử, việc tách biệt Gross Merchandise Value (GMV) và Net Completed Revenue giúp tránh ảo tưởng tăng trưởng do đơn hủy hoặc hoàn tiền. Ngành hàng Electronics dẫn đầu với 960.5 USD dù có 1 đơn bị hủy.',
  },
  {
    id: 'da-int-02',
    code: 'DA-204',
    title: 'Phân tích Phễu Chuyển đổi Onboarding & Điểm Nghẽn (Funnel Bottleneck)',
    track: 'DA',
    difficulty: 'Intermediate',
    topic: 'Funnel & Product Analytics',
    skills: ['Funnel Conversion', 'Drop-off Attribution', 'Sequential Ratios'],
    interviewTag: 'Fintech Product Analytics Case',
    estimatedMinutes: 25,
    points: 150,
    summary:
      'Đo lường tỷ lệ chuyển đổi qua 4 bước mở tài khoản ví điện tử, xác định tỷ lệ chuyển đổi toàn phễu và tìm bước có tỷ lệ người dùng rời bỏ (drop-off rate) lớn nhất.',
    businessContext:
      'Ứng dụng Fintech nhận thấy số lượng người dùng nạp tiền lần đầu thấp hơn kỳ vọng dù chi phí quảng cáo thu hút đăng ký mới rất cao. Nhóm Product cần tìm chính xác bước nào trong luồng eKYC đang làm mất nhiều khách hàng nhất.',
    requirements: [
      '4 bước theo thứ tự: `signup` → `kyc_submitted` → `kyc_verified` → `first_deposit`.',
      'Tính tổng số user đạt được ở mỗi bước (dựa trên cột cờ boolean `1` hoặc `0` của từng user).',
      'Tính `overall_conversion_pct`: `(first_deposit_users / signup_users) * 100` (làm tròn 2 chữ số thập phân).',
      'Tính tỷ lệ rơi rụng (drop-off rate) giữa từng cặp bước liền kề: `1 - (next_step_users / current_step_users)`.',
      'Xác định `bottleneck_transition`: chuỗi tên bước chuyển tiếp có tỷ lệ rơi rụng cao nhất (ví dụ `"kyc_submitted -> kyc_verified"`).',
    ],
    constraints: [
      'Làm tròn mọi chỉ số phần trăm đến 2 chữ số thập phân.',
      'Trả về `signup_count`, `deposit_count`, `overall_conversion_pct`, và `bottleneck_transition`.',
    ],
    inputDescription: 'Bảng `onboarding_events` ghi nhận trạng thái hoàn thành 4 bước của từng `user_id`.',
    outputDescription:
      'Dict chứa `signup_count`, `deposit_count`, `overall_conversion_pct` (float), và `bottleneck_transition` (string).',
    datasetName: 'onboarding_events.csv',
    datasetColumns: [
      { name: 'user_id', type: 'string', description: 'Mã người dùng đăng ký' },
      { name: 'signup', type: 'number', description: '1 nếu đã tạo tài khoản' },
      { name: 'kyc_submitted', type: 'number', description: '1 nếu đã tải ảnh CCCD' },
      { name: 'kyc_verified', type: 'number', description: '1 nếu hệ thống duyệt eKYC thành công' },
      { name: 'first_deposit', type: 'number', description: '1 nếu đã nạp tiền lần đầu' },
      { name: 'channel', type: 'string', description: 'Kênh thu hút (Organic, Paid_Social, Referral)' },
    ],
    datasetRows: [
      { user_id: 'U-01', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1, channel: 'Organic' },
      { user_id: 'U-02', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0, channel: 'Paid_Social' },
      { user_id: 'U-03', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1, channel: 'Referral' },
      { user_id: 'U-04', signup: 1, kyc_submitted: 0, kyc_verified: 0, first_deposit: 0, channel: 'Paid_Social' },
      { user_id: 'U-05', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0, channel: 'Paid_Social' },
      { user_id: 'U-06', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 0, channel: 'Organic' },
      { user_id: 'U-07', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0, channel: 'Referral' },
      { user_id: 'U-08', signup: 1, kyc_submitted: 1, kyc_verified: 1, first_deposit: 1, channel: 'Organic' },
      { user_id: 'U-09', signup: 1, kyc_submitted: 1, kyc_verified: 0, first_deposit: 0, channel: 'Paid_Social' },
      { user_id: 'U-10', signup: 1, kyc_submitted: 0, kyc_verified: 0, first_deposit: 0, channel: 'Paid_Social' },
    ],
    starterCode: {
      python: `def solve(dataset):
    steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"]
    counts = {s: sum(row[s] for row in dataset) for s in steps}
    signup_count = counts["signup"]
    deposit_count = counts["first_deposit"]
    overall_conversion_pct = round((deposit_count / signup_count) * 100, 2)
    max_dropoff = -1.0
    bottleneck_transition = ""
    for i in range(len(steps) - 1):
        curr_step, next_step = steps[i], steps[i + 1]
        dropoff = 1.0 - (counts[next_step] / counts[curr_step])
        if dropoff > max_dropoff:
            max_dropoff = dropoff
            bottleneck_transition = f"{curr_step} -> {next_step}"
    return {
        "signup_count": signup_count,
        "deposit_count": deposit_count,
        "overall_conversion_pct": overall_conversion_pct,
        "bottleneck_transition": bottleneck_transition
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"];
  const counts: Record<string, number> = {};
  for (const s of steps) counts[s] = dataset.reduce((acc, row) => acc + Number(row[s]), 0);
  const signupCount = counts.signup;
  const depositCount = counts.first_deposit;
  const overallConversionPct = Number(((depositCount / signupCount) * 100).toFixed(2));
  let maxDropoff = -1;
  let bottleneckTransition = "";
  for (let i = 0; i < steps.length - 1; i++) {
    const dropoff = 1 - counts[steps[i + 1]] / counts[steps[i]];
    if (dropoff > maxDropoff) {
      maxDropoff = dropoff;
      bottleneckTransition = \`\${steps[i]} -> \${steps[i + 1]}\`;
    }
  }
  return {
    signup_count: signupCount,
    deposit_count: depositCount,
    overall_conversion_pct: overallConversionPct,
    bottleneck_transition: bottleneckTransition,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"]
    counts = {s: sum(row[s] for row in dataset) for s in steps}
    signup_count = counts["signup"]
    deposit_count = counts["first_deposit"]
    overall_conversion_pct = round((deposit_count / signup_count) * 100, 2)
    max_dropoff = -1.0
    bottleneck_transition = ""
    for i in range(len(steps) - 1):
        curr_step, next_step = steps[i], steps[i + 1]
        dropoff = 1.0 - (counts[next_step] / counts[curr_step])
        if dropoff > max_dropoff:
            max_dropoff = dropoff
            bottleneck_transition = f"{curr_step} -> {next_step}"
    return {
        "signup_count": signup_count,
        "deposit_count": deposit_count,
        "overall_conversion_pct": overall_conversion_pct,
        "bottleneck_transition": bottleneck_transition
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const steps = ["signup", "kyc_submitted", "kyc_verified", "first_deposit"];
  const counts: Record<string, number> = {};
  for (const s of steps) counts[s] = dataset.reduce((acc, row) => acc + Number(row[s]), 0);
  const signupCount = counts.signup;
  const depositCount = counts.first_deposit;
  const overallConversionPct = Number(((depositCount / signupCount) * 100).toFixed(2));
  let maxDropoff = -1;
  let bottleneckTransition = "";
  for (let i = 0; i < steps.length - 1; i++) {
    const dropoff = 1 - counts[steps[i + 1]] / counts[steps[i]];
    if (dropoff > maxDropoff) {
      maxDropoff = dropoff;
      bottleneckTransition = \`\${steps[i]} -> \${steps[i + 1]}\`;
    }
  }
  return {
    signup_count: signupCount,
    deposit_count: depositCount,
    overall_conversion_pct: overallConversionPct,
    bottleneck_transition: bottleneckTransition,
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
      {
        id: 'tc-1',
        name: 'Đếm số lượng đăng ký & nạp tiền đầu tiên',
        description: '10 user đăng ký và 3 user hoàn tất nạp tiền đầu tiên',
        expectedKey: 'deposit_count',
        expectedValue: 3,
      },
      {
        id: 'tc-2',
        name: 'Tỷ lệ chuyển đổi toàn phễu (End-to-End Conversion)',
        description: '3 / 10 = 30.0% chuyển đổi toàn trình',
        expectedKey: 'overall_conversion_pct',
        expectedValue: 30,
        tolerance: 0.01,
      },
      {
        id: 'tc-3',
        name: 'Phát hiện điểm nghẽn lớn nhất (Funnel Bottleneck)',
        description: 'Từ kyc_submitted (8) sang kyc_verified (4) mất 50% user — cao nhất toàn phễu',
        isHidden: true,
        expectedKey: 'bottleneck_transition',
        expectedValue: 'kyc_submitted -> kyc_verified',
      },
    ],
    hints: [
      'Tổng số user tại mỗi bước là tổng giá trị cột tương ứng: signup (10), kyc_submitted (8), kyc_verified (4), first_deposit (3).',
      'Tỷ lệ rời bỏ giữa bước i và i+1 được tính bằng `1 - (counts[i+1] / counts[i])`.',
    ],
    explanation:
      'Điểm nghẽn lớn nhất nằm ở bước duyệt eKYC (`kyc_submitted -> kyc_verified`) với 50% người dùng bị từ chối hoặc bỏ cuộc (chủ yếu từ kênh Paid_Social).',
  },
  {
    id: 'da-adv-03',
    code: 'DA-309',
    title: 'Phân khúc Rủi ro Rời bỏ Khách hàng B2B SaaS (Churn Risk & ARR Exposure)',
    track: 'DA',
    difficulty: 'Advanced',
    topic: 'Customer Retention & Health Scoring',
    skills: ['Composite Health Score', 'Churn Exposure', 'B2B Segmentation'],
    interviewTag: 'SaaS Revenue Operations Case',
    estimatedMinutes: 30,
    points: 200,
    summary:
      'Xây dựng chỉ số Customer Health Score từ tần suất đăng nhập, mức độ sử dụng và số ticket lỗi, sau đó tính tổng doanh thu định kỳ năm (ARR) đang nằm trong nhóm nguy cơ rời bỏ cao.',
    businessContext:
      'Đội ngũ Customer Success tại một công ty B2B SaaS cần danh sách cảnh báo sớm các doanh nghiệp có nguy cơ không gia hạn hợp đồng trong quý tới để ưu tiên can thiệp kỹ thuật.',
    requirements: [
      'Công thức điểm sức khỏe (`health_score`) cho mỗi tài khoản: `100 - (days_since_last_login * 1.5) + (monthly_sessions * 1.2) - (support_tickets * 4.0)`.',
      'Tài khoản bị xếp vào nhóm rủi ro cao (`At-Risk`) nếu `health_score < 60`.',
      'Trả về danh sách `at_risk_accounts` (mảng các `account_id` theo thứ tự xuất hiện).',
      'Tính `at_risk_arr`: tổng `arr_usd` của tất cả tài khoản thuộc nhóm `At-Risk`.',
      'Tính `avg_health_score`: điểm sức khỏe trung bình của toàn bộ tập khách hàng (làm tròn 2 chữ số thập phân).',
    ],
    constraints: [
      'Giữ nguyên thứ tự `account_id` trong danh sách `at_risk_accounts`.',
      'Làm tròn `avg_health_score` đến 2 chữ số thập phân.',
    ],
    inputDescription: 'Danh sách các tài khoản doanh nghiệp từ bảng `b2b_accounts.csv`.',
    outputDescription:
      'Dict gồm `at_risk_accounts` (list of strings), `at_risk_arr` (number), và `avg_health_score` (float).',
    datasetName: 'b2b_accounts.csv',
    datasetColumns: [
      { name: 'account_id', type: 'string', description: 'Mã doanh nghiệp khách hàng' },
      { name: 'days_since_last_login', type: 'number', description: 'Số ngày kể từ lần đăng nhập gần nhất' },
      { name: 'monthly_sessions', type: 'number', description: 'Số phiên làm việc trong 30 ngày qua' },
      { name: 'arr_usd', type: 'number', description: 'Doanh thu định kỳ hàng năm (USD)' },
      { name: 'support_tickets', type: 'number', description: 'Số ticket báo lỗi chưa đóng' },
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
    at_risk_accounts = []
    at_risk_arr = 0
    scores = []
    for row in dataset:
        score = 100.0 - row["days_since_last_login"] * 1.5 + row["monthly_sessions"] * 1.2 - row["support_tickets"] * 4.0
        scores.append(score)
        if score < 60.0:
            at_risk_accounts.append(row["account_id"])
            at_risk_arr += row["arr_usd"]
    return {
        "at_risk_accounts": at_risk_accounts,
        "at_risk_arr": at_risk_arr,
        "avg_health_score": round(sum(scores) / len(scores), 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const atRiskAccounts: string[] = [];
  let atRiskArr = 0;
  const scores: number[] = [];
  for (const row of dataset) {
    const score = 100 - Number(row.days_since_last_login) * 1.5 + Number(row.monthly_sessions) * 1.2 - Number(row.support_tickets) * 4.0;
    scores.push(score);
    if (score < 60) {
      atRiskAccounts.push(String(row.account_id));
      atRiskArr += Number(row.arr_usd);
    }
  }
  return {
    at_risk_accounts: atRiskAccounts,
    at_risk_arr: atRiskArr,
    avg_health_score: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    at_risk_accounts = []
    at_risk_arr = 0
    scores = []
    for row in dataset:
        score = 100.0 - row["days_since_last_login"] * 1.5 + row["monthly_sessions"] * 1.2 - row["support_tickets"] * 4.0
        scores.append(score)
        if score < 60.0:
            at_risk_accounts.append(row["account_id"])
            at_risk_arr += row["arr_usd"]
    return {
        "at_risk_accounts": at_risk_accounts,
        "at_risk_arr": at_risk_arr,
        "avg_health_score": round(sum(scores) / len(scores), 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const atRiskAccounts: string[] = [];
  let atRiskArr = 0;
  const scores: number[] = [];
  for (const row of dataset) {
    const score = 100 - Number(row.days_since_last_login) * 1.5 + Number(row.monthly_sessions) * 1.2 - Number(row.support_tickets) * 4.0;
    scores.push(score);
    if (score < 60) {
      atRiskAccounts.push(String(row.account_id));
      atRiskArr += Number(row.arr_usd);
    }
  }
  return {
    at_risk_accounts: atRiskAccounts,
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
      {
        id: 'tc-1',
        name: 'Danh sách tài khoản rủi ro rời bỏ (At-Risk Accounts)',
        description: 'Xác định đúng ACC-102 (42.8), ACC-104 (35.4), và ACC-106 (46.0)',
        expectedKey: 'at_risk_accounts',
        expectedValue: ['ACC-102', 'ACC-104', 'ACC-106'],
      },
      {
        id: 'tc-2',
        name: 'Tổng doanh thu định kỳ gặp rủi ro (At-Risk ARR)',
        description: '72,000 + 95,000 + 54,000 = 221,000 USD',
        expectedKey: 'at_risk_arr',
        expectedValue: 221000,
      },
      {
        id: 'tc-3',
        name: 'Điểm sức khỏe trung bình toàn danh mục',
        description: 'Trung bình cộng của 6 điểm sức khỏe bằng 79.33',
        isHidden: true,
        expectedKey: 'avg_health_score',
        expectedValue: 79.33,
        tolerance: 0.02,
      },
    ],
    hints: [
      'Áp dụng chính xác trọng số: `- 1.5 * days_since_last_login + 1.2 * monthly_sessions - 4.0 * support_tickets`.',
      'Kiểm tra điều kiện `score < 60` để đưa `account_id` vào danh sách `at_risk_accounts` và cộng dồn `arr_usd`.',
    ],
    explanation:
      '3 tài khoản lớn (`ACC-102`, `ACC-104`, `ACC-106`) chiếm tới 221,000 USD ARR đang có dấu hiệu ngừng đăng nhập quá 24 ngày kèm nhiều ticket lỗi tồn đọng.',
  },
  {
    id: 'ds-beg-04',
    code: 'DS-102',
    title: 'Làm sạch Dữ liệu Cảm biến: Điền Khuyết Trung vị & Lọc Nhiễu (Imputation & Outliers)',
    track: 'DS',
    difficulty: 'Beginner',
    topic: 'Exploratory Data Analysis & Data Cleaning',
    skills: ['Missing Value Imputation', 'Outlier Filtering', 'Robust Statistics'],
    interviewTag: 'Data Science Technical Screen',
    estimatedMinutes: 20,
    points: 120,
    summary:
      'Xử lý tập dữ liệu nhiệt độ kho lạnh bị khuyết (`null`) và nhiễu phần cứng (nhiệt độ vượt ngưỡng vật lý) bằng phương pháp điền trung vị (median imputation).',
    businessContext:
      'Hệ thống IoT giám sát chuỗi cung ứng kho dược phẩm gửi dữ liệu nhiệt độ về máy chủ mỗi 10 phút. Tuy nhiên một số gói tin bị mất (`null`) hoặc bị vọt giá trị ảo (`> 50°C` hoặc `< -30°C`) làm sai lệch mô hình cảnh báo.',
    requirements: [
      'Bước 1: Loại bỏ các bản ghi bị lỗi phần cứng có `temperature_c` khác `null` nhưng nằm ngoài khoảng hợp lệ `[-30.0, 50.0]`. Đếm số bản ghi bị loại vào `outliers_removed`.',
      'Bước 2: Tính trung vị (`median_used`) của các giá trị `temperature_c` hợp lệ (không `null` và nằm trong đoạn `[-30.0, 50.0]`).',
      'Bước 3: Thay thế các bản ghi có `temperature_c == null` bằng `median_used`.',
      'Bước 4: Tính giá trị trung bình (`cleaned_mean`) của toàn bộ chuỗi sau khi đã loại nhiễu và điền khuyết (làm tròn 2 chữ số thập phân).',
    ],
    constraints: [
      'Các bản ghi có `temperature_c == null` KHÔNG bị coi là outlier mà phải được giữ lại để điền khuyết bằng `median_used`.',
      'Làm tròn `median_used` và `cleaned_mean` đến 2 chữ số thập phân.',
    ],
    inputDescription: 'Danh sách bản ghi cảm biến từ bảng `iot_readings.csv`.',
    outputDescription:
      'Dict chứa `median_used` (float), `cleaned_mean` (float), `outliers_removed` (int), và `valid_records_count` (int).',
    datasetName: 'iot_readings.csv',
    datasetColumns: [
      { name: 'sensor_id', type: 'string', description: 'Mã cảm biến kho lạnh' },
      { name: 'temperature_c', type: 'number', description: 'Nhiệt độ đo được (°C, có thể null hoặc nhiễu)' },
      { name: 'humidity_pct', type: 'number', description: 'Độ ẩm tương đối (%)' },
      { name: 'facility_zone', type: 'string', description: 'Phân khu kho (Zone-A, Zone-B)' },
    ],
    datasetRows: [
      { sensor_id: 'S-01', temperature_c: 4.2, humidity_pct: 62, facility_zone: 'Zone-A' },
      { sensor_id: 'S-02', temperature_c: 5.0, humidity_pct: 60, facility_zone: 'Zone-A' },
      { sensor_id: 'S-03', temperature_c: null, humidity_pct: 61, facility_zone: 'Zone-A' },
      { sensor_id: 'S-04', temperature_c: 125.0, humidity_pct: 58, facility_zone: 'Zone-B' },
      { sensor_id: 'S-05', temperature_c: 3.8, humidity_pct: 64, facility_zone: 'Zone-A' },
      { sensor_id: 'S-06', temperature_c: 6.2, humidity_pct: 59, facility_zone: 'Zone-B' },
      { sensor_id: 'S-07', temperature_c: -85.0, humidity_pct: 63, facility_zone: 'Zone-B' },
      { sensor_id: 'S-08', temperature_c: 4.6, humidity_pct: 61, facility_zone: 'Zone-A' },
      { sensor_id: 'S-09', temperature_c: null, humidity_pct: 60, facility_zone: 'Zone-B' },
    ],
    starterCode: {
      python: `def solve(dataset):
    outliers_removed = 0
    valid_obs = []
    missing_count = 0
    for row in dataset:
        temp = row["temperature_c"]
        if temp is None:
            missing_count += 1
        elif temp < -30.0 or temp > 50.0:
            outliers_removed += 1
        else:
            valid_obs.append(float(temp))
    valid_obs.sort()
    n = len(valid_obs)
    median_used = valid_obs[n // 2] if n % 2 == 1 else (valid_obs[n // 2 - 1] + valid_obs[n // 2]) / 2.0
    cleaned_series = valid_obs + [median_used] * missing_count
    return {
        "median_used": round(median_used, 2),
        "cleaned_mean": round(sum(cleaned_series) / len(cleaned_series), 2),
        "outliers_removed": outliers_removed,
        "valid_records_count": len(cleaned_series)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let outliersRemoved = 0;
  const validObs: number[] = [];
  let missingCount = 0;
  for (const row of dataset) {
    const temp = row.temperature_c;
    if (temp === null || temp === undefined) missingCount++;
    else if (temp < -30 || temp > 50) outliersRemoved++;
    else validObs.push(Number(temp));
  }
  validObs.sort((a, b) => a - b);
  const medianUsed = validObs[Math.floor(validObs.length / 2)];
  const cleanedSeries = [...validObs, ...Array(missingCount).fill(medianUsed)];
  const cleanedMean = cleanedSeries.reduce((a, b) => a + b, 0) / cleanedSeries.length;
  return {
    median_used: Number(medianUsed.toFixed(2)),
    cleaned_mean: Number(cleanedMean.toFixed(2)),
    outliers_removed: outliersRemoved,
    valid_records_count: cleanedSeries.length,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    outliers_removed = 0
    valid_obs = []
    missing_count = 0
    for row in dataset:
        temp = row["temperature_c"]
        if temp is None:
            missing_count += 1
        elif temp < -30.0 or temp > 50.0:
            outliers_removed += 1
        else:
            valid_obs.append(float(temp))
    valid_obs.sort()
    n = len(valid_obs)
    median_used = valid_obs[n // 2] if n % 2 == 1 else (valid_obs[n // 2 - 1] + valid_obs[n // 2]) / 2.0
    cleaned_series = valid_obs + [median_used] * missing_count
    return {
        "median_used": round(median_used, 2),
        "cleaned_mean": round(sum(cleaned_series) / len(cleaned_series), 2),
        "outliers_removed": outliers_removed,
        "valid_records_count": len(cleaned_series)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let outliersRemoved = 0;
  const validObs: number[] = [];
  let missingCount = 0;
  for (const row of dataset) {
    const temp = row.temperature_c;
    if (temp === null || temp === undefined) missingCount++;
    else if (temp < -30 || temp > 50) outliersRemoved++;
    else validObs.push(Number(temp));
  }
  validObs.sort((a, b) => a - b);
  const medianUsed = validObs[Math.floor(validObs.length / 2)];
  const cleanedSeries = [...validObs, ...Array(missingCount).fill(medianUsed)];
  const cleanedMean = cleanedSeries.reduce((a, b) => a + b, 0) / cleanedSeries.length;
  return {
    median_used: Number(medianUsed.toFixed(2)),
    cleaned_mean: Number(cleanedMean.toFixed(2)),
    outliers_removed: outliersRemoved,
    valid_records_count: cleanedSeries.length,
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
      {
        id: 'tc-1',
        name: 'Loại bỏ cảm biến nhiễu ngoài [-30, 50]',
        description: 'Loại bỏ S-04 (125.0°C) và S-07 (-85.0°C) -> outliers_removed = 2',
        expectedKey: 'outliers_removed',
        expectedValue: 2,
      },
      {
        id: 'tc-2',
        name: 'Xác định trung vị (Median Imputation Value)',
        description: '5 giá trị thực [3.8, 4.2, 4.6, 5.0, 6.2] có trung vị là 4.6°C',
        expectedKey: 'median_used',
        expectedValue: 4.6,
        tolerance: 0.01,
      },
      {
        id: 'tc-3',
        name: 'Tính trung bình sau điền khuyết (Cleaned Mean)',
        description: 'Tổng 7 bản ghi sau khi điền 2 giá trị 4.6 chia 7 bằng 4.71°C',
        isHidden: true,
        expectedKey: 'cleaned_mean',
        expectedValue: 4.71,
        tolerance: 0.01,
      },
    ],
    hints: [
      'Tách riêng các dòng `temperature_c is None` trước khi kiểm tra điều kiện `< -30` hoặc `> 50`.',
      'Sắp xếp mảng 5 giá trị hợp lệ `[3.8, 4.2, 4.6, 5.0, 6.2]` để lấy phần tử đứng giữa là `4.6`.',
    ],
    explanation:
      'Việc dùng trung vị (4.6°C) để điền khuyết giúp bảo toàn phân phối trung tâm của kho lạnh dược phẩm.',
  },
  {
    id: 'ds-int-05',
    code: 'DS-205',
    title: 'Kiểm định Thống kê A/B Testing: Relative Uplift & Two-Proportion Z-Test',
    track: 'DS',
    difficulty: 'Intermediate',
    topic: 'Experimentation & Causal Inference',
    skills: ['Hypothesis Testing', 'Pooled Z-Score', 'Conversion Uplift'],
    interviewTag: 'Product Data Science Experimentation',
    estimatedMinutes: 25,
    points: 160,
    summary:
      'Tổng hợp kết quả thử nghiệm A/B theo ngày giữa giao diện thanh toán cũ (Control) và giao diện 1-Click Checkout mới (Treatment), tính mức tăng trưởng tương đối và kiểm định Z-Test hai tỷ lệ ở mức ý nghĩa α = 0.05.',
    businessContext:
      'Đội ngũ Thanh toán muốn triển khai tính năng "1-Click Checkout" cho toàn bộ người dùng sau 3 ngày chạy thử nghiệm. Với tư cách là Data Scientist, bạn cần tính toán xem mức tăng tỷ lệ chuyển đổi có thực sự có ý nghĩa thống kê (`|Z| >= 1.96`) hay chỉ do ngẫu nhiên.',
    requirements: [
      'Cộng dồn tổng `visitors` và `conversions` cho từng nhóm `control` và `treatment`.',
      'Tính `cr_control` và `cr_treatment` (tỷ lệ chuyển đổi dạng số thập phân làm tròn 4 chữ số, ví dụ `0.0800`).',
      'Tính `relative_uplift_pct`: `((cr_treatment - cr_control) / cr_control) * 100` (làm tròn 2 chữ số thập phân).',
      'Tính `z_score` theo công thức kiểm định 2 tỷ lệ gộp (Pooled Two-Proportion Z-Test).',
      'Trả về `is_significant = True` nếu `z_score >= 1.96`, ngược lại `False`.',
    ],
    constraints: [
      'Sử dụng đúng công thức Pooled Standard Error cho kiểm định 2 tỷ lệ.',
      'Làm tròn `cr_control`, `cr_treatment` 4 chữ số; `relative_uplift_pct`, `z_score` 2 chữ số.',
    ],
    inputDescription: 'Bảng `ab_experiment_groups.csv` chứa số liệu theo từng ngày của nhóm `control` và `treatment`.',
    outputDescription:
      'Dict chứa `cr_control`, `cr_treatment`, `relative_uplift_pct`, `z_score`, và `is_significant` (bool).',
    datasetName: 'ab_experiment_groups.csv',
    datasetColumns: [
      { name: 'day', type: 'string', description: 'Ngày chạy thử nghiệm' },
      { name: 'group', type: 'string', description: 'Nhóm thử nghiệm: control hoặc treatment' },
      { name: 'visitors', type: 'number', description: 'Số lượng người dùng truy cập trang thanh toán' },
      { name: 'conversions', type: 'number', description: 'Số lượng người dùng thanh toán thành công' },
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
    cr_c = conv_c / vis_c
    cr_t = conv_t / vis_t
    uplift_pct = ((cr_t - cr_c) / cr_c) * 100.0
    p_pool = (conv_c + conv_t) / (vis_c + vis_t)
    se = math.sqrt(p_pool * (1.0 - p_pool) * (1.0 / vis_c + 1.0 / vis_t))
    z_score = (cr_t - cr_c) / se
    return {
        "cr_control": round(cr_c, 4),
        "cr_treatment": round(cr_t, 4),
        "relative_uplift_pct": round(uplift_pct, 2),
        "z_score": round(z_score, 2),
        "is_significant": bool(z_score >= 1.96)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let visC = 0, convC = 0, visT = 0, convT = 0;
  for (const r of dataset) {
    if (r.group === "control") { visC += Number(r.visitors); convC += Number(r.conversions); }
    else { visT += Number(r.visitors); convT += Number(r.conversions); }
  }
  const crC = convC / visC;
  const crT = convT / visT;
  const upliftPct = ((crT - crC) / crC) * 100;
  const pPool = (convC + convT) / (visC + visT);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / visC + 1 / visT));
  const zScore = (crT - crC) / se;
  return {
    cr_control: Number(crC.toFixed(4)),
    cr_treatment: Number(crT.toFixed(4)),
    relative_uplift_pct: Number(upliftPct.toFixed(2)),
    z_score: Number(zScore.toFixed(2)),
    is_significant: zScore >= 1.96,
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
    cr_c = conv_c / vis_c
    cr_t = conv_t / vis_t
    uplift_pct = ((cr_t - cr_c) / cr_c) * 100.0
    p_pool = (conv_c + conv_t) / (vis_c + vis_t)
    se = math.sqrt(p_pool * (1.0 - p_pool) * (1.0 / vis_c + 1.0 / vis_t))
    z_score = (cr_t - cr_c) / se
    return {
        "cr_control": round(cr_c, 4),
        "cr_treatment": round(cr_t, 4),
        "relative_uplift_pct": round(uplift_pct, 2),
        "z_score": round(z_score, 2),
        "is_significant": bool(z_score >= 1.96)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let visC = 0, convC = 0, visT = 0, convT = 0;
  for (const r of dataset) {
    if (r.group === "control") { visC += Number(r.visitors); convC += Number(r.conversions); }
    else { visT += Number(r.visitors); convT += Number(r.conversions); }
  }
  const crC = convC / visC;
  const crT = convT / visT;
  const upliftPct = ((crT - crC) / crC) * 100;
  const pPool = (convC + convT) / (visC + visT);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / visC + 1 / visT));
  const zScore = (crT - crC) / se;
  return {
    cr_control: Number(crC.toFixed(4)),
    cr_treatment: Number(crT.toFixed(4)),
    relative_uplift_pct: Number(upliftPct.toFixed(2)),
    z_score: Number(zScore.toFixed(2)),
    is_significant: zScore >= 1.96,
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
      {
        id: 'tc-1',
        name: 'Tỷ lệ chuyển đổi Control vs Treatment',
        description: 'Control = 400/5000 (0.08), Treatment = 500/5000 (0.10)',
        expectedKey: 'cr_treatment',
        expectedValue: 0.1,
        tolerance: 0.0005,
      },
      {
        id: 'tc-2',
        name: 'Tăng trưởng tương đối (Relative Uplift %)',
        description: '(0.10 - 0.08) / 0.08 = +25.0% Uplift',
        expectedKey: 'relative_uplift_pct',
        expectedValue: 25,
        tolerance: 0.05,
      },
      {
        id: 'tc-3',
        name: 'Giá trị thống kê Z-Score & Kết luận ý nghĩa',
        description: 'Z-Score = 3.49 >= 1.96 -> Có ý nghĩa thống kê ở mức alpha = 0.05',
        isHidden: true,
        expectedKey: 'z_score',
        expectedValue: 3.49,
        tolerance: 0.03,
      },
    ],
    hints: [
      'Control có 5,000 visitors và 400 conversions (`cr_c = 0.08`); Treatment có 5,000 visitors và 500 conversions (`cr_t = 0.10`).',
      'Tỷ lệ gộp `p_pool = (400 + 500) / (5000 + 5000) = 0.09`.',
    ],
    explanation:
      'Với Z-Score = 3.49 và mức tăng trưởng tương đối +25%, tính năng 1-Click Checkout vượt ngưỡng ý nghĩa thống kê.',
  },
  {
    id: 'ds-adv-06',
    code: 'DS-308',
    title: 'Chọn lọc Đặc trưng bằng Hệ số Tương quan Pearson (Credit Risk Feature Selection)',
    track: 'DS',
    difficulty: 'Advanced',
    topic: 'Feature Engineering & Statistical Modeling',
    skills: ['Pearson Correlation', 'Feature Ranking', 'Variance Analysis'],
    interviewTag: 'Credit Scoring Modeling Interview',
    estimatedMinutes: 35,
    points: 220,
    summary:
      'Tính hệ số tương quan tuyến tính Pearson giữa từng biến đặc trưng tài chính với biến mục tiêu vỡ nợ (`default_flag`) để chọn ra 2 đặc trưng quan trọng nhất đưa vào mô hình Logistic Regression.',
    businessContext:
      'Khi xây dựng mô hình chấm điểm tín dụng (Credit Scoring), việc đưa các biến nhiễu hoặc ít tương quan vào mô hình làm giảm khả năng giải thích.',
    requirements: [
      'Danh sách 4 biến đặc trưng: `["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"]`.',
      'Tính hệ số tương quan Pearson `r` giữa mỗi đặc trưng và `default_flag`.',
      'Xếp hạng theo `abs(r)` giảm dần và chọn 2 đặc trưng cao nhất.',
    ],
    constraints: ['Làm tròn mọi hệ số tương quan đến 4 chữ số thập phân.'],
    inputDescription: 'Bảng `credit_features.csv` gồm 8 hồ sơ vay.',
    outputDescription:
      'Dict chứa `selected_features` (list 2 strings), `max_abs_correlation` (float), và `correlations` (dict).',
    datasetName: 'credit_features.csv',
    datasetColumns: [
      { name: 'debt_ratio', type: 'number', description: 'Tỷ lệ nợ trên thu nhập' },
      { name: 'credit_utilization', type: 'number', description: 'Tỷ lệ sử dụng hạn mức thẻ tín dụng' },
      { name: 'late_payments_12m', type: 'number', description: 'Số lần trả chậm trong 12 tháng qua' },
      { name: 'income_stability', type: 'number', description: 'Số năm làm việc liên tục tại công ty hiện tại' },
      { name: 'default_flag', type: 'number', description: 'Nhãn mục tiêu: 1 (Vỡ nợ), 0 (Trả tốt)' },
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

def pearson_r(x, y):
    n = len(x)
    mean_x, mean_y = sum(x) / n, sum(y) / n
    num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    den_x = sum((x[i] - mean_x) ** 2 for i in range(n))
    den_y = sum((y[i] - mean_y) ** 2 for i in range(n))
    return num / math.sqrt(den_x * den_y)

def solve(dataset):
    features = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"]
    y = [float(row["default_flag"]) for row in dataset]
    correlations = {}
    for feat in features:
        x = [float(row[feat]) for row in dataset]
        correlations[feat] = round(pearson_r(x, y), 4)
    ranked = sorted(features, key=lambda f: abs(correlations[f]), reverse=True)
    return {
        "selected_features": ranked[:2],
        "max_abs_correlation": round(abs(correlations[ranked[0]]), 4),
        "correlations": correlations
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const features = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"];
  const y = dataset.map((r) => Number(r.default_flag));
  const correlations: Record<string, number> = {};
  for (const feat of features) {
    const x = dataset.map((r) => Number(r[feat]));
    const n = x.length;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - mx) * (y[i] - my);
      dx2 += (x[i] - mx) ** 2;
      dy2 += (y[i] - my) ** 2;
    }
    correlations[feat] = Number((num / Math.sqrt(dx2 * dy2)).toFixed(4));
  }
  const ranked = [...features].sort((a, b) => Math.abs(correlations[b]) - Math.abs(correlations[a]));
  return {
    selected_features: ranked.slice(0, 2),
    max_abs_correlation: Number(Math.abs(correlations[ranked[0]]).toFixed(4)),
    correlations,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def pearson_r(x, y):
    n = len(x)
    mean_x, mean_y = sum(x) / n, sum(y) / n
    num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    den_x = sum((x[i] - mean_x) ** 2 for i in range(n))
    den_y = sum((y[i] - mean_y) ** 2 for i in range(n))
    return num / math.sqrt(den_x * den_y)

def solve(dataset):
    features = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"]
    y = [float(row["default_flag"]) for row in dataset]
    correlations = {}
    for feat in features:
        x = [float(row[feat]) for row in dataset]
        correlations[feat] = round(pearson_r(x, y), 4)
    ranked = sorted(features, key=lambda f: abs(correlations[f]), reverse=True)
    return {
        "selected_features": ranked[:2],
        "max_abs_correlation": round(abs(correlations[ranked[0]]), 4),
        "correlations": correlations
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const features = ["debt_ratio", "credit_utilization", "late_payments_12m", "income_stability"];
  const y = dataset.map((r) => Number(r.default_flag));
  const correlations: Record<string, number> = {};
  for (const feat of features) {
    const x = dataset.map((r) => Number(r[feat]));
    const n = x.length;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - mx) * (y[i] - my);
      dx2 += (x[i] - mx) ** 2;
      dy2 += (y[i] - my) ** 2;
    }
    correlations[feat] = Number((num / Math.sqrt(dx2 * dy2)).toFixed(4));
  }
  const ranked = [...features].sort((a, b) => Math.abs(correlations[b]) - Math.abs(correlations[a]));
  return {
    selected_features: ranked.slice(0, 2),
    max_abs_correlation: Number(Math.abs(correlations[ranked[0]]).toFixed(4)),
    correlations,
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
      {
        id: 'tc-1',
        name: 'Chọn lọc Top 2 đặc trưng quan trọng nhất',
        description: 'credit_utilization (0.9806) và debt_ratio (0.9693) đứng đầu',
        expectedKey: 'selected_features',
        expectedValue: ['credit_utilization', 'debt_ratio'],
      },
      {
        id: 'tc-2',
        name: 'Hệ số tương quan tuyệt đối lớn nhất',
        description: 'max_abs_correlation đạt 0.9806',
        expectedKey: 'max_abs_correlation',
        expectedValue: 0.9806,
        tolerance: 0.001,
      },
    ],
    hints: [
      'Lấy `abs(r)` khi xếp hạng đặc trưng.',
      '`credit_utilization` (`0.9806`) và `debt_ratio` (`0.9693`) có độ lớn tuyệt đối cao nhất.',
    ],
    explanation:
      '`credit_utilization` (0.9806) và `debt_ratio` (0.9693) là hai chỉ báo tuyến tính mạnh nhất dự báo khả năng vỡ nợ.',
  },
  {
    id: 'ml-beg-07',
    code: 'ML-103',
    title: 'Đánh giá Mô hình Phân loại Gian lận: Precision, Recall & F1-Score',
    track: 'ML',
    difficulty: 'Beginner',
    topic: 'Model Evaluation & Thresholding',
    skills: ['Confusion Matrix', 'Precision-Recall Tradeoff', 'F1-Score'],
    interviewTag: 'ML Engineer Screening',
    estimatedMinutes: 20,
    points: 130,
    summary:
      'Chuyển đổi xác suất dự đoán (`y_prob`) của mô hình phát hiện gian lận thẻ tín dụng thành nhãn nhị phân tại ngưỡng `threshold = 0.5`, xây dựng Confusion Matrix và tính Precision, Recall, F1-Score.',
    businessContext:
      'Trong bài toán phát hiện giao dịch gian lận (Fraud Detection), dữ liệu rất mất cân bằng. Kỹ sư ML phải đánh giá mô hình qua Precision và Recall.',
    requirements: [
      'Với mỗi giao dịch, dự đoán `y_pred = 1` nếu `y_prob >= 0.5`, ngược lại `0`.',
      'Đếm `tp`, `fp`, `fn`, `tn`.',
      'Tính `precision = tp / (tp + fp)`, `recall = tp / (tp + fn)`, `f1_score = 2 * precision * recall / (precision + recall)`.',
    ],
    constraints: ['Làm tròn 4 chữ số thập phân.'],
    inputDescription: 'Bảng `fraud_predictions.csv` gồm nhãn thật `y_true` và xác suất `y_prob`.',
    outputDescription: 'Dict chứa `tp`, `fp`, `fn`, `tn`, `precision`, `recall`, và `f1_score`.',
    datasetName: 'fraud_predictions.csv',
    datasetColumns: [
      { name: 'tx_id', type: 'string', description: 'Mã giao dịch' },
      { name: 'y_true', type: 'number', description: 'Nhãn thực tế: 1 (Fraud), 0 (Legit)' },
      { name: 'y_prob', type: 'number', description: 'Xác suất mô hình dự đoán là Fraud [0..1]' },
      { name: 'amount_usd', type: 'number', description: 'Giá trị giao dịch (USD)' },
    ],
    datasetRows: [
      { tx_id: 'TX-01', y_true: 1, y_prob: 0.91, amount_usd: 1200 },
      { tx_id: 'TX-02', y_true: 0, y_prob: 0.12, amount_usd: 45 },
      { tx_id: 'TX-03', y_true: 1, y_prob: 0.64, amount_usd: 890 },
      { tx_id: 'TX-04', y_true: 0, y_prob: 0.58, amount_usd: 310 },
      { tx_id: 'TX-05', y_true: 1, y_prob: 0.39, amount_usd: 540 },
      { tx_id: 'TX-06', y_true: 0, y_prob: 0.08, amount_usd: 22 },
      { tx_id: 'TX-07', y_true: 1, y_prob: 0.83, amount_usd: 1750 },
      { tx_id: 'TX-08', y_true: 0, y_prob: 0.24, amount_usd: 95 },
      { tx_id: 'TX-09', y_true: 1, y_prob: 0.77, amount_usd: 670 },
      { tx_id: 'TX-10', y_true: 0, y_prob: 0.19, amount_usd: 60 },
    ],
    starterCode: {
      python: `def solve(dataset):
    tp = fp = fn = tn = 0
    for row in dataset:
        y_true = int(row["y_true"])
        y_pred = 1 if float(row["y_prob"]) >= 0.5 else 0
        if y_true == 1 and y_pred == 1: tp += 1
        elif y_true == 0 and y_pred == 1: fp += 1
        elif y_true == 1 and y_pred == 0: fn += 1
        else: tn += 1
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    f1 = 2 * precision * recall / (precision + recall)
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const row of dataset) {
    const yTrue = Number(row.y_true);
    const yPred = Number(row.y_prob) >= 0.5 ? 1 : 0;
    if (yTrue === 1 && yPred === 1) tp++;
    else if (yTrue === 0 && yPred === 1) fp++;
    else if (yTrue === 1 && yPred === 0) fn++;
    else tn++;
  }
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = (2 * precision * recall) / (precision + recall);
  return {
    tp, fp, fn, tn,
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1_score: Number(f1.toFixed(4)),
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    tp = fp = fn = tn = 0
    for row in dataset:
        y_true = int(row["y_true"])
        y_pred = 1 if float(row["y_prob"]) >= 0.5 else 0
        if y_true == 1 and y_pred == 1: tp += 1
        elif y_true == 0 and y_pred == 1: fp += 1
        elif y_true == 1 and y_pred == 0: fn += 1
        else: tn += 1
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    f1 = 2 * precision * recall / (precision + recall)
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const row of dataset) {
    const yTrue = Number(row.y_true);
    const yPred = Number(row.y_prob) >= 0.5 ? 1 : 0;
    if (yTrue === 1 && yPred === 1) tp++;
    else if (yTrue === 0 && yPred === 1) fp++;
    else if (yTrue === 1 && yPred === 0) fn++;
    else tn++;
  }
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = (2 * precision * recall) / (precision + recall);
  return {
    tp, fp, fn, tn,
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1_score: Number(f1.toFixed(4)),
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
      {
        id: 'tc-1',
        name: 'Xây dựng Confusion Matrix (TP, FP, FN, TN)',
        description: 'TP = 4, FP = 1, FN = 1, TN = 4',
        expectedKey: 'tp',
        expectedValue: 4,
      },
      {
        id: 'tc-2',
        name: 'Tính Precision & Recall',
        description: 'Precision = 0.8000, Recall = 0.8000',
        expectedKey: 'precision',
        expectedValue: 0.8,
        tolerance: 0.0001,
      },
      {
        id: 'tc-3',
        name: 'Tính F1-Score điều hòa',
        description: 'F1-Score = 0.8000',
        isHidden: true,
        expectedKey: 'f1_score',
        expectedValue: 0.8,
        tolerance: 0.0001,
      },
    ],
    hints: ['Tại threshold = 0.5, TX-04 là False Positive và TX-05 là False Negative.'],
    explanation: 'Tại ngưỡng 0.5, mô hình đạt sự cân bằng giữa Precision (80%) và Recall (80%).',
  },
  {
    id: 'ml-int-08',
    code: 'ML-206',
    title: 'Chuẩn hóa Min-Max & Thuật toán K-Nearest Neighbors (KNN Classification)',
    track: 'ML',
    difficulty: 'Intermediate',
    topic: 'Distance-Based Learning & Scaling',
    skills: ['Min-Max Normalization', 'Euclidean Distance', 'KNN Voting'],
    interviewTag: 'ML Coding From Scratch',
    estimatedMinutes: 30,
    points: 180,
    summary:
      'Chuẩn hóa hai đặc trưng có đơn vị đo khác nhau (`annual_spend_k` và `visit_frequency`) về đoạn `[0, 1]`, sau đó cài đặt thuật toán K-Nearest Neighbors (`k = 3`) để phân loại khách hàng mới.',
    businessContext:
      'Khi áp dụng thuật toán dựa trên khoảng cách như KNN hay K-Means, đặc trưng có biên độ lớn hơn sẽ lấn át đặc trưng nhỏ.',
    requirements: [
      'Chuẩn hóa Min-Max cho `annual_spend_k` và `visit_frequency`.',
      'Điểm truy vấn đã chuẩn hóa là `query = [0.75, 0.80]`.',
      'Tìm `k = 3` láng giềng có khoảng cách Euclidean nhỏ nhất.',
      'Trả về `nearest_neighbors`, `nearest_distance`, và `predicted_label`.',
    ],
    constraints: ['Làm tròn `nearest_distance` 4 chữ số.'],
    inputDescription: 'Bảng `customer_vectors.csv`.',
    outputDescription: 'Dict chứa `nearest_neighbors`, `nearest_distance`, và `predicted_label`.',
    datasetName: 'customer_vectors.csv',
    datasetColumns: [
      { name: 'user_id', type: 'string', description: 'Mã khách hàng' },
      { name: 'annual_spend_k', type: 'number', description: 'Chi tiêu năm (nghìn USD)' },
      { name: 'visit_frequency', type: 'number', description: 'Số lần mua hàng/năm' },
      { name: 'label', type: 'string', description: 'Phân hạng: Enterprise hoặc Standard' },
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
    spends = [float(r["annual_spend_k"]) for r in dataset]
    visits = [float(r["visit_frequency"]) for r in dataset]
    min_s, max_s = min(spends), max(spends)
    min_v, max_v = min(visits), max(visits)
    qx, qy = 0.75, 0.80
    distances = []
    for r in dataset:
        s_norm = (float(r["annual_spend_k"]) - min_s) / (max_s - min_s)
        v_norm = (float(r["visit_frequency"]) - min_v) / (max_v - min_v)
        dist = math.sqrt((s_norm - qx) ** 2 + (v_norm - qy) ** 2)
        distances.append((dist, r["user_id"], r["label"]))
    distances.sort(key=lambda item: item[0])
    top_3 = distances[:3]
    votes = {}
    for _, _, label in top_3:
        votes[label] = votes.get(label, 0) + 1
    return {
        "nearest_neighbors": [item[1] for item in top_3],
        "nearest_distance": round(top_3[0][0], 4),
        "predicted_label": max(votes, key=votes.get)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const spends = dataset.map((r) => Number(r.annual_spend_k));
  const visits = dataset.map((r) => Number(r.visit_frequency));
  const minS = Math.min(...spends), maxS = Math.max(...spends);
  const minV = Math.min(...visits), maxV = Math.max(...visits);
  const distances = dataset.map((r) => {
    const sNorm = (Number(r.annual_spend_k) - minS) / (maxS - minS);
    const vNorm = (Number(r.visit_frequency) - minV) / (maxV - minV);
    const dist = Math.sqrt((sNorm - 0.75) ** 2 + (vNorm - 0.80) ** 2);
    return { dist, userId: String(r.user_id), label: String(r.label) };
  });
  distances.sort((a, b) => a.dist - b.dist);
  const top3 = distances.slice(0, 3);
  const votes: Record<string, number> = {};
  for (const item of top3) votes[item.label] = (votes[item.label] || 0) + 1;
  const predictedLabel = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  return {
    nearest_neighbors: top3.map((d) => d.userId),
    nearest_distance: Number(top3[0].dist.toFixed(4)),
    predicted_label: predictedLabel,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def solve(dataset):
    spends = [float(r["annual_spend_k"]) for r in dataset]
    visits = [float(r["visit_frequency"]) for r in dataset]
    min_s, max_s = min(spends), max(spends)
    min_v, max_v = min(visits), max(visits)
    qx, qy = 0.75, 0.80
    distances = []
    for r in dataset:
        s_norm = (float(r["annual_spend_k"]) - min_s) / (max_s - min_s)
        v_norm = (float(r["visit_frequency"]) - min_v) / (max_v - min_v)
        dist = math.sqrt((s_norm - qx) ** 2 + (v_norm - qy) ** 2)
        distances.append((dist, r["user_id"], r["label"]))
    distances.sort(key=lambda item: item[0])
    top_3 = distances[:3]
    votes = {}
    for _, _, label in top_3:
        votes[label] = votes.get(label, 0) + 1
    return {
        "nearest_neighbors": [item[1] for item in top_3],
        "nearest_distance": round(top_3[0][0], 4),
        "predicted_label": max(votes, key=votes.get)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const spends = dataset.map((r) => Number(r.annual_spend_k));
  const visits = dataset.map((r) => Number(r.visit_frequency));
  const minS = Math.min(...spends), maxS = Math.max(...spends);
  const minV = Math.min(...visits), maxV = Math.max(...visits);
  const distances = dataset.map((r) => {
    const sNorm = (Number(r.annual_spend_k) - minS) / (maxS - minS);
    const vNorm = (Number(r.visit_frequency) - minV) / (maxV - minV);
    const dist = Math.sqrt((sNorm - 0.75) ** 2 + (vNorm - 0.80) ** 2);
    return { dist, userId: String(r.user_id), label: String(r.label) };
  });
  distances.sort((a, b) => a.dist - b.dist);
  const top3 = distances.slice(0, 3);
  const votes: Record<string, number> = {};
  for (const item of top3) votes[item.label] = (votes[item.label] || 0) + 1;
  const predictedLabel = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  return {
    nearest_neighbors: top3.map((d) => d.userId),
    nearest_distance: Number(top3[0].dist.toFixed(4)),
    predicted_label: predictedLabel,
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
      {
        id: 'tc-1',
        name: 'Xác định 3 láng giềng gần nhất sau Min-Max Scaling',
        description: 'U-102 (dist=0.05), U-105 (dist=0.1118), U-104 (dist=0.3202)',
        expectedKey: 'nearest_neighbors',
        expectedValue: ['U-102', 'U-105', 'U-104'],
      },
      {
        id: 'tc-2',
        name: 'Khoảng cách Euclidean nhỏ nhất',
        description: 'U-102 có khoảng cách 0.05',
        expectedKey: 'nearest_distance',
        expectedValue: 0.05,
        tolerance: 0.0005,
      },
      {
        id: 'tc-3',
        name: 'Dự đoán nhãn theo đa số (KNN Majority Vote)',
        description: 'Cả 3 láng giềng gần nhất đều thuộc nhóm Enterprise',
        isHidden: true,
        expectedKey: 'predicted_label',
        expectedValue: 'Enterprise',
      },
    ],
    hints: ['Sau khi chuẩn hóa Min-Max, U-102 nằm tại [0.80, 0.80], cách [0.75, 0.80] đúng 0.05.'],
    explanation: 'Ba láng giềng gần nhất (`U-102`, `U-105`, `U-104`) đều thuộc phân khúc `Enterprise`.',
  },
  {
    id: 'ml-adv-09',
    code: 'ML-310',
    title: 'Tối ưu hóa Gradient Descent cho Hồi quy Tuyến tính (Linear Regression Optimization)',
    track: 'ML',
    difficulty: 'Advanced',
    topic: 'Optimization & Gradient Descent',
    skills: ['MSE Loss Function', 'Partial Derivatives', 'Parameter Update'],
    interviewTag: 'Core ML Algorithms Deep Dive',
    estimatedMinutes: 35,
    points: 250,
    summary:
      'Cài đặt hàm mất mát Mean Squared Error (MSE) và thực hiện một bước cập nhật đạo hàm riêng Gradient Descent cho mô hình hồi quy tuyến tính `y_hat = w * x + b`.',
    businessContext:
      'Cài đặt bước cập nhật Gradient Descent từ con số 0 (không dùng thư viện scikit-learn).',
    requirements: [
      'Khởi tạo `w = 0.0`, `b = 0.0`, `lr = 0.01`.',
      'Tính `initial_mse`.',
      'Tính gradient `dw` và `db`.',
      'Cập nhật `updated_w = w - lr * dw`, `updated_b = b - lr * db`.',
      'Tính `updated_mse`.',
    ],
    constraints: ['Dùng đúng hệ số `2/N` trong đạo hàm riêng.'],
    inputDescription: 'Bảng `demand_history.csv` gồm `ad_spend_k` và `units_sold`.',
    outputDescription: 'Dict chứa `initial_mse`, `updated_w`, `updated_b`, và `updated_mse`.',
    datasetName: 'demand_history.csv',
    datasetColumns: [
      { name: 'week', type: 'string', description: 'Tuần quan sát' },
      { name: 'ad_spend_k', type: 'number', description: 'Chi phí quảng cáo x' },
      { name: 'units_sold', type: 'number', description: 'Sản lượng bán ra y' },
    ],
    datasetRows: [
      { week: 'W-01', ad_spend_k: 1.0, units_sold: 3.0 },
      { week: 'W-02', ad_spend_k: 2.0, units_sold: 5.0 },
      { week: 'W-03', ad_spend_k: 3.0, units_sold: 7.0 },
      { week: 'W-04', ad_spend_k: 4.0, units_sold: 9.0 },
      { week: 'W-05', ad_spend_k: 5.0, units_sold: 11.0 },
    ],
    starterCode: {
      python: `def solve(dataset):
    x = [float(r["ad_spend_k"]) for r in dataset]
    y = [float(r["units_sold"]) for r in dataset]
    n = len(x)
    w, b, lr = 0.0, 0.0, 0.01
    initial_mse = sum((w * x[i] + b - y[i]) ** 2 for i in range(n)) / n
    dw = (2.0 / n) * sum(x[i] * (w * x[i] + b - y[i]) for i in range(n))
    db = (2.0 / n) * sum((w * x[i] + b - y[i]) for i in range(n))
    updated_w = w - lr * dw
    updated_b = b - lr * db
    updated_mse = sum((updated_w * x[i] + updated_b - y[i]) ** 2 for i in range(n)) / n
    return {
        "initial_mse": round(initial_mse, 2),
        "updated_w": round(updated_w, 4),
        "updated_b": round(updated_b, 4),
        "updated_mse": round(updated_mse, 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const x = dataset.map((r) => Number(r.ad_spend_k));
  const y = dataset.map((r) => Number(r.units_sold));
  const n = x.length;
  const initialMse = y.reduce((s, yi) => s + yi * yi, 0) / n;
  const dw = -(2 / n) * x.reduce((s, xi, i) => s + xi * y[i], 0);
  const db = -(2 / n) * y.reduce((s, yi) => s + yi, 0);
  const updatedW = -0.01 * dw;
  const updatedB = -0.01 * db;
  const updatedMse = x.reduce((s, xi, i) => s + (updatedW * xi + updatedB - y[i]) ** 2, 0) / n;
  return {
    initial_mse: Number(initialMse.toFixed(2)),
    updated_w: Number(updatedW.toFixed(4)),
    updated_b: Number(updatedB.toFixed(4)),
    updated_mse: Number(updatedMse.toFixed(2)),
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
    initial_mse = sum((w * x[i] + b - y[i]) ** 2 for i in range(n)) / n
    dw = (2.0 / n) * sum(x[i] * (w * x[i] + b - y[i]) for i in range(n))
    db = (2.0 / n) * sum((w * x[i] + b - y[i]) for i in range(n))
    updated_w = w - lr * dw
    updated_b = b - lr * db
    updated_mse = sum((updated_w * x[i] + updated_b - y[i]) ** 2 for i in range(n)) / n
    return {
        "initial_mse": round(initial_mse, 2),
        "updated_w": round(updated_w, 4),
        "updated_b": round(updated_b, 4),
        "updated_mse": round(updated_mse, 2)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const x = dataset.map((r) => Number(r.ad_spend_k));
  const y = dataset.map((r) => Number(r.units_sold));
  const n = x.length;
  const initialMse = y.reduce((s, yi) => s + yi * yi, 0) / n;
  const dw = -(2 / n) * x.reduce((s, xi, i) => s + xi * y[i], 0);
  const db = -(2 / n) * y.reduce((s, yi) => s + yi, 0);
  const updatedW = -0.01 * dw;
  const updatedB = -0.01 * db;
  const updatedMse = x.reduce((s, xi, i) => s + (updatedW * xi + updatedB - y[i]) ** 2, 0) / n;
  return {
    initial_mse: Number(initialMse.toFixed(2)),
    updated_w: Number(updatedW.toFixed(4)),
    updated_b: Number(updatedB.toFixed(4)),
    updated_mse: Number(updatedMse.toFixed(2)),
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
      {
        id: 'tc-1',
        name: 'Tính hàm mất mát ban đầu (Initial MSE)',
        description: 'Tại w=0, b=0: MSE = 57.0',
        expectedKey: 'initial_mse',
        expectedValue: 57,
        tolerance: 0.01,
      },
      {
        id: 'tc-2',
        name: 'Cập nhật trọng số w và hệ số chệch b',
        description: 'updated_w = 0.5000; updated_b = 0.1400',
        expectedKey: 'updated_w',
        expectedValue: 0.5,
        tolerance: 0.0005,
      },
      {
        id: 'tc-3',
        name: 'Kiểm chứng giảm hàm mất mát (Updated MSE)',
        description: 'MSE giảm từ 57.0 xuống 32.87',
        isHidden: true,
        expectedKey: 'updated_mse',
        expectedValue: 32.87,
        tolerance: 0.02,
      },
    ],
    hints: ['Tại w=0, b=0: dw = -50.0 -> updated_w = 0.5; db = -14.0 -> updated_b = 0.14.'],
    explanation: 'Chỉ sau 1 bước cập nhật Gradient Descent, MSE giảm từ 57.0 xuống còn 32.87 (-42.3%).',
  },
];
