export type EvaluationStatus = 'completed' | 'needs_review' | 'analyzing' | 'draft';

export interface EvaluationItem {
  id: string;
  projectName: string;
  groupName: string;
  submittedAt: string;
  submissionRound: string;
  authors: string[];
  status: EvaluationStatus;
  proposedScore?: number; // e.g. 8.23
  itemsToReview?: number | string; // e.g. 3 mục, 'Đang xử lý', 'Hoàn tất'
  classCode: string; // e.g. 'Đồ án chuyên ngành · HK261'
  reportFileName?: string;
  reportFileSize?: string;
  reportPages?: number;
  sourceFileName?: string;
  sourceFileSize?: string;
  sourceFileCount?: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // e.g. 15 for 15%
  maxScore: number; // e.g. 10
  score?: number; // e.g. 8.5
  evidenceCount?: number;
}

export interface RubricConfig {
  id: string;
  name: string;
  scoreScale: string;
  appliedClass: string;
  evaluationCountPerCriterion: number; // e.g. 3
  showVariance: boolean;
  escalateOnDisagreement: boolean;
  enableCodeAudit: boolean;
  enableAiSignal: boolean;
  criteria: RubricCriterion[];
}

export type CitationStatus = 'SUPPORT' | 'REFUTE' | 'NEI';

export interface CitationClaim {
  id: string;
  claimCode: string; // e.g. '[07]'
  title: string; // e.g. 'Kết quả thực nghiệm'
  claimText: string;
  status: CitationStatus;
  reportLocation: string; // e.g. 'bao-cao-nhom-08.pdf · Trang 12 · Mục 3.2 · [07]'
  sourceQuote: string;
  sourceLocation: string; // e.g. 'Nguồn [07] · Toàn văn · Trang 6 · Bảng 2'
  verdict: string; // e.g. 'Kết luận: claim khái quát vượt quá kết quả nguồn.'
  confidence: string; // 'cao · Đã đối chiếu toàn văn'
  note?: string;
  viewed?: boolean;
}

export type CodeAuditStatus = 'MATCH' | 'CLARIFY' | 'MISMATCH';

export interface CodeAuditClaim {
  id: string;
  claimCode: string; // e.g. 'CLAIM #09 · TRANG 18, MỤC 4.1'
  reportStatement: string;
  status: 'mismatch' | 'clarify' | 'match';
  findingDescription: string;
  sourceCodeFile: string; // e.g. 'src/train.py · dòng 42-47 · commit a31f8c2'
  sourceCodeSnippet: string;
  tracePath: string; // e.g. 'Truy vết: cấu hình → optimizer → lời gọi train()'
  executionStatus: string; // 'Chưa chạy'
}

export type AiSignalLevel = 'low' | 'moderate' | 'high';

export interface AiSignalAnalysis {
  level: AiSignalLevel;
  levelLabel: string; // 'Moderate · Trung bình'
  confidence: string; // 'Trung bình'
  recommendation: string;
  language: string; // 'Tiếng Việt'
  domain: string; // 'Báo cáo kỹ thuật CSE'
  analyzedWordCount: number; // 6420
  thresholdTuning: string; // 'Theo miền · FPR mục tiêu 5%'
  note: string;
  segments: {
    id: string;
    text: string;
    signalType: 'low' | 'moderate' | 'high';
  }[];
  warningReasons: string[];
}
