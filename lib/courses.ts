/**
 * lib/courses.ts
 *
 * SINGLE SOURCE OF TRUTH for AU's courses. The catalogue is open-ended —
 * add a Course entry to the COURSES array and every consumer (homepage
 * grid, /courses index, /courses/[slug] detail, sitemap, schema, OG
 * images, Nav drawer, geo-page recommended sections) updates automatically.
 *
 * Drives:
 *   - Homepage course grid (CourseCard tiles)
 *   - /courses index
 *   - /courses/[slug] detail pages
 *   - JSON-LD structured data on each course page
 *
 * Course copy taken verbatim from:
 *   - clone-aesthetics-unlocked/copy.md (rewritten marketing voice)
 *   - clone-aesthetics-unlocked/course-content.md (course-voice openers)
 *
 * RULE: never duplicate course copy in pages or components. Import from here.
 */

import { courseKartraPlaceholder } from "./links";

export type CourseTone = "black" | "charcoal" | "pink" | "pink-soft" | "cream";

export type CourseModule = {
  num: string;
  title: string;
  body: string;
  /** Sub-topics covered inside this module — the SCOPE, not the
   *  answers. Surfaces the depth without giving away paywalled content. */
  topics?: readonly string[];
};

/**
 * A "before → after" transformation pair. Drives the "what will change
 * for you" section on every course detail page — the headline outcome
 * a practitioner walks away with after taking the course.
 */
export type CourseTransformation = {
  before: string;
  after: string;
};

export type CourseAvailability = "available" | "waitlist";

export type Course = {
  /** URL slug — `/courses/${slug}`. */
  slug: string;
  /** Eyebrow shown above the title — e.g. "Free · 3 days". */
  eyebrow: string;
  /** Course title — TM marks preserved. */
  title: string;
  /** One-line summary used on tiles + meta description. */
  summary: string;
  /** Long-form lead paragraph for the detail-page hero. */
  body: string;
  /** Course-content voice opener — quoted as social proof on the sales page. */
  voiceQuote?: string;
  /** Outcomes — short verb-led phrases used on the "What you'll learn" rail. */
  bullets: readonly string[];
  /** Stat rail used on tiles + sales-page hero. */
  stats: readonly string[];
  /** Curriculum modules surfaced on the detail page. */
  modules: readonly CourseModule[];
  /** Optional GBP price. `undefined` = free. */
  price?: number;
  /** CTA label for tiles. */
  ctaText: string;
  /**
   * Kartra destination for this course's primary CTA (enrol now, join
   * waitlist, or free opt-in form). PLACEHOLDER until Bernadette
   * provides the real URL — see `courseKartraPlaceholder()` in
   * lib/links.ts. Search the codebase for `TODO_KARTRA_course_` to
   * find every unfilled course CTA.
   */
  kartraUrl: string;
  /** AU palette tone driving the tile background. */
  tone: CourseTone;
  /** Audience tag — "Free taster", "Clinical", "Business", "Regulatory". */
  category: "Free taster" | "Clinical" | "Business" | "Regulatory";
  /** Format note — "3 days", "12 weeks", "Self-paced", etc. */
  format: string;
  /**
   * "available" → buyable today.
   * "waitlist" → opt-in only; show waitlist CTA on sales page.
   */
  availability: CourseAvailability;
  /** /public path to a backdrop image rendered behind the card body.
   *  Layered with mix-blend-* depending on tone so the texture reads
   *  without flattening the type. One per course → visual variety
   *  across the grid. */
  bgImage?: string;
  /** Single-sentence promise the course delivers. Surfaced near the
   *  hero — answers "why should I take this course" instantly. */
  promise?: string;
  /** Before → after transformations. 3–5 pairs typical. */
  transformations?: readonly CourseTransformation[];
  /** Why Bernadette specifically teaches this course. Course-specific
   *  paragraph anchoring her authority for the topic at hand. */
  whyBernadette?: string;
  /** What's actually included with enrolment — modules, certificate,
   *  lifetime access, support level, etc. Practitioners deciding on
   *  paid courses want to see this. */
  includes?: readonly string[];
  /** Course-specific FAQs. Generic ones live in lib/faqs.ts. */
  faqs?: readonly { q: string; a: string }[];
  /** Exact `membership_name` Kartra returns for this course in
   *  `lead.memberships[]`. Used by the members-area launchpad to
   *  resolve "owned memberships → owned courses". Co-located here so
   *  adding a course only touches this file (no external mapping). */
  kartraMembershipName?: string;
  /** Slug of the **paid** course this free taster is the lead-magnet
   *  front-door for. Drives the upsell rail rendered inside the free
   *  course and the "if you've taken the Mini" continuity language on
   *  the paid sales page. Only set on free tasters. */
  upsellsTo?: string;
  /** Slug of the **free** taster that fronts this paid course. Inverse
   *  of `upsellsTo`. Drives the "have you taken the Mini?" CTA on paid
   *  sales pages and the parentCourse link inside the free Mini's
   *  members-area chrome. */
  freeTasterSlug?: string;
  /** Time commitment as a short reader-facing string, e.g.
   *  "≈ 2 hrs / week" or "≈ 30 min total". Surfaced on cards + the
   *  detail-page stat strip so practitioners can plan their week
   *  before they enrol. */
  weeklyHours?: string;
  /** A concrete, defensible value anchor used on higher-priced course
   *  detail pages so the price has context. Two short lines work best,
   *  e.g. "Equivalent CPD pathway with a private dermatology educator:
   *  £600+/day" + "One additional retained client at £200/treatment
   *  pays this back in two visits." Compliant — never claims an
   *  outcome, just frames opportunity cost. */
  valueAnchor?: readonly string[];
  /** True if the course is structured for CPD evidence + NMC
   *  revalidation reflective practice, with a downloadable
   *  Certificate of Completion. Drives a chip on the catalogue card
   *  and a one-line strip on the detail page. */
  isCpdEvidence?: boolean;
};

