import { useState, type FormEvent } from "react";

export interface FieldDef {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "date" | "number" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
}

export function CrudForm({
  fields,
  onSubmit,
  submitLabel = "Add",
}: {
  fields: FieldDef[];
  onSubmit: (values: Record<string, string | number | boolean | null>) => Promise<void>;
  submitLabel?: string;
}) {
  const initial = Object.fromEntries(
    fields.map((f) => [f.name, f.defaultValue ?? (f.kind === "checkbox" ? false : "")])
  );
  const [values, setValues] = useState<Record<string, string | number | boolean>>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(name: string, value: string | number | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, string | number | boolean | null> = {};
      for (const f of fields) {
        const raw = values[f.name];
        if (f.kind === "number") {
          payload[f.name] = raw === "" ? null : Number(raw);
        } else if (f.kind === "checkbox") {
          payload[f.name] = Boolean(raw);
        } else {
          payload[f.name] = raw === "" ? null : raw;
        }
      }
      await onSubmit(payload);
      setValues(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <label
          key={f.name}
          className={`flex flex-col gap-1 text-sm ${f.kind === "textarea" ? "sm:col-span-2" : ""}`}
        >
          <span className="font-medium text-slate-700">{f.label}</span>
          {f.kind === "textarea" ? (
            <textarea
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              rows={2}
              placeholder={f.placeholder}
              required={f.required}
              value={String(values[f.name] ?? "")}
              onChange={(e) => setField(f.name, e.target.value)}
            />
          ) : f.kind === "select" ? (
            <select
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              required={f.required}
              value={String(values[f.name] ?? "")}
              onChange={(e) => setField(f.name, e.target.value)}
            >
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.kind === "checkbox" ? (
            <input
              type="checkbox"
              className="h-4 w-4 self-start rounded border-slate-300"
              checked={Boolean(values[f.name])}
              onChange={(e) => setField(f.name, e.target.checked)}
            />
          ) : (
            <input
              type={f.kind ?? "text"}
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder={f.placeholder}
              required={f.required}
              value={String(values[f.name] ?? "")}
              onChange={(e) => setField(f.name, e.target.value)}
            />
          )}
        </label>
      ))}
      <div className="sm:col-span-2">
        {error && <p className="mb-2 text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
