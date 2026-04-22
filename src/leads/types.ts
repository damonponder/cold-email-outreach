export type ServiceType =
  | "ai_appointment_setter"
  | "seo"
  | "social_media"
  | "website"
  | "gbp_management"
  | "ppc";

export type WebsiteSignals = {
  scanned: boolean;
  contactPageUrl?: string;
  emailsFound: string[];
  phonesFound: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  hasContactPage: boolean;
  hasBookingCTA: boolean;
  hasForm: boolean;
  siteLooksOutdated: boolean;
  title?: string;
  metaDescription?: string;
};

export type BusinessLead = {
  source: string;
  externalId?: string;
  businessName: string;
  website?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  address?: string;
  niche?: string;
  googleRating?: number;
  reviewCount?: number;
  hasWebsite: boolean;
  hasFacebook?: boolean;
  hasInstagram?: boolean;
  notes?: string[];
  websiteSignals?: WebsiteSignals;
};

export type QualifiedLead = BusinessLead & {
  qualified: boolean;
  score: number;
  bestService?: ServiceType;
  painPoints: string[];
  reason: string;
};