import type {
  Contact,
  Contractor,
  CorrespondenceEntry,
  DocumentRecord,
  Inspection,
  Payment,
  Permit,
  PermitDetail,
  PermitStatus,
  ReviewComment,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listPermits: () => request<Permit[]>("/permits"),
  createPermit: (data: Partial<Permit>) =>
    request<Permit>("/permits", { method: "POST", body: JSON.stringify(data) }),
  getPermit: (id: string) => request<PermitDetail>(`/permits/${id}`),
  updatePermit: (id: string, data: Partial<Permit>) =>
    request<Permit>(`/permits/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePermit: (id: string) => request<void>(`/permits/${id}`, { method: "DELETE" }),
  setStatus: (id: string, status: PermitStatus, note?: string) =>
    request(`/permits/${id}/status`, { method: "POST", body: JSON.stringify({ status, note }) }),

  addContact: (permitId: string, data: Partial<Contact>) =>
    request<Contact>(`/permits/${permitId}/contacts`, { method: "POST", body: JSON.stringify(data) }),
  updateContact: (id: string, data: Partial<Contact>) =>
    request<Contact>(`/contacts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteContact: (id: string) => request<void>(`/contacts/${id}`, { method: "DELETE" }),

  addContractor: (permitId: string, data: Partial<Contractor>) =>
    request<Contractor>(`/permits/${permitId}/contractors`, { method: "POST", body: JSON.stringify(data) }),
  updateContractor: (id: string, data: Partial<Contractor>) =>
    request<Contractor>(`/contractors/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteContractor: (id: string) => request<void>(`/contractors/${id}`, { method: "DELETE" }),

  addDocument: (permitId: string, data: Partial<DocumentRecord>) =>
    request<DocumentRecord>(`/permits/${permitId}/documents`, { method: "POST", body: JSON.stringify(data) }),
  updateDocument: (id: string, data: Partial<DocumentRecord>) =>
    request<DocumentRecord>(`/documents/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteDocument: (id: string) => request<void>(`/documents/${id}`, { method: "DELETE" }),

  addCorrespondence: (permitId: string, data: Partial<CorrespondenceEntry>) =>
    request<CorrespondenceEntry>(`/permits/${permitId}/correspondence`, { method: "POST", body: JSON.stringify(data) }),
  updateCorrespondence: (id: string, data: Partial<CorrespondenceEntry>) =>
    request<CorrespondenceEntry>(`/correspondence/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCorrespondence: (id: string) => request<void>(`/correspondence/${id}`, { method: "DELETE" }),

  addReviewComment: (permitId: string, data: Partial<ReviewComment>) =>
    request<ReviewComment>(`/permits/${permitId}/review-comments`, { method: "POST", body: JSON.stringify(data) }),
  updateReviewComment: (id: string, data: Partial<ReviewComment>) =>
    request<ReviewComment>(`/review-comments/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteReviewComment: (id: string) => request<void>(`/review-comments/${id}`, { method: "DELETE" }),

  addPayment: (permitId: string, data: Partial<Payment>) =>
    request<Payment>(`/permits/${permitId}/payments`, { method: "POST", body: JSON.stringify(data) }),
  updatePayment: (id: string, data: Partial<Payment>) =>
    request<Payment>(`/payments/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePayment: (id: string) => request<void>(`/payments/${id}`, { method: "DELETE" }),

  addInspection: (permitId: string, data: Partial<Inspection>) =>
    request<Inspection>(`/permits/${permitId}/inspections`, { method: "POST", body: JSON.stringify(data) }),
  updateInspection: (id: string, data: Partial<Inspection>) =>
    request<Inspection>(`/inspections/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteInspection: (id: string) => request<void>(`/inspections/${id}`, { method: "DELETE" }),
};
