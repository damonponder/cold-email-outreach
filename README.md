# Rank Missile Lead Discovery Engine

An AI-assisted lead discovery and qualification system for **Rank Missile**, designed to help identify local businesses that are likely to benefit from digital marketing and lead-conversion services.

This project is the front-end of a larger outbound sales workflow. Instead of relying on manually uploaded lead lists, the system is built to:

- discover potential business leads by niche and geography
- normalize and deduplicate results
- evaluate whether each business is a good fit for Rank Missile’s services
- identify the best service to pitch first
- score and prioritize leads before outreach

The long-term goal is to connect this engine to a broader campaign system that can personalize outbound messaging, manage replies, detect positive hand-raises, and sync qualified conversations back into GoHighLevel.

---

## Project Purpose

Many local businesses need help with one or more of the following:

- AI appointment setters that follow up by email, text, and voice
- SEO management
- social media management
- website design and rebuilds
- Google Business Profile management
- PPC ad management

This project helps Rank Missile find those businesses automatically and determine which offer is the best fit for each one.

Instead of blindly contacting random companies, the system is designed to identify businesses with visible marketing gaps such as:

- no website
- outdated website
- weak or missing local SEO signals
- poor review counts or weak reputation
- lack of social presence
- likely missed lead follow-up opportunities
- strong appointment-driven business model with no automation

---

## Core Concept

This is **not** a random scraper.

The system is designed so that:

- **data providers** gather business candidates
- **business rules** filter weak opportunities
- **Claude** acts as the qualification and scoring brain
- **Rank Missile** receives prioritized opportunities that are more likely to convert

The discovery process follows this structure:

```text
ICP Definition -> Query Generation -> Lead Discovery -> Normalization -> Dedupe -> Pre-Scoring -> Claude Qualification -> Prioritized Output