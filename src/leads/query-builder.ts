import { ICP_BUCKETS } from "../config/icp.js";

export type LeadQuery = {
  niche: string;
  city: string;
  state: string;
  search: string;
  targetLeadCount: number;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export function buildLeadQueries(): LeadQuery[] {
  const queries: LeadQuery[] = [];

 for (const bucket of ICP_BUCKETS) {
    for (const target of bucket.geoTargets) {
      queries.push(
          {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
          {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
          {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `best ${bucket.niche} in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
           {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} company in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
           {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} company in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
           {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} company in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          },
           {
            niche: bucket.niche,
            city: target.city,
            state: target.state,
            search: `${bucket.niche} company in ${target.city}, ${target.state}`,
            targetLeadCount: bucket.targetLeadCount,
            latitude: target.latitude,
            longitude: target.longitude,
            radiusMeters: target.radiusMeters
          }
        );
      }
    }

  return queries;
}