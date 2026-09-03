// Seeds the store with the real B26-40 permit history reconstructed from the
// applicant's email thread with the City of Brier (csloan@ci.brier.wa.us /
// buildingpermits@ci.brier.wa.us), so the app opens with a working example
// instead of an empty dashboard. Run with `npm run seed` inside /server.
import { newId, resetDb } from "./store.js";
import type { DbShape } from "./types.js";

const permitId = newId();

const db: DbShape = {
  permits: [
    {
      id: permitId,
      permitNumber: "B26-40",
      jurisdiction: "City of Brier",
      projectAddress: "3413 Alaska Rd, Brier, WA",
      projectDescription:
        "Convert attached 2-car garage into two additional bedroom living spaces.",
      applicantName: "Sandy Abrah",
      applicantEmail: "sandyabrah.sa@gmail.com",
      applicantPhone: null,
      ownerIsContractor: true,
      status: "corrections_issued",
      submittedDate: "2026-08-14",
      cityContactName: "Christine Sloan",
      cityContactEmail: "csloan@ci.brier.wa.us",
      cityContactPhone: "425-775-5440",
      planReviewDepositAmount: 840.29,
      reviewTimeWeeksMin: 4,
      reviewTimeWeeksMax: 6,
      notes:
        "Submit revisions/correspondence to buildingpermits@ci.brier.wa.us. City Hall hours: Mon–Thu 8:30am–12:00pm & 1:00–4:30pm, closed Friday.",
      createdAt: "2026-08-14T06:24:15.000Z",
      updatedAt: "2026-09-01T15:46:20.000Z",
    },
  ],

  contacts: [
    {
      id: newId(),
      permitId,
      role: "city_reviewer",
      name: "Christine Sloan",
      email: "csloan@ci.brier.wa.us",
      phone: "425-775-5440",
      organization: "City of Brier",
    },
    {
      id: newId(),
      permitId,
      role: "other",
      name: "Building Permits Intake",
      email: "buildingpermits@ci.brier.wa.us",
      phone: null,
      organization: "City of Brier",
    },
    {
      id: newId(),
      permitId,
      role: "applicant",
      name: "Sandy Abrah",
      email: "sandyabrah.sa@gmail.com",
      phone: null,
      organization: null,
    },
  ],

  contractors: [
    {
      id: newId(),
      permitId,
      trade: "general",
      companyName: null,
      contactName: "Sandy Abrah (owner)",
      licenseNumber: null,
      licenseExpiration: null,
      ubiNumber: null,
      cityBusinessLicenseConfirmed: false,
      status: "confirmed",
      notes: "Acting as owner/general contractor; self-performing part of the work.",
    },
    {
      id: newId(),
      permitId,
      trade: "electrical",
      companyName: null,
      contactName: null,
      licenseNumber: null,
      licenseExpiration: null,
      ubiNumber: null,
      cityBusinessLicenseConfirmed: false,
      status: "tbd",
      notes: "To be engaged as needed; will pull the electrical permit through L&I.",
    },
    {
      id: newId(),
      permitId,
      trade: "plumbing",
      companyName: null,
      contactName: null,
      licenseNumber: null,
      licenseExpiration: null,
      ubiNumber: null,
      cityBusinessLicenseConfirmed: false,
      status: "tbd",
      notes: "To be engaged as needed.",
    },
    {
      id: newId(),
      permitId,
      trade: "hvac",
      companyName: null,
      contactName: null,
      licenseNumber: null,
      licenseExpiration: null,
      ubiNumber: null,
      cityBusinessLicenseConfirmed: false,
      status: "tbd",
      notes: "To be engaged as needed.",
    },
  ],

  documents: [
    { id: newId(), permitId, filename: "BuildingPermit-signed.pdf", category: "application", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "Plumbing-MechanicalForm-signed.pdf", category: "application", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "EnergyCode2021.pdf", category: "energy_code", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "Existing Floor plan.pdf", category: "plans", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "Floorplan.pdf", category: "plans", direction: "submitted", date: "2026-08-14", notes: "Proposed floor plan." },
    { id: newId(), permitId, filename: "Afh Garage Conversion plan.pdf", category: "plans", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "Window_Door_Schedule.docx", category: "window_door_schedule", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "Brier_Garage_Conversion_Permit_Package.docx", category: "permit_package", direction: "submitted", date: "2026-08-14", notes: null },
    { id: newId(), permitId, filename: "B26-40 - Abrah Garage Conversion Plan Review PC1.docx", category: "comment_letter", direction: "received", date: "2026-09-01", notes: "First plan review comments." },
    { id: newId(), permitId, filename: "B26-40 - Abrah Garage Conversion Zoning First Review.pdf", category: "comment_letter", direction: "received", date: "2026-09-01", notes: "First zoning review comments." },
  ],

  correspondence: [
    {
      id: newId(), permitId, direction: "outbound",
      fromAddr: "sandyabrah.sa@gmail.com", toAddr: "buildingpermits@ci.brier",
      subject: "3413 Alaska rd building permit request",
      summary: "Initial permit application and supporting documents submitted for the garage conversion (sent to a mistyped address).",
      date: "2026-08-14T06:24:15.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "inbound",
      fromAddr: "mailer-daemon@googlemail.com", toAddr: "sandyabrah.sa@gmail.com",
      subject: "Delivery Status Notification (Failure)",
      summary: "Bounced — buildingpermits@ci.brier does not exist (missing .wa.us).",
      date: "2026-08-14T06:24:35.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "outbound",
      fromAddr: "sandyabrah.sa@gmail.com", toAddr: "buildingpermits@ci.brier.wa.us",
      subject: "Fwd: 3413 Alaska rd building permit request",
      summary: "Resent the application and documents to the correct address.",
      date: "2026-08-14T15:59:29.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "inbound",
      fromAddr: "csloan@ci.brier.wa.us", toAddr: "sandyabrah.sa@gmail.com",
      subject: "RE: [External] Fwd: 3413 Alaska rd building permit request",
      summary: "City asked whether the blank contractor field means owner will self-perform, or a contractor is still TBD.",
      date: "2026-08-14T17:08:49.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "outbound",
      fromAddr: "sandyabrah.sa@gmail.com", toAddr: "csloan@ci.brier.wa.us",
      subject: "Re: [External] Fwd: 3413 Alaska rd building permit request",
      summary: "Confirmed owner/GC status: self-performing some work, will hire licensed subs (electrical/plumbing/mechanical/HVAC) as needed and supply license, UBI, and City business-license info per trade before work begins.",
      date: "2026-08-14T19:35:57.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "inbound",
      fromAddr: "csloan@ci.brier.wa.us", toAddr: "sandyabrah.sa@gmail.com",
      subject: "RE: [External] Re: [External] Fwd: 3413 Alaska rd building permit request",
      summary: "No further questions. Next step: pay the $840.29 plan review deposit (check or cash). First review runs 4-6 weeks.",
      date: "2026-08-14T20:06:20.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "outbound",
      fromAddr: "sandyabrah.sa@gmail.com", toAddr: "csloan@ci.brier.wa.us",
      subject: "Re: [External] Re: [External] Fwd: 3413 Alaska rd building permit request",
      summary: "Offered to bring a check to the office same day; asked who to make it payable to.",
      date: "2026-08-14T20:07:43.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "inbound",
      fromAddr: "csloan@ci.brier.wa.us", toAddr: "sandyabrah.sa@gmail.com",
      subject: "RE: [External] Re: [External] Re: [External] Fwd: 3413 Alaska rd building permit request",
      summary: "Check payable to \"City of Brier\"; noted office was closed that day (Friday).",
      date: "2026-08-14T20:10:51.000Z", gmailThreadId: "19ffeeb5def71cad",
    },
    {
      id: newId(), permitId, direction: "inbound",
      fromAddr: "csloan@ci.brier.wa.us", toAddr: "sandyabrah.sa@gmail.com",
      subject: "RE: B26-40 3413 Alaska rd building permit request",
      summary: "Plan review comment letters attached (Plan Review PC1 + Zoning First Review). Permit number B26-40 assigned. Revisions go to buildingpermits@ci.brier.wa.us.",
      date: "2026-09-01T15:46:20.000Z", gmailThreadId: "1a05da68bfe766e6",
    },
  ],

  reviewComments: [
    {
      id: newId(), permitId, reviewRound: 1, discipline: "Zoning",
      commentText: "See attached \"B26-40 - Abrah Garage Conversion Zoning First Review.pdf\" for the full list of required corrections.",
      status: "open", dateIssued: "2026-09-01", dateResolved: null,
    },
    {
      id: newId(), permitId, reviewRound: 1, discipline: "Plan Review / Building",
      commentText: "See attached \"B26-40 - Abrah Garage Conversion Plan Review PC1.docx\" for the full list of required corrections.",
      status: "open", dateIssued: "2026-09-01", dateResolved: null,
    },
  ],

  payments: [
    {
      id: newId(), permitId, type: "plan_review_deposit", amount: 840.29,
      method: "check", status: "paid",
      invoicedDate: "2026-08-14", paidDate: null, payee: "City of Brier",
      notes: "Deposit required before plan review would start. Office was closed the day it was invoiced (Friday); exact drop-off date wasn't confirmed in the email thread, but the deposit must have posted since plan review comments followed.",
    },
  ],

  inspections: [],

  statusHistory: [
    { id: newId(), permitId, status: "submitted", changedAt: "2026-08-14T06:24:15.000Z", note: "Application emailed; bounced (wrong domain) and resent the same day to buildingpermits@ci.brier.wa.us." },
    { id: newId(), permitId, status: "info_requested", changedAt: "2026-08-14T17:08:49.000Z", note: "City asked for clarification on contractor status." },
    { id: newId(), permitId, status: "deposit_invoiced", changedAt: "2026-08-14T20:06:20.000Z", note: "$840.29 plan review deposit requested; first review estimated at 4–6 weeks." },
    { id: newId(), permitId, status: "plan_review", changedAt: "2026-08-17T16:00:00.000Z", note: "Deposit paid and plan review begun (exact date estimated)." },
    { id: newId(), permitId, status: "corrections_issued", changedAt: "2026-09-01T15:46:20.000Z", note: "Permit number B26-40 assigned. Comment letters received from Zoning and Plan Review; revisions due back to the City." },
  ],
};

resetDb(db);
console.log(`Seeded permit ${permitId} (B26-40, 3413 Alaska Rd).`);
