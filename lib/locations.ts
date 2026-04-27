/**
 * lib/locations.ts
 *
 * SINGLE SOURCE OF TRUTH for the geo landing pages at /for/[slug].
 *
 * Why these exist:
 *   The competitor research surfaced two genuine SEO opportunities:
 *     1. UK aesthetics regulation differs by nation. England has its
 *        new licensing scheme; Scotland uses HIS; Wales uses HIW;
 *        Northern Ireland uses RQIA. No competitor in the UK
 *        aesthetics-education space covers nation-level regulatory
 *        nuance comprehensively.
 *     2. Practitioner density is concentrated in 4–5 UK cities.
 *        "Aesthetic clinic compliance London" / "aesthetics business
 *        course Manchester" are real queries with weak SERP coverage.
 *
 * Pages are NOT thin SEO bait — each carries genuinely tailored content
 * about that nation/city's regulatory landscape, the practitioner
 * landscape there, and how AU's framework applies. Bernadette's NHS
 * background + MSc + JCCP-aware curriculum are specifically credible
 * here because the rules are evolving and few educators distinguish
 * between the four UK nations.
 *
 * Type design notes:
 *   - `kind: "nation" | "city"` drives layout + heading copy
 *   - `regulators[]` lists the bodies relevant to THIS location
 *     (e.g. JCCP / MHRA apply UK-wide; CQC is England-only;
 *     HIS replaces CQC in Scotland)
 *   - `relatedCourseSlugs[]` drives the course-strip on each page
 *   - `seoKeywords[]` drives meta keywords for that page
 */

export type LocationKind = "nation" | "city";

export type Location = {
  /** URL slug — `/for/${slug}`. */
  slug: string;
  /** Display name — "England", "London", etc. */
  name: string;
  /** "nation" or "city" — drives layout. */
  kind: LocationKind;
  /** Geo placement — used in JSON-LD `Place`. */
  region: "England" | "Scotland" | "Wales" | "Northern Ireland" | "United Kingdom";
  /** One-line summary used on tiles + meta description. */
  summary: string;
  /** Long-form lead paragraph for the page hero. */
  intro: string;
  /** Regulator slugs (from lib/standards.ts) that apply *here*. */
  regulators: readonly string[];
  /** Notes specific to this location's regulatory environment. */
  regulatoryNotes: readonly string[];
  /** What's distinctive about practitioners in this location. */
  practitionerLandscape: readonly string[];
  /** AU course slugs surfaced as the recommended path for practitioners
   *  here. Order matters — most relevant first. */
  relatedCourseSlugs: readonly string[];
  /** SEO keyword phrases this page targets. */
  seoKeywords: readonly string[];
  /** Optional eyebrow override. Defaults to "For UK practitioners". */
  eyebrow?: string;
};

