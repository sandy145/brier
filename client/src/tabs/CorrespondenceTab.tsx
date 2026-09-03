import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { CorrespondenceEntry } from "../types";

export function CorrespondenceTab({
  permitId,
  correspondence,
  refresh,
}: {
  permitId: string;
  correspondence: CorrespondenceEntry[];
  refresh: () => void;
}) {
  const sorted = [...correspondence].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <EntityPanel
      title="Correspondence log"
      description="Emails and calls with the City, kept in one timeline."
      items={sorted}
      emptyLabel="No correspondence logged yet."
      fields={[
        {
          name: "direction",
          label: "Direction",
          kind: "select",
          required: true,
          options: [
            { value: "outbound", label: "Sent by applicant" },
            { value: "inbound", label: "Received from City" },
          ],
        },
        { name: "date", label: "Date", kind: "date", required: true },
        { name: "fromAddr", label: "From", placeholder: "sender@example.com" },
        { name: "toAddr", label: "To", placeholder: "recipient@example.com" },
        { name: "subject", label: "Subject" },
        { name: "summary", label: "Summary", kind: "textarea", required: true },
        { name: "gmailThreadId", label: "Gmail thread ID (optional)" },
      ]}
      onAdd={async (values) => {
        await api.addCorrespondence(permitId, values as Partial<CorrespondenceEntry>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteCorrespondence(id);
        refresh();
      }}
      renderRow={(entry) => (
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                entry.direction === "inbound" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {entry.direction === "inbound" ? "From City" : "Sent"}
            </span>
            <span className="text-xs text-slate-500">{new Date(entry.date).toLocaleString()}</span>
          </div>
          {entry.subject && <p className="mt-1 text-sm font-medium text-slate-900">{entry.subject}</p>}
          <p className="text-sm text-slate-600">{entry.summary}</p>
          <p className="mt-1 text-xs text-slate-400">
            {entry.fromAddr} → {entry.toAddr}
          </p>
        </div>
      )}
    />
  );
}
