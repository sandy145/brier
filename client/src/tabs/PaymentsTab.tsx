import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { Payment } from "../types";

const TYPE_LABELS: Record<Payment["type"], string> = {
  plan_review_deposit: "Plan review deposit",
  permit_fee: "Permit fee",
  other: "Other",
};

export function PaymentsTab({
  permitId,
  payments,
  refresh,
}: {
  permitId: string;
  payments: Payment[];
  refresh: () => void;
}) {
  return (
    <EntityPanel
      title="Payments & fees"
      items={payments}
      emptyLabel="No payments logged yet."
      fields={[
        {
          name: "type",
          label: "Type",
          kind: "select",
          required: true,
          options: Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
        },
        { name: "amount", label: "Amount ($)", kind: "number", required: true },
        {
          name: "status",
          label: "Status",
          kind: "select",
          required: true,
          options: [
            { value: "invoiced", label: "Invoiced" },
            { value: "paid", label: "Paid" },
          ],
        },
        {
          name: "method",
          label: "Method",
          kind: "select",
          options: [
            { value: "check", label: "Check" },
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "other", label: "Other" },
          ],
        },
        { name: "payee", label: "Payee" },
        { name: "invoicedDate", label: "Invoiced date", kind: "date" },
        { name: "paidDate", label: "Paid date", kind: "date" },
        { name: "notes", label: "Notes", kind: "textarea" },
      ]}
      onAdd={async (values) => {
        await api.addPayment(permitId, values as Partial<Payment>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deletePayment(id);
        refresh();
      }}
      renderRow={(p) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{TYPE_LABELS[p.type]}</span>
            <span className="font-mono text-sm text-slate-700">${p.amount.toFixed(2)}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                p.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {p.status === "paid" ? "Paid" : "Invoiced"}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {p.method ? `${p.method} · ` : ""}
            {p.payee ? `Payable to ${p.payee} · ` : ""}
            {p.invoicedDate ? `invoiced ${p.invoicedDate}` : ""}
            {p.paidDate ? ` · paid ${p.paidDate}` : ""}
          </p>
          {p.notes && <p className="mt-1 text-xs text-slate-500">{p.notes}</p>}
          {p.status !== "paid" && (
            <button
              className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
              onClick={async () => {
                await api.updatePayment(p.id, { status: "paid", paidDate: new Date().toISOString().slice(0, 10) });
                refresh();
              }}
            >
              Mark paid
            </button>
          )}
        </div>
      )}
    />
  );
}
