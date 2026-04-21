import * as cheerio from "cheerio";
import type { WebsiteSignals } from "../leads/types.js";

function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return [...new Set(matches.map((email) => email.toLowerCase()))];
}

function extractPhones(text: string): string[] {
  const matches =
    text.match(/(\+?1[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g) ?? [];
  return [...new Set(matches.map((phone) => phone.trim()))];
}

function looksOutdated(html: string, text: string): boolean {
  const indicators = [
    "copyright 2018",
    "copyright 2019",
    "best viewed in",
    "under construction",
    "flash",
    "frameset"
  ];

  const lowered = `${html} ${text}`.toLowerCase();
  return indicators.some((term) => lowered.includes(term));
}

function findContactPageUrl(baseUrl: string, $: cheerio.CheerioAPI): string | undefined {
  const links = $("a")
    .map((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim().toLowerCase();
      return { href, text };
    })
    .get();

  const contactLink = links.find(
    (link) =>
      link.href &&
      (link.text.includes("contact") ||
        link.href.toLowerCase().includes("contact") ||
        link.text.includes("about"))
  );

  if (!contactLink?.href) return undefined;

  try {
    return new URL(contactLink.href, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function findSocialLinks($: cheerio.CheerioAPI) {
  const hrefs = $("a")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter(Boolean) as string[];

  const findMatch = (domain: string) => hrefs.find((href) => href.includes(domain));

  return {
    facebook: findMatch("facebook.com"),
    instagram: findMatch("instagram.com"),
    linkedin: findMatch("linkedin.com"),
    youtube: findMatch("youtube.com")
  };
}

export async function scanWebsite(url: string): Promise<WebsiteSignals> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "RankMissileLeadScanner/1.0"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const emailsFound = extractEmails(bodyText);
    const phonesFound = extractPhones(bodyText);
    const socialLinks = findSocialLinks($);
    const contactPageUrl = findContactPageUrl(url, $);

    const hasBookingCTA =
      bodyText.toLowerCase().includes("book now") ||
      bodyText.toLowerCase().includes("schedule") ||
      bodyText.toLowerCase().includes("appointment") ||
      bodyText.toLowerCase().includes("get started");

    const hasForm = $("form").length > 0;

    return {
      scanned: true,
      contactPageUrl,
      emailsFound,
      phonesFound,
      socialLinks,
      hasContactPage: Boolean(contactPageUrl),
      hasBookingCTA,
      hasForm,
      siteLooksOutdated: looksOutdated(html, bodyText),
      title: $("title").first().text().trim() || undefined,
      metaDescription:
        $('meta[name="description"]').attr("content")?.trim() || undefined
    };
  } catch {
    return {
      scanned: false,
      emailsFound: [],
      phonesFound: [],
      socialLinks: {},
      hasContactPage: false,
      hasBookingCTA: false,
      hasForm: false,
      siteLooksOutdated: false
    };
  }
}