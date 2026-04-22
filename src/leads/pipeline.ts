import type { QualifiedLead, BusinessLead } from "./types.js";
import { buildLeadQueries } from "./query-builder.js";
import { normalizeLead, dedupeLeads } from "./normalize.js";
import { preScoreLead } from "./score.js";
import { qualifyLead } from "./qualify.js";
import { GooglePlacesProvider } from "../providers/google.provider.js";
import { scanWebsite } from "../providers/website.provider.js";
import { logStep } from "../utils/logger.js";

export type PipelineResult = {
  rawLeads: BusinessLead[];
  enrichedLeads: BusinessLead[];
  preQualifiedLeads: BusinessLead[];
  qualifiedLeads: QualifiedLead[];
};

async function enrichLeadWithWebsiteSignals(lead: BusinessLead): Promise<BusinessLead> {
  if (!lead.website) return lead;

  const websiteSignals = await scanWebsite(lead.website);

  return {
    ...lead,
    websiteSignals,
    hasFacebook: lead.hasFacebook || Boolean(websiteSignals.socialLinks.facebook),
    hasInstagram: lead.hasInstagram || Boolean(websiteSignals.socialLinks.instagram),
    email: lead.email || websiteSignals.emailsFound[0],
    phone: lead.phone || websiteSignals.phonesFound[0]
  };
}

function passesHardFilter(lead: BusinessLead): boolean {
  if (!lead.businessName) return false;
  if (!lead.niche) return false;
  if (!lead.city || !lead.state) return false;

  // require at least one useful signal before Claude
  const hasDiscoveryValue =
    Boolean(lead.website) ||
    Boolean(lead.phone) ||
    (lead.reviewCount ?? 0) > 0 ||
    (lead.googleRating ?? 0) > 0;

  return hasDiscoveryValue;
}

export async function runDiscoveryPipeline(): Promise<PipelineResult> {
  const provider = new GooglePlacesProvider();
  const MAX_RAW_LEADS = 300;
  const nicheCounts: Record<string, number> = {};
  const queries = buildLeadQueries();

  logStep(`Generated ${queries.length} search queries`);

  const rawLeads: BusinessLead[] = [];

  for (const query of queries) {
    if (rawLeads.length >= MAX_RAW_LEADS) {
      logStep(`Reached global cap of ${MAX_RAW_LEADS} leads`);
      break;
    }

    const niche = query.niche;
    const target = query.targetLeadCount;
    const currentCount = nicheCounts[niche] ?? 0;

    if (currentCount >= target) {
      continue;
    }

    const found = await provider.search(query);

    const remainingNeeded = target - currentCount;
    const globalRemaining = MAX_RAW_LEADS - rawLeads.length;
    const allowedToTake = Math.min(remainingNeeded, globalRemaining);

    const trimmed = found.slice(0, allowedToTake);

    rawLeads.push(...trimmed);
    nicheCounts[niche] = currentCount + trimmed.length;
  }

  logStep(`Collected ${rawLeads.length} raw leads`);

  const normalized = rawLeads.map(normalizeLead);
  const deduped = dedupeLeads(normalized);

  logStep(`Deduped leads down to ${deduped.length}`);

  const hardFiltered = deduped.filter(passesHardFilter);
  logStep(`Hard-filtered leads down to ${hardFiltered.length}`);

  const enrichedLeads: BusinessLead[] = [];
  for (const lead of hardFiltered) {
    enrichedLeads.push(await enrichLeadWithWebsiteSignals(lead));
  }

  logStep(`Enriched ${enrichedLeads.length} leads with website signals`);

  const preQualifiedLeads = enrichedLeads.filter((lead) => preScoreLead(lead) >= 35);

  logStep(`Prequalified ${preQualifiedLeads.length} leads`);

  const qualifiedLeads: QualifiedLead[] = [];
  for (const lead of preQualifiedLeads) {
    const qualified = await qualifyLead(lead);
    qualifiedLeads.push(qualified);
  }

  const finalQualified = qualifiedLeads
    .filter((lead) => lead.qualified)
    .sort((a, b) => b.score - a.score);

  logStep(`Final qualified leads: ${finalQualified.length}`);

  return {
    rawLeads,
    enrichedLeads,
    preQualifiedLeads,
    qualifiedLeads: finalQualified
  };
}