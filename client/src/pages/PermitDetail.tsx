import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { ProgressBar } from "../components/ProgressBar";
import { StatusBadge } from "../components/StatusBadge";
import { ContactsTab } from "../tabs/ContactsTab";
import { ContractorsTab } from "../tabs/ContractorsTab";
import { CorrespondenceTab } from "../tabs/CorrespondenceTab";
import { DocumentsTab } from "../tabs/DocumentsTab";
import { InspectionsTab } from "../tabs/InspectionsTab";
import { OverviewTab } from "../tabs/OverviewTab";
import { PaymentsTab } from "../tabs/PaymentsTab";
import { ReviewCommentsTab } from "../tabs/ReviewCommentsTab";
import { TimelineTab } from "../tabs/TimelineTab";
import type { PermitDetail as PermitDetailType } from "../types";

const TABS = [
  "Overview",
  "Timeline",
  "Documents",
  "Correspondence",
  "Contractors",
  "Contacts",
  "Payments",
  "Review Comments",
  "Inspections",
] as const;
type Tab = (typeof TABS)[number];

export function PermitDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<PermitDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");

  const refresh = useCallback(() => {
    api
      .getPermit(id)
      .then(setDetail)
      .catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => refresh(), [refresh]);

  async function handleDelete() {
    if (!confirm("Delete this permit and all its records? This cannot be undone.")) return;
    await api.deletePermit(id);
    navigate("/");
  }

  if (error) return <p className="mx-auto max-w-5xl px-4 py-8 text-sm text-rose-600">{error}</p>;
  if (!detail) return <p className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-400">Loading…</p>;

  const { permit } = detail;
  const openComments = detail.reviewComments.filter((c) => c.status !== "resolved").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
        ← All permits
      </Link>

      <div className="mt-2 mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{permit.permitNumber || "Unassigned permit"}</h1>
            <StatusBadge status={permit.status} />
          </div>
          <p className="text-sm text-slate-600">{permit.projectAddress}</p>
        </div>
        <button onClick={handleDelete} className="text-xs text-slate-400 hover:text-rose-600">
          Delete permit
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <ProgressBar status={permit.status} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-3 py-2 text-sm font-medium ${
              tab === t ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
            {t === "Review Comments" && openComments > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                {openComments}
              </span>
            )}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab permit={permit} refresh={refresh} />}
      {tab === "Timeline" && <TimelineTab detail={detail} />}
      {tab === "Documents" && <DocumentsTab permitId={id} documents={detail.documents} refresh={refresh} />}
      {tab === "Correspondence" && (
        <CorrespondenceTab permitId={id} correspondence={detail.correspondence} refresh={refresh} />
      )}
      {tab === "Contractors" && (
        <ContractorsTab permitId={id} contractors={detail.contractors} refresh={refresh} />
      )}
      {tab === "Contacts" && <ContactsTab permitId={id} contacts={detail.contacts} refresh={refresh} />}
      {tab === "Payments" && <PaymentsTab permitId={id} payments={detail.payments} refresh={refresh} />}
      {tab === "Review Comments" && (
        <ReviewCommentsTab permitId={id} reviewComments={detail.reviewComments} refresh={refresh} />
      )}
      {tab === "Inspections" && (
        <InspectionsTab permitId={id} inspections={detail.inspections} refresh={refresh} />
      )}
    </div>
  );
}
