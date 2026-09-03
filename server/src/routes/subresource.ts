import { Router } from "express";
import { newId, withDb, readOnlyDb } from "../store.js";
import type { DbShape } from "../types.js";

type CollectionKey = Exclude<keyof DbShape, "permits" | "statusHistory">;

/**
 * Builds a router for a permit sub-resource (contacts, documents, etc).
 * List/create are nested under /api/permits/:permitId/<name>;
 * update/delete are flat under /api/<name>/:id so callers don't need the
 * parent permit id on hand.
 */
export function subResourceRouter<T extends { id: string; permitId: string }>(
  collection: CollectionKey,
  buildDefaults: (body: Partial<T>) => Omit<T, "id" | "permitId">
) {
  const nested = Router({ mergeParams: true });
  const flat = Router();

  nested.get("/", (req, res) => {
    const { permitId } = req.params as { permitId: string };
    const items = readOnlyDb((db) => (db[collection] as unknown as T[]).filter((i) => i.permitId === permitId));
    res.json(items);
  });

  nested.post("/", (req, res) => {
    const { permitId } = req.params as { permitId: string };
    const permitExists = readOnlyDb((db) => db.permits.some((p) => p.id === permitId));
    if (!permitExists) {
      res.status(404).json({ error: "Permit not found" });
      return;
    }
    const item = {
      id: newId(),
      permitId,
      ...buildDefaults(req.body ?? {}),
    } as unknown as T;
    withDb((db) => {
      (db[collection] as unknown as T[]).push(item);
    });
    res.status(201).json(item);
  });

  flat.patch("/:id", (req, res) => {
    const { id } = req.params;
    const updated = withDb((db) => {
      const list = db[collection] as unknown as T[];
      const idx = list.findIndex((i) => i.id === id);
      if (idx === -1) return null;
      list[idx] = { ...list[idx], ...req.body, id: list[idx].id, permitId: list[idx].permitId };
      return list[idx];
    });
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(updated);
  });

  flat.delete("/:id", (req, res) => {
    const { id } = req.params;
    const removed = withDb((db) => {
      const list = db[collection] as unknown as T[];
      const idx = list.findIndex((i) => i.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);
      return true;
    });
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  });

  return { nested, flat };
}
