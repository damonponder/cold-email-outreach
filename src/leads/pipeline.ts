import type { QualifiedLead, BusinessLead } from "./types.js";
import { buildLeadQueries } from "./query-builder.js";
import { normalizeLead, dedupeLeads } from "./normalize.js";
import { preScoreLead } from "./score.js";
import { qualifyLead } from "./qualify.js";
import { MockLeadProvider } from "../providers/mock.provider.js";
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

export async function runDiscoveryPipeline(): Promise<PipelineResult> {
  const provider = new MockLeadProvider();
  const queries = buildLeadQueries();

  logStep(`Generated ${queries.length} search queries`);

  const rawLeads: BusinessLead[] = [];

  for (const query of queries) {
    const found = await provider.search(query);
    rawLeads.push(...found);
  }

  logStep(`Collected ${rawLeads.length} raw leads`);

  const normalized = rawLeads.map(normalizeLead);
  const deduped = dedupeLeads(normalized);

  logStep(`Deduped leads down to ${deduped.length}`);

  const enrichedLeads: BusinessLead[] = [];
  for (const lead of deduped) {
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