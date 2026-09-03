import { useState, type ReactNode } from "react";
import { CrudForm, type FieldDef } from "./CrudForm";

export function EntityPanel<T extends { id: string }>({
  title,
  description,
  items,
  fields,
  onAdd,
  onDelete,
  renderRow,
  emptyLabel = "Nothing here yet.",
}: {
  title: string;
  description?: string;
  items: T[];
  fields: FieldDef[];
  onAdd: (values: Record<string, string | number | boolean | null>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  renderRow: (item: T) => ReactNode;
  emptyLabel?: string;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="shrink-0 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-md bg-slate-50 p-3">
          <CrudForm
            fields={fields}
            onSubmit={async (values) => {
              await onAdd(values);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">{renderRow(item)}</div>
              <button
                onClick={() => onDelete(item.id)}
                className="shrink-0 text-xs text-slate-400 hover:text-rose-600"
                title="Delete"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
