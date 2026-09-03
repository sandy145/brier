import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { StatusBadge } from "../components/StatusBadge";
import type { Permit } from "../types";

export function Dashboard() {
  const [permits, setPermits] = useState<Permit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listPermits()
      .then(setPermits)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Building Permits</h1>
          <p className="text-sm text-slate-500">Track applications end-to-end with the City of Brier.</p>
        </div>
        <Link
          to="/permits/new"
          className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New permit
        </Link>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {!permits ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : permits.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">
          <p className="text-sm text-slate-500">No permit applications yet.</p>
          <Link to="/permits/new" className="mt-2 inline-block text-sm font-medium text-indigo-600">
            Start your first application →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {permits.map((p) => (
            <li key={p.id}>
              <Link
                to={`/permits/${p.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{p.permitNumber || "Unassigned #"}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-slate-600">{p.projectAddress}</p>
                    <p className="text-xs text-slate-400">{p.projectDescription}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-400">
                    <p>{p.applicantName}</p>
                    <p>Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
