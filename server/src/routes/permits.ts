import { Router } from "express";
import { newId, nowIso, withDb, readOnlyDb } from "../store.js";
import { PERMIT_STATUSES, type Permit, type PermitStatus } from "../types.js";

export const permitsRouter = Router();

permitsRouter.get("/", (_req, res) => {
  const permits = readOnlyDb((db) => [...db.permits].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  res.json(permits);
});

permitsRouter.post("/", (req, res) => {
  const body = req.body ?? {};
  if (!body.projectAddress || !body.applicantName) {
    res.status(400).json({ error: "projectAddress and applicantName are required" });
    return;
  }
  const ts = nowIso();
  const permit: Permit = {
    id: newId(),
    permitNumber: body.permitNumber ?? null,
    jurisdiction: body.jurisdiction ?? "City of Brier",
    projectAddress: body.projectAddress,
    projectDescription: body.projectDescription ?? "",
    applicantName: body.applicantName,
    applicantEmail: body.applicantEmail ?? "",
    applicantPhone: body.applicantPhone ?? null,
    ownerIsContractor: body.ownerIsContractor ?? false,
    status: (body.status as PermitStatus) ?? "draft",
    submittedDate: body.submittedDate ?? null,
    cityContactName: body.cityContactName ?? null,
    cityContactEmail: body.cityContactEmail ?? null,
    cityContactPhone: body.cityContactPhone ?? null,
    planReviewDepositAmount: body.planReviewDepositAmount ?? null,
    reviewTimeWeeksMin: body.reviewTimeWeeksMin ?? null,
    reviewTimeWeeksMax: body.reviewTimeWeeksMax ?? null,
    notes: body.notes ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  withDb((db) => {
    db.permits.push(permit);
    db.statusHistory.push({
      id: newId(),
      permitId: permit.id,
      status: permit.status,
      changedAt: ts,
      note: "Permit record created",
    });
  });
  res.status(201).json(permit);
});

permitsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const data = readOnlyDb((db) => {
    const permit = db.permits.find((p) => p.id === id);
    if (!permit) return null;
    return {
      permit,
      contacts: db.contacts.filter((r) => r.permitId === id),
      contractors: db.contractors.filter((r) => r.permitId === id),
      documents: db.documents.filter((r) => r.permitId === id),
      correspondence: db.correspondence.filter((r) => r.permitId === id),
      reviewComments: db.reviewComments.filter((r) => r.permitId === id),
      payments: db.payments.filter((r) => r.permitId === id),
      inspections: db.inspections.filter((r) => r.permitId === id),
      statusHistory: db.statusHistory
        .filter((r) => r.permitId === id)
        .sort((a, b) => a.changedAt.localeCompare(b.changedAt)),
    };
  });
  if (!data) {
    res.status(404).json({ error: "Permit not found" });
    return;
  }
  res.json(data);
});

permitsRouter.patch("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};
  const updated = withDb((db) => {
    const permit = db.permits.find((p) => p.id === id);
    if (!permit) return null;
    Object.assign(permit, body, { id: permit.id, updatedAt: nowIso() });
    return permit;
  });
  if (!updated) {
    res.status(404).json({ error: "Permit not found" });
    return;
  }
  res.json(updated);
});

permitsRouter.post("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body ?? {};
  if (!PERMIT_STATUSES.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${PERMIT_STATUSES.join(", ")}` });
    return;
  }
  const ts = nowIso();
  const result = withDb((db) => {
    const permit = db.permits.find((p) => p.id === id);
    if (!permit) return null;
    permit.status = status;
    permit.updatedAt = ts;
    const entry = { id: newId(), permitId: id, status, changedAt: ts, note: note ?? null };
    db.statusHistory.push(entry);
    return { permit, entry };
  });
  if (!result) {
    res.status(404).json({ error: "Permit not found" });
    return;
  }
  res.status(201).json(result);
});

permitsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const removed = withDb((db) => {
    const idx = db.permits.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    db.permits.splice(idx, 1);
    (Object.keys(db) as (keyof typeof db)[]).forEach((key) => {
      if (key === "permits") return;
      // @ts-expect-error -- every other collection carries a permitId field
      db[key] = db[key].filter((item) => item.permitId !== id);
    });
    return true;
  });
  if (!removed) {
    res.status(404).json({ error: "Permit not found" });
    return;
  }
  res.status(204).end();
});
