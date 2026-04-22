import type { LeadProvider } from "./base.js";
import type { BusinessLead } from "../leads/types.js";
import type { LeadQuery } from "../leads/query-builder.js";

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  types?: string[];
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
};

type TextSearchResponse = {
  places?: GooglePlace[];
};

function extractCityAndState(place: GooglePlace): { city?: string; state?: string } {
  const components = place.addressComponents ?? [];

  const city =
    components.find((c) => c.types?.includes("locality"))?.longText ||
    components.find((c) => c.types?.includes("postal_town"))?.longText;

  const state =
    components.find((c) => c.types?.includes("administrative_area_level_1"))?.shortText;

  return { city, state };
}

function looksRelevantToNiche(place: GooglePlace, niche: string): boolean {
  const haystack = [
    place.primaryType ?? "",
    ...(place.types ?? []),
    place.displayName?.text ?? ""
  ]
    .join(" ")
    .toLowerCase();

  const nicheMap: Record<string, string[]> = {
    roofing: ["roof", "roofing", "contractor"],
    hvac: ["hvac", "air_conditioning", "heating", "contractor"],
    "med spa": ["spa", "medical_spa", "beauty", "skin", "wellness"]
  };

  const keywords = nicheMap[niche.toLowerCase()] ?? [niche.toLowerCase()];
  return keywords.some((keyword) => haystack.includes(keyword));
}

export class GooglePlacesProvider implements LeadProvider {
  name = "google_places";

  private readonly apiKey: string;

  constructor() {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      throw new Error("Missing GOOGLE_MAPS_API_KEY in environment variables.");
    }
    this.apiKey = key;
  }

  async search(query: LeadQuery): Promise<BusinessLead[]> {
    const endpoint = "https://places.googleapis.com/v1/places:searchText";

    const body = {
      textQuery: query.search,
      pageSize: 10,
      locationBias: {
        circle: {
          center: {
            latitude: query.latitude,
            longitude: query.longitude
          },
          radius: query.radiusMeters
        }
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.websiteUri",
          "places.nationalPhoneNumber",
          "places.rating",
          "places.userRatingCount",
          "places.addressComponents",
          "places.primaryType",
          "places.types"
        ].join(",")
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Places search failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as TextSearchResponse;
    const places = (data.places ?? []).filter((place) => looksRelevantToNiche(place, query.niche));

    return places.map((place) => {
      const { city, state } = extractCityAndState(place);

      return {
        source: this.name,
        externalId: place.id,
        businessName: place.displayName?.text ?? "Unknown Business",
        website: place.websiteUri,
        phone: place.nationalPhoneNumber,
        address: place.formattedAddress,
        city: city ?? query.city,
        state: state ?? query.state,
        niche: query.niche,
        googleRating: place.rating,
        reviewCount: place.userRatingCount,
        hasWebsite: Boolean(place.websiteUri),
        hasFacebook: false,
        hasInstagram: false,
        notes: [
          `Google primaryType: ${place.primaryType ?? "unknown"}`,
          `Google types: ${(place.types ?? []).join(", ")}`
        ]
      } satisfies BusinessLead;
    });
  }
}