export const LOCATIONS: readonly Location[] = [
  /* ============================================================
     UK NATIONS — regulatory differentiation is the core value
     ============================================================ */
  {
    slug: "england",
    name: "England",
    kind: "nation",
    region: "England",
    summary:
      "Aesthetics education and regulatory training for practitioners in England — built around the new licensing scheme, JCCP, CPSA, MHRA, and CQC.",
    intro:
      "England's aesthetics regulation is shifting fast. The Health and Care Act 2022 introduced a licensing scheme for non-surgical cosmetic procedures, and the Department of Health & Social Care's consultation has signalled where the line will fall. If you're practising in England and wondering whether you're already compliant, already exposed, or somewhere in between — this is what I built every framework on.",
    regulators: ["jccp", "cpsa", "mhra", "cqc", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "England's licensing scheme (Health and Care Act 2022, Part 5) is the headline change — once activated, certain non-surgical cosmetic procedures will require local-authority licensing in addition to professional registration.",
      "The JCCP voluntary register and CPSA competence framework set the de-facto standard most insurers and complaint reviewers already work to.",
      "CQC registration applies if your practice meets the thresholds for a regulated activity (e.g. prescribing, certain invasive treatments). Most pure-aesthetics clinics aren't CQC-registrable, but many have CQC-registered associates.",
      "ASA / CAP code applies to all marketing — England's Advertising Standards Authority enforcement is strict on before/after photography and outcome claims.",
    ],
    practitionerLandscape: [
      "Highest practitioner density in the UK — roughly 80% of UK aesthetic practitioners work in England.",
      "Significant variation between London/SE clinic economics and the rest of England. Pricing strategy that works in central London doesn't work in regional England.",
      "Nurse-led, doctor-led, and dentist-led clinics all coexist; each comes under different professional regulators (NMC / GMC / GDC) on top of the new licensing scheme.",
    ],
    relatedCourseSlugs: ["free-2-day-rag", "rag-pathway", "5k-formula", "acne-decoded"],
    seoKeywords: [
      "aesthetics regulation England",
      "aesthetics licensing scheme England",
      "JCCP-aligned training England",
      "aesthetic practitioner course England",
      "Health and Care Act aesthetics",
    ],
  },
  {
    slug: "scotland",
    name: "Scotland",
    kind: "nation",
    region: "Scotland",
    summary:
      "Aesthetics regulation in Scotland operates differently to the rest of the UK — Healthcare Improvement Scotland (HIS), not CQC. Built for Scottish practitioners.",
    intro:
      "If you practise in Scotland, the rulebook isn't the same one your friends in England are working from. Healthcare Improvement Scotland regulates independent clinics under the Healthcare Improvement Scotland (Inspection) Regulations. The forthcoming UK-wide licensing scheme has additional Scotland-specific implications. Every course I teach is anchored to UK-wide professional bodies (NMC, JCCP, CPSA) but I flag the points where Scottish regulation diverges so you don't end up working from the wrong assumption.",
    regulators: ["jccp", "cpsa", "mhra", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Healthcare Improvement Scotland (HIS) — not CQC — regulates independent healthcare clinics in Scotland. Registration is required where the clinic meets the regulated-activity thresholds.",
      "The proposed UK-wide licensing scheme is being implemented in stages and the Scottish position is still developing — expect divergence from the English model on enforcement and licensing categories.",
      "MHRA (medicines), NMC (nursing register), JCCP (voluntary practitioner register), and the ASA all apply UK-wide and operate the same way in Scotland as in England.",
      "NICE guidance is the gold standard England-wide, but in Scotland the Scottish Intercollegiate Guidelines Network (SIGN) is the parallel body — many of my clinical pathways reference both.",
    ],
    practitionerLandscape: [
      "Concentrated practitioner clusters in Edinburgh, Glasgow, and Aberdeen.",
      "Scottish clinics typically serve a more regulated cross-section of the UK industry — many practitioners are dual NMC/HIS-registered.",
      "Scottish practitioners face the same fee pressure as the rest of the UK but a smaller market — the case for a tighter pricing strategy is sharper.",
    ],
    relatedCourseSlugs: ["free-2-day-rag", "rag-pathway", "5k-formula"],
    seoKeywords: [
      "aesthetics regulation Scotland",
      "Healthcare Improvement Scotland aesthetics",
      "aesthetic practitioner course Scotland",
      "JCCP Scotland",
    ],
  },
  {
    slug: "wales",
    name: "Wales",
    kind: "nation",
    region: "Wales",
    summary:
      "Aesthetics regulation in Wales runs through Healthcare Inspectorate Wales (HIW). Tailored education for Welsh practitioners.",
    intro:
      "Welsh aesthetics regulation runs through Healthcare Inspectorate Wales, not CQC. Wales also runs its own primary-care and prescribing arrangements. If you practise in Wales — particularly if you cross the border into England regularly, as a lot of Welsh practitioners do — you're working with two parallel regulatory environments. Every framework I teach holds up in both, and I flag the divergences explicitly.",
    regulators: ["jccp", "cpsa", "mhra", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Healthcare Inspectorate Wales (HIW) — not CQC — regulates independent healthcare clinics in Wales.",
      "Welsh prescribing and Patient Group Direction (PGD) arrangements differ from English NHS arrangements; relevant for any clinic supplying Schedule 4 / Prescription-Only Medicines.",
      "MHRA, NMC, JCCP, CPSA, ASA all apply UK-wide.",
      "Many Welsh practitioners hold dual registration / dual-jurisdiction practice (Wales + bordering English counties).",
    ],
    practitionerLandscape: [
      "Practitioner density is concentrated around Cardiff, Swansea, and the M4 corridor.",
      "Cross-border practice is common — Welsh clinics often serve patients from neighbouring English counties.",
      "The market is smaller than England, which sharpens the case for differentiated positioning rather than competing on price.",
    ],
    relatedCourseSlugs: ["free-2-day-rag", "rag-pathway", "5k-formula"],
    seoKeywords: [
      "aesthetics regulation Wales",
      "Healthcare Inspectorate Wales aesthetics",
      "aesthetic practitioner course Wales",
      "Welsh aesthetics business",
    ],
  },
  {
    slug: "northern-ireland",
    name: "Northern Ireland",
    kind: "nation",
    region: "Northern Ireland",
    summary:
      "Aesthetics regulation in Northern Ireland — Regulation and Quality Improvement Authority (RQIA) — and how UK-wide bodies apply locally.",
    intro:
      "Northern Ireland regulation is its own conversation. The Regulation and Quality Improvement Authority (RQIA) inspects independent healthcare clinics; the NMC, MHRA, JCCP, CPSA and ASA all apply UK-wide. The forthcoming UK licensing scheme has its own NI implementation timeline. Every regulatory framework I teach is built so it holds up under RQIA inspection as cleanly as it does under CQC.",
    regulators: ["jccp", "cpsa", "mhra", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Regulation and Quality Improvement Authority (RQIA) — not CQC — inspects independent healthcare clinics in Northern Ireland.",
      "MHRA, NMC, JCCP, CPSA, and ASA all apply UK-wide and operate identically in NI.",
      "The aesthetics-licensing arrangements being introduced UK-wide will have NI-specific implementation depending on Stormont's position.",
      "Cross-border practice with the Republic of Ireland is a regulatory consideration — patients travelling for treatment is common.",
    ],
    practitionerLandscape: [
      "Smaller practitioner population than the rest of the UK; clusters around Belfast, Derry, and the wider Belfast metropolitan area.",
      "Many NI practitioners hold dual NMC + Irish Medical Council/Nursing & Midwifery Board of Ireland registration.",
      "The NI market is small but tight-knit — reputation effects compound faster than in larger markets, which is exactly what the RAG Pathway is built for.",
    ],
    relatedCourseSlugs: ["free-2-day-rag", "rag-pathway", "5k-formula"],
    seoKeywords: [
      "aesthetics regulation Northern Ireland",
      "RQIA aesthetics",
      "aesthetic practitioner course Northern Ireland",
      "Belfast aesthetics business",
    ],
  },
  /* ============================================================
     UK CITIES — practitioner-density-driven, not regulatory
     ============================================================ */
  {
    slug: "london",
    name: "London",
    kind: "city",
    region: "England",
    summary:
      "Aesthetics business and regulatory education for London practitioners — where fee pressure is highest and regulatory scrutiny is sharpest.",
    intro:
      "London is the densest aesthetic-practitioner market in the UK. Fee pressure is real, the Harley Street rate doesn't translate to Zone 4, and ASA enforcement on cosmetic marketing is highest here. Every framework I teach is built around that reality — pricing strategy that holds at premium central-London rates and at suburban-London rates, and a regulatory posture that holds up under the heightened scrutiny that comes with a London postcode.",
    regulators: ["jccp", "cpsa", "mhra", "cqc", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "London practitioners face the strictest ASA scrutiny on cosmetic-marketing claims — local journalism and consumer-rights complaints are concentrated here.",
      "CQC registration thresholds and the new England-wide licensing scheme apply identically across London boroughs.",
      "Many London clinics operate under associate / locum models with multiple practitioners — the regulatory implications for the lead clinician are non-trivial.",
    ],
    practitionerLandscape: [
      "Highest density of injectors, advanced practitioners, and clinic owners in the UK.",
      "Sharp polarisation between Harley Street / central London (premium fees, very high overheads) and outer London (moderate fees, very high practitioner saturation).",
      "Marketing competition is brutal — the differentiator strategy I teach in the 5K+ Formula is built for exactly this market.",
    ],
    relatedCourseSlugs: ["5k-formula", "rag-pathway", "free-2-day-rag", "acne-decoded"],
    seoKeywords: [
      "aesthetics business course London",
      "aesthetic practitioner training London",
      "JCCP-aligned training London",
      "London clinic owner course",
    ],
  },
  {
    slug: "manchester",
    name: "Manchester",
    kind: "city",
    region: "England",
    summary:
      "Aesthetics education for Manchester and the wider North West — a fast-growing aesthetics market with its own competitive dynamics.",
    intro:
      "Manchester and the wider North West has been one of the fastest-growing aesthetic markets in the UK over the last five years. Practitioner density is rising fast, fee pressure is sharpening, and the city's aesthetic identity — cleaner, less-overdone work — has its own pricing implications. Every framework I teach is regulator-aligned and pricing-disciplined, designed to hold up in a market that's maturing fast.",
    regulators: ["jccp", "cpsa", "mhra", "cqc", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Same England-wide regulatory framework as the rest of the country — JCCP / CPSA / MHRA / CQC / NICE / ASA / NMC.",
      "The new licensing scheme rolls out at local-authority level, so regulation timing in Greater Manchester may differ from neighbouring authorities.",
    ],
    practitionerLandscape: [
      "One of the fastest-growing aesthetic-practitioner populations in the UK — concentrated around Manchester, Salford, Stockport, and Cheshire.",
      "Strong cluster of nurse-led and doctor-led clinics; the market values clinical credibility.",
      "Pricing tends to land below central London but above the wider North.",
    ],
    relatedCourseSlugs: ["5k-formula", "rag-pathway", "free-2-day-rag"],
    seoKeywords: [
      "aesthetics business course Manchester",
      "aesthetic practitioner training Manchester",
      "Manchester clinic owner course",
    ],
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    kind: "city",
    region: "England",
    summary:
      "Aesthetics education for Birmingham and the West Midlands — a large, diverse market with strong dental-led aesthetic representation.",
    intro:
      "Birmingham and the West Midlands hold one of the largest concentrated aesthetic markets outside London. The market is diverse — heavy nurse-led representation, strong dental-aesthetic crossover, an active doctor-led cluster around the Edgbaston / Harborne corridor. Every framework I teach is built around the realities of operating in a large, varied market where one-size positioning fails.",
    regulators: ["jccp", "cpsa", "mhra", "cqc", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Same England-wide regulatory framework — and a particularly active GDC presence given the strong dental-aesthetic crossover in the region.",
      "Birmingham City Council and surrounding local authorities are early adopters on health-and-safety enforcement; expect proactive licensing-scheme rollout.",
    ],
    practitionerLandscape: [
      "Large, highly varied practitioner mix — nurses, doctors, dentists, advanced practitioners, all with different regulatory anchors.",
      "Strong dental-aesthetic crossover — relevant for any practitioner working alongside dentists or in dental-attached clinics.",
      "Pricing varies dramatically between central Birmingham (premium) and surrounding towns; the differentiation case the 5K+ Formula makes is unusually sharp here.",
    ],
    relatedCourseSlugs: ["5k-formula", "rag-pathway", "free-2-day-rag"],
    seoKeywords: [
      "aesthetics business course Birmingham",
      "aesthetic practitioner training Birmingham",
      "West Midlands aesthetics",
    ],
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    kind: "city",
    region: "Scotland",
    summary:
      "Aesthetics education for Edinburgh practitioners — Scottish regulation, premium positioning, and the realities of a smaller premium market.",
    intro:
      "Edinburgh is Scotland's premium aesthetic market — smaller in volume than Glasgow, but typically higher in fee tolerance. You're working under HIS rather than CQC; under the same UK-wide JCCP / CPSA / MHRA / NMC framework as the rest of the UK; and inside a market that punishes weak positioning. Every framework I teach is regulator-aligned for Scotland and pricing-disciplined for a market this size.",
    regulators: ["jccp", "cpsa", "mhra", "nice", "asa", "nmc"],
    regulatoryNotes: [
      "Healthcare Improvement Scotland (HIS) — not CQC — regulates independent healthcare clinics in Edinburgh.",
      "MHRA, NMC, JCCP, CPSA, and ASA all apply UK-wide.",
      "SIGN guidance complements NICE in Scotland — both inform clinical pathway design in my courses.",
    ],
    practitionerLandscape: [
      "Smaller market than London or Manchester, but typically higher fee tolerance per treatment.",
      "Concentrated around Edinburgh New Town, Stockbridge, and the Bruntsfield / Morningside corridor.",
      "Premium positioning genuinely matters — undifferentiated injectors struggle.",
    ],
    relatedCourseSlugs: ["5k-formula", "rag-pathway", "free-2-day-rag"],
    seoKeywords: [
      "aesthetics business course Edinburgh",
      "aesthetic practitioner training Edinburgh",
      "Scotland aesthetics regulation",
    ],
  },
];

export function getLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getLocationsByKind(kind: LocationKind): readonly Location[] {
  return LOCATIONS.filter((l) => l.kind === kind);
}
