import type { BusinessLead } from "./types.js";

export function preScoreLead(lead: BusinessLead): number {
  let score = 0;

  if (!lead.hasWebsite) score += 25;
  if ((lead.googleRating ?? 5) < 4.2) score += 15;
  if ((lead.reviewCount ?? 0) < 25) score += 15;

  const niche = (lead.niche ?? "").toLowerCase();
  if (["roofing", "hvac", "plumbing", "electrician", "med spa", "dental"].includes(niche)) {
    score += 20;
  }

  if (!lead.hasFacebook && !lead.hasInstagram) score += 10;
  if (!lead.email && !lead.phone) score -= 20;

  if (lead.websiteSignals?.siteLooksOutdated) score += 15;
  if (lead.websiteSignals && !lead.websiteSignals.hasBookingCTA) score += 10;
  if (lead.websiteSignals && !lead.websiteSignals.hasContactPage) score += 10;
  if (lead.websiteSignals?.emailsFound.length) score += 5;

  return Math.max(0, Math.min(100, score));
}