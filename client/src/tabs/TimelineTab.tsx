import { STATUS_LABELS } from "../types";
import type { PermitDetail } from "../types";

interface TimelineItem {
  date: string;
  kind: string;
  title: string;
  detail?: string;
  color: string;
}

export function TimelineTab({ detail }: { detail: PermitDetail }) {
  const items: TimelineItem[] = [
    ...detail.statusHistory.map((s) => ({
      date: s.changedAt,
      kind: "Status",
      title: `Status → ${STATUS_LABELS[s.status]}`,
      detail: s.note ?? undefined,
      color: "bg-indigo-500",
    })),
    ...detail.correspondence.map((c) => ({
      date: c.date,
      kind: c.direction === "inbound" ? "From City" : "Sent",
      title: c.subject || c.summary,
      detail: c.subject ? c.summary : undefined,
      color: c.direction === "inbound" ? "bg-blue-500" : "bg-slate-400",
    })),
    ...detail.payments.map((p) => ({
      date: p.paidDate ?? p.invoicedDate ?? detail.permit.createdAt,
      kind: "Payment",
      title: `${p.status === "paid" ? "Paid" : "Invoiced"}: $${p.amount.toFixed(2)} (${p.type.replace(/_/g, " ")})`,
      detail: p.notes ?? undefined,
      color: "bg-emerald-500",
    })),
    ...detail.reviewComments.map((r) => ({
      date: r.dateResolved ?? r.dateIssued,
      kind: "Review comment",
      title: `${r.discipline} — round ${r.reviewRound} (${r.status})`,
      detail: r.commentText,
      color: "bg-amber-500",
    })),
    ...detail.inspections
      .filter((i) => i.scheduledDate || i.completedDate)
      .map((i) => ({
        date: i.completedDate ?? i.scheduledDate!,
        kind: "Inspection",
        title: `${i.inspectionType} — ${i.result}`,
        detail: i.notes ?? undefined,
        color: "bg-teal-500",
      })),
  ]
    .filter((i) => i.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Nothing recorded yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-slate-200 pl-6">
      {items.map((item, idx) => (
        <li key={idx} className="relative">
          <span className={`absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full ${item.color}`} />
          <p className="text-xs text-slate-400">
            {new Date(item.date).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: item.date.includes("T") ? "short" : undefined,
            })}{" "}
            · {item.kind}
          </p>
          <p className="text-sm font-medium text-slate-900">{item.title}</p>
          {item.detail && <p className="text-sm text-slate-600">{item.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
