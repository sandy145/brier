import { useState } from "react";
import { api } from "../api";
import { PERMIT_STATUSES, STATUS_LABELS, type Permit } from "../types";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

export function OverviewTab({ permit, refresh }: { permit: Permit; refresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(permit);
  const [statusNote, setStatusNote] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveEdits() {
    setSaving(true);
    try {
      await api.updatePermit(permit.id, form);
      setEditing(false);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Project details</h3>
          <button
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setForm(permit);
              setEditing((e) => !e);
            }}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editing ? (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Permit number" value={permit.permitNumber} />
            <Field label="Jurisdiction" value={permit.jurisdiction} />
            <Field label="Project address" value={permit.projectAddress} />
            <Field label="Submitted date" value={permit.submittedDate} />
            <div className="sm:col-span-2">
              <Field label="Project description" value={permit.projectDescription} />
            </div>
            <Field label="Applicant" value={permit.applicantName} />
            <Field label="Applicant email" value={permit.applicantEmail} />
            <Field label="Owner acting as GC" value={permit.ownerIsContractor ? "Yes" : "No"} />
            <Field label="City contact" value={permit.cityContactName} />
            <Field label="City contact email" value={permit.cityContactEmail} />
            <Field label="City contact phone" value={permit.cityContactPhone} />
            <Field
              label="Plan review deposit"
              value={permit.planReviewDepositAmount != null ? `$${permit.planReviewDepositAmount.toFixed(2)}` : null}
            />
            <Field
              label="Estimated review time"
              value={
                permit.reviewTimeWeeksMin && permit.reviewTimeWeeksMax
                  ? `${permit.reviewTimeWeeksMin}–${permit.reviewTimeWeeksMax} weeks`
                  : null
              }
            />
            <div className="sm:col-span-2">
              <Field label="Notes" value={permit.notes} />
            </div>
          </dl>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                ["permitNumber", "Permit number", "text"],
                ["jurisdiction", "Jurisdiction", "text"],
                ["projectAddress", "Project address", "text"],
                ["submittedDate", "Submitted date", "date"],
                ["applicantName", "Applicant", "text"],
                ["applicantEmail", "Applicant email", "text"],
                ["applicantPhone", "Applicant phone", "text"],
                ["cityContactName", "City contact", "text"],
                ["cityContactEmail", "City contact email", "text"],
                ["cityContactPhone", "City contact phone", "text"],
                ["planReviewDepositAmount", "Plan review deposit ($)", "number"],
                ["reviewTimeWeeksMin", "Review time min (weeks)", "number"],
                ["reviewTimeWeeksMax", "Review time max (weeks)", "number"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <input
                  type={type}
                  className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                  value={(form[key] as string | number | null) ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      [key]: type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value,
                    }))
                  }
                />
              </label>
            ))}
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Project description</span>
              <textarea
                className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                rows={2}
                value={form.projectDescription}
                onChange={(e) => setForm((f) => ({ ...f, projectDescription: e.target.value }))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={form.ownerIsContractor}
                onChange={(e) => setForm((f) => ({ ...f, ownerIsContractor: e.target.checked }))}
              />
              <span className="font-medium text-slate-700">Owner acting as general contractor</span>
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Notes</span>
              <textarea
                className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                rows={2}
                value={form.notes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>
            <div className="sm:col-span-2">
              <button
                onClick={saveEdits}
                disabled={saving}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Change status</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">New status</span>
            <select
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
            >
              <option value="" disabled>
                Select…
              </option>
              {PERMIT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[16rem] flex-1 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Note (optional)</span>
            <input
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Deposit paid at City Hall"
            />
          </label>
          <button
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
            onClick={async () => {
              if (!nextStatus) return;
              await api.setStatus(permit.id, nextStatus as Permit["status"], statusNote || undefined);
              setStatusNote("");
              setNextStatus("");
              refresh();
            }}
          >
            Update status
          </button>
        </div>
      </section>
    </div>
  );
}