export const COURSES: readonly Course[] = [
  /* ============================================================
     FREE TASTERS
     ============================================================ */
  {
    slug: "free-3-day-startup",
    kartraMembershipName: "The 5K+ Formula™ Mini",
    upsellsTo: "5k-formula",
    eyebrow: "Free · 3 days",
    title: "The 5K+ Formula™ Mini",
    summary:
      "A free 3-day clarity reset for practitioners who feel busy but not paid.",
    body: "Not another marketing course. Not “post more on Instagram.” Three short lessons on the maths and mindset that decide whether your clinic actually pays you. By the end of Day 3 you'll know exactly which clients and services are most likely to grow your income, without adding more treatments or more hours.",
    voiceQuote:
      "You're not here to fit into the industry. You're here to find your place within it.",
    bullets: ["Niche clarity", "Brand positioning", "Profit awareness"],
    stats: ["3 days", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Day 1: Niche awareness",
        body: "Stop trying to be everything. The exercise that surfaces the niche where your expertise, your interest and the economics actually line up.",
      },
      {
        num: "02",
        title: "Day 2: Brand awareness",
        body: "The one-line brand statement that turns “another injector” into “the practitioner I trust.” Built in 30 minutes.",
      },
      {
        num: "03",
        title: "Day 3: Profit awareness",
        body: "The simple weekly read-out that tells you whether your clinic is busy or actually profitable, and what to change first.",
      },
    ],
    ctaText: "Get instant access",
    kartraUrl: courseKartraPlaceholder("free-3-day-startup"),
    tone: "black",
    category: "Free taster",
    format: "3 days · self-paced",
    availability: "available",
    bgImage: "/backgrounds/pink-grunge-deep.png",
    promise:
      "By the end of Day 3, you'll know exactly which clients and services are most likely to grow your income, without adding more treatments, more hours, or more guesswork.",
    transformations: [
      {
        before:
          "Trying to be everything, every treatment, every trend, every client. Privately overwhelmed.",
        after:
          "A clear niche based on where your expertise, interest, and the economics actually line up.",
      },
      {
        before:
          "Sounding like every other injector in your area. Marketing that competes on price.",
        after:
          "A one-line brand statement that turns “another injector” into “the practitioner I trust.”",
      },
      {
        before:
          "Busy diary, but privately unsure if the clinic is actually paying you.",
        after:
          "A simple weekly read-out that tells you whether your clinic is busy or actually profitable, and what to change first.",
      },
    ],
    whyBernadette:
      "I built my own clinic, Visage Aesthetics, using this exact reset. It went on to win Best Non-Surgical Aesthetics Clinic 2026 (Essex). The 5K+ Formula™ is my playbook, refined over twelve years of running a real clinic under real fee pressure. The Mini is the front door.",
    includes: [
      "Three short daily lessons released over 3 days",
      "Lifetime access, revisit any time",
      "A simple weekly numbers read-out you can keep",
      "Self-paced, work it around your clinic",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. Three days of strategic clarity, fully free. No credit card, no upsell required to access the lessons.",
      },
      {
        q: "Do I get a certificate?",
        a: "The Mini doesn't include a Certificate of Completion, that sits with the full 5K+ Formula™ programme. The Mini is designed as a clarity reset, not a CPD module.",
      },
      {
        q: "Will it sell me on the paid course?",
        a: "There's a soft transition at the end if you want to keep going, but no pressure. The Mini stands on its own; many practitioners take it, do the work, and never enrol in the paid programme.",
      },
    ],
    weeklyHours: "≈ 30 min total",
    isCpdEvidence: false,
  },
  {
    slug: "free-2-day-rag",
    kartraMembershipName: "From Regulation to Reputation™ Mini",
    upsellsTo: "rag-pathway",
    eyebrow: "Free · 2 days",
    title: "From Regulation to Reputation™ Mini",
    summary:
      "A free 2-day reality check on UK aesthetics regulation, built for practitioners in England.",
    body: "Built for practitioners in England who want to know exactly where they stand before the regulator decides for them. Two days. The honest read-out, framed around the Traffic Light System, Red, Amber, Green, so you can see your scope of practice, your risk gaps, and your next move.",
    voiceQuote:
      "Most practitioners don't get into trouble for being careless. They get into trouble because the rules were never clearly explained to them.",
    bullets: [
      "Scope of practice",
      "Risk-gap audit",
      "The Traffic Light System",
    ],
    stats: ["2 days", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Day 1: The aesthetics reality check",
        body: "What the rules actually say, what they don't, and where the line sits for practitioners in England today.",
      },
      {
        num: "02",
        title: "Day 2: The Traffic Light System",
        body: "🔴 Red, 🟠 Amber, 🟢 Green. The decision-making muscle that lets you triage every new procedure, marketing claim and treatment offer at a glance.",
      },
    ],
    ctaText: "Get instant access",
    kartraUrl: courseKartraPlaceholder("free-2-day-rag"),
    tone: "pink",
    category: "Free taster",
    format: "2 days · self-paced",
    availability: "available",
    bgImage: "/backgrounds/pink-halftone.png",
    promise:
      "Two days. The honest read-out on where you stand under England's evolving aesthetics regulation, before someone else decides for you.",
    transformations: [
      {
        before:
          "Confusing confidence with compliance. Following what others are doing online.",
        after:
          "A clear-eyed read on what you can defend, what you can't, and exactly where the line sits today.",
      },
      {
        before:
          "Vague unease about scope of practice, supervision, marketing claims.",
        after:
          "The Traffic Light System (Red / Amber / Green) as a working decision-making muscle for every new procedure, claim, or treatment.",
      },
      {
        before:
          "Relying on training certificates as if they were permission to practise.",
        after:
          "Understanding the difference between training and authorisation, and where most unintentional breaches actually start.",
      },
    ],
    whyBernadette:
      "I'm NMC-registered (verifiable on the public register) and an MSc Advanced Practice nurse. I lecture postgraduate clinicians on regulation, lead clinical workforce governance for an NHS Trust, and I built my own clinic to JCCP / CPSA-aligned standards. The Traffic Light System I teach isn't theory, it's how regulators already think.",
    includes: [
      "Two short lessons released over 2 days",
      "The full Traffic Light System (Red / Amber / Green)",
      "Lifetime access, revisit any time",
      "Self-paced, work it around your clinic",
    ],
    faqs: [
      {
        q: "Is this England-only?",
        a: "Yes. The regulatory framework taught is specific to England, the JCCP, CPSA, MHRA, CQC and ASA jurisdiction. Practitioners in Scotland, Wales, or Northern Ireland will find the principles useful but the licensing detail differs.",
      },
      {
        q: "Will this turn me into a regulator?",
        a: "No. The aim is to help you recognise risk before risk recognises you, not to make you an expert in legislation. You'll leave able to triage decisions the way regulators already do.",
      },
      {
        q: "What's the difference between this and the full RAG Pathway?",
        a: "The Mini gives you awareness, the conceptual framework. The full RAG Pathway (4 weeks, paid) gives you the documentation, governance systems, and defensible practice records to actually operate inside it day-to-day.",
      },
    ],
    weeklyHours: "≈ 25 min total",
    isCpdEvidence: false,
  },

  {
    slug: "free-acne-decoded",
    kartraMembershipName: "Acne Decoded Mini",
    upsellsTo: "acne-decoded",
    eyebrow: "Free · 3 lessons",
    title: "Acne Decoded, The Mini",
    summary:
      "A free 3-lesson taster of the science underneath every breakout, and why most plans fail.",
    body: "Free, 20-minute taster of the full Acne Decoded course. Three short lessons that reframe acne from a hygiene problem into a chronic inflammatory condition with four interlocking drivers, sebum, hyperkeratinisation, microbiome, inflammation, and show you why most plans fail by treating one or two of them. NICE-aligned. Honest. Yours to keep.",
    voiceQuote:
      "Acne is not simply a cosmetic concern. It is a complex, chronic inflammatory skin condition that affects individuals physically, psychologically, and socially.",
    bullets: [
      "Why acne isn't a hygiene problem",
      "The four mechanisms underneath every breakout",
      "Why most acne plans fail",
    ],
    stats: ["3 lessons", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Welcome",
        body: "Why this short course exists, what you'll walk away with, and where it leads.",
      },
      {
        num: "02",
        title: "What acne actually is",
        body: "A science-led definition, the four mechanisms behind every breakout, and why hygiene has nothing to do with it.",
      },
      {
        num: "03",
        title: "Where to go from here",
        body: "What's missing, and the clinical pathway that picks up exactly where this Mini ends.",
      },
    ],
    ctaText: "Get instant access",
    kartraUrl: courseKartraPlaceholder("free-acne-decoded"),
    tone: "cream",
    category: "Free taster",
    format: "3 lessons · self-paced",
    availability: "available",
    bgImage: "/backgrounds/cream-halftone.png",
    promise:
      "Twenty minutes. The science under every breakout, so the next acne consultation feels less like guessing and more like clinical reasoning.",
    transformations: [
      {
        before:
          "Treating acne as a hygiene problem with the same protocol every time.",
        after:
          "Treating acne as a chronic inflammatory condition with four interlocking drivers, and a plan that addresses all four.",
      },
      {
        before:
          "Plans that work for one client and not the next.",
        after:
          "A clear mental model of why some plans hold and some don't, even before you change a single product.",
      },
    ],
    whyBernadette:
      "I'm an Advanced Nurse Practitioner, MSc Advanced Practice, NMC registered, and I lecture postgraduate clinicians on conditions like this. The Mini distils the opening of the full Acne Decoded course, same NICE-aligned approach, no protocols borrowed from social media.",
    includes: [
      "Three short lessons (~20 minutes total)",
      "Lifetime access, revisit any time",
      "The four-mechanism model of acne",
      "A clear next step if you want the full clinical pathway",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. Three lessons, fully free. No credit card. The science in Lesson 2 is yours to keep, whether you ever take the paid course or not.",
      },
      {
        q: "Will it sell me on the paid course?",
        a: "Lesson 3 is a clear pointer to the full course if you want to keep going, but no pressure. Many practitioners take the Mini, do the work, and never enrol in the paid programme.",
      },
      {
        q: "Do I get a certificate?",
        a: "The Mini doesn't include a Certificate of Completion, that sits with the full Acne Decoded course. The Mini is designed as a clarity reset, not a CPD module.",
      },
    ],
    weeklyHours: "≈ 20 min total",
    isCpdEvidence: false,
  },
  {
    slug: "free-rosacea-beyond-redness",
    kartraMembershipName: "Rosacea Beyond Redness Mini",
    upsellsTo: "rosacea-beyond-redness",
    eyebrow: "Free · 3 lessons",
    title: "Rosacea Beyond Redness, The Mini",
    summary:
      "A free 3-lesson taster on why rosacea is a barrier-and-microbiome condition, not a redness problem.",
    body: "Free, 20-minute taster of the full Rosacea Beyond Redness course. Three short lessons that reframe rosacea from a redness problem into a barrier-and-microbiome condition with four NICE-recognised subtypes, and show you why barrier-first treatment outperforms anti-inflammatory-first treatment in most cases. NICE-aligned. Honest. Yours to keep.",
    voiceQuote:
      "Build knowledge, confidence, and safe decision-making when working with clients who may present with rosacea.",
    bullets: [
      "Rosacea as a barrier-and-microbiome condition",
      "The four NICE-recognised subtypes",
      "Why barrier-first beats anti-redness-first",
    ],
    stats: ["3 lessons", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Welcome",
        body: "Why this short course exists, who it's for, and what you'll walk away with.",
      },
      {
        num: "02",
        title: "What rosacea actually is",
        body: "The four subtypes, why barrier matters more than anti-inflammatory, and what most plans miss.",
      },
      {
        num: "03",
        title: "Where to go from here",
        body: "What's missing, and the clinical pathway that picks up exactly where this Mini ends.",
      },
    ],
    ctaText: "Get instant access",
    kartraUrl: courseKartraPlaceholder("free-rosacea-beyond-redness"),
    tone: "pink-soft",
    category: "Free taster",
    format: "3 lessons · self-paced",
    availability: "available",
    bgImage: "/backgrounds/cream-halftone.png",
    promise:
      "Twenty minutes. The science underneath the redness, so the next rosacea consultation lands on the right pathway, not the textbook one.",
    transformations: [
      {
        before:
          "Reaching for the same anti-redness regimen on every rosacea presentation.",
        after:
          "Recognising the four NICE-recognised subtypes and knowing each one needs a different pathway.",
      },
      {
        before:
          "Plans that calm the surface but don't change the underlying condition.",
        after:
          "A barrier-first mental model that treats rosacea as the condition it actually is, not the symptom that's most visible.",
      },
    ],
    whyBernadette:
      "I'm an Advanced Nurse Practitioner, MSc Advanced Practice, NMC registered. My clinic, Visage Aesthetics, Best Non-Surgical Aesthetics Clinic 2026 (Essex), sees rosacea every week. The Mini distils the opening of the full Rosacea Beyond Redness course.",
    includes: [
      "Three short lessons (~20 minutes total)",
      "Lifetime access, revisit any time",
      "The four-subtype model of rosacea",
      "A clear next step if you want the full clinical pathway",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. Three lessons, fully free. No credit card. The science in Lesson 2 is yours to keep, whether you ever take the paid course or not.",
      },
      {
        q: "Will it sell me on the paid course?",
        a: "Lesson 3 is a clear pointer to the full course if you want to keep going, but no pressure. Many practitioners take the Mini, do the work, and never enrol in the paid programme.",
      },
      {
        q: "Do I get a certificate?",
        a: "The Mini doesn't include a Certificate of Completion, that sits with the full Rosacea Beyond Redness course. The Mini is designed as a clarity reset, not a CPD module.",
      },
    ],
    weeklyHours: "≈ 20 min total",
    isCpdEvidence: false,
  },
  {
    slug: "free-clinical-audit",
    kartraMembershipName: "The England Aesthetic Compliance Audit",
    upsellsTo: "rag-pathway",
    eyebrow: "Free · 8-section audit",
    title: "The England Aesthetic Compliance Audit",
    summary:
      "A free 8-section self-audit that shows you exactly where your clinic stands against England's aesthetic compliance requirements, before someone else decides for you.",
    body: "The compliance audit Bernadette runs against her own clinic, distilled for English aesthetic practitioners to use straight away. Eight sections of yes/no checks covering health & safety, licensing, clinical paperwork, infection control, GDPR, essential policies, stock control, and aftercare. Plus a closing inspection-readiness check. Self-paced. Honest. Yours to keep.",
    voiceQuote:
      "You don't need to be perfect. You need to be defensible. The audit shows you where the gap actually is, before someone else decides for you.",
    bullets: [
      "Map your clinic against eight compliance areas",
      "See exactly which documents you're missing",
      "Triage what to fix first",
    ],
    stats: ["8 sections", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Section 1: Health & Safety",
        body: "COSHH, Safety Data Sheets, and the risk assessments every English aesthetic clinic is legally expected to hold.",
        topics: [
          "COSHH risk assessments, completed, accessible, reviewed annually",
          "Dermal fillers and injectables included within COSHH",
          "Safety Data Sheets (SDS) for every product in clinic",
          "Fire, treatment-specific, and infection-control risk assessments",
          "Where to source: HSE templates · manufacturer SDS",
        ],
      },
      {
        num: "02",
        title: "Section 2: Licensing & regulation (England)",
        body: "Local-authority Special Treatments Licences, the incoming national licensing scheme, treatment-specific insurance, and the qualifications evidence inspectors actually look for.",
        topics: [
          "Special Treatments Licence, checked, obtained, conditions followed",
          "Awareness of the incoming national licensing scheme",
          "Practitioner + premises licensing readiness",
          "Treatment-specific insurance (e.g. Hamilton Fraser)",
          "Certificates and CPD evidence matched to treatments performed",
        ],
      },
      {
        num: "03",
        title: "Section 3: Core clinical paperwork",
        body: "Consultation, consent, treatment records and photography, the four-document foundation underneath every defensible plan.",
        topics: [
          "Full medical history, recorded and updated regularly",
          "Treatment-specific consent forms, signed, dated, risks outlined",
          "Treatment record per visit, products, batch, dosage, area, date",
          "Before/after photography with consent, secure storage, and record-link",
        ],
      },
      {
        num: "04",
        title: "Section 4: Infection control & clinical safety",
        body: "Written infection-control policy, sharps and clinical waste disposal, and the complication / emergency protocols you need before something happens.",
        topics: [
          "Written infection-control procedures + cleaning + hand hygiene",
          "Sharps bins, clinical waste contract, collection records",
          "Written complication management plan + emergency procedures",
          "Adverse event log + escalation / referral pathway",
        ],
      },
      {
        num: "05",
        title: "Section 5: Data protection (GDPR)",
        body: "ICO registration, privacy policy, secure record storage and a clear retention rule, the data spine the rest of the audit hangs on.",
        topics: [
          "Registered with the Information Commissioner's Office",
          "Privacy policy in place and accessible to clients",
          "Secure client record storage with access controls",
          "Data retention policy defined and applied",
        ],
      },
      {
        num: "06",
        title: "Section 6: Essential policies & documents",
        body: "Complaints, accidents, safeguarding, lone working, health & safety, staff, the policy file inspectors and insurers expect to find on day one.",
        topics: [
          "Complaints procedure",
          "Accident / incident log",
          "Safeguarding policy (where applicable)",
          "Lone working policy + Health & Safety policy",
          "Staff policies (where applicable)",
        ],
      },
      {
        num: "07",
        title: "Section 7: Product & stock control",
        body: "Approved suppliers, batch traceability, expiry monitoring, storage and tracking, the supply-chain audit that protects every treatment record above.",
        topics: [
          "Products sourced from approved suppliers only",
          "Batch numbers recorded per client treatment",
          "Expiry dates monitored",
          "Storage conditions followed (temperature + security)",
          "Stock tracking system in place",
        ],
      },
      {
        num: "08",
        title: "Section 8: Aftercare & follow-up",
        body: "Written aftercare on every treatment, follow-up plans, and a closing inspection-readiness check so you know the audit holds together end-to-end.",
        topics: [
          "Written aftercare for every treatment, explained + documented",
          "Follow-up plan recorded per client",
          "Post-treatment communication logged",
          "Inspection readiness, produce all documents on demand, consistent across clients, paperwork reflects treatments actually performed",
        ],
      },
    ],
    ctaText: "Get the audit",
    kartraUrl: courseKartraPlaceholder("free-clinical-audit"),
    tone: "pink-soft",
    category: "Free taster",
    format: "8 sections · self-paced",
    availability: "available",
    bgImage: "/backgrounds/pink-halftone.png",
    promise:
      "By the time you've worked through the audit, you'll know exactly which compliance gaps to close first, and which ones genuinely matter under England's incoming licensing scheme.",
    transformations: [
      {
        before:
          "Vague unease about whether your clinic is genuinely compliant.",
        after:
          "An eight-section self-audit you can produce on demand for an inspector, an insurer, or a complaint reviewer.",
      },
      {
        before:
          "Compliance documents scattered across folders, emails, and that one drive nobody can find.",
        after:
          "A single audit trail showing exactly where every piece of compliance paperwork lives.",
      },
      {
        before:
          "Hoping the incoming national licensing scheme won't apply to your clinic.",
        after:
          "Already aligned with the scope of practitioner and premises licensing England is proposing. By design, not by accident.",
      },
      {
        before:
          "Treating compliance as paperwork to dread.",
        after:
          "Treating compliance as the framework that protects your reputation, not a burden you keep postponing.",
      },
    ],
    whyBernadette:
      "I lead clinical workforce governance for an NHS Trust with oversight of more than a thousand nurses, lecture postgraduate clinicians on regulation, and run my own clinic, Visage Aesthetics, to JCCP / CPSA-aligned standards. The audit you're getting is the one I run against my own practice. It's plain English, defensible, and built for the way English clinics actually operate.",
    includes: [
      "The full 8-section self-audit (digital, mobile-friendly, printable)",
      "Section-by-section yes / no checklists",
      "Reference notes on where each piece of compliance documentation sits",
      "Closing inspection-readiness check",
      "Lifetime access, revisit any time",
      "A clear next step if you want the templates and governance systems behind the framework",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. The full eight-section audit, fully free. No credit card. The checklist is yours to keep, whether or not you ever take the paid programme.",
      },
      {
        q: "Is this England-only?",
        a: "Yes. The licensing detail and regulator landscape is specific to England, the Special Treatments Licence regime, the upcoming national licensing scheme, the JCCP / CPSA framework, ICO registration, ASA jurisdiction. Practitioners in Scotland, Wales, or Northern Ireland will find the principles useful but the licensing detail differs.",
      },
      {
        q: "Will I get a certificate?",
        a: "The audit doesn't include a Certificate of Completion, that sits with the full RAG Pathway. The audit is designed as a gap-analysis tool, not a CPD module.",
      },
      {
        q: "What's the difference between this and the full RAG Pathway?",
        a: "The audit gives you the gap-analysis: where you stand, what's missing, what to fix first. The full RAG Pathway (4 weeks, paid) gives you the documents, governance systems, and templates to actually close the gaps, including ASA-safe marketing modules and JCCP-aligned operating standards.",
      },
    ],
    weeklyHours: "≈ 30 min total",
    isCpdEvidence: false,
  },

  /* ============================================================
     CLINICAL CONDITION COURSES
     ============================================================ */
  {
    slug: "acne-decoded",
    kartraMembershipName: "Acne Decoded",
    freeTasterSlug: "free-acne-decoded",
    eyebrow: "Clinical · £150",
    title: "Acne Decoded",
    summary:
      "Stop guessing. Learn what drives acne and how to treat it properly.",
    body: "Most acne treatment plans are educated guesses. Same protocols, same disappointed clients, same results that don't hold. I built Acne Decoded as the science behind the condition. What drives breakouts at the cellular level. How to assess severity correctly. How to treat without over-treating. NICE guidance translated into clinical decisions you can defend. One course. £150. No upsells.",
    voiceQuote:
      "Acne is not simply a cosmetic concern. It is a complex, chronic inflammatory skin condition that affects individuals physically, psychologically, and socially.",
    bullets: [
      "Acne pathophysiology",
      "NICE-aligned protocols",
      "Treatment decision-making",
      "Severity assessment",
    ],
    stats: ["11 sections", "Self-paced", "£150"],
    modules: [
      {
        num: "01",
        title: "What is acne?",
        body: "Definition, types, UK classification, key facts, and why “teenage acne” gets it wrong.",
        topics: [
          "Definition of acne vulgaris (medical, not cosmetic)",
          "Open vs closed comedones",
          "Inflammatory lesions: papules, pustules, nodules, cysts",
          "UK classification framework",
          "Comedonal vs inflammatory acne",
          "Adult-onset vs adolescent acne",
        ],
      },
      {
        num: "02",
        title: "Anatomy & physiology",
        body: "Sebaceous gland biology, follicular hyperkeratinisation, microbiome, hormonal drivers. What's happening underneath every breakout.",
        topics: [
          "Pilosebaceous unit anatomy",
          "Stratum corneum & barrier function",
          "Four core pathophysiological drivers",
          "Comedogenesis (microcomedone formation)",
          "Cutibacterium acnes colonisation",
          "Inflammatory & immune response cascade",
        ],
      },
      {
        num: "03",
        title: "Causes & risk factors",
        body: "Modifiable vs non-modifiable drivers. The lifestyle, hormonal, and pharmaceutical triggers behind most adult-onset cases.",
        topics: [
          "Hormonal drivers (androgens, PCOS, menstrual, perimenopause)",
          "Excess sebum production",
          "Abnormal keratinisation",
          "C. acnes microbiome imbalance",
          "Genetic predisposition",
          "Lifestyle & environmental contributors (stress, occlusion, pollution)",
        ],
      },
      {
        num: "04",
        title: "Risk & complications",
        body: "Scarring, post-inflammatory hyperpigmentation, psychological impact. Red flags and when to refer up.",
        topics: [
          "Persistent inflammation & dermal damage",
          "Skin barrier damage from over-treatment",
          "Post-inflammatory hyperpigmentation (PIH)",
          "Atrophic vs hypertrophic scarring",
          "Psychological & emotional risk indicators",
          "Red flags: when to refer",
        ],
      },
      {
        num: "05",
        title: "Clinical assessment",
        body: "The consultation that surfaces the right history, sets realistic expectations, and de-risks the plan from day one.",
        topics: [
          "Confirming acne vulgaris vs mimickers (rosacea, folliculitis, perioral dermatitis)",
          "Lesion-type identification",
          "NICE severity grading (mild / moderate / severe)",
          "Distribution mapping",
          "Scarring & PIH/PIE assessment",
          "Psychosocial impact screening (NICE-emphasised)",
          "Photographic documentation protocol",
        ],
      },
      {
        num: "06",
        title: "Treatment pathways",
        body: "Topicals, oral, in-clinic, when each belongs and how to sequence without burning the barrier.",
        topics: [
          "AHAs (glycolic, lactic, mandelic): mechanism + indications",
          "BHAs (salicylic): when, why, how",
          "Retinoid use & sequencing",
          "Antibacterial + anti-inflammatory topicals",
          "Oral pathways & prescriber referral",
          "In-clinic adjuncts (peels, light-based, microneedling)",
          "When NOT to treat in clinic",
        ],
      },
      {
        num: "07",
        title: "Case studies & applied learning",
        body: "Real cases, decision walkthroughs. Mild, moderate, severe, what you'd do, why, and what NICE backs.",
        topics: [
          "Mild comedonal: full pathway walkthrough",
          "Moderate inflammatory: sequencing decisions",
          "Severe / scarring risk: escalation triggers",
          "Hormonal adult acne: assessment + collaboration",
          "Post-acne pigmentation case",
          "When to refer to dermatology / GP",
        ],
      },
      {
        num: "08",
        title: "NHS guidance & summary",
        body: "How NICE pathways map onto private clinic practice. Knowledge check + recap. Certificate of Completion.",
        topics: [
          "NICE acne guidelines applied to private practice",
          "Documentation standards that defend a treatment plan",
          "Final knowledge check",
          "Certificate of Completion (CPD evidence)",
        ],
      },
    ],
    price: 150,
    ctaText: "View course",
    kartraUrl:
      "https://aestheticsunlock.kartra.com/checkout/ecf0494c1d91f575fecb6f538677d092",
    tone: "charcoal",
    category: "Clinical",
    format: "Self-paced · 11 sections",
    availability: "available",
    bgImage: "/backgrounds/pink-grunge-mid.png",
    promise:
      "Stop guessing. Start treating acne with NICE-aligned clinical reasoning you can defend to a GP, an insurer, or a complaint reviewer.",
    transformations: [
      {
        before:
          "Treating acne with the same protocol regardless of severity, type, or driver.",
        after:
          "Differentiating comedonal vs inflammatory vs nodular acne and matching the right pathway to each.",
      },
      {
        before:
          "Disappointed clients whose results don't hold past the third treatment.",
        after:
          "Realistic expectations set at the consultation. Treatment plans staged for the long term.",
      },
      {
        before:
          "Borrowing protocols from social media. Hoping for the best.",
        after:
          "NICE-aligned, evidence-led decision-making with defensible documentation behind every plan.",
      },
      {
        before:
          "Charging beauty-room prices for clinical-level work.",
        after:
          "Charging premium fees with the clinical reasoning to back them, and the photographic documentation to prove the outcome.",
      },
    ],
    whyBernadette:
      "I hold an MSc Advanced Practice (Level 7), I'm NMC registered, I lecture postgraduate clinicians, and I run an award-winning aesthetics clinic, Visage Aesthetics, which won Best Non-Surgical Aesthetics Clinic 2026 (Essex). I built Acne Decoded on the same NICE pathways the NHS uses, translated for private clinic practice by a nurse who's spent twenty years inside the system that wrote them.",
    includes: [
      "11 sections covering pathophysiology, assessment, and treatment",
      "NICE-aligned consultation framework + severity scoring",
      "Treatment pathway decision tree (mild / moderate / severe)",
      "Real case study walkthroughs",
      "Certificate of Completion for CPD evidence",
      "Lifetime access, including future updates",
      "Self-paced · self-marked knowledge check",
    ],
    faqs: [
      {
        q: "Is this CPD-accredited?",
        a: "Acne Decoded is designed to count toward CPD evidence and is appropriate as reflective practice for NMC revalidation. The Certificate of Completion at the end gives you the documentation to attach to your portfolio.",
      },
      {
        q: "Will this teach me to inject?",
        a: "No. This is clinical reasoning around acne, assessment, treatment decisions, NICE-aligned pathways, when to escalate. Hands-on technical training requires a separate insured pathway.",
      },
      {
        q: "Do I need to be a nurse to take it?",
        a: "No. The course is designed for any practitioner working with skin who wants the clinical reasoning behind acne decisions, including aestheticians, beauty therapists, advanced facialists, and prescribing clinicians.",
      },
      {
        q: "Is it really £150 with no upsells?",
        a: "Yes. £150 one-time, lifetime access, no upsells inside the course. Bernadette's stance is that clinical education should be priced honestly.",
      },
    ],
    weeklyHours: "≈ 1 hr/wk · 5 wks",
    isCpdEvidence: true,
  },
  {
    slug: "rosacea-beyond-redness",
    kartraMembershipName: "Rosacea Beyond Redness",
    freeTasterSlug: "free-rosacea-beyond-redness",
    eyebrow: "Clinical · £150",
    title: "Rosacea Beyond Redness",
    summary:
      "Pathophysiology, barrier integrity, microbiome, NICE-aligned management, the rosacea course UK practitioners have been waiting for.",
    body: "Rosacea is rarely just about redness. I built this course to unpack the four subtypes, the barrier story, the microbiome, and the long-term management strategy NICE backs. For practitioners who want to stop reaching for the same flare-management tool and start treating the condition. One course. £150. No upsells.",
    voiceQuote:
      "Build knowledge, confidence, and safe decision-making when working with clients who may present with rosacea.",
    bullets: [
      "Rosacea subtypes & pathophysiology",
      "Barrier integrity & microbiome",
      "NICE-aligned management",
      "Trigger identification",
    ],
    stats: ["12 sections", "Self-paced", "£150"],
    modules: [
      {
        num: "01",
        title: "What is rosacea?",
        body: "Erythematotelangiectatic, papulopustular, phymatous, ocular. The four faces of rosacea and what each one tells you about the underlying drivers.",
      },
      {
        num: "02",
        title: "Pathophysiology & skin science",
        body: "Vascular, neurological, immunological. The three systems that conspire to make rosacea unpredictable, and how to read them.",
      },
      {
        num: "03",
        title: "Barrier integrity & microbiome",
        body: "Why barrier-first treatment outperforms anti-inflammatory-first treatment in 80% of presentations.",
      },
      {
        num: "04",
        title: "Clinical assessment & diagnosis",
        body: "Severity scoring, photographic documentation, the consultation script that catches misdiagnoses.",
      },
      {
        num: "05",
        title: "Causes & risk factors",
        body: "Genetics, sun, alcohol, heat, the gut. Mapping personal triggers to a defensible management plan.",
      },
      {
        num: "06",
        title: "Complications",
        body: "Phymatous progression, ocular involvement, psychological impact. When to refer up, how to document it.",
      },
      {
        num: "07",
        title: "Treatment pathways",
        body: "Topical metronidazole, ivermectin, azelaic acid, oral doxycycline. When, how long, and how to stage de-escalation.",
      },
      {
        num: "08",
        title: "Case studies, summary & test",
        body: "Real cases, decision walkthroughs. NICE-aligned recap. Knowledge check + Certificate of Completion.",
      },
    ],
    price: 150,
    ctaText: "View course",
    kartraUrl:
      "https://aestheticsunlock.kartra.com/checkout/dd04088c684f5a9082eaa98f6dcb289b",
    tone: "pink-soft",
    category: "Clinical",
    format: "Self-paced · 12 sections",
    availability: "available",
    bgImage: "/backgrounds/cream-halftone.png",
    promise:
      "Stop managing flares with the same tool. Start treating the condition, barrier, microbiome, vascular, neurological, with NICE-aligned clinical reasoning.",
    transformations: [
      {
        before:
          "Reaching for the same anti-redness regimen on every rosacea presentation.",
        after:
          "Identifying the four NICE-recognised subtypes and matching the right pathway to each.",
      },
      {
        before:
          "Treating rosacea as a redness problem.",
        after:
          "Treating rosacea as a barrier-and-microbiome problem first, with a defensible NICE-aligned management plan.",
      },
      {
        before:
          "Triggers misunderstood. Clients frustrated. Compliance with care plans low.",
        after:
          "A trigger-mapping protocol clients actually follow, and a long-term management strategy that compounds.",
      },
      {
        before:
          "Unsure when to refer or co-manage.",
        after:
          "Clear escalation criteria, phymatous progression, ocular involvement, treatment-resistant inflammation.",
      },
    ],
    whyBernadette:
      "I'm an Advanced Nurse Practitioner with twenty years' clinical experience and twelve in aesthetics. My clinic, Visage Aesthetics, Best Non-Surgical Aesthetics Clinic 2026 (Essex), sees rosacea every week. I built this course on the NICE pathway, the RCN's clinical guidance, and the realities of treating rosacea inside a private clinic at premium fees.",
    includes: [
      "12 sections covering subtypes, assessment, and treatment ladders",
      "Barrier-first vs anti-inflammatory-first decision framework",
      "Trigger-mapping protocol clients will actually follow",
      "NICE-aligned topical + oral treatment pathway",
      "Real case study walkthroughs",
      "Certificate of Completion for CPD evidence",
      "Lifetime access, including future updates",
    ],
    faqs: [
      {
        q: "Will this help me distinguish rosacea from acne or perioral dermatitis?",
        a: "Yes. The clinical assessment module covers all the common mimickers and the differential reasoning to catch misdiagnoses before they cost you a treatment plan.",
      },
      {
        q: "Does it cover ocular rosacea?",
        a: "Yes, including when to refer to ophthalmology and how to document the conversation. Ocular involvement is one of the most under-recognised aspects of rosacea in private practice.",
      },
      {
        q: "Is it CPD-accredited?",
        a: "Designed to count toward CPD and appropriate as NMC revalidation reflective practice. Includes a Certificate of Completion.",
      },
    ],
    weeklyHours: "≈ 1 hr/wk · 6 wks",
    isCpdEvidence: true,
  },

  /* ============================================================
     PREMIUM CLINICAL — multi-condition specialist programme
     ============================================================ */
  {
    slug: "skin-specialist-programme",
    kartraMembershipName: "The Skin Specialist™ Programme",
    freeTasterSlug: "free-skin-specialist-mini",
    eyebrow: "Clinical · 10 modules · £399",
    title: "The Skin Specialist™ Programme",
    price: 399,
    summary:
      "From single-condition uncertainty to multi-condition skin specialism. A 10-module clinical-reasoning programme, NICE-aligned, evidence-led.",
    body: "The course Bernadette wishes had existed when she was learning. A self-paced 10-module clinical programme that takes a generalist beauty or aesthetic practitioner to a confident, multi-condition skin specialist, anchored in NICE-aligned clinical reasoning rather than borrowed protocols. Covers the consultation framework, acne, rosacea, pigmentation, barrier dysfunction, photodamage, scarring, treatment planning, and the documentation that makes every plan defensible. Self-paced. Lifetime access. £399. Certificate of Completion for CPD evidence.",
    voiceQuote:
      "Most skin plans don't fail because the practitioner is careless. They fail because the consultation skipped the question that would have changed the plan.",
    bullets: [
      "The structured skin consultation",
      "Multi-condition treatment planning",
      "NICE-aligned clinical reasoning",
      "Pigmentation, barrier, photodamage, scarring",
      "Defensible documentation",
      "Treatment escalation & referral pathways",
    ],
    stats: ["10 modules", "Self-paced", "£399"],
    modules: [
      {
        num: "01",
        title: "Module 1: Foundations of skin health",
        body: "Skin biology, barrier function, the microbiome, the immune system at the surface. The mental model every skin plan rests on.",
        topics: [
          "Skin layers + cellular detail",
          "Barrier function & TEWL",
          "The skin microbiome",
          "Innate immune response in skin",
          "Skin types vs skin conditions, the difference",
        ],
      },
      {
        num: "02",
        title: "Module 2: The Skin Specialist consultation",
        body: "The structured consultation framework that anchors every condition module that follows. NICE-aligned, defensible, repeatable.",
        topics: [
          "Pre-consultation intake",
          "Structured history-taking",
          "Examination + photography protocol",
          "Lesion / pattern classification",
          "Setting expectations + cooling-off period",
          "Consent + capacity considerations",
        ],
      },
      {
        num: "03",
        title: "Module 3: Acne, in depth",
        body: "The clinical-reasoning approach to acne, building on the Acne Decoded course with hormonal pathways, scarring risk, and treatment escalation.",
        topics: [
          "Four mechanisms revisited",
          "Hormonal acne in adult women",
          "Severity grading + escalation triggers",
          "AHAs, BHAs, retinoids, sequencing",
          "Post-acne pigmentation + scarring risk",
          "When to refer to GP / dermatology",
        ],
      },
      {
        num: "04",
        title: "Module 4: Rosacea, in depth",
        body: "Beyond redness, the four NICE-recognised subtypes, barrier-first treatment, and the trigger-mapping protocol clients will actually follow.",
        topics: [
          "Erythematotelangiectatic, papulopustular, phymatous, ocular",
          "Vascular, neurological, immunological mechanisms",
          "Barrier-first vs anti-inflammatory-first",
          "Topical metronidazole, ivermectin, azelaic acid pathway",
          "Trigger-mapping protocol",
          "When to refer to ophthalmology",
        ],
      },
      {
        num: "05",
        title: "Module 5: Pigmentation disorders",
        body: "Melasma, post-inflammatory hyperpigmentation (PIH), sun damage. Skin-tone-aware approach with realistic outcomes and ethical bleaching alternatives.",
        topics: [
          "Melanin biology + Fitzpatrick assessment",
          "Melasma vs PIH vs lentigines",
          "Hydroquinone vs alternatives (kojic, azelaic, tranexamic)",
          "Photoprotection as treatment",
          "Skin-of-colour considerations",
          "Risk of rebound + ethical practice",
        ],
      },
      {
        num: "06",
        title: "Module 6: Barrier dysfunction & sensitised skin",
        body: "The most-misunderstood condition in the clinic. Barrier repair pathway, ceramide science, microbiome-friendly actives.",
        topics: [
          "Functional vs structural barrier impairment",
          "TEWL measurement + interpretation",
          "Ceramides, fatty acids, cholesterol, the lipid trio",
          "Sequencing actives without crashing the barrier",
          "Sensitised vs sensitive skin, diagnostic difference",
          "Recovery timeline + client communication",
        ],
      },
      {
        num: "07",
        title: "Module 7: Photodamage & ageing skin",
        body: "Intrinsic vs extrinsic ageing, sun-damage assessment, anti-ageing treatment hierarchy. What works, what's marketing, what's both.",
        topics: [
          "Intrinsic vs extrinsic ageing biology",
          "Sun damage assessment (Glogau, Fitzpatrick)",
          "Retinoids, vitamin C, niacinamide, evidence + sequencing",
          "Photoprotection as the foundation",
          "In-clinic adjuncts (peels, microneedling, light)",
          "Setting realistic outcomes",
        ],
      },
      {
        num: "08",
        title: "Module 8: Scarring & post-inflammatory change",
        body: "Atrophic, hypertrophic, keloid scars + post-inflammatory pigmentation/erythema. Classification, treatment options, realistic outcomes.",
        topics: [
          "Scar classification (ice-pick, boxcar, rolling, hypertrophic)",
          "PIH vs PIE, different problems, different solutions",
          "Microneedling, peels, light-based options",
          "When to refer (deep dermal scarring, keloid risk)",
          "Photographic documentation of progress",
          "Setting realistic timelines (12 months+)",
        ],
      },
      {
        num: "09",
        title: "Module 9: Treatment planning & combination therapy",
        body: "How to combine modalities safely. The decision tree for stacking actives, peels, microneedling, and light. Risk management for the practitioner who wants to do more than one thing.",
        topics: [
          "Single-modality vs combination thinking",
          "Active sequencing rules",
          "Stacking peels, microneedling, light",
          "Recovery timelines + downtime planning",
          "Risk hierarchy (post-inflammatory pigmentation, barrier crash, infection)",
          "Documentation across multi-modal plans",
        ],
      },
      {
        num: "10",
        title: "Module 10: Integration, certification & next steps",
        body: "Pulling the framework into a sustainable clinical practice. Case study presentation. Self-audit. Certificate of Completion. Where to go next.",
        topics: [
          "Case study presentation framework",
          "Self-audit against NICE alignment",
          "Documentation file build-out",
          "CPD reflection prompts",
          "Certificate of Completion",
          "Bridging to The 5K+ Formula™",
        ],
      },
    ],
    ctaText: "Enrol now",
    kartraUrl:
      "https://aestheticsunlock.kartra.com/checkout/cf1907b07a0c733941243f06ad0e74e2",
    tone: "charcoal",
    category: "Clinical",
    format: "Self-paced · 10 modules",
    availability: "available",
    bgImage: "/backgrounds/pink-grunge-mid.png",
    promise:
      "Stop guessing across conditions. Start consulting like a skin specialist, with NICE-aligned clinical reasoning you can defend on paper.",
    transformations: [
      {
        before:
          "Confident in one or two conditions. Unsure or improvising on the rest.",
        after:
          "Multi-condition clinical reasoning across acne, rosacea, pigmentation, barrier, photodamage, and scarring, anchored in NICE-aligned thinking.",
      },
      {
        before:
          "Borrowing protocols from social media. Hoping the next plan holds.",
        after:
          "A structured consultation framework that surfaces the real driver, and a treatment plan you can defend to a GP, an insurer, or a complaint reviewer.",
      },
      {
        before:
          "Charging skin-therapy prices for clinical-level work because the documentation doesn't yet justify the premium.",
        after:
          "A defensible consultation, photographic baseline, and treatment plan that justifies premium fees, and the reputation that follows.",
      },
      {
        before:
          "Single-condition courses (Acne, Rosacea) as one-off CPD ticks.",
        after:
          "An integrated skin-specialist identity, the practitioner clients refer their friends to.",
      },
    ],
    whyBernadette:
      "I'm an Advanced Nurse Practitioner with twenty years on the ward, twelve in aesthetics, and I run an NHS Trust's clinical workforce governance for over 1,000 nurses. I'm NMC registered, MSc Advanced Practice, and lecture postgraduate clinicians on this exact pathway. The Skin Specialist Programme is the curriculum I distilled from teaching inside the NHS, translated for private clinic practice, NICE-aligned end-to-end, built by a senior clinician who treats skin every week.",
    includes: [
      "10 self-paced modules covering foundations, consultation, six conditions, and integration",
      "The structured Skin Specialist consultation framework",
      "NICE-aligned treatment-planning decision tree per condition",
      "Photographic documentation protocol",
      "Multi-modal combination-therapy guidance",
      "Real UK case study walkthroughs",
      "Certificate of Completion for CPD evidence",
      "Lifetime access, including future clinical updates",
    ],
    faqs: [
      {
        q: "How is this different from Acne Decoded and Rosacea Beyond Redness?",
        a: "The £150 decoders are deep dives on a single condition. The Skin Specialist Programme is the integrated, multi-condition pathway, including the consultation framework, pigmentation, barrier dysfunction, photodamage, and scarring (none of which are covered in the single-condition courses). If you've already taken Acne Decoded or Rosacea Beyond Redness, this extends, it doesn't repeat.",
      },
      {
        q: "Is this CPD-accredited?",
        a: "Designed to count toward CPD evidence and appropriate as NMC revalidation reflective practice. The Certificate of Completion gives you the documentation to attach to your portfolio.",
      },
      {
        q: "Will this teach me to inject?",
        a: "No. This is clinical reasoning around skin, assessment, treatment planning, multi-modal pathways, when to escalate, defensible documentation. Hands-on injectable training requires a separate insured pathway.",
      },
      {
        q: "Do I need a clinical background?",
        a: "No, but you should be already working with skin in a professional capacity (aesthetician, advanced facialist, beauty therapist, clinical nurse, prescribing clinician). The programme assumes you know how to perform treatments, the work is on the clinical reasoning underneath them.",
      },
      {
        q: "Is £399 a one-off or a subscription?",
        a: "One-off, lifetime access, including future updates as clinical guidance evolves. No recurring fees, no upsells inside the course.",
      },
      {
        q: "How long does it take?",
        a: "Self-paced. Most practitioners complete one module per week (~10 weeks) but you can move faster or slower. Each module is approximately 2 hours of learning + reflection.",
      },
    ],
    weeklyHours: "≈ 2 hrs/wk · 10 wks",
    isCpdEvidence: true,
    valueAnchor: [
      "An equivalent multi-condition skin-specialist pathway with a private dermatology educator runs £600–£900 per teaching day.",
      "One additional retained skin client at a confident £200/treatment recoups the course in two visits.",
    ],
  },

  /* ============================================================
     PREMIUM CLINICAL — free taster
     ============================================================ */
  {
    slug: "free-skin-specialist-mini",
    kartraMembershipName: "The Skin Specialist™ Mini",
    upsellsTo: "skin-specialist-programme",
    eyebrow: "Free · 4 lessons",
    title: "The Skin Specialist™ Mini",
    summary:
      "A free 4-lesson taster of the consultation framework that anchors every defensible skin plan.",
    body: "Free, 30-minute taster of the full Skin Specialist Programme. Four short lessons that reframe skin consultations from a tick-box exercise into the structured clinical conversation that decides whether a plan holds. The Skin Specialist consultation is the foundation underneath every condition module in the full course, and the most differentiating skill a practitioner can develop. NICE-aligned. Honest. Yours to keep.",
    voiceQuote:
      "If you cannot justify it on paper, you cannot defend it in practice, and the consultation is where the paper trail starts.",
    bullets: [
      "Why most skin plans fail",
      "The structured consultation framework",
      "What separates a skin therapist from a skin specialist",
    ],
    stats: ["4 lessons", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Welcome",
        body: "Why this short course exists, who it's for, and what you'll walk away with.",
      },
      {
        num: "02",
        title: "Why most skin plans fail",
        body: "The consultation gap, the question most plans skip, and why it's the question that decides whether the plan holds.",
      },
      {
        num: "03",
        title: "The Skin Specialist consultation",
        body: "The structured framework, pre-consultation intake, history, examination, classification, expectations, consent. The same flow used inside the full programme.",
      },
      {
        num: "04",
        title: "Where to go from here",
        body: "What's missing, and the full Skin Specialist Programme that picks up exactly where this Mini ends.",
      },
    ],
    ctaText: "Get instant access",
    kartraUrl: courseKartraPlaceholder("free-skin-specialist-mini"),
    tone: "cream",
    category: "Free taster",
    format: "4 lessons · self-paced",
    availability: "available",
    bgImage: "/backgrounds/cream-halftone.png",
    promise:
      "Thirty minutes. The consultation framework underneath every defensible skin plan, yours to keep, whether or not you ever take the full programme.",
    transformations: [
      {
        before:
          "Skin consultations as a tick-box exercise before the treatment.",
        after:
          "The structured clinical conversation that decides whether the plan holds, and gives you the paper trail to defend it.",
      },
      {
        before:
          "Plans that look great on paper and fall apart by week six.",
        after:
          "A consultation that surfaces the real driver, so the plan you write is the plan that holds.",
      },
    ],
    whyBernadette:
      "The consultation framework taught here is the same one I use inside Visage Aesthetics, the clinic that won Best Non-Surgical Aesthetics Clinic 2026 (Essex). It's the foundation underneath every condition module in the full Skin Specialist Programme. The Mini is the front door.",
    includes: [
      "Four short lessons (~30 minutes total)",
      "The structured Skin Specialist consultation framework",
      "Lifetime access, revisit any time",
      "A clear next step if you want the full clinical pathway",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. Four lessons, fully free. No credit card. The consultation framework is yours to keep, whether or not you ever take the paid programme.",
      },
      {
        q: "Will it sell me on the paid course?",
        a: "Lesson 4 is a clear pointer to the full Skin Specialist Programme if you want to keep going, but no pressure. Many practitioners take the Mini, integrate the consultation framework, and never enrol in the paid programme.",
      },
      {
        q: "How is this different from the Acne or Rosacea Mini?",
        a: "The Acne and Rosacea Minis are condition-specific tasters. The Skin Specialist Mini is the consultation framework that sits underneath every condition, applicable whether you treat acne, rosacea, pigmentation, or anything else. Take all three if it helps; they don't repeat.",
      },
    ],
    weeklyHours: "≈ 30 min total",
    isCpdEvidence: false,
  },

  /* ============================================================
     BUSINESS / REGULATORY (PAID, WAITLIST)
     ============================================================ */
  {
    slug: "rag-pathway",
    kartraMembershipName: "From Regulation to Reputation™, The RAG Pathway",
    freeTasterSlug: "free-2-day-rag",
    eyebrow: "Regulatory · 4 weeks · £499",
    title: "From Regulation to Reputation™, The RAG Pathway",
    price: 499,
    summary:
      "The structured 4-week, educator-led RAG Pathway. For England-based practitioners who want to practise safely, ethically, and defensibly.",
    body: "Aesthetics isn't unregulated. It's misunderstood, and that's where careers, confidence, and reputations get lost. From Regulation to Reputation™ is the RAG Pathway in full: a 4-week, educator-led programme I designed for England-based practitioners. Without fear. Without guesswork. Without cutting corners. This isn't a “how to inject” course. It's the framework that keeps you compliant, in business, and building a reputation that compounds, the same one I run my own award-winning clinic on.",
    voiceQuote:
      "As your mentor on this journey, my role is to help you move beyond confusion and fear around regulation and instead use it as a strategic advantage.",
    bullets: [
      "JCCP & MHRA-aligned practice",
      "Scope-of-practice clarity",
      "Risk-gap auditing",
      "ASA-safe marketing",
      "Defensible documentation",
    ],
    stats: ["8 modules", "4 weeks", "£499"],
    modules: [
      {
        num: "01",
        title: "Module 1: The aesthetics reality check",
        body: "Where England's aesthetics industry actually sits today. The licensing landscape, the JCCP register, the MHRA expectations.",
      },
      {
        num: "02",
        title: "Module 2: The Traffic Light System",
        body: "🔴 Red, 🟠 Amber, 🟢 Green. The decision-making muscle for every procedure, marketing claim, and treatment offer.",
      },
      {
        num: "03",
        title: "Module 3: Legal essentials",
        body: "Consent, capacity, supervision, prescribing pathways, indemnity. The non-negotiables, in plain English.",
      },
      {
        num: "04",
        title: "Module 4: Setting up your clinic",
        body: "Premises, infection control, sharps, waste, oversight. What inspectors look for and what gets you closed.",
      },
      {
        num: "05",
        title: "Module 5: Clinical governance",
        body: "Documentation, audit, complaints, escalation. The systems that turn complaints into evidence of good practice.",
      },
      {
        num: "06",
        title: "Module 6: Staying ASA safe",
        body: "What you can claim, what you can't, what gets your ads pulled. Marketing rules, made workable.",
      },
      {
        num: "07",
        title: "Module 7: Training, qualifications & CPD",
        body: "What counts, what doesn't, and how to evidence ongoing competence to insurers and clients.",
      },
      {
        num: "08",
        title: "Module 8: Integration & reflection",
        body: "Pulling the framework into a sustainable practice rhythm. Certificate of Completion.",
      },
    ],
    ctaText: "Enrol now",
    kartraUrl:
      "https://aestheticsunlock.kartra.com/checkout/7d315ceba7aa1d59433b325d988e36f5",
    tone: "pink",
    category: "Regulatory",
    format: "8 modules · 4 weeks · educator-led",
    availability: "available",
    bgImage: "/backgrounds/pink-fade-charcoal.png",
    promise:
      "Four weeks. Eight modules. The structured framework that turns regulation from a source of anxiety into a strategic advantage you can defend in any room.",
    transformations: [
      {
        before:
          "Vaguely anxious. Hoping no one looks too closely at the documentation.",
        after:
          "A defensible practice, scope, premises, consent, governance, marketing, every layer aligned to JCCP / CPSA / MHRA expectations.",
      },
      {
        before:
          "Avoiding the regulators' websites because the language is impenetrable.",
        after:
          "Fluent in the framework: JCCP, CPSA, MHRA, CQC, ASA, the Health and Care Act 2022, the Keogh Review's direction of travel.",
      },
      {
        before:
          "Marketing that sails close to ASA-flag territory. Online posts that could pull an investigation.",
        after:
          "ASA-safe content frameworks. Visibility without vulnerability.",
      },
      {
        before:
          "If something went wrong tomorrow, you couldn't say who'd investigate or what they'd find.",
        after:
          "Clear answer to the question: “If a complaint landed today, could I justify and defend every decision?” Yes, on paper.",
      },
      {
        before:
          "Worried about the licensing direction of travel.",
        after:
          "Future-proofed. Aligned with where statutory licensing is heading before it lands.",
      },
    ],
    whyBernadette:
      "I lead clinical workforce governance for an NHS Trust with oversight of over 1,000 nurses. I lecture postgraduate clinicians on advanced practice, regulation, and clinical governance, at the same level the rules in this course were designed for. The RAG Pathway is what I distilled from teaching inside the NHS into a framework private aesthetic practitioners can actually use, and it's how I run my own clinic.",
    includes: [
      "8 modules across 4 weeks · educator-led",
      "The full Traffic Light System decision framework",
      "Documentation, governance, and audit templates",
      "ASA-safe content frameworks (what you can and can't claim)",
      "Live touch-points throughout the 4-week programme",
      "Certificate of Completion for CPD + revalidation",
      "Lifetime access, including future regulatory updates",
    ],
    faqs: [
      {
        q: "When can I start?",
        a: "Immediately. The RAG Pathway is self-paced, you can begin Module 1 the day you enrol and work through the eight modules at the pace that fits your clinic.",
      },
      {
        q: "Is this a one-off or a subscription?",
        a: "One-off. Lifetime access to the modules and any future regulatory updates as the framework evolves. No recurring fees.",
      },
      {
        q: "Will this make me JCCP-ready?",
        a: "The course is designed to align practitioners with JCCP / CPSA expectations so that registration becomes a documentation exercise rather than a re-engineering exercise. The course doesn't replace JCCP's own application process.",
      },
      {
        q: "What's the difference between this and the free 2-day Mini?",
        a: "The Mini gives you the conceptual framework. The full RAG Pathway gives you the documented, defensible practice records to actually operate inside it, including templates, audit checklists, and ASA-safe marketing modules.",
      },
    ],
    weeklyHours: "≈ 2 hrs/wk · 4 wks",
    isCpdEvidence: true,
  },
  {
    slug: "5k-formula",
    kartraMembershipName: "The 5K+ Formula™",
    freeTasterSlug: "free-3-day-startup",
    eyebrow: "Business · 10 weeks · £799",
    title: "The 5K+ Formula™",
    price: 799,
    summary:
      "Consistent £5K+ months. Without chasing clients, discounting, or doing more treatments.",
    body: "Twelve modules, ten weeks, the complete UNLOCK PROFIT™ Framework I refined inside my own clinic. Niche, signature offers, confident pricing, the systems that hold a clinic together. For clinic owners ready to build consistent £5K+ months without burning out, racing on price, or chasing the next viral treatment. Self-paced. Lifetime access. £799.",
    voiceQuote:
      "You're not here to learn generic business tips, you're here to master the art of building a profitable, personal, and professional aesthetics brand.",
    bullets: [
      "The UNLOCK PROFIT™ Framework",
      "Three Pillars of the Clinical Core",
      "Signature offer building",
      "Confident pricing & systems",
      "Client journey mapping",
      "Monthly business rituals",
    ],
    stats: ["12 modules", "10 weeks", "£799"],
    modules: [
      {
        num: "01",
        title: "Module 1: Niche",
        body: "The Three Pillars of the Clinical Core: Expertise. Excitement. Economics. The exercise that turns a generalist clinic into a destination practice.",
      },
      {
        num: "02",
        title: "Module 2: Branding",
        body: "Voice, visual, and the one-line proposition that turns “another injector” into “the practitioner I trust.”",
      },
      {
        num: "03",
        title: "Module 3: Leveraging",
        body: "Where your time, energy and authority compound, and the busywork to drop today.",
      },
      {
        num: "04",
        title: "Module 4: Optimise the client experience",
        body: "Pre-consult, consult, post-treatment, reactivation. The four touch-points that decide whether one client becomes ten.",
      },
      {
        num: "05",
        title: "Module 5: Create authority via content",
        body: "Educational content that converts without pandering. The minimum-viable rhythm that fills the diary.",
      },
      {
        num: "06",
        title: "Module 6: Becoming fully booked",
        body: "Diary management, retention, the invisible scarcity that makes you the practitioner they wait for.",
      },
      {
        num: "07",
        title: "Module 7: Pricing mastery",
        body: "How to set, hold, and raise prices without losing the clients you actually want.",
      },
      {
        num: "08",
        title: "Module 8: Refine your sales skills",
        body: "Ethical sales as patient-centred guidance. Closing without ever sounding like a salesperson.",
      },
      {
        num: "09",
        title: "Module 9: Organise your operations",
        body: "The systems, SOPs, and rhythms that keep a busy clinic from owning your weekends.",
      },
      {
        num: "10",
        title: "Module 10: Forecast & scale",
        body: "Numbers you actually run on. The monthly read-out that decides what to grow and what to cut.",
      },
      {
        num: "11",
        title: "Module 11: Long-term strategy",
        body: "Where the practice goes in year three, five, ten, and how to plan back from it.",
      },
      {
        num: "12",
        title: "Module 12: The compound effect",
        body: "Integration & reflection. Why the practitioners who stay still eventually win. Certificate of Completion.",
      },
    ],
    ctaText: "Enrol now",
    kartraUrl:
      "https://aestheticsunlock.kartra.com/checkout/900cf0c28a41d0b353b08063563124a4",
    tone: "black",
    category: "Business",
    format: "12 modules · 10 weeks · educator-led",
    availability: "available",
    bgImage: "/backgrounds/pink-fade-charcoal-2.png",
    promise:
      "Twelve modules across ten weeks. The complete UNLOCK PROFIT™ Framework I built my own award-winning clinic on, translated for practitioners who want consistent £5K+ months without burning out.",
    transformations: [
      {
        before:
          "Busy diary, but privately unsure if the clinic is actually paying you.",
        after:
          "Consistent £5K+ months. Numbers you can trust. A monthly read-out that drives decisions.",
      },
      {
        before:
          "Discounting to fill the diary. Racing on price.",
        after:
          "Confident pricing that holds. Premium fees backed by clinical reasoning and signature offers.",
      },
      {
        before:
          "Trying to be everything to everyone. Marketing that sounds like every other injector.",
        after:
          "A clear niche, a one-line brand statement, and the 3–5 signature offers your clinic is famous for.",
      },
      {
        before:
          "Living inside your own diary. Owning every booking, every reminder, every follow-up.",
        after:
          "Systems that hold the clinic without you. Pre-consult, consult, post-treatment, reactivation, automated where it should be, personal where it matters.",
      },
      {
        before:
          "Running on instinct and exhaustion.",
        after:
          "An hour-a-week business rhythm. Forecasts, reviews, and the compound effect of small decisions made consistently.",
      },
    ],
    whyBernadette:
      "I built Visage Aesthetics on the UNLOCK PROFIT™ Framework. The clinic went on to win Best Non-Surgical Aesthetics Clinic 2026 (Essex, Health, Beauty & Wellness Awards). I've spent twelve years refining the framework in real clinic, under real fee pressure. The 5K+ Formula™ is that system, taught by the practitioner who proved it works.",
    includes: [
      "12 modules across 10 weeks · rolling release",
      "The complete UNLOCK PROFIT™ Framework",
      "Niche · branding · pricing · systems modules",
      "Worksheets and templates inside every module",
      "Certificate of Completion",
      "Lifetime access, including future updates",
    ],
    faqs: [
      {
        q: "When can I start?",
        a: "Immediately. The 5K+ Formula™ is self-paced, you can begin Module 1 the day you enrol and work through the twelve weeks at the pace that fits your clinic.",
      },
      {
        q: "What if I already have a busy clinic?",
        a: "The 5K+ Formula™ is built specifically for practitioners who are already in clinic but feel busy-not-paid. It assumes you've got the technical skills, the work is on niche, pricing, signature offers, and the systems that turn busy weeks into profitable ones. Twelve modules across ten weeks, designed to fit alongside a working clinic.",
      },
      {
        q: "How much time per week?",
        a: "Plan for ~3 hours of module work + ~1 hour of weekly business rituals applied inside your clinic. The framework is designed to integrate into your week, not replace it. Ten weeks total, twelve modules.",
      },
      {
        q: "Will it teach me marketing?",
        a: "Yes, but ASA-safe, ethical, content-first marketing. Not Instagram tactics, not paid ads. The marketing module is anchored to the same regulatory framework taught in the RAG Pathway.",
      },
      {
        q: "Do I get 1-1 support?",
        a: "The 5K+ Formula™ is self-paced, not a live cohort. There are no group calls or director meetings inside the programme; the work is in the modules, the worksheets, and the framework you apply inside your own clinic. 1-1 support sits outside this programme, speak to us directly if you're looking for that.",
      },
    ],
    weeklyHours: "≈ 3 hrs/wk · 10 wks",
    isCpdEvidence: true,
    valueAnchor: [
      "Equivalent 1-to-1 business mentoring with an aesthetics-specialist consultant runs £200–£400 per hour.",
      "Adding £350 to a single month's revenue through tighter pricing and signature offers covers the programme back inside one quarter.",
    ],
  },
] as const;

