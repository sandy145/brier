import { STATUS_COLORS, STATUS_LABELS, type PermitStatus } from "../types";

export function StatusBadge({ status }: { status: PermitStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
