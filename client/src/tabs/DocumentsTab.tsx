import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { DocumentRecord } from "../types";

const CATEGORY_LABELS: Record<DocumentRecord["category"], string> = {
  application: "Application form",
  plans: "Plans",
  energy_code: "Energy code",
  window_door_schedule: "Window/door schedule",
  comment_letter: "Comment letter",
  permit_package: "Permit package",
  other: "Other",
};

export function DocumentsTab({
  permitId,
  documents,
  refresh,
}: {
  permitId: string;
  documents: DocumentRecord[];
  refresh: () => void;
}) {
  const sorted = [...documents].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <EntityPanel
      title="Documents"
      description="Plans, forms, and letters exchanged with the City."
      items={sorted}
      emptyLabel="No documents logged yet."
      fields={[
        { name: "filename", label: "File name", required: true, placeholder: "e.g. Floor plan.pdf" },
        {
          name: "category",
          label: "Category",
          kind: "select",
          required: true,
          options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
        },
        {
          name: "direction",
          label: "Direction",
          kind: "select",
          required: true,
          options: [
            { value: "submitted", label: "Submitted by applicant" },
            { value: "received", label: "Received from City" },
          ],
        },
        { name: "date", label: "Date", kind: "date" },
        { name: "notes", label: "Notes", kind: "textarea" },
      ]}
      onAdd={async (values) => {
        await api.addDocument(permitId, values as Partial<DocumentRecord>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteDocument(id);
        refresh();
      }}
      renderRow={(doc) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{doc.filename}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                doc.direction === "received" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {doc.direction === "received" ? "From City" : "Submitted"}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {CATEGORY_LABELS[doc.category]}
            {doc.date ? ` · ${doc.date}` : ""}
          </p>
          {doc.notes && <p className="mt-1 text-xs text-slate-500">{doc.notes}</p>}
        </div>
      )}
    />
  );
}
