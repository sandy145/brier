import { PROGRESS_INDEX, PROGRESS_STATUSES, STATUS_LABELS, type PermitStatus } from "../types";

const BRANCH_NOTE: Partial<Record<PermitStatus, string>> = {
  info_requested: "Waiting on applicant response before intake can complete.",
  deposit_invoiced: "Waiting on plan review deposit payment.",
  corrections_issued: "Waiting on applicant to submit revisions.",
  re_review: "City is re-reviewing submitted revisions.",
  withdrawn: "Application withdrawn.",
};

export function ProgressBar({ status }: { status: PermitStatus }) {
  const currentIndex = PROGRESS_INDEX[status];
  const isOnMainLine = PROGRESS_STATUSES[currentIndex] === status;
  const branchNote = BRANCH_NOTE[status];

  if (status === "withdrawn") {
    return <p className="text-sm text-rose-700">Application withdrawn.</p>;
  }

  return (
    <div>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {PROGRESS_STATUSES.map((step, idx) => {
          const done = idx < currentIndex || (idx === currentIndex && isOnMainLine);
          const isCurrent = idx === currentIndex;
          return (
            <li key={step} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isCurrent
                    ? "bg-indigo-600 text-white"
                    : done
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCurrent ? "bg-white" : done ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                {STATUS_LABELS[step]}
              </div>
              {idx < PROGRESS_STATUSES.length - 1 && <span className="mx-1 h-px w-4 bg-slate-300" />}
            </li>
          );
        })}
      </ol>
      {!isOnMainLine && (
        <p className="mt-2 text-sm text-amber-800">
          Currently: <span className="font-medium">{STATUS_LABELS[status]}</span>
          {branchNote ? ` — ${branchNote}` : ""}
        </p>
      )}
    </div>
  );
}
