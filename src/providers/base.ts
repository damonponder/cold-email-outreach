import type { BusinessLead } from "../leads/types.js";
import type { LeadQuery } from "../leads/query-builder.js";

export interface LeadProvider {
  name: string;
  search(query: LeadQuery): Promise<BusinessLead[]>;
}