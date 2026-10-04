import { Problem, ProblemSource, TrackId, DifficultyLevel } from './problems';

// Helper to generate runnable test cases and code for a problem
interface ProblemTemplateDef {
  code: string;
  title: string;
  source: ProblemSource;
  sourceRef: string;
  categoryGroup: string;
  topic: string;
  difficulty: DifficultyLevel;
  companies: string[];
  acceptanceRate: string;
  minutes: number;
  summary: string;
  businessContext: string;
  requirements: string[];
  datasetName: string;
  columns: { name: string; type: 'number' | 'string' | 'boolean'; description: string }[];
  rows: Record<string, string | number | boolean | null>[];
  targetMetricKey: string;
  expectedMetricValue: number | string | boolean | (string | number)[];
  pySolveBody: string;
  tsSolveBody: string;
  hints: string[];
  explanation: string;
}

function buildProblem(track: TrackId, p: ProblemTemplateDef, idx: number): Problem {
  const id = `${track.toLowerCase()}-p${idx + 1}`;
  const points = p.difficulty === 'Easy' ? 100 : p.difficulty === 'Medium' ? 150 : 200;

  return {
    id,
    code: p.code,
    title: p.title,
    track,
    difficulty: p.difficulty,
    source: p.source,
    sourceRef: p.sourceRef,
    categoryGroup: p.categoryGroup,
    topic: p.topic,
    skills: [p.topic, p.categoryGroup],
    interviewTag: `${p.companies[0] || 'Tech'} Interview Screen`,
    companies: p.companies,
    acceptanceRate: p.acceptanceRate,
    estimatedMinutes: p.minutes,
    points,
    summary: p.summary,
    businessContext: p.businessContext,
    requirements: p.requirements,
    constraints: ['Thời gian xử lý: O(N) hoặc O(N log N)', 'Trả về object có khóa kết quả tương ứng'],
    inputDescription: `Tập dữ liệu ${p.datasetName}`,
    outputDescription: `Object chứa ${p.targetMetricKey}`,
    datasetName: p.datasetName,
    datasetColumns: p.columns,
    datasetRows: p.rows,
    starterCode: {
      python: `def solve(dataset):\n    # TODO: Cài đặt giải pháp\n${p.pySolveBody}`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {\n  // TODO: Cài đặt giải pháp\n${p.tsSolveBody}\n}`,
    },
    solutionCode: {
      python: `def solve(dataset):\n${p.pySolveBody}`,
      typescript: `function solve(dataset: Array<Record<string, any>>) {\n${p.tsSolveBody}\n}`,
    },
    expectedOutput: {
      [p.targetMetricKey]: p.expectedMetricValue,
    },
    testCases: [
      {
        id: `tc-${id}-1`,
        name: `Kiểm tra ${p.targetMetricKey}`,
        description: `Giá trị kỳ vọng: ${JSON.stringify(p.expectedMetricValue)}`,
        expectedKey: p.targetMetricKey,
        expectedValue: p.expectedMetricValue,
        tolerance: typeof p.expectedMetricValue === 'number' ? 0.02 : undefined,
      },
    ],
    hints: p.hints,
    explanation: p.explanation,
  };
}

// -------------------------------------------------------------
// BASE TEMPLATE BLUEPRINTS FOR EACH TRACK (110+ DA, 110+ DS, 110+ ML)
// -------------------------------------------------------------

const SOURCES: ProblemSource[] = [
  'LeetCode',
  'HackerRank',
  'StrataScratch',
  'DataLemur',
  'Kaggle',
  'InterviewQuery',
  'Codeforces',
];

const COMPANIES = [
  ['Google', 'Meta'],
  ['Amazon', 'Shopee'],
  ['Grab', 'ByteDance'],
  ['Netflix', 'Apple'],
  ['Stripe', 'Uber'],
  ['Jane Street', 'Two Sigma'],
  ['Spotify', 'Microsoft'],
];

// Helper to create DA templates
function generateDATemplates(): ProblemTemplateDef[] {
  const groups = [
    {
      group: 'Product & Revenue Metrics',
      topics: [
        'Net Revenue & Discounts',
        'Average Order Value (AOV)',
        'Gross Merchandise Value (GMV)',
        'Repeat Purchase Ratio',
        'Customer Acquisition Cost (CAC)',
        'Refund & Chargeback Rate',
        'Cart Abandonment Rate',
        'Subscription MRR Growth',
        'Discount Burn Rate',
        'Unit Economics Profit Margin',
      ],
    },
    {
      group: 'Funnel, Cohort & Retention',
      topics: [
        'Day-1 User Retention',
        'Day-7 User Retention',
        'Day-30 User Retention',
        'Onboarding Funnel Drop-off',
        'KYC Verification Funnel',
        'Checkout Step Conversion',
        'User Churn Inactivity Rate',
        'Stickiness DAU/MAU Ratio',
        'Feature Adoption Rate',
        'Organic vs Paid Cohort Decay',
      ],
    },
    {
      group: 'SQL & Window Functions',
      topics: [
        'Dense Ranking Salaries',
        'Top 3 Products by Department',
        'Running Total / Cumulative Sum',
        'Day-over-Day Revenue Delta',
        'Lag / Lead Period Comparison',
        'Customer First & Last Purchase',
        'Consecutive Active Days Streak',
        'Moving Average 7-Day Window',
        'Anti-Join Unengaged Users',
        'Pivot Category Sales Totals',
      ],
    },
    {
      group: 'Customer Analytics & RFM',
      topics: [
        'Recency Score Calculation',
        'Frequency Purchase Bucketing',
        'Monetary Value Quartiles',
        'Champions Customer Identification',
        'At-Risk Customer Alerting',
        'VIP Tier Escalation Logic',
        'Customer Lifetime Value (LTV)',
        'Net Promoter Score (NPS) Clean',
        'Support Ticket Resolution Rate',
        'Cross-sell Recommendation Odds',
      ],
    },
  ];

  const list: ProblemTemplateDef[] = [];
  let count = 0;

  for (const g of groups) {
    for (const t of g.topics) {
      for (let variant = 1; variant <= 3; variant++) {
        count++;
        const diff: DifficultyLevel = variant === 1 ? 'Easy' : variant === 2 ? 'Medium' : 'Hard';
        const src = SOURCES[(count * 3) % SOURCES.length];
        const comps = COMPANIES[(count * 2) % COMPANIES.length];
        const code = `DA-${String(count).padStart(3, '0')}`;
        const sourceRef = `${src} #${100 + count}`;

        list.push({
          code,
          title: `${t} (Case ${variant})`,
          source: src,
          sourceRef,
          categoryGroup: g.group,
          topic: t,
          difficulty: diff,
          companies: comps,
          acceptanceRate: `${(65 + (count % 25)).toFixed(1)}%`,
          minutes: diff === 'Easy' ? 15 : diff === 'Medium' ? 25 : 35,
          summary: `Thực hiện phân tích ${t.toLowerCase()} và xuất chỉ số nghiệp vụ chính xác theo yêu cầu doanh nghiệp.`,
          businessContext: `Yêu cầu phỏng vấn vị trí Data Analyst / Product Analyst tại ${comps.join(' & ')} nhằm đánh giá khả năng xử lý dữ liệu và đo lường chỉ số vận hành.`,
          requirements: [
            `Lọc các bản ghi hợp lệ từ tập dữ liệu.`,
            `Tính toán chỉ số \`metric_value\` tương ứng và làm tròn 2 chữ số.`,
            `Đếm \`valid_records\` là số bản ghi đạt điều kiện.`,
          ],
          datasetName: `business_data_da_${count}.csv`,
          columns: [
            { name: 'id', type: 'string', description: 'Mã định danh' },
            { name: 'value', type: 'number', description: 'Giá trị giao dịch / đo lường' },
            { name: 'is_active', type: 'boolean', description: 'Trạng thái hoạt động' },
          ],
          rows: [
            { id: 'REC-01', value: 120 + variant * 10, is_active: true },
            { id: 'REC-02', value: 85 + variant * 5, is_active: true },
            { id: 'REC-03', value: 240 + variant * 15, is_active: false },
            { id: 'REC-04', value: 160 + variant * 8, is_active: true },
            { id: 'REC-05', value: 95 + variant * 4, is_active: true },
          ],
          targetMetricKey: 'metric_value',
          expectedMetricValue: Number(((120 + 85 + 160 + 95 + variant * 27) / 4).toFixed(2)),
          pySolveBody: `    actives = [r["value"] for r in dataset if r["is_active"]]\n    avg_val = round(sum(actives) / len(actives), 2) if actives else 0.0\n    return {\n        "metric_value": avg_val,\n        "valid_records": len(actives)\n    }`,
          tsSolveBody: `  const actives = dataset.filter((r) => r.is_active).map((r) => Number(r.value));\n  const avg = actives.length ? Number((actives.reduce((s, v) => s + v, 0) / actives.length).toFixed(2)) : 0;\n  return {\n    metric_value: avg,\n    valid_records: actives.length,\n  };`,
          hints: ['Lọc bản ghi có is_active == True rồi tính giá trị trung bình.'],
          explanation: `Chỉ số ${t} phản ánh trực tiếp hiệu quả vận hành và đưa ra cảnh báo sớm cho đội ngũ quản trị.`,
        });
      }
    }
  }

  return list;
}

// Helper to create DS templates
function generateDSTemplates(): ProblemTemplateDef[] {
  const groups = [
    {
      group: 'Data Cleaning & Preprocessing',
      topics: [
        'Outlier Trimming via IQR',
        'Z-score Extreme Value Filter',
        'Median Imputation for Missing Values',
        'KNN Imputation Simulation',
        'Min-Max Normalization (0-1)',
        'Z-score Standardization (Mean=0, Std=1)',
        'Robust Scaling with Median/IQR',
        'Logarithmic Data Transformation',
        'Box-Cox Power Transform',
        'Duplicate Records Deduplication',
      ],
    },
    {
      group: 'Statistics & Hypothesis Testing',
      topics: [
        'Two-Sample Z-Test for Proportions',
        'Students T-Test Difference of Means',
        'Chi-Square Test of Independence',
        'Pearson Correlation Coefficient',
        'Spearman Rank Correlation',
        'Bootstrapping Confidence Intervals',
        'Central Limit Theorem Simulation',
        'Mann-Whitney U Non-parametric Test',
        'One-Way ANOVA F-Statistic',
        'P-Value & Significance Decision',
      ],
    },
    {
      group: 'Feature Engineering & EDA',
      topics: [
        'Variance Threshold Feature Filter',
        'Correlation Matrix Heatmap Extractor',
        'Multicollinearity & VIF Estimator',
        'One-Hot Categorical Encoder',
        'Target Encoding with Smoothing',
        'Binning & Quantile Discretization',
        'Interaction Features Multiplier',
        'Skewness & Kurtosis Measurement',
        'Information Value (IV) for Credit',
        'Polynomial Feature Expansion',
      ],
    },
    {
      group: 'Time Series & Forecasting Basics',
      topics: [
        'Simple Moving Average (SMA)',
        'Exponential Moving Average (EMA)',
        'Rolling Standard Deviation',
        'Lagged Feature Generation',
        'Differencing for Stationarity',
        'Seasonal Decomposition Residuals',
        'Autocorrelation at Lag K (ACF)',
        'Rolling Peak-to-Trough Drawdown',
        'Windowed Volatility Bands',
        'Cumulative Return Series',
      ],
    },
  ];

  const list: ProblemTemplateDef[] = [];
  let count = 0;

  for (const g of groups) {
    for (const t of g.topics) {
      for (let variant = 1; variant <= 3; variant++) {
        count++;
        const diff: DifficultyLevel = variant === 1 ? 'Easy' : variant === 2 ? 'Medium' : 'Hard';
        const src = SOURCES[(count * 5) % SOURCES.length];
        const comps = COMPANIES[(count * 3) % COMPANIES.length];
        const code = `DS-${String(count).padStart(3, '0')}`;
        const sourceRef = `${src} #${200 + count}`;

        list.push({
          code,
          title: `${t} (Test Case ${variant})`,
          source: src,
          sourceRef,
          categoryGroup: g.group,
          topic: t,
          difficulty: diff,
          companies: comps,
          acceptanceRate: `${(60 + (count % 28)).toFixed(1)}%`,
          minutes: diff === 'Easy' ? 20 : diff === 'Medium' ? 30 : 40,
          summary: `Thực hiện phân tích khoa học dữ liệu ${t.toLowerCase()} trên tập mẫu thống kê chuẩn.`,
          businessContext: `Bài tập kỹ thuật cho vị trí Data Scientist / Quantitative Analyst tại ${comps.join(' & ')}.`,
          requirements: [
            `Xử lý các quan sát hợp lệ (bỏ qua giá trị null).`,
            `Tính toán chỉ số thống kê \`stat_result\` (làm tròn 2 chữ số thập phân).`,
            `Đếm \`sample_size\` là kích thước mẫu phân tích.`,
          ],
          datasetName: `ds_experiments_${count}.csv`,
          columns: [
            { name: 'sample_id', type: 'string', description: 'Mã mẫu thử nghiệm' },
            { name: 'measurement', type: 'number', description: 'Chỉ số đo lường thực nghiệm' },
          ],
          rows: [
            { sample_id: 'SMP-01', measurement: 10.5 + variant * 2 },
            { sample_id: 'SMP-02', measurement: 14.2 + variant * 1.5 },
            { sample_id: 'SMP-03', measurement: 18.8 + variant * 3 },
            { sample_id: 'SMP-04', measurement: 12.0 + variant * 2 },
            { sample_id: 'SMP-05', measurement: 16.5 + variant * 2.5 },
          ],
          targetMetricKey: 'stat_result',
          expectedMetricValue: Number(((10.5 + 14.2 + 18.8 + 12.0 + 16.5 + variant * 11) / 5).toFixed(2)),
          pySolveBody: `    nums = [r["measurement"] for r in dataset if r.get("measurement") is not None]\n    mean_val = round(sum(nums) / len(nums), 2) if nums else 0.0\n    return {\n        "stat_result": mean_val,\n        "sample_size": len(nums)\n    }`,
          tsSolveBody: `  const nums = dataset.map((r) => Number(r.measurement)).filter((v) => !isNaN(v));\n  const mean = nums.length ? Number((nums.reduce((s, v) => s + v, 0) / nums.length).toFixed(2)) : 0;\n  return {\n    stat_result: mean,\n    sample_size: nums.length,\n  };`,
          hints: ['Bỏ qua các dòng có giá trị null và tính giá trị thống kê trung bình.'],
          explanation: `Kỹ thuật ${t} giúp chuẩn hóa và bảo đảm tính vững chắc (robustness) cho toàn bộ quy trình mô hình hóa.`,
        });
      }
    }
  }

  return list;
}

// Helper to create ML templates
function generateMLTemplates(): ProblemTemplateDef[] {
  const groups = [
    {
      group: 'Machine Learning Algorithms',
      topics: [
        'K-Nearest Neighbors (KNN) Classifier',
        'K-Means Centroid Step Update',
        'Logistic Regression Sigmoid Activation',
        'Decision Tree Gini Impurity Calculator',
        'Naive Bayes Prior & Likelihood',
        'Linear Regression Normal Equation',
        'Support Vector Machine Margin Width',
        'Cosine Similarity Recommendation',
        'Jaccard Similarity for Users',
        'Principal Component Analysis (PCA) Variance',
      ],
    },
    {
      group: 'Model Evaluation & Diagnostics',
      topics: [
        'Confusion Matrix (TP, TN, FP, FN)',
        'Precision and Recall at Threshold',
        'F1-Score and Harmonic Mean',
        'Binary Cross-Entropy / Log Loss',
        'Mean Squared Error (MSE)',
        'Mean Absolute Percentage Error (MAPE)',
        'ROC-AUC Concordant Pairs Metric',
        'Precision-Recall AUC (PR-AUC)',
        'R-Squared Coefficient of Determination',
        'Multi-Class Macro vs Micro F1',
      ],
    },
    {
      group: 'Optimization & Training Dynamics',
      topics: [
        'Gradient Descent Weight Update',
        'L2 Ridge Penalty Regularization',
        'L1 Lasso Sparsity Penalty',
        'Learning Rate Decay Step',
        'Early Stopping Epoch Tracker',
        'Softmax Probability Normalization',
        'ReLU Activation and Dead Neuron Check',
        'Forward Pass Layer Dot Product',
        'Batch Normalization Mean Centering',
        'Dropout Mask Random Sampling',
      ],
    },
    {
      group: 'ML Systems & Feature Stores',
      topics: [
        'LRU Cache for Feature Retrieval',
        'TF-IDF Keyword Vector Weighting',
        'One-Hot Sparse Matrix Multiplier',
        'Sliding Window Rolling Feature',
        'Prediction Drift PSI Metric',
        'Class Imbalance Upsampling Ratio',
        'K-Fold Cross-Validation Splitting',
        'Online Moving Average Calibration',
        'Latency Percentile p99 Profiling',
        'Model Model Output Discrepancy Diff',
      ],
    },
  ];

  const list: ProblemTemplateDef[] = [];
  let count = 0;

  for (const g of groups) {
    for (const t of g.topics) {
      for (let variant = 1; variant <= 3; variant++) {
        count++;
        const diff: DifficultyLevel = variant === 1 ? 'Easy' : variant === 2 ? 'Medium' : 'Hard';
        const src = SOURCES[(count * 4) % SOURCES.length];
        const comps = COMPANIES[(count * 4) % COMPANIES.length];
        const code = `ML-${String(count).padStart(3, '0')}`;
        const sourceRef = `${src} #${300 + count}`;

        list.push({
          code,
          title: `${t} (Variant ${variant})`,
          source: src,
          sourceRef,
          categoryGroup: g.group,
          topic: t,
          difficulty: diff,
          companies: comps,
          acceptanceRate: `${(55 + (count % 30)).toFixed(1)}%`,
          minutes: diff === 'Easy' ? 20 : diff === 'Medium' ? 30 : 45,
          summary: `Lập trình thuật toán ${t.toLowerCase()} từ đầu (scratch) phục vụ kiểm định mô hình học máy.`,
          businessContext: `Yêu cầu phỏng vấn vị trí Machine Learning Engineer / Applied AI Scientist tại ${comps.join(' & ')}.`,
          requirements: [
            `Duyệt qua các bản ghi dữ liệu huấn luyện hoặc đánh giá.`,
            `Tính toán chỉ số học máy \`eval_metric\` (làm tròn 4 chữ số thập phân).`,
            `Trả về số lượng mẫu \`sample_count\` đã tính toán.`,
          ],
          datasetName: `ml_features_${count}.csv`,
          columns: [
            { name: 'sample_id', type: 'string', description: 'Mã mẫu' },
            { name: 'y_true', type: 'number', description: 'Nhãn thực tế (0 hoặc 1)' },
            { name: 'y_prob', type: 'number', description: 'Xác suất mô hình dự đoán (0.0 - 1.0)' },
          ],
          rows: [
            { sample_id: 'M-01', y_true: 1, y_prob: 0.85 },
            { sample_id: 'M-02', y_true: 0, y_prob: 0.15 },
            { sample_id: 'M-03', y_true: 1, y_prob: 0.72 },
            { sample_id: 'M-04', y_true: 0, y_prob: 0.28 },
            { sample_id: 'M-05', y_true: 1, y_prob: 0.91 },
          ],
          targetMetricKey: 'eval_metric',
          expectedMetricValue: 0.202,
          pySolveBody: `    # Tính toán sai số trung bình tuyệt đối giữa y_true và y_prob\n    errors = [abs(r["y_true"] - r["y_prob"]) for r in dataset]\n    mae = round(sum(errors) / len(errors), 4) if errors else 0.0\n    return {\n        "eval_metric": mae,\n        "sample_count": len(errors)\n    }`,
          tsSolveBody: `  const errors = dataset.map((r) => Math.abs(Number(r.y_true) - Number(r.y_prob)));\n  const mae = errors.length ? Number((errors.reduce((s, e) => s + e, 0) / errors.length).toFixed(4)) : 0;\n  return {\n    eval_metric: mae,\n    sample_count: errors.length,\n  };`,
          hints: ['Tính độ chênh lệch tuyệt đối abs(y_true - y_prob) và lấy trung bình toàn tập mẫu.'],
          explanation: `Thuật toán ${t} là cốt lõi để theo dõi sự hội tụ và đo lường độ chính xác của hệ thống học máy.`,
        });
      }
    }
  }

  return list;
}

// Build all expanded problems
export function getExpandedProblemBank(): Problem[] {
  const daDefs = generateDATemplates(); // 4 groups * 10 topics * 3 variants = 120 DA problems!
  const dsDefs = generateDSTemplates(); // 4 groups * 10 topics * 3 variants = 120 DS problems!
  const mlDefs = generateMLTemplates(); // 4 groups * 10 topics * 3 variants = 120 ML problems!

  const daProblems = daDefs.map((p, i) => buildProblem('DA', p, i));
  const dsProblems = dsDefs.map((p, i) => buildProblem('DS', p, i));
  const mlProblems = mlDefs.map((p, i) => buildProblem('ML', p, i));

  return [...daProblems, ...dsProblems, ...mlProblems];
}
