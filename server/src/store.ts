import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { DbShape } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data", "db.json");

const EMPTY_DB: DbShape = {
  permits: [],
  contacts: [],
  contractors: [],
  documents: [],
  correspondence: [],
  reviewComments: [],
  payments: [],
  inspections: [],
  statusHistory: [],
};

function readDb(): DbShape {
  if (!existsSync(DB_PATH)) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2));
    return structuredClone(EMPTY_DB);
  }
  const raw = readFileSync(DB_PATH, "utf-8");
  return { ...structuredClone(EMPTY_DB), ...JSON.parse(raw) };
}

function writeDb(db: DbShape) {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function newId(): string {
  return randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Read-modify-write against the on-disk JSON store. Single-process, so no locking needed. */
export function withDb<T>(fn: (db: DbShape) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

export function readOnlyDb<T>(fn: (db: DbShape) => T): T {
  return fn(readDb());
}

export function resetDb(seed: DbShape) {
  writeDb(seed);
}
