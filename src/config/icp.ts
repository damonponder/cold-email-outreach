import type { ServiceType } from "../leads/types.js";

export type ICPBucket = {
  niche: string;
  targetCities: string[];
  targetStates: string[];
  pains: string[];
  preferredServices: ServiceType[];
  minScoreToSend: number;
};

export const ICP_BUCKETS: ICPBucket[] = [
  {
    niche: "roofing",
    targetCities: ["Houston", "Dallas", "San Antonio"],
    targetStates: ["TX"],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: [
      "ai_appointment_setter",
      "seo",
      "website",
      "gbp_management",
      "ppc"
    ],
    minScoreToSend: 70
  },
  {
    niche: "hvac",
    targetCities: ["Houston", "Austin", "Dallas"],
    targetStates: ["TX"],
    pains: [
      "slow lead response",
      "poor online visibility",
      "outdated website",
      "no follow-up automation"
    ],
    preferredServices: [
      "ai_appointment_setter",
      "seo",
      "website",
      "ppc"
    ],
    minScoreToSend: 68
  },
  {
    niche: "med spa",
    targetCities: ["Houston", "Austin", "Dallas"],
    targetStates: ["TX"],
    pains: [
      "booking friction",
      "weak lead nurturing",
      "low social proof conversion",
      "slow response to inquiries"
    ],
    preferredServices: [
      "ai_appointment_setter",
      "ppc",
      "social_media",
      "website"
    ],
    minScoreToSend: 72
  }
];