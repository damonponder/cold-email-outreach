import type { LeadProvider } from "./base.js";
import type { BusinessLead } from "../leads/types.js";
import type { LeadQuery } from "../leads/query-builder.js";

export class MockLeadProvider implements LeadProvider {
  name = "mock";

  async search(query: LeadQuery): Promise<BusinessLead[]> {
    return [
      {
        source: this.name,
        businessName: `${query.city} Elite ${query.niche}`,
        website: "https://example-business.com",
        phone: "555-111-2222",
        city: query.city,
        state: query.state,
        niche: query.niche,
        googleRating: 3.9,
        reviewCount: 18,
        hasWebsite: true,
        hasFacebook: true,
        hasInstagram: false,
        notes: ["placeholder lead with weak review count"]
      },
      {
        source: this.name,
        businessName: `${query.city} Rapid ${query.niche} Pros`,
        city: query.city,
        state: query.state,
        niche: query.niche,
        googleRating: 4.7,
        reviewCount: 124,
        hasWebsite: false,
        hasFacebook: false,
        hasInstagram: false,
        notes: ["placeholder lead with no website"]
      }
    ];
  }
}