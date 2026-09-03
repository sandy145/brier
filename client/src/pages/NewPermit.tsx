import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { CrudForm } from "../components/CrudForm";
import type { Permit } from "../types";

export function NewPermit() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">New permit application</h1>
      <p className="mb-6 text-sm text-slate-500">
        Start tracking a new building permit application from the ground up.
      </p>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <CrudForm
          submitLabel="Create permit"
          fields={[
            { name: "projectAddress", label: "Project address", required: true, placeholder: "e.g. 3413 Alaska Rd, Brier, WA" },
            { name: "projectDescription", label: "Project description", kind: "textarea", required: true },
            { name: "jurisdiction", label: "Jurisdiction", defaultValue: "City of Brier", required: true },
            { name: "applicantName", label: "Applicant name", required: true },
            { name: "applicantEmail", label: "Applicant email" },
            { name: "applicantPhone", label: "Applicant phone" },
            { name: "ownerIsContractor", label: "Owner acting as general contractor", kind: "checkbox" },
            { name: "permitNumber", label: "Permit number (if assigned)" },
            { name: "submittedDate", label: "Submitted date", kind: "date" },
            { name: "cityContactName", label: "City contact name" },
            { name: "cityContactEmail", label: "City contact email" },
            { name: "cityContactPhone", label: "City contact phone" },
          ]}
          onSubmit={async (values) => {
            const permit = await api.createPermit(values as Partial<Permit>);
            navigate(`/permits/${permit.id}`);
          }}
        />
      </div>
    </div>
  );
}
