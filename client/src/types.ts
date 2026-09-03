export const PERMIT_STATUSES = [
  "draft",
  "submitted",
  "intake_review",
  "info_requested",
  "deposit_invoiced",
  "deposit_paid",
  "plan_review",
  "corrections_issued",
  "revisions_submitted",
  "re_review",
  "approved",
  "permit_issued",
  "inspections",
  "finaled",
  "closed",
  "withdrawn",
] as const;

export type PermitStatus = (typeof PERMIT_STATUSES)[number];

export const STATUS_LABELS: Record<PermitStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  intake_review: "Intake Review",
  info_requested: "Info Requested",
  deposit_invoiced: "Deposit Invoiced",
  deposit_paid: "Deposit Paid",
  plan_review: "Plan Review",
  corrections_issued: "Corrections Issued",
  revisions_submitted: "Revisions Submitted",
  re_review: "Re-Review",
  approved: "Approved",
  permit_issued: "Permit Issued",
  inspections: "Inspections",
  finaled: "Finaled",
  closed: "Closed",
  withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<PermitStatus, string> = {
  draft: "bg-slate-200 text-slate-700",
  submitted: "bg-blue-100 text-blue-800",
  intake_review: "bg-blue-100 text-blue-800",
  info_requested: "bg-amber-100 text-amber-800",
  deposit_invoiced: "bg-amber-100 text-amber-800",
  deposit_paid: "bg-blue-100 text-blue-800",
  plan_review: "bg-indigo-100 text-indigo-800",
  corrections_issued: "bg-amber-100 text-amber-800",
  revisions_submitted: "bg-indigo-100 text-indigo-800",
  re_review: "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  permit_issued: "bg-emerald-100 text-emerald-800",
  inspections: "bg-teal-100 text-teal-800",
  finaled: "bg-emerald-200 text-emerald-900",
  closed: "bg-slate-200 text-slate-700",
  withdrawn: "bg-rose-100 text-rose-800",
};

export const PROGRESS_STATUSES: PermitStatus[] = [
  "submitted",
  "intake_review",
  "deposit_paid",
  "plan_review",
  "revisions_submitted",
  "approved",
  "permit_issued",
  "inspections",
  "finaled",
];

/**
 * Maps every status onto the progress bar above: the index of the last
 * main-line step reached. Branch statuses (waiting on a person, blocked,
 * looping back for another look) map onto the step they're waiting within
 * rather than getting a slot of their own.
 */
export const PROGRESS_INDEX: Record<PermitStatus, number> = {
  draft: -1,
  submitted: 0,
  intake_review: 1,
  info_requested: 0,
  deposit_invoiced: 1,
  deposit_paid: 2,
  plan_review: 3,
  corrections_issued: 3,
  revisions_submitted: 4,
  re_review: 4,
  approved: 5,
  permit_issued: 6,
  inspections: 7,
  finaled: 8,
  closed: 8,
  withdrawn: -1,
};

export interface Permit {
  id: string;
  permitNumber: string | null;
  jurisdiction: string;
  projectAddress: string;
  projectDescription: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string | null;
  ownerIsContractor: boolean;
  status: PermitStatus;
  submittedDate: string | null;
  cityContactName: string | null;
  cityContactEmail: string | null;
  cityContactPhone: string | null;
  planReviewDepositAmount: number | null;
  reviewTimeWeeksMin: number | null;
  reviewTimeWeeksMax: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ContactRole = "city_reviewer" | "applicant" | "other";

export interface Contact {
  id: string;
  permitId: string;
  role: ContactRole;
  name: string;
  email: string | null;
  phone: string | null;
  organization: string | null;
}

export type ContractorTrade = "general" | "electrical" | "plumbing" | "mechanical" | "hvac" | "other";
export type ContractorStatus = "tbd" | "confirmed";

export interface Contractor {
  id: string;
  permitId: string;
  trade: ContractorTrade;
  companyName: string | null;
  contactName: string | null;
  licenseNumber: string | null;
  licenseExpiration: string | null;
  ubiNumber: string | null;
  cityBusinessLicenseConfirmed: boolean;
  status: ContractorStatus;
  notes: string | null;
}

export type DocumentCategory =
  | "application"
  | "plans"
  | "energy_code"
  | "window_door_schedule"
  | "comment_letter"
  | "permit_package"
  | "other";
export type DocumentDirection = "submitted" | "received";

export interface DocumentRecord {
  id: string;
  permitId: string;
  filename: string;
  category: DocumentCategory;
  direction: DocumentDirection;
  date: string | null;
  notes: string | null;
}

export type CorrespondenceDirection = "inbound" | "outbound";

export interface CorrespondenceEntry {
  id: string;
  permitId: string;
  direction: CorrespondenceDirection;
  fromAddr: string;
  toAddr: string;
  subject: string;
  summary: string;
  date: string;
  gmailThreadId: string | null;
}

export type ReviewCommentStatus = "open" | "addressed" | "resolved";

export interface ReviewComment {
  id: string;
  permitId: string;
  reviewRound: number;
  discipline: string;
  commentText: string;
  status: ReviewCommentStatus;
  dateIssued: string;
  dateResolved: string | null;
}

export type PaymentType = "plan_review_deposit" | "permit_fee" | "other";
export type PaymentMethod = "check" | "cash" | "card" | "other";
export type PaymentStatus = "invoiced" | "paid";

export interface Payment {
  id: string;
  permitId: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod | null;
  status: PaymentStatus;
  invoicedDate: string | null;
  paidDate: string | null;
  payee: string | null;
  notes: string | null;
}

export type InspectionResult = "pending" | "pass" | "fail" | "partial";

export interface Inspection {
  id: string;
  permitId: string;
  inspectionType: string;
  scheduledDate: string | null;
  completedDate: string | null;
  result: InspectionResult;
  inspectorName: string | null;
  notes: string | null;
}

export interface StatusHistoryEntry {
  id: string;
  permitId: string;
  status: PermitStatus;
  changedAt: string;
  note: string | null;
}

export interface PermitDetail {
  permit: Permit;
  contacts: Contact[];
  contractors: Contractor[];
  documents: DocumentRecord[];
  correspondence: CorrespondenceEntry[];
  reviewComments: ReviewComment[];
  payments: Payment[];
  inspections: Inspection[];
  statusHistory: StatusHistoryEntry[];
}
