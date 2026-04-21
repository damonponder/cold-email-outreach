import type { BusinessLead } from "./types.js";

export function normalizeLead(lead: BusinessLead): BusinessLead {
  return {
    ...lead,
    businessName: lead.businessName.trim(),
    website: lead.website?.trim().toLowerCase(),
    email: lead.email?.trim().toLowerCase(),
    city: lead.city?.trim(),
    state: lead.state?.trim().toUpperCase(),
    notes: lead.notes ?? [],
    websiteSignals: lead.websiteSignals
      ? {
          ...lead.websiteSignals,
          emailsFound: lead.websiteSignals.emailsFound ?? [],
          phonesFound: lead.websiteSignals.phonesFound ?? [],
          socialLinks: lead.websiteSignals.socialLinks ?? {}
        }
      : undefined
  };
}

export function dedupeLeads(leads: BusinessLead[]): BusinessLead[] {
  const seen = new Set<string>();
  const result: BusinessLead[] = [];

  for (const lead of leads) {
    const key = [
      lead.businessName.toLowerCase(),
      lead.website ?? "",
      lead.city ?? "",
      lead.state ?? ""
    ].join("|");

    if (!seen.has(key)) {
      seen.add(key);
      result.push(lead);
    }
  }

  return result;
}