/** Look-up helper used by `/courses/[slug]/page.tsx`. */
export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/**
 * The three high-level *subjects* the catalogue is organised by on
 * the /courses index. Free tasters map to one of these based on the
 * paid course they front (`upsellsTo`) so they sit alongside their
 * parent in the tabs — instead of stranded under a "Free" filter.
 */
export type CourseSubject = "Clinical" | "Regulatory" | "Business";

export const COURSE_SUBJECTS: readonly CourseSubject[] = [
  "Clinical",
  "Regulatory",
  "Business",
] as const;

/**
 * Resolve the subject (Clinical / Regulatory / Business) for any course.
 * For paid courses the answer is `category` directly. For free tasters
 * we look up the paid course they upsell to and use its category — so
 * a Free taster of a Clinical programme appears under the CLINICAL tab.
 *
 * Returns `null` for the (rare) edge case of a free taster with no
 * `upsellsTo` mapping yet — those will fall into the "All" view.
 */
export function getCourseSubject(course: Course): CourseSubject | null {
  if (
    course.category === "Clinical" ||
    course.category === "Regulatory" ||
    course.category === "Business"
  ) {
    return course.category;
  }
  // Free taster — derive from parent.
  if (course.upsellsTo) {
    const parent = COURSES.find((c) => c.slug === course.upsellsTo);
    if (parent && parent.category !== "Free taster") {
      return parent.category as CourseSubject;
    }
  }
  return null;
}

/** Resolve a Kartra `lead.memberships[].membership_name` back to its
 *  Course entry. Returns undefined if no course matches that name —
 *  which is the right behaviour for a stale or misspelt mapping. */
export function getCourseByMembershipName(
  membershipName: string,
): Course | undefined {
  return COURSES.find((c) => c.kartraMembershipName === membershipName);
}
