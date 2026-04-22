import type { ServiceType } from "../leads/types.js";

export type GeoTarget = {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type ICPBucket = {
  niche: string;
  geoTargets: GeoTarget[];
  pains: string[];
  preferredServices: ServiceType[];
  minScoreToSend: number;
  targetLeadCount: number;
};

export const ICP_BUCKETS: ICPBucket[] = [
  {
   niche: "roofing",
    geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
  {
    niche: "hvac",
       geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
  {
    niche: "plumber",
      geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
    {
    niche: "electrician",
       geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
    {
    niche: "home services",
       geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
  {
    niche: "med spa",
       geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  },
  {
    niche: "chiropractic",
       geoTargets: [
      { city: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698, radiusMeters: 30000 },
    ],
    pains: [
      "missed inbound calls",
      "weak website conversion",
      "poor local search visibility",
      "no automated lead follow-up"
    ],
    preferredServices: ["ai_appointment_setter", "seo", "website", "gbp_management", "ppc"],
    minScoreToSend: 70,
    targetLeadCount: 20
  }
];