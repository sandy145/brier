import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { Inspection } from "../types";

const RESULT_STYLES: Record<Inspection["result"], string> = {
  pending: "bg-slate-100 text-slate-600",
  pass: "bg-emerald-50 text-emerald-700",
  fail: "bg-rose-50 text-rose-700",
  partial: "bg-amber-50 text-amber-700",
};

export function InspectionsTab({
  permitId,
  inspections,
  refresh,
}: {
  permitId: string;
  inspections: Inspection[];
  refresh: () => void;
}) {
  const sorted = [...inspections].sort((a, b) => (b.scheduledDate ?? "").localeCompare(a.scheduledDate ?? ""));

  return (
    <EntityPanel
      title="Inspections"
      description="Schedule and track required field inspections once the permit is issued."
      items={sorted}
      emptyLabel="No inspections scheduled yet."
      fields={[
        { name: "inspectionType", label: "Inspection type", required: true, placeholder: "e.g. Framing, Electrical rough-in" },
        { name: "scheduledDate", label: "Scheduled date", kind: "date" },
        { name: "inspectorName", label: "Inspector" },
        {
          name: "result",
          label: "Result",
          kind: "select",
          defaultValue: "pending",
          options: [
            { value: "pending", label: "Pending" },
            { value: "pass", label: "Pass" },
            { value: "fail", label: "Fail" },
            { value: "partial", label: "Partial" },
          ],
        },
        { name: "notes", label: "Notes", kind: "textarea" },
      ]}
      onAdd={async (values) => {
        await api.addInspection(permitId, values as Partial<Inspection>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteInspection(id);
        refresh();
      }}
      renderRow={(i) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{i.inspectionType}</span>
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${RESULT_STYLES[i.result]}`}>
              {i.result}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {i.scheduledDate ? `Scheduled ${i.scheduledDate}` : "Not yet scheduled"}
            {i.completedDate ? ` · completed ${i.completedDate}` : ""}
            {i.inspectorName ? ` · ${i.inspectorName}` : ""}
          </p>
          {i.notes && <p className="mt-1 text-xs text-slate-500">{i.notes}</p>}
          {i.result === "pending" && (
            <button
              className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
              onClick={async () => {
                await api.updateInspection(i.id, {
                  result: "pass",
                  completedDate: new Date().toISOString().slice(0, 10),
                });
                refresh();
              }}
            >
              Mark passed
            </button>
          )}
        </div>
      )}
    />
  );
}
