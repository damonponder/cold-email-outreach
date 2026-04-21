import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { BusinessLead, QualifiedLead, ServiceType } from "./types.js";
import { buildQualificationPrompt } from "../prompts/qualify-business.js";
import { logWarn } from "../utils/logger.js";

const QualificationSchema = z.object({
  qualified: z.boolean(),
  score: z.number().min(0).max(100),
  bestService: z.string().optional(),
  painPoints: z.array(z.string()),
  reason: z.string()
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

function extractJson(rawText: string): unknown {
  const trimmed = rawText.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    return JSON.parse(fenceMatch[1].trim());
  }

  return JSON.parse(trimmed);
}

function normalizeBestService(value: unknown): ServiceType | undefined {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();

  const serviceMap: Record<string, ServiceType> = {
    ai_appointment_setter: "ai_appointment_setter",
    "ai appointment setter": "ai_appointment_setter",
    "ai setter": "ai_appointment_setter",
    appointment_setter: "ai_appointment_setter",
    "appointment setter": "ai_appointment_setter",

    seo: "seo",

    social_media: "social_media",
    "social media": "social_media",
    social: "social_media",
    social_media_management: "social_media",
    "social media management": "social_media",

    website: "website",
    "website building": "website",
    website_building: "website",
    "website redesign": "website",
    website_redesign: "website",
    web_design: "website",
    "web design": "website",
    "web development": "website",
    web_development: "website",

    gbp_management: "gbp_management",
    gbp: "gbp_management",
    "google business profile": "gbp_management",
    "google business profile management": "gbp_management",
    google_business_profile_management: "gbp_management",
    google_business_profile: "gbp_management",
    "google business": "gbp_management",
    "profile management": "gbp_management",

    ppc: "ppc",
    "ppc ad management": "ppc",
    "paid ads": "ppc",
    "google ads": "ppc",
    google_ads: "ppc",
    google_ads_management: "ppc"
  };

  return serviceMap[normalized];
}

export async function qualifyLead(lead: BusinessLead): Promise<QualifiedLead> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: buildQualificationPrompt(lead)
        }
      ]
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const parsedJson = extractJson(text);
    const parsed = QualificationSchema.parse(parsedJson);

    const normalizedBestService = normalizeBestService(parsed.bestService);

    if (parsed.qualified && !normalizedBestService) {
      logWarn(`Unknown bestService value from Claude: ${parsed.bestService ?? "undefined"}`);
    }

    return {
      ...lead,
      qualified: parsed.qualified,
      score: parsed.score,
      bestService: normalizedBestService,
      painPoints: parsed.painPoints,
      reason: parsed.reason
    };
  } catch (error) {
    logWarn(`Claude qualification failed for ${lead.businessName}. Falling back to unqualified lead.`);

    return {
      ...lead,
      qualified: false,
      score: 0,
      bestService: undefined,
      painPoints: ["Claude qualification failed"],
      reason: "Qualification could not be completed due to parsing or API error."
    };
  }
}