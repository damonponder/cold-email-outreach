import type { BusinessLead } from "./types.js";

export function preScoreLead(lead: BusinessLead): number {
  let score = 0;

  if (!lead.businessName || lead.businessName.toLowerCase().includes("unknown")) score -= 30;
  if (!lead.city || !lead.state) score -= 10;

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

  // weak-fit suppression
  if ((lead.reviewCount ?? 0) === 0 && !lead.website) score -= 15;
  if ((lead.googleRating ?? 0) > 4.8 && (lead.reviewCount ?? 0) > 200 && lead.hasWebsite) score -= 10;

  return Math.max(0, Math.min(100, score));
}