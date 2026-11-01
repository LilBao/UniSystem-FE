export type EvaluationStatus = 'completed' | 'needs_review' | 'analyzing' | 'draft';

export interface EvaluationItem {
  id: string;
  submissionId?: string;
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

export type GlobalRole = 'user' | 'student' | 'instructor' | 'admin';
export type CourseRole = 'instructor' | 'ta' | 'student' | 'reviewer';
export type GroupRole = 'leader' | 'member';

export type Permission =
  | 'user:read'
  | 'user:manage'
  | 'audit:read'
  | 'course:create'
  | 'course:read'
  | 'course:update'
  | 'course:manage_members'
  | 'project:read'
  | 'project:manage'
  | 'group:create'
  | 'group:read'
  | 'group:manage_members'
  | 'rubric:read'
  | 'rubric:manage'
  | 'rubric:publish'
  | 'submission:create'
  | 'submission:read'
  | 'submission:upload'
  | 'submission:submit'
  | 'pipeline:run'
  | 'pipeline:read'
  | 'evaluation:read'
  | 'evaluation:override'
  | 'evaluation:publish';

export interface RegisterRequest {
  email: string;
  display_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface CourseMembershipSummary {
  course_id: string;
  course_code?: string | null;
  course_name?: string | null;
  term?: string | null;
  role: CourseRole;
  permissions: Permission[];
}

export interface GroupMembershipSummary {
  group_id: string;
  project_id: string;
  group_name?: string | null;
  role: GroupRole;
  permissions: Permission[];
}

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
  global_role: GlobalRole;
  is_active: boolean;
  permissions: Permission[];
  created_at?: string | null;
}

export interface UserProfileResponse extends UserResponse {
  course_memberships: CourseMembershipSummary[];
  group_memberships: GroupMembershipSummary[];
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_expires_in: number;
  user: UserResponse;
}

export interface UpdateGlobalRoleRequest {
  global_role: GlobalRole;
  is_active?: boolean | null;
}

export interface AssignCourseRoleRequest {
  role: CourseRole;
}

export interface CourseMembershipResponse {
  course_id: string;
  user_id: string;
  role: CourseRole;
  permissions: Permission[];
}

export interface AssignGroupRoleRequest {
  role: GroupRole;
}

export interface GroupMembershipResponse {
  group_id: string;
  project_id: string;
  user_id: string;
  role: GroupRole;
  permissions: Permission[];
}

export interface PermissionCheckRequest {
  permission: Permission;
  course_id?: string | null;
  project_id?: string | null;
  group_id?: string | null;
  submission_id?: string | null;
}

export interface PermissionCheckResponse {
  allowed: boolean;
  permission: Permission;
  reason: string;
  matched_roles: string[];
  effective_permissions: Permission[];
  course_id?: string | null;
  project_id?: string | null;
  group_id?: string | null;
  submission_id?: string | null;
}

export interface PermissionMatrixResponse {
  global_roles: Record<string, Permission[]>;
  course_roles: Record<string, Permission[]>;
  group_roles: Record<string, Permission[]>;
}

// Submissions, Artifacts & File Uploads
export type UploadArtifactKind = 'report_pdf' | 'source_archive';

export interface SubmissionCreate {
  project_id: string;
  group_id: string;
  submitted_by_user_id: string;
  rubric_version_id: string;
  attempt_no?: number;
}

export interface SubmissionResponse extends SubmissionCreate {
  id: string;
  status: string;
}

export interface ArtifactCreate {
  kind: UploadArtifactKind;
  version_no?: number;
  object_uri: string;
  media_type: string;
  byte_size: number;
  sha256: string;
  metadata?: Record<string, unknown>;
}

export interface ArtifactResponse extends ArtifactCreate {
  id: string;
  submission_id: string | null;
}

export interface CloudinaryUploadResponse {
  provider: string;
  submission_id: string;
  kind: UploadArtifactKind;
  asset_id: string;
  public_id: string;
  resource_type: string;
  delivery_type: string;
  object_uri: string;
  secure_url: string;
  original_filename: string;
  media_type: string;
  byte_size: number;
  sha256: string;
}

export interface PipelineRunResponse {
  id: string;
  submission_id: string;
  pipeline: string;
  status: string;
  input_fingerprint: string;
  attempt_no: number;
}

// Reference Resolution (Pipeline 2 Prep)
export interface ReferenceResolutionSummary {
  total: number;
  resolved: number;
  ambiguous: number;
  not_found: number;
  unresolved: number;
}

// Pipeline 3: Code-Report Consistency & Visual Graph
export type CodeConsistencyVerdict = 'CONSISTENT' | 'INCONSISTENT' | 'PARTIAL' | 'NEI';
export type HighlightKind =
  | 'CENTRAL_CONCEPT'
  | 'CORE_ALGORITHM'
  | 'KEY_ENTRYPOINT'
  | 'CORE_FEATURE'
  | 'MISMATCH_STRUCTURAL'
  | 'MISMATCH_SEMANTIC'
  | 'MISMATCH_EXECUTION';
export type HighlightSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface CodeLocationSpan {
  path: string;
  start_line: number;
  end_line: number;
}

export interface MismatchWitness {
  claim_id: string;
  claim_text: string;
  report_location: Record<string, unknown>;
  code_location: CodeLocationSpan;
  code_snippet: string;
  mismatch_type: HighlightKind;
  severity: HighlightSeverity;
  expected_behavior: string;
  actual_behavior: string;
  rationale: string;
}

export interface VisualGraphNodeData {
  label: string;
  kind: 'CLAIM' | 'FILE' | 'CLASS' | 'FUNCTION' | 'ENTRYPOINT';
  status: 'consistent' | 'mismatch' | 'unsupported' | 'neutral';
  is_important: boolean;
  importance_score: number;
  has_mismatch: boolean;
  location: Record<string, unknown>;
  snippet?: string | null;
  cluster_id?: string | null;
  cluster_name?: string | null;
  role?: string | null;
}

export interface VisualGraphNode {
  id: string;
  type: 'claim_node' | 'code_node' | 'cluster_group';
  data: VisualGraphNodeData;
}

export interface VisualGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'verifies_against' | 'calls' | 'imports' | 'defines';
  is_mismatch: boolean;
  severity?: HighlightSeverity | null;
  discrepancy_details?: string | null;
  label?: string | null;
  is_aggregated: boolean;
}

export interface VisualGraphMetrics {
  total_nodes: number;
  total_edges: number;
  important_nodes_count: number;
  mismatched_nodes_count: number;
  mismatched_edges_count: number;
  consistency_score: number;
}

export type GraphFilterMode = 'all' | 'mismatches_only' | 'important_only';

export interface VisualGraphResponse {
  submission_id: string;
  run_id?: string | null;
  nodes: VisualGraphNode[];
  edges: VisualGraphEdge[];
  metrics: VisualGraphMetrics;
  mismatch_witnesses: MismatchWitness[];
}

export interface HealthResponse {
  status: string;
}
