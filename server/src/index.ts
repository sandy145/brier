import cors from "cors";
import express from "express";
import { permitsRouter } from "./routes/permits.js";
import { subResourceRouter } from "./routes/subresource.js";
import type {
  Contact,
  Contractor,
  CorrespondenceEntry,
  DocumentRecord,
  Inspection,
  Payment,
  ReviewComment,
} from "./types.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/permits", permitsRouter);

const contacts = subResourceRouter<Contact>("contacts", (b) => ({
  role: b.role ?? "other",
  name: b.name ?? "",
  email: b.email ?? null,
  phone: b.phone ?? null,
  organization: b.organization ?? null,
}));

const contractors = subResourceRouter<Contractor>("contractors", (b) => ({
  trade: b.trade ?? "general",
  companyName: b.companyName ?? null,
  contactName: b.contactName ?? null,
  licenseNumber: b.licenseNumber ?? null,
  licenseExpiration: b.licenseExpiration ?? null,
  ubiNumber: b.ubiNumber ?? null,
  cityBusinessLicenseConfirmed: b.cityBusinessLicenseConfirmed ?? false,
  status: b.status ?? "tbd",
  notes: b.notes ?? null,
}));

const documents = subResourceRouter<DocumentRecord>("documents", (b) => ({
  filename: b.filename ?? "untitled",
  category: b.category ?? "other",
  direction: b.direction ?? "submitted",
  date: b.date ?? null,
  notes: b.notes ?? null,
}));

const correspondence = subResourceRouter<CorrespondenceEntry>("correspondence", (b) => ({
  direction: b.direction ?? "outbound",
  fromAddr: b.fromAddr ?? "",
  toAddr: b.toAddr ?? "",
  subject: b.subject ?? "",
  summary: b.summary ?? "",
  date: b.date ?? new Date().toISOString(),
  gmailThreadId: b.gmailThreadId ?? null,
}));

const reviewComments = subResourceRouter<ReviewComment>("reviewComments", (b) => ({
  reviewRound: b.reviewRound ?? 1,
  discipline: b.discipline ?? "general",
  commentText: b.commentText ?? "",
  status: b.status ?? "open",
  dateIssued: b.dateIssued ?? new Date().toISOString(),
  dateResolved: b.dateResolved ?? null,
}));

const payments = subResourceRouter<Payment>("payments", (b) => ({
  type: b.type ?? "other",
  amount: b.amount ?? 0,
  method: b.method ?? null,
  status: b.status ?? "invoiced",
  invoicedDate: b.invoicedDate ?? null,
  paidDate: b.paidDate ?? null,
  payee: b.payee ?? null,
  notes: b.notes ?? null,
}));

const inspections = subResourceRouter<Inspection>("inspections", (b) => ({
  inspectionType: b.inspectionType ?? "general",
  scheduledDate: b.scheduledDate ?? null,
  completedDate: b.completedDate ?? null,
  result: b.result ?? "pending",
  inspectorName: b.inspectorName ?? null,
  notes: b.notes ?? null,
}));

app.use("/api/permits/:permitId/contacts", contacts.nested);
app.use("/api/contacts", contacts.flat);

app.use("/api/permits/:permitId/contractors", contractors.nested);
app.use("/api/contractors", contractors.flat);

app.use("/api/permits/:permitId/documents", documents.nested);
app.use("/api/documents", documents.flat);

app.use("/api/permits/:permitId/correspondence", correspondence.nested);
app.use("/api/correspondence", correspondence.flat);

app.use("/api/permits/:permitId/review-comments", reviewComments.nested);
app.use("/api/review-comments", reviewComments.flat);

app.use("/api/permits/:permitId/payments", payments.nested);
app.use("/api/payments", payments.flat);

app.use("/api/permits/:permitId/inspections", inspections.nested);
app.use("/api/inspections", inspections.flat);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`brier permits API listening on http://localhost:${PORT}`);
});
