import { Problem } from './problems';

export const MORE_PROBLEMS: Problem[] = [
  // ===================== LEETCODE SOURCES =====================
  {
    id: 'lc-176',
    code: 'LC-176',
    title: 'Second Highest Salary / Nth Revenue Record',
    track: 'DA',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceRef: 'LeetCode #176 & HackerRank SQL',
    categoryGroup: 'SQL & Business Metrics',
    topic: 'SQL Window Functions & Aggregation',
    skills: ['Dense Ranking', 'NULL Handling', 'Distinct Aggregation'],
    interviewTag: 'FAANG SQL Screen',
    companies: ['Google', 'Amazon', 'Meta'],
    acceptanceRate: '41.2%',
    estimatedMinutes: 20,
    points: 120,
    summary:
      'Tìm mức lương hoặc doanh thu cao thứ nhì trong bảng nhân viên. Nếu không có giá trị cao thứ nhì, trả về null.',
    businessContext:
      'Bài toán kinh điển xuất hiện trong hơn 80% buổi phỏng vấn Data Analyst / SQL tại Google và Meta nhằm kiểm tra khả năng xử lý trùng lặp và giá trị null.',
    requirements: [
      'Tìm giá trị `second_highest_salary` là mức lương cao thứ 2 (distinct value).',
      'Nếu bảng có ít hơn 2 mức lương khác nhau, trả về null.',
      'Đếm `total_distinct_salaries`: số lượng mức lương duy nhất trong công ty.',
    ],
    constraints: [
      'Độ phức tạp O(N log N) hoặc O(N).',
      'Trả về object: { second_highest_salary, total_distinct_salaries }',
    ],
    inputDescription: 'Bảng employees.csv gồm employee_id, department, salary (USD).',
    outputDescription: 'Object chứa second_highest_salary và total_distinct_salaries.',
    datasetName: 'employees_salary.csv',
    datasetColumns: [
      { name: 'employee_id', type: 'string', description: 'Mã nhân viên' },
      { name: 'department', type: 'string', description: 'Phòng ban' },
      { name: 'salary', type: 'number', description: 'Mức lương hàng năm (USD)' },
    ],
    datasetRows: [
      { employee_id: 'E-01', department: 'Engineering', salary: 120000 },
      { employee_id: 'E-02', department: 'Engineering', salary: 140000 },
      { employee_id: 'E-03', department: 'Marketing', salary: 95000 },
      { employee_id: 'E-04', department: 'Engineering', salary: 140000 },
      { employee_id: 'E-05', department: 'Sales', salary: 110000 },
      { employee_id: 'E-06', department: 'Sales', salary: 105000 },
    ],
    starterCode: {
      python: `def solve(dataset):
    salaries = sorted(list(set(r["salary"] for r in dataset)), reverse=True)
    second_highest = salaries[1] if len(salaries) >= 2 else None
    return {
        "second_highest_salary": second_highest,
        "total_distinct_salaries": len(salaries)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const uniqueSalaries = Array.from(new Set(dataset.map((r) => Number(r.salary)))).sort((a, b) => b - a);
  const secondHighest = uniqueSalaries.length >= 2 ? uniqueSalaries[1] : null;
  return {
    second_highest_salary: secondHighest,
    total_distinct_salaries: uniqueSalaries.length,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    salaries = sorted(list(set(r["salary"] for r in dataset)), reverse=True)
    return {
        "second_highest_salary": salaries[1] if len(salaries) >= 2 else None,
        "total_distinct_salaries": len(salaries)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const uniqueSalaries = Array.from(new Set(dataset.map((r) => Number(r.salary)))).sort((a, b) => b - a);
  return {
    second_highest_salary: uniqueSalaries.length >= 2 ? uniqueSalaries[1] : null,
    total_distinct_salaries: uniqueSalaries.length,
  };
}
`,
    },
    expectedOutput: {
      second_highest_salary: 120000,
      total_distinct_salaries: 5,
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Mức lương cao thứ nhì',
        description: 'Mức 140k cao nhất, mức 120k là cao thứ nhì',
        expectedKey: 'second_highest_salary',
        expectedValue: 120000,
      },
      {
        id: 'tc-2',
        name: 'Số lượng mức lương duy nhất',
        description: 'Tổng cộng 5 mức lương phân biệt',
        expectedKey: 'total_distinct_salaries',
        expectedValue: 5,
      },
    ],
    hints: [
      'Dùng set() để loại bỏ các mức lương trùng nhau (ví dụ E-02 và E-04 cùng 140k)',
      'Sắp xếp giảm dần và lấy phần tử ở chỉ mục 1',
    ],
    explanation:
      'Trong SQL, giải pháp này tương đương với SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees) hoặc DENSE_RANK().',
  },

  {
    id: 'lc-1',
    code: 'LC-001',
    title: 'Two Sum Target Price Match (Market Basket)',
    track: 'DA',
    difficulty: 'Easy',
    source: 'LeetCode',
    sourceRef: 'LeetCode #1',
    categoryGroup: 'Data Structures & Algorithms',
    topic: 'Hashing & Pair Finding',
    skills: ['Hash Map', 'One-Pass Algorithm', 'Complement Lookup'],
    interviewTag: 'E-Commerce Product Pairing',
    companies: ['Amazon', 'Shopee', 'Apple'],
    acceptanceRate: '54.8%',
    estimatedMinutes: 15,
    points: 100,
    summary:
      'Tìm cặp sản phẩm có tổng giá trị đúng bằng voucher khuyến mãi (target = 100 USD) bằng thuật toán Hash Map O(N).',
    businessContext:
      'Tính năng giỏ hàng của Amazon gợi ý 2 món đồ để khách vừa khít tiêu hết mã coupon 100$ nhằm kích thích tỉ lệ chốt đơn.',
    requirements: [
      'Tìm 2 sản phẩm khác nhau có `price_a + price_b == 100`.',
      'Trả về danh sách 2 `product_id` theo thứ tự từ điển tăng dần.',
      'Trả về `pair_found`: boolean (true nếu tìm thấy).',
    ],
    constraints: ['Chạy trong thời gian O(N) với single-pass hash map.'],
    inputDescription: 'Bảng store_catalog.csv chứa product_id, category, price.',
    outputDescription: 'Object: { pair_found, matched_products, target_sum }',
    datasetName: 'store_catalog.csv',
    datasetColumns: [
      { name: 'product_id', type: 'string', description: 'Mã SKU' },
      { name: 'category', type: 'string', description: 'Ngành hàng' },
      { name: 'price', type: 'number', description: 'Giá bán niêm yết (USD)' },
    ],
    datasetRows: [
      { product_id: 'P-10', category: 'Books', price: 15 },
      { product_id: 'P-20', category: 'Accessories', price: 25 },
      { product_id: 'P-30', category: 'Audio', price: 35 },
      { product_id: 'P-40', category: 'Gaming', price: 65 },
      { product_id: 'P-50', category: 'Home', price: 40 },
    ],
    starterCode: {
      python: `def solve(dataset):
    target = 100
    seen = {}
    matched = []
    found = False
    
    for item in dataset:
        p = item["price"]
        comp = target - p
        if comp in seen:
            matched = sorted([seen[comp], item["product_id"]])
            found = True
            break
        seen[p] = item["product_id"]
        
    return {
        "pair_found": found,
        "matched_products": matched,
        "target_sum": target
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const target = 100;
  const seen: Record<number, string> = {};
  let matched: string[] = [];
  let found = false;

  for (const item of dataset) {
    const price = Number(item.price);
    const comp = target - price;
    if (seen[comp] !== undefined) {
      matched = [seen[comp], item.product_id].sort();
      found = true;
      break;
    }
    seen[price] = item.product_id;
  }

  return {
    pair_found: found,
    matched_products: matched,
    target_sum: target,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    target = 100
    seen = {}
    matched = []
    found = False
    for item in dataset:
        comp = target - item["price"]
        if comp in seen:
            matched = sorted([seen[comp], item["product_id"]])
            found = True
            break
        seen[item["price"]] = item["product_id"]
    return {
        "pair_found": found,
        "matched_products": matched,
        "target_sum": target
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const target = 100;
  const seen: Record<number, string> = {};
  let matched: string[] = [];
  let found = false;
  for (const item of dataset) {
    const price = Number(item.price);
    const comp = target - price;
    if (seen[comp] !== undefined) {
      matched = [seen[comp], item.product_id].sort();
      found = true;
      break;
    }
    seen[price] = item.product_id;
  }
  return {
    pair_found: found,
    matched_products: matched,
    target_sum: target,
  };
}
`,
    },
    expectedOutput: {
      pair_found: true,
      matched_products: ['P-30', 'P-40'],
      target_sum: 100,
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Tìm ra cặp sản phẩm khớp',
        description: 'P-30 (35$) và P-40 (65$) = 100$',
        expectedKey: 'matched_products',
        expectedValue: ['P-30', 'P-40'],
      },
      {
        id: 'tc-2',
        name: 'Trạng thái tìm thấy',
        description: 'pair_found == true',
        expectedKey: 'pair_found',
        expectedValue: true,
      },
    ],
    hints: ['Sử dụng Hash Map lưu giá trị complement (100 - price) đã duyệt qua.'],
    explanation:
      'LeetCode #1 là bài tập căn bản nhất về tối ưu độ phức tạp từ O(N^2) xuống O(N) nhờ bảng băm.',
  },

  // ===================== HACKERRANK SOURCES =====================
  {
    id: 'hr-stats-01',
    code: 'HR-STAT-01',
    title: '10 Days of Statistics: Mean, Median & Standard Deviation',
    track: 'DS',
    difficulty: 'Easy',
    source: 'HackerRank',
    sourceRef: 'HackerRank 10 Days of Statistics',
    categoryGroup: 'Statistics & A/B Testing',
    topic: 'Descriptive Statistics',
    skills: ['Central Tendency', 'Variance', 'Standard Deviation'],
    interviewTag: 'Quantitative Data Screening',
    companies: ['Goldman Sachs', 'Grab', 'Shopee'],
    acceptanceRate: '82.1%',
    estimatedMinutes: 15,
    points: 100,
    summary:
      'Tính toán bộ ba chỉ số thống kê mô tả: Mean (trung bình), Median (trung vị), và Population Standard Deviation (độ lệch chuẩn).',
    businessContext:
      'Trước khi xây dựng bất kỳ mô hình dự báo nào, nhà khoa học dữ liệu phải tóm tắt phân phối để phát hiện độ lệch (skewness).',
    requirements: [
      'Tính `mean`: làm tròn 2 chữ số thập phân.',
      'Tính `median`: giá trị chính giữa (hoặc trung bình 2 số ở giữa nếu số phần tử chẵn).',
      'Tính `std_dev`: độ lệch chuẩn quần thể (căn bậc hai của trung bình bình phương sai số so với mean, làm tròn 2 chữ số).',
    ],
    constraints: ['Không dùng thư viện numpy/scipy ngoài để rèn luyện tư duy tính toán gốc.'],
    inputDescription: 'Bảng student_test_scores.csv chứa student_id và score.',
    outputDescription: 'Object: { mean, median, std_dev, total_samples }',
    datasetName: 'student_test_scores.csv',
    datasetColumns: [
      { name: 'student_id', type: 'string', description: 'Mã thí sinh' },
      { name: 'score', type: 'number', description: 'Điểm số bài thi (0-100)' },
    ],
    datasetRows: [
      { student_id: 'S-1', score: 64 },
      { student_id: 'S-2', score: 78 },
      { student_id: 'S-3', score: 85 },
      { student_id: 'S-4', score: 90 },
      { student_id: 'S-5', score: 92 },
      { student_id: 'S-6', score: 95 },
      { student_id: 'S-7', score: 68 },
      { student_id: 'S-8', score: 88 },
    ],
    starterCode: {
      python: `import math

def solve(dataset):
    scores = sorted([r["score"] for r in dataset])
    n = len(scores)
    mean_val = round(sum(scores) / n, 2)
    
    # Median
    if n % 2 == 1:
        median_val = scores[n // 2]
    else:
        median_val = round((scores[n // 2 - 1] + scores[n // 2]) / 2, 2)
        
    # Std dev (population)
    variance = sum((x - mean_val) ** 2 for x in scores) / n
    std_dev = round(math.sqrt(variance), 2)
    
    return {
        "mean": mean_val,
        "median": median_val,
        "std_dev": std_dev,
        "total_samples": n
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const scores = dataset.map((r) => Number(r.score)).sort((a, b) => a - b);
  const n = scores.length;
  const mean = Number((scores.reduce((s, x) => s + x, 0) / n).toFixed(2));

  let median = 0;
  if (n % 2 === 1) {
    median = scores[Math.floor(n / 2)];
  } else {
    median = Number(((scores[n / 2 - 1] + scores[n / 2]) / 2).toFixed(2));
  }

  const variance = scores.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / n;
  const stdDev = Number(Math.sqrt(variance).toFixed(2));

  return {
    mean,
    median,
    std_dev: stdDev,
    total_samples: n,
  };
}
`,
    },
    solutionCode: {
      python: `import math

def solve(dataset):
    scores = sorted([r["score"] for r in dataset])
    n = len(scores)
    mean_val = round(sum(scores) / n, 2)
    median_val = scores[n // 2] if n % 2 == 1 else round((scores[n // 2 - 1] + scores[n // 2]) / 2, 2)
    variance = sum((x - mean_val) ** 2 for x in scores) / n
    std_dev = round(math.sqrt(variance), 2)
    return {
        "mean": mean_val,
        "median": median_val,
        "std_dev": std_dev,
        "total_samples": n
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const scores = dataset.map((r) => Number(r.score)).sort((a, b) => a - b);
  const n = scores.length;
  const mean = Number((scores.reduce((s, x) => s + x, 0) / n).toFixed(2));
  const median = n % 2 === 1 ? scores[Math.floor(n / 2)] : Number(((scores[n / 2 - 1] + scores[n / 2]) / 2).toFixed(2));
  const variance = scores.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / n;
  const stdDev = Number(Math.sqrt(variance).toFixed(2));
  return {
    mean,
    median,
    std_dev: stdDev,
    total_samples: n,
  };
}
`,
    },
    expectedOutput: {
      mean: 82.5,
      median: 86.5,
      std_dev: 11.21,
      total_samples: 8,
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Điểm trung bình (Mean)',
        description: 'Mean = 82.50',
        expectedKey: 'mean',
        expectedValue: 82.5,
        tolerance: 0.05,
      },
      {
        id: 'tc-2',
        name: 'Trung vị (Median)',
        description: 'Median của [64, 68, 78, 85, 88, 90, 92, 95] = (85+88)/2 = 86.5',
        expectedKey: 'median',
        expectedValue: 86.5,
        tolerance: 0.05,
      },
      {
        id: 'tc-3',
        name: 'Độ lệch chuẩn (Std Dev)',
        description: 'Population std dev ~ 11.21',
        expectedKey: 'std_dev',
        expectedValue: 11.21,
        tolerance: 0.1,
      },
    ],
    hints: [
      'Sắp xếp mảng điểm trước khi tìm Median',
      'Độ lệch chuẩn quần thể chia cho N (thay vì N-1 của mẫu)',
    ],
    explanation:
      'Bộ bài tập HackerRank 10 Days of Statistics là tài liệu chuẩn mực giúp lập trình viên thành thạo nền tảng toán học của dữ liệu.',
  },

  // ===================== KAGGLE SOURCES =====================
  {
    id: 'kg-rfm-01',
    code: 'KG-RFM-01',
    title: 'Customer RFM Segmentation & Scoring',
    track: 'DA',
    difficulty: 'Medium',
    source: 'Kaggle',
    sourceRef: 'Kaggle Customer Analytics Dataset',
    categoryGroup: 'Product & Revenue Metrics',
    topic: 'Customer Segmentation',
    skills: ['RFM Modeling', 'Quantile Scoring', 'Cohort Classification'],
    interviewTag: 'Marketing Analytics Takehome',
    companies: ['Shopee', 'Lazada', 'Grab'],
    acceptanceRate: '67.4%',
    estimatedMinutes: 25,
    points: 130,
    summary:
      'Phân loại tập khách hàng thành các nhóm: "Champions", "At Risk", và "Need Attention" dựa trên điểm số Recency, Frequency, và Monetary.',
    businessContext:
      'Đội ngũ CRM của sàn E-commerce cần gửi mã giảm giá được cá nhân hóa cho từng nhóm khách hàng nhằm tối ưu chi phí Marketing.',
    requirements: [
      'Tính điểm R (Recency): Khách mua càng gần đây điểm càng cao (days <= 10: điểm 3, days <= 30: điểm 2, còn lại điểm 1).',
      'Tính điểm F (Frequency): orders >= 5: điểm 3, orders >= 3: điểm 2, còn lại điểm 1.',
      'Tính điểm M (Monetary): spend >= 500: điểm 3, spend >= 200: điểm 2, còn lại điểm 1.',
      'Khách hàng có tổng điểm R+F+M >= 7 được gắn nhãn "Champion".',
      'Trả về danh sách `champion_users`: mảng customer_id của các khách hàng đạt chuẩn Champion (theo thứ tự tăng dần).',
      'Đếm `total_champions`: số lượng khách hàng Champions.',
    ],
    constraints: ['Xử lý tập dữ liệu O(N).'],
    inputDescription: 'Bảng customer_activity.csv chứa customer_id, days_since_last_order, total_orders, total_spend.',
    outputDescription: 'Object: { champion_users, total_champions }',
    datasetName: 'customer_activity.csv',
    datasetColumns: [
      { name: 'customer_id', type: 'string', description: 'Mã khách hàng' },
      { name: 'days_since_last_order', type: 'number', description: 'Số ngày từ lần mua cuối' },
      { name: 'total_orders', type: 'number', description: 'Tổng số đơn hàng thành công' },
      { name: 'total_spend', type: 'number', description: 'Tổng chi tiêu tích lũy (USD)' },
    ],
    datasetRows: [
      { customer_id: 'C-001', days_since_last_order: 5, total_orders: 8, total_spend: 650 },
      { customer_id: 'C-002', days_since_last_order: 45, total_orders: 1, total_spend: 50 },
      { customer_id: 'C-003', days_since_last_order: 8, total_orders: 4, total_spend: 320 },
      { customer_id: 'C-004', days_since_last_order: 12, total_orders: 6, total_spend: 520 },
      { customer_id: 'C-005', days_since_last_order: 60, total_orders: 7, total_spend: 700 },
    ],
    starterCode: {
      python: `def solve(dataset):
    champions = []
    for c in dataset:
        days = c["days_since_last_order"]
        orders = c["total_orders"]
        spend = c["total_spend"]
        
        r_score = 3 if days <= 10 else (2 if days <= 30 else 1)
        f_score = 3 if orders >= 5 else (2 if orders >= 3 else 1)
        m_score = 3 if spend >= 500 else (2 if spend >= 200 else 1)
        
        if (r_score + f_score + m_score) >= 7:
            champions.append(c["customer_id"])
            
    champions.sort()
    return {
        "champion_users": champions,
        "total_champions": len(champions)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const champions: string[] = [];

  for (const c of dataset) {
    const days = Number(c.days_since_last_order);
    const orders = Number(c.total_orders);
    const spend = Number(c.total_spend);

    const rScore = days <= 10 ? 3 : days <= 30 ? 2 : 1;
    const fScore = orders >= 5 ? 3 : orders >= 3 ? 2 : 1;
    const mScore = spend >= 500 ? 3 : spend >= 200 ? 2 : 1;

    if (rScore + fScore + mScore >= 7) {
      champions.push(c.customer_id);
    }
  }

  champions.sort();
  return {
    champion_users: champions,
    total_champions: champions.length,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    champions = []
    for c in dataset:
        days = c["days_since_last_order"]
        orders = c["total_orders"]
        spend = c["total_spend"]
        r = 3 if days <= 10 else (2 if days <= 30 else 1)
        f = 3 if orders >= 5 else (2 if orders >= 3 else 1)
        m = 3 if spend >= 500 else (2 if spend >= 200 else 1)
        if r + f + m >= 7:
            champions.append(c["customer_id"])
    champions.sort()
    return {
        "champion_users": champions,
        "total_champions": len(champions)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const champions: string[] = [];
  for (const c of dataset) {
    const days = Number(c.days_since_last_order);
    const orders = Number(c.total_orders);
    const spend = Number(c.total_spend);
    const r = days <= 10 ? 3 : days <= 30 ? 2 : 1;
    const f = orders >= 5 ? 3 : orders >= 3 ? 2 : 1;
    const m = spend >= 500 ? 3 : spend >= 200 ? 2 : 1;
    if (r + f + m >= 7) champions.push(c.customer_id);
  }
  champions.sort();
  return {
    champion_users: champions,
    total_champions: champions.length,
  };
}
`,
    },
    expectedOutput: {
      champion_users: ['C-001', 'C-003', 'C-004'],
      total_champions: 3,
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Danh sách khách hàng Champion',
        description: 'C-001 (9 điểm), C-003 (7 điểm), C-004 (8 điểm)',
        expectedKey: 'champion_users',
        expectedValue: ['C-001', 'C-003', 'C-004'],
      },
      {
        id: 'tc-2',
        name: 'Số lượng Champions',
        description: '3 khách hàng đạt chuẩn',
        expectedKey: 'total_champions',
        expectedValue: 3,
      },
    ],
    hints: ['Quy đổi từng giá trị thành điểm 1-3 theo ngưỡng và tính tổng R+F+M.'],
    explanation:
      'Mô hình RFM là nền tảng của hầu hết chiến lược tăng trưởng (Growth Marketing) trong doanh nghiệp số.',
  },

  // ===================== CODEFORCES SOURCES =====================
  {
    id: 'cf-window-01',
    code: 'CF-SLIDE-01',
    title: 'Sliding Window Maximum Volatility (Stock Spike)',
    track: 'ML',
    difficulty: 'Medium',
    source: 'Codeforces',
    sourceRef: 'Codeforces / Algorithmic Quant Tech',
    categoryGroup: 'Data Structures & Algorithms',
    topic: 'Time Series & Sliding Window',
    skills: ['Sliding Window', 'Rolling Volatility', 'Feature Engineering'],
    interviewTag: 'High Frequency Trading Screening',
    companies: ['Jane Street', 'Two Sigma', 'Citadel'],
    acceptanceRate: '48.9%',
    estimatedMinutes: 25,
    points: 130,
    summary:
      'Tính khoảng chênh lệch cực đại (Max - Min) trong mỗi cửa sổ trượt độ rộng K = 3 phiên giao dịch để phát hiện đột biến giá.',
    businessContext:
      'Trong các hệ thống định lượng (Quantitative Trading), biên độ dao động cục bộ là đặc trưng quan trọng kích hoạt bot bảo toàn vốn.',
    requirements: [
      'Cho chuỗi giá đóng cửa với cửa sổ trượt kích thước K = 3.',
      'Với mỗi cửa sổ i (từ index 0 tới N - K), tính `spread = max(window) - min(window)`.',
      'Trả về mảng `spread_series`: danh sách các giá trị spread làm tròn 2 chữ số.',
      'Xác định `max_spread`: độ chênh lệch lớn nhất từng xảy ra trong chuỗi.',
    ],
    constraints: ['Chuỗi có độ dài N >= 3.'],
    inputDescription: 'Bảng tick_prices.csv chứa timestamp, price (USD).',
    outputDescription: 'Object: { spread_series, max_spread, window_count }',
    datasetName: 'tick_prices.csv',
    datasetColumns: [
      { name: 'tick', type: 'number', description: 'Thứ tự phiên' },
      { name: 'price', type: 'number', description: 'Giá khớp lệnh (USD)' },
    ],
    datasetRows: [
      { tick: 1, price: 100 },
      { tick: 2, price: 105 },
      { tick: 3, price: 98 },
      { tick: 4, price: 112 },
      { tick: 5, price: 110 },
      { tick: 6, price: 125 },
    ],
    starterCode: {
      python: `def solve(dataset):
    prices = [r["price"] for r in dataset]
    k = 3
    spreads = []
    
    for i in range(len(prices) - k + 1):
        window = prices[i : i + k]
        spread = round(max(window) - min(window), 2)
        spreads.append(spread)
        
    return {
        "spread_series": spreads,
        "max_spread": max(spreads) if spreads else 0,
        "window_count": len(spreads)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const prices = dataset.map((r) => Number(r.price));
  const k = 3;
  const spreads: number[] = [];

  for (let i = 0; i <= prices.length - k; i++) {
    const window = prices.slice(i, i + k);
    const maxVal = Math.max(...window);
    const minVal = Math.min(...window);
    spreads.push(Number((maxVal - minVal).toFixed(2)));
  }

  return {
    spread_series: spreads,
    max_spread: spreads.length > 0 ? Math.max(...spreads) : 0,
    window_count: spreads.length,
  };
}
`,
    },
    solutionCode: {
      python: `def solve(dataset):
    prices = [r["price"] for r in dataset]
    k = 3
    spreads = [round(max(prices[i:i+k]) - min(prices[i:i+k]), 2) for i in range(len(prices) - k + 1)]
    return {
        "spread_series": spreads,
        "max_spread": max(spreads) if spreads else 0,
        "window_count": len(spreads)
    }
`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {
  const prices = dataset.map((r) => Number(r.price));
  const k = 3;
  const spreads: number[] = [];
  for (let i = 0; i <= prices.length - k; i++) {
    const w = prices.slice(i, i + k);
    spreads.push(Number((Math.max(...w) - Math.min(...w)).toFixed(2)));
  }
  return {
    spread_series: spreads,
    max_spread: Math.max(...spreads),
    window_count: spreads.length,
  };
}
`,
    },
    expectedOutput: {
      spread_series: [7, 14, 14, 15],
      max_spread: 15,
      window_count: 4,
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Chuỗi biên độ biến động',
        description: 'W1=[100,105,98]->7, W2=[105,98,112]->14, W3=[98,112,110]->14, W4=[112,110,125]->15',
        expectedKey: 'spread_series',
        expectedValue: [7, 14, 14, 15],
      },
      {
        id: 'tc-2',
        name: 'Độ chênh lệch lớn nhất',
        description: 'Max spread = 15 USD ở cửa sổ cuối',
        expectedKey: 'max_spread',
        expectedValue: 15,
      },
    ],
    hints: ['Cắt mảng con prices[i : i+k] và tính hiệu max - min.'],
    explanation:
      'Thuật toán cửa sổ trượt (Sliding Window) là công cụ nền tảng để tạo đặc trưng (feature engineering) cho dữ liệu chuỗi thời gian.',
  },
];
