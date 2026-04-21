import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { runDiscoveryPipeline } from "../leads/pipeline.js";
import { writeCsvFile } from "../utils/csv.js";
import { logError, logStep } from "../utils/logger.js";

function flattenQualifiedLeadForCsv(lead: Record<string, unknown>) {
  return {
    businessName: lead.businessName,
    niche: lead.niche,
    city: lead.city,
    state: lead.state,
    website: lead.website,
    phone: lead.phone,
    email: lead.email,
    googleRating: lead.googleRating,
    reviewCount: lead.reviewCount,
    qualified: lead.qualified,
    score: lead.score,
    bestService: lead.bestService,
    painPoints: Array.isArray(lead.painPoints) ? lead.painPoints.join(" | ") : "",
    reason: lead.reason
  };
}

async function main() {
  const outputDir = path.resolve("data/output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result = await runDiscoveryPipeline();

  const rawLeadsPath = path.join(outputDir, "raw-leads.json");
  const enrichedLeadsPath = path.join(outputDir, "enriched-leads.json");
  const preQualifiedLeadsPath = path.join(outputDir, "prequalified-leads.json");
  const qualifiedLeadsPath = path.join(outputDir, "qualified-leads.json");
  const qualifiedLeadsCsvPath = path.join(outputDir, "qualified-leads.csv");

  fs.writeFileSync(rawLeadsPath, JSON.stringify(result.rawLeads, null, 2), "utf-8");
  fs.writeFileSync(enrichedLeadsPath, JSON.stringify(result.enrichedLeads, null, 2), "utf-8");
  fs.writeFileSync(preQualifiedLeadsPath, JSON.stringify(result.preQualifiedLeads, null, 2), "utf-8");
  fs.writeFileSync(qualifiedLeadsPath, JSON.stringify(result.qualifiedLeads, null, 2), "utf-8");

  writeCsvFile(
    qualifiedLeadsCsvPath,
    result.qualifiedLeads.map((lead) =>
      flattenQualifiedLeadForCsv(lead as unknown as Record<string, unknown>)
    )
  );

  logStep(`Saved raw leads to ${rawLeadsPath}`);
  logStep(`Saved enriched leads to ${enrichedLeadsPath}`);
  logStep(`Saved prequalified leads to ${preQualifiedLeadsPath}`);
  logStep(`Saved qualified leads to ${qualifiedLeadsPath}`);
  logStep(`Saved qualified lead CSV to ${qualifiedLeadsCsvPath}`);
}

main().catch((error) => {
  logError("Pipeline failed", error);
  process.exit(1);
});