# Brier Building Permits

A small end-to-end tracker for a building permit application with the City
of Brier, WA. It follows the real workflow from the applicant's email
correspondence with `buildingpermits@ci.brier.wa.us` / `csloan@ci.brier.wa.us`:
submit → intake questions → plan review deposit → plan review → correction
letters → revisions → approval → permit issuance → inspections → final.

The app ships seeded with permit **B26-40** (3413 Alaska Rd — garage-to-living-space
conversion), reconstructed from that email thread, so it opens with a working
example instead of an empty screen.

## What it tracks, per permit

- **Overview** — project/applicant/city-contact details, deposit amount,
  estimated review time, and a status changer.
- **Timeline** — every status change, email, payment, review comment, and
  inspection merged into one chronological feed.
- **Documents** — plans, forms, and comment letters, submitted vs. received.
- **Correspondence** — a log of emails/calls with the City.
- **Contractors** — one row per trade (general/electrical/plumbing/HVAC/…)
  with license, UBI, and city-business-license status.
- **Contacts** — city reviewer, applicant, intake inbox, etc.
- **Payments** — deposits and fees, invoiced vs. paid.
- **Review comments** — corrections requested per discipline/round, tracked
  open → addressed → resolved.
- **Inspections** — scheduled/completed field inspections and results.

## Stack

- `server/` — Express + TypeScript API, persisted to a JSON file
  (`server/data/db.json`) via a tiny read-modify-write store. No external
  database or account needed.
- `client/` — React + Vite + TypeScript + Tailwind SPA, calling the API
  through Vite's dev proxy.

## Running it

```bash
npm install       # installs both workspaces
npm run seed      # (re)seeds server/data/db.json with the B26-40 example
npm run dev       # runs the API (port 4000) and the web app (port 5173) together
```

Then open the URL Vite prints (typically http://localhost:5173).

Running `npm run seed` again at any time resets the data store back to the
seeded B26-40 example — useful after experimenting.

## API

REST, mounted under `/api`:

- `GET/POST /api/permits`, `GET/PATCH/DELETE /api/permits/:id`,
  `POST /api/permits/:id/status`
- Nested sub-resources, each with the same shape — list/create under
  `/api/permits/:permitId/<name>`, update/delete under `/api/<name>/:id`:
  `contacts`, `contractors`, `documents`, `correspondence`,
  `review-comments`, `payments`, `inspections`.
