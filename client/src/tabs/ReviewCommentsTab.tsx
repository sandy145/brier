import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { ReviewComment } from "../types";

const STATUS_STYLES: Record<ReviewComment["status"], string> = {
  open: "bg-amber-50 text-amber-700",
  addressed: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

export function ReviewCommentsTab({
  permitId,
  reviewComments,
  refresh,
}: {
  permitId: string;
  reviewComments: ReviewComment[];
  refresh: () => void;
}) {
  const sorted = [...reviewComments].sort(
    (a, b) => b.reviewRound - a.reviewRound || a.discipline.localeCompare(b.discipline)
  );

  return (
    <EntityPanel
      title="Plan review comments"
      description="Corrections the City has asked for, tracked to resolution."
      items={sorted}
      emptyLabel="No review comments logged yet."
      fields={[
        { name: "reviewRound", label: "Review round", kind: "number", defaultValue: 1, required: true },
        { name: "discipline", label: "Discipline", placeholder: "e.g. Zoning, Building, Plumbing", required: true },
        { name: "commentText", label: "Comment", kind: "textarea", required: true },
        { name: "dateIssued", label: "Date issued", kind: "date", required: true },
        {
          name: "status",
          label: "Status",
          kind: "select",
          defaultValue: "open",
          options: [
            { value: "open", label: "Open" },
            { value: "addressed", label: "Addressed (revision submitted)" },
            { value: "resolved", label: "Resolved (City signed off)" },
          ],
        },
      ]}
      onAdd={async (values) => {
        await api.addReviewComment(permitId, values as Partial<ReviewComment>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteReviewComment(id);
        refresh();
      }}
      renderRow={(c) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              Round {c.reviewRound} · {c.discipline}
            </span>
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[c.status]}`}>
              {c.status}
            </span>
          </div>
          <p className="text-sm text-slate-600">{c.commentText}</p>
          <p className="text-xs text-slate-400">
            Issued {c.dateIssued}
            {c.dateResolved ? ` · resolved ${c.dateResolved}` : ""}
          </p>
          {c.status !== "resolved" && (
            <button
              className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
              onClick={async () => {
                const next = c.status === "open" ? "addressed" : "resolved";
                await api.updateReviewComment(c.id, {
                  status: next,
                  dateResolved: next === "resolved" ? new Date().toISOString().slice(0, 10) : c.dateResolved,
                });
                refresh();
              }}
            >
              Mark {c.status === "open" ? "addressed" : "resolved"}
            </button>
          )}
        </div>
      )}
    />
  );
}
