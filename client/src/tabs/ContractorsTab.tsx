import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { Contractor } from "../types";

const TRADE_LABELS: Record<Contractor["trade"], string> = {
  general: "General",
  electrical: "Electrical",
  plumbing: "Plumbing",
  mechanical: "Mechanical",
  hvac: "HVAC",
  other: "Other",
};

export function ContractorsTab({
  permitId,
  contractors,
  refresh,
}: {
  permitId: string;
  contractors: Contractor[];
  refresh: () => void;
}) {
  return (
    <EntityPanel
      title="Contractors"
      description="Track each trade — who's doing the work and whether their credentials are on file."
      items={contractors}
      emptyLabel="No contractors added yet."
      fields={[
        {
          name: "trade",
          label: "Trade",
          kind: "select",
          required: true,
          options: Object.entries(TRADE_LABELS).map(([value, label]) => ({ value, label })),
        },
        {
          name: "status",
          label: "Status",
          kind: "select",
          required: true,
          options: [
            { value: "tbd", label: "TBD" },
            { value: "confirmed", label: "Confirmed" },
          ],
        },
        { name: "companyName", label: "Company name" },
        { name: "contactName", label: "Contact name" },
        { name: "licenseNumber", label: "WA contractor license #" },
        { name: "licenseExpiration", label: "License expiration", kind: "date" },
        { name: "ubiNumber", label: "UBI number" },
        { name: "cityBusinessLicenseConfirmed", label: "City business license confirmed", kind: "checkbox" },
        { name: "notes", label: "Notes", kind: "textarea" },
      ]}
      onAdd={async (values) => {
        await api.addContractor(permitId, values as Partial<Contractor>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteContractor(id);
        refresh();
      }}
      renderRow={(c) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{TRADE_LABELS[c.trade]}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                c.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {c.status === "confirmed" ? "Confirmed" : "TBD"}
            </span>
            {c.cityBusinessLicenseConfirmed && (
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
                City license OK
              </span>
            )}
          </div>
          {(c.companyName || c.contactName) && (
            <p className="text-sm text-slate-600">{[c.companyName, c.contactName].filter(Boolean).join(" — ")}</p>
          )}
          {(c.licenseNumber || c.ubiNumber) && (
            <p className="text-xs text-slate-500">
              {c.licenseNumber ? `Lic #${c.licenseNumber}` : ""}
              {c.licenseExpiration ? ` (exp. ${c.licenseExpiration})` : ""}
              {c.ubiNumber ? ` · UBI ${c.ubiNumber}` : ""}
            </p>
          )}
          {c.notes && <p className="mt-1 text-xs text-slate-500">{c.notes}</p>}
        </div>
      )}
    />
  );
}
