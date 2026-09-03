import { api } from "../api";
import { EntityPanel } from "../components/EntityPanel";
import type { Contact } from "../types";

const ROLE_LABELS: Record<Contact["role"], string> = {
  city_reviewer: "City reviewer",
  applicant: "Applicant",
  other: "Other",
};

export function ContactsTab({
  permitId,
  contacts,
  refresh,
}: {
  permitId: string;
  contacts: Contact[];
  refresh: () => void;
}) {
  return (
    <EntityPanel
      title="Contacts"
      items={contacts}
      emptyLabel="No contacts added yet."
      fields={[
        { name: "name", label: "Name", required: true },
        {
          name: "role",
          label: "Role",
          kind: "select",
          required: true,
          options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
        },
        { name: "organization", label: "Organization" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
      ]}
      onAdd={async (values) => {
        await api.addContact(permitId, values as Partial<Contact>);
        refresh();
      }}
      onDelete={async (id) => {
        await api.deleteContact(id);
        refresh();
      }}
      renderRow={(c) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{c.name}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              {ROLE_LABELS[c.role]}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {[c.organization, c.email, c.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    />
  );
}
