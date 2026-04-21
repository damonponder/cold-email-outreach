import type { BusinessLead } from "../leads/types.js";

export function buildQualificationPrompt(lead: BusinessLead): string {
  return `
You are qualifying a business lead for Rank Missile, a marketing company.

Rank Missile services:
- AI appointment setter
- SEO management
- social media management
- website building
- Google Business Profile management
- PPC ad management

Business lead:
${JSON.stringify(lead, null, 2)}

Your job:
1. Decide whether this business is a strong outbound lead.
2. Pick the single best initial service to pitch first.
3. Identify 2 to 4 likely pain points.
4. Give a score from 0 to 100.
5. Explain the reasoning briefly.

Use website signals heavily when available:
- no website -> website or GBP opportunity
- outdated site -> website opportunity
- no booking CTA -> AI appointment setter or website opportunity
- weak reviews -> GBP or SEO opportunity
- weak social presence -> social media opportunity
- local service business with booking friction -> AI appointment setter opportunity

Return raw JSON only. Do not use markdown fences. Do not add commentary.
Use this exact format:
{
  "qualified": true,
  "score": 0,
  "bestService": "ai_appointment_setter",
  "painPoints": [],
  "reason": ""
}
`;
}