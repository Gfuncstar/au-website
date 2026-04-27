/**
 * lib/standards.ts
 *
 * SINGLE SOURCE OF TRUTH for the regulators and professional bodies AU's
 * teaching is anchored to. Drives:
 *   - StandardsStrip component (homepage + course detail pages)
 *   - /standards index page (overview of every body)
 *   - /standards/[slug] dedicated pages (deep dive: who they are, what
 *     they do, how AU teaches against them, which courses connect)
 *
 * Built per Giles' "add Read more to standards + each one has its page,
 * how AU works with the standards they teach against" call.
 */

import { COURSES } from "./courses";

export type StandardSlug =
  | "nice"
  | "jccp"
  | "cpsa"
  | "mhra"
  | "cqc"
  | "nmc"
  | "rcn"
  | "asa";

export type StandardContext = "clinical" | "regulatory" | "business" | "all";

export type Standard = {
  slug: StandardSlug;
  abbrev: string;
  name: string;
  /** One-sentence summary used on the StandardsStrip rail. */
  what: string;
  /** Longer description shown in the dedicated page hero. */
  about: string;
  /** What this body actually does — bullet points. */
  responsibilities: readonly string[];
  /** How AU teaches with / against this standard — 2–3 paragraphs. */
  howAU: readonly string[];
  /** Slugs of related AU courses that reference / align with this body. */
  relatedCourseSlugs: readonly string[];
  /** Official website (link out). */
  url: string;
  /** Which contexts this body is surfaced in. */
  contexts: readonly StandardContext[];
};

export const STANDARDS: readonly Standard[] = [
  {
    slug: "nice",
    abbrev: "NICE",
    name: "National Institute for Health and Care Excellence",
    what: "Sets the evidence-based clinical guidance the NHS works to. Every AU clinical course aligns to NICE pathways.",
    about:
      "NICE is the UK body that produces evidence-based guidance for the NHS on clinical decision-making, public health, and social care. Its guidance is the gold standard UK clinicians work to — including for skin conditions like acne and rosacea.",
    responsibilities: [
      "Develops clinical guidelines used by the NHS, including for non-surgical aesthetics-adjacent conditions (acne, rosacea, eczema, hyperpigmentation).",
      "Publishes severity-grading tools used by GPs and dermatologists for triage and escalation.",
      "Defines treatment pathways (topical, oral, in-clinic) and referral thresholds.",
      "Reviews the evidence base behind each recommendation and updates guidance as new clinical evidence emerges.",
    ],
    howAU: [
      "Every AU clinical course is built directly on NICE guidance. The Acne Decoded curriculum mirrors the NICE acne severity framework (mild, moderate, severe) and the staged treatment pathway. Rosacea Beyond Redness teaches the four NICE-recognised subtypes and the topical/oral management ladder.",
      "AU teaches NICE-aligned consultation: the history-taking, the lesion documentation, the psychosocial impact assessment, the photographic record. Practitioners leave the course able to defend a treatment plan to a GP, an insurer, or a complaint reviewer using the same framework.",
      "The point isn't to turn aesthetic practitioners into prescribers — it's to teach them when a presentation needs escalation, how to communicate that to the client, and how to document the decision so the practice is defensible.",
    ],
    relatedCourseSlugs: ["acne-decoded", "rosacea-beyond-redness"],
    url: "https://www.nice.org.uk",
    contexts: ["clinical", "all"],
  },
  {
    slug: "jccp",
    abbrev: "JCCP",
    name: "Joint Council for Cosmetic Practitioners",
    what: "The voluntary register for safe non-surgical aesthetics. Risk-based competence framework AU teaches against.",
    about:
      "The JCCP is the UK's voluntary register for non-surgical cosmetic practitioners. Backed by the Department of Health & Social Care and recognised by the Professional Standards Authority, it's the closest thing the industry has to a national professional register.",
    responsibilities: [
      "Maintains a public register of practitioners who have demonstrated they meet recognised competence standards.",
      "Defines a risk-based competence framework, aligning practitioner training and oversight to procedure risk.",
      "Promotes proportional regulation — higher-risk procedures, higher expectations.",
      "Works alongside the CPSA, which sets the underlying procedural and competence standards.",
    ],
    howAU: [
      "AU teaches the JCCP framework explicitly in the RAG Pathway. Practitioners learn how to map their own scope of practice against the JCCP register's competence levels — and where their training, insurance, and oversight either align or fall short.",
      "The Traffic Light System AU teaches is a direct translation of the risk-based logic the JCCP and CPSA use. Red, Amber, Green isn't AU's invention — it's how regulators already think. AU's contribution is making that logic legible to practitioners who've never been shown it.",
      "Practitioners considering JCCP registration get a clear-eyed read-out of what's required before they apply, what counts as evidence, and how to build a portfolio that holds up to peer review.",
    ],
    relatedCourseSlugs: ["free-2-day-rag", "rag-pathway"],
    url: "https://www.jccp.org.uk",
    contexts: ["regulatory", "all"],
  },
  {
    slug: "cpsa",
    abbrev: "CPSA",
    name: "Cosmetic Practice Standards Authority",
    what: "Sets the procedural and competence standards behind the JCCP register. Where Green / Amber / Red logic was formalised.",
    about:
      "The CPSA is the standards body that defines what 'competent' looks like in non-surgical aesthetics. It works alongside the JCCP — if the JCCP is the register, the CPSA is the rulebook the register draws from.",
    responsibilities: [
      "Publishes the formal procedural standards for non-surgical cosmetic interventions in the UK.",
      "Defines the competence and oversight required for each risk category (Green, Amber, Red).",
      "Reviews and updates standards as new procedures, devices, and evidence emerge.",
      "Provides the underlying logic the JCCP register, insurers, and increasingly council licensing teams use.",
    ],
    howAU: [
      "AU's regulatory teaching is anchored to CPSA standards. Practitioners learn what 'good' looks like — premises, infection control, consent, documentation, supervision — through the CPSA's lens, not a generic checklist.",
      "Where the CPSA standards are still evolving (which is most of them), AU teaches practitioners how to read direction-of-travel signals: which procedures are quietly being tightened, which ones are climbing the risk ladder, and where the next regulatory pressure is going to land.",
      "The aim is future-proofing. Practitioners aligned with CPSA standards today are already aligned with where statutory licensing is heading tomorrow.",
    ],
    relatedCourseSlugs: ["rag-pathway"],
    url: "https://www.cosmeticstandards.org.uk",
    contexts: ["regulatory", "all"],
  },
  {
    slug: "mhra",
    abbrev: "MHRA",
    name: "Medicines & Healthcare products Regulatory Agency",
    what: "Regulates products and devices used in non-surgical aesthetics. Higher scrutiny applies to higher-risk procedures.",
    about:
      "The MHRA is the UK government agency that regulates medicines, medical devices, and blood components. In aesthetics, it's the body that decides what's a prescription-only medicine, what's a device, and what's safe to use — and on whom.",
    responsibilities: [
      "Licenses medicines used in non-surgical aesthetics (e.g. botulinum toxin) — including who can prescribe, supply, and administer.",
      "Regulates medical devices used in clinic, including dermal fillers, energy-based devices, and microneedling tools.",
      "Investigates adverse incidents and product safety concerns through the Yellow Card scheme.",
      "Sets the supply chain rules for products entering the UK, including post-Brexit divergence from EU regulation.",
    ],
    howAU: [
      "AU teaches the MHRA-relevant rules explicitly: what counts as a prescription-only medicine, who can lawfully prescribe vs administer, what supply documentation looks like, and where most unintentional breaches actually happen.",
      "Acne Decoded references MHRA-licensed treatments and the prescribing chain that sits behind them. The RAG Pathway dedicates a module to the legal essentials — consent, capacity, supervision, prescribing pathways, indemnity — and how the MHRA framework underpins all of it.",
      "Practitioners leave AU courses able to read a product's MHRA licence and understand what it actually permits — rather than relying on a supplier's marketing claim.",
    ],
    relatedCourseSlugs: ["acne-decoded", "rag-pathway"],
    url: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency",
    contexts: ["clinical", "regulatory", "all"],
  },
  {
    slug: "cqc",
    abbrev: "CQC",
    name: "Care Quality Commission",
    what: "Already regulates Red-category procedures. Enforces a risk-escalation model consistent with the Traffic Light approach.",
    about:
      "The CQC is the independent regulator of health and adult social care services in England. Most non-surgical aesthetics doesn't currently fall under CQC registration — but the higher-risk end of the industry already does, and the line is moving.",
    responsibilities: [
      "Registers and inspects services that provide regulated activities — currently including some higher-risk aesthetics services.",
      "Sets fundamental standards for safety, dignity, and clinical governance.",
      "Has powers to investigate, enforce, and where necessary close services that fall short.",
      "Operates a risk-based regulatory model — same logic as the Traffic Light System AU teaches.",
    ],
    howAU: [
      "AU teaches practitioners how to think about CQC alignment even when their current scope sits outside formal registration. Why? Because CQC's risk-escalation logic is already being adopted by councils, insurers, and the JCCP — and because services that creep upward in risk eventually need it.",
      "The RAG Pathway 'Setting up your clinic' and 'Clinical governance' modules teach the documentation, audit, and complaints handling that underpin CQC compliance. Practitioners building toward registration get a head-start; those who'll never need formal registration still benefit from the rigor.",
      "The aim isn't bureaucracy. It's defensibility. If anything ever goes wrong, the practitioner who can produce a CQC-shaped governance record is the one who keeps their reputation.",
    ],
    relatedCourseSlugs: ["rag-pathway"],
    url: "https://www.cqc.org.uk",
    contexts: ["regulatory", "all"],
  },
  {
    slug: "nmc",
    abbrev: "NMC",
    name: "Nursing and Midwifery Council",
    what: "The statutory regulator for UK nurses. Bernadette is registered — verifiable on the NMC public register.",
    about:
      "The NMC is the statutory regulator for nurses, midwives, and nursing associates in the UK. Registration is mandatory to practise as a nurse — and registration brings ongoing accountability through the Code, revalidation, and fitness-to-practise procedures.",
    responsibilities: [
      "Maintains the register of UK nurses, midwives, and nursing associates — searchable on nmc.org.uk.",
      "Sets and enforces the NMC Code (the professional standards every registered nurse practises to).",
      "Operates revalidation — every nurse demonstrates ongoing competence every three years.",
      "Investigates and adjudicates fitness-to-practise concerns.",
    ],
    howAU: [
      "Bernadette is NMC registered (PIN 05G1755E, verifiable on the public register). That's not a marketing claim — it's a statutory regulator confirming, in real time, that the educator behind AU is a fit-to-practise UK nurse.",
      "AU's clinical voice sits inside the NMC tradition: evidence-based decision-making, accountability, professional duty of candour, safeguarding, and the patient-first ethics every NMC registrant works to. That's the spine of every AU clinical course.",
      "For nurse practitioners taking AU courses: the curriculum is designed to count toward NMC revalidation reflective practice. Every course closes with a Certificate of Completion you can use as evidence.",
    ],
    relatedCourseSlugs: ["acne-decoded", "rosacea-beyond-redness", "rag-pathway"],
    url: "https://www.nmc.org.uk",
    contexts: ["clinical", "all"],
  },
  {
    slug: "rcn",
    abbrev: "RCN",
    name: "Royal College of Nursing",
    what: "The largest UK nursing union and professional body. AU's clinical voice sits inside that tradition.",
    about:
      "The RCN is the UK's largest professional body and trade union for nurses, with over 500,000 members. Beyond representation, it produces clinical guidance, education resources, and policy positions that shape UK nursing practice.",
    responsibilities: [
      "Publishes evidence-based clinical guidance, including for skin conditions and aesthetic-adjacent care.",
      "Sets professional standards alongside the NMC, particularly around scope of practice and advanced practice roles.",
      "Provides legal, professional, and indemnity support to members.",
      "Influences UK health policy, including emerging non-surgical aesthetics regulation.",
    ],
    howAU: [
      "Bernadette is an RCN member. AU's teaching reflects the RCN's standards on advanced practice, scope, and ethics — including how to operate at the boundary of nursing and aesthetics without compromising either.",
      "The RCN has been one of the louder voices calling for clearer regulation of non-surgical aesthetics in England. AU's RAG Pathway draws on RCN policy positions and the underlying clinical reasoning, translating it for practitioners who don't necessarily come from nursing.",
      "For nurses considering aesthetics as a second career, AU's courses are designed to integrate cleanly with the RCN's advanced practice expectations.",
    ],
    relatedCourseSlugs: ["rag-pathway"],
    url: "https://www.rcn.org.uk",
    contexts: ["clinical", "all"],
  },
  {
    slug: "asa",
    abbrev: "ASA",
    name: "Advertising Standards Authority",
    what: "Polices what aesthetics practitioners can claim in marketing. AU teaches ASA-safe content as a core module.",
    about:
      "The ASA is the UK's independent advertising regulator. Online posts, before-and-afters, treatment claims, price-anchoring — all of it is advertising, and all of it falls under ASA jurisdiction. Aesthetics is one of the most-investigated sectors.",
    responsibilities: [
      "Administers the UK Code of Non-broadcast Advertising and Direct & Promotional Marketing (CAP Code).",
      "Investigates complaints — most aesthetics enforcement starts here, not in clinic.",
      "Bans ads found to mislead, harm, or breach the Code, with public rulings published on its site.",
      "Specifically polices prescription-only medicine claims (a major issue in aesthetics) — POMs cannot be advertised to the public at all.",
    ],
    howAU: [
      "The RAG Pathway has a dedicated module on ASA-safe marketing — what you can claim, what you can't, what gets your ads pulled, and where the line sits between education and promotion. It's the difference between a thriving online presence and a public ASA ruling.",
      "The 5K+ Formula's content authority module teaches practitioners how to build educational content that converts without breaching CAP rules. The 'create authority via content' work is anchored in ASA-safe practice from the start.",
      "Most aesthetics enforcement in 2026 starts on Instagram, not in clinic. AU teaches practitioners how to be visible without being vulnerable.",
    ],
    relatedCourseSlugs: ["rag-pathway", "5k-formula"],
    url: "https://www.asa.org.uk",
    contexts: ["regulatory", "business", "all"],
  },
];

export function getStandard(slug: string): Standard | undefined {
  return STANDARDS.find((s) => s.slug === slug);
}

/** Resolve related course objects from the slug list for a given Standard. */
export function getRelatedCourses(standard: Standard) {
  return standard.relatedCourseSlugs
    .map((slug) => COURSES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
}
