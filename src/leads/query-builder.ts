import { ICP_BUCKETS } from "../config/icp.js";

export type LeadQuery = {
  niche: string;
  city: string;
  state: string;
  search: string;
};

export function buildLeadQueries(): LeadQuery[] {
  const queries: LeadQuery[] = [];

  for (const bucket of ICP_BUCKETS) {
    for (const city of bucket.targetCities) {
      for (const state of bucket.targetStates) {
        queries.push(
          {
            niche: bucket.niche,
            city,
            state,
            search: `${bucket.niche} companies in ${city}, ${state}`
          },
          {
            niche: bucket.niche,
            city,
            state,
            search: `${bucket.niche} near ${city}, ${state}`
          },
          {
            niche: bucket.niche,
            city,
            state,
            search: `best ${bucket.niche} ${city} ${state}`
          }
        );
      }
    }
  }

  return queries;
}