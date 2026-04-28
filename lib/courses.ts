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
};

export const COURSES: readonly Course[] = [
  /* ============================================================
     FREE TASTERS
     ============================================================ */
  {
    slug: "free-3-day-startup",
    kartraMembershipName: "The 5K+ Formula™ Mini",
    eyebrow: "Free · 3 days",
    title: "The 5K+ Formula™ Mini",
    summary:
      "A free 3-day clarity reset for practitioners who feel busy but not paid.",
    body: "Not another marketing course. Not “post more on Instagram.” Three short lessons on the maths and mindset that decide whether your clinic actually pays you. By the end of Day 3 you'll know exactly which clients and services are most likely to grow your income — without adding more treatments or more hours.",
    voiceQuote:
      "You're not here to fit into the industry. You're here to find your place within it.",
    bullets: ["Niche clarity", "Brand positioning", "Profit awareness"],
    stats: ["3 days", "Self-paced", "Free"],
    modules: [
      {
        num: "01",
        title: "Day 1 — Niche awareness",
        body: "Stop trying to be everything. The exercise that surfaces the niche where your expertise, your interest and the economics actually line up.",
      },
      {
        num: "02",
        title: "Day 2 — Brand awareness",
        body: "The one-line brand statement that turns “another injector” into “the practitioner I trust.” Built in 30 minutes.",
      },
      {
        num: "03",
        title: "Day 3 — Profit awareness",
        body: "The simple weekly read-out that tells you whether your clinic is busy or actually profitable — and what to change first.",
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
      "By the end of Day 3, you'll know exactly which clients and services are most likely to grow your income — without adding more treatments, more hours, or more guesswork.",
    transformations: [
      {
        before:
          "Trying to be everything — every treatment, every trend, every client. Quietly overwhelmed.",
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
          "Busy diary, but quietly unsure if the clinic is actually paying you.",
        after:
          "A simple weekly read-out that tells you whether your clinic is busy or actually profitable — and what to change first.",
      },
    ],
    whyBernadette:
      "I built my own clinic — Visage Aesthetics — using this exact reset. It went on to win Best Non-Surgical Aesthetics Clinic 2026 (Essex). The 5K+ Formula™ is my playbook, refined over twelve years of running a real clinic under real fee pressure. The Mini is the front door.",
    includes: [
      "Three short daily lessons released over 3 days",
      "Lifetime access — revisit any time",
      "A simple weekly numbers read-out you can keep",
      "Self-paced — work it around your clinic",
    ],
    faqs: [
      {
        q: "Is this really free?",
        a: "Yes. Three days of strategic clarity, fully free. No credit card, no upsell required to access the lessons.",
      },
      {
        q: "Do I get a certificate?",
        a: "The Mini doesn't include a Certificate of Completion — that sits with the full 5K+ Formula™ programme. The Mini is designed as a clarity reset, not a CPD module.",
      },
      {
        q: "Will it sell me on the paid course?",
        a: "There's a soft transition at the end if you want to keep going — but no pressure. The Mini stands on its own; many practitioners take it, do the work, and never enrol in the paid programme.",
      },
    ],
  },
  {
    slug: "free-2-day-rag",
    kartraMembershipName: "From Regulation to Reputation™ Mini",
    eyebrow: "Free · 2 days",
    title: "From Regulation to Reputation™ Mini",
    summary:
      "A free 2-day reality check on UK aesthetics regulation — built for practitioners in England.",
    body: "Built for practitioners in England who want to know exactly where they stand before the regulator decides for them. Two days. The honest read-out, framed around the Traffic Light System — Red, Amber, Green — so you can see your scope of practice, your risk gaps, and your next move.",
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
        title: "Day 1 — The aesthetics reality check",
        body: "What the rules actually say, what they don't, and where the line sits for practitioners in England today.",
      },
      {
        num: "02",
        title: "Day 2 — The Traffic Light System",
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
      "Two days. The honest read-out on where you stand under England's evolving aesthetics regulation — before someone else decides for you.",
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
          "Understanding the difference between training and authorisation — and where most unintentional breaches actually start.",
      },
    ],
    whyBernadette:
      "I'm NMC-registered (verifiable on the public register) and an MSc Advanced Practice nurse. I lecture postgraduate clinicians on regulation, lead clinical workforce governance for an NHS Trust, and I built my own clinic to JCCP / CPSA-aligned standards. The Traffic Light System I teach isn't theory — it's how regulators already think.",
    includes: [
      "Two short lessons released over 2 days",
      "The full Traffic Light System (Red / Amber / Green)",
      "Lifetime access — revisit any time",
      "Self-paced — work it around your clinic",
    ],
    faqs: [
      {
        q: "Is this England-only?",
        a: "Yes. The regulatory framework taught is specific to England — the JCCP, CPSA, MHRA, CQC and ASA jurisdiction. Practitioners in Scotland, Wales, or Northern Ireland will find the principles useful but the licensing detail differs.",
      },
      {
        q: "Will this turn me into a regulator?",
        a: "No. The aim is to help you recognise risk before risk recognises you — not to make you an expert in legislation. You'll leave able to triage decisions the way regulators already do.",
      },
      {
        q: "What's the difference between this and the full RAG Pathway?",
        a: "The Mini gives you awareness — the conceptual framework. The full RAG Pathway (4 weeks, paid) gives you the documentation, governance systems, and defensible practice records to actually operate inside it day-to-day.",
      },
    ],
  },

  /* ============================================================
     CLINICAL CONDITION COURSES
     ============================================================ */
  {
    slug: "acne-decoded",
    kartraMembershipName: "Acne Decoded",
    eyebrow: "Clinical · £79",
    title: "Acne Decoded",
    summary:
      "Stop guessing. Learn what drives acne and how to treat it properly.",
    body: "Most acne treatment plans are educated guesses. Same protocols, same disappointed clients, same results that don't hold. I built Acne Decoded as the science behind the condition. What drives breakouts at the cellular level. How to assess severity correctly. How to treat without over-treating. NICE guidance translated into clinical decisions you can defend. One course. £79. No upsells.",
    voiceQuote:
      "Acne is not simply a cosmetic concern. It is a complex, chronic inflammatory skin condition that affects individuals physically, psychologically, and socially.",
    bullets: [
      "Acne pathophysiology",
      "NICE-aligned protocols",
      "Treatment decision-making",
      "Severity assessment",
    ],
    stats: ["11 sections", "Self-paced", "£79"],
    modules: [
      {
        num: "01",
        title: "What is acne?",
        body: "Definition, types, UK classification, key facts — and why “teenage acne” gets it wrong.",
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
        body: "Topicals, oral, in-clinic — when each belongs and how to sequence without burning the barrier.",
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
        body: "Real cases, decision walkthroughs. Mild, moderate, severe — what you'd do, why, and what NICE backs.",
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
    price: 79,
    ctaText: "View course",
    kartraUrl: courseKartraPlaceholder("acne-decoded"),
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
          "Charging premium fees with the clinical reasoning to back them — and the photographic documentation to prove the outcome.",
      },
    ],
    whyBernadette:
      "I hold an MSc Advanced Practice (Level 7), I'm NMC registered, I lecture postgraduate clinicians, and I run an award-winning aesthetics clinic — Visage Aesthetics, which won Best Non-Surgical Aesthetics Clinic 2026 (Essex). I built Acne Decoded on the same NICE pathways the NHS uses — translated for private clinic practice by a nurse who's spent twenty years inside the system that wrote them.",
    includes: [
      "11 sections covering pathophysiology, assessment, and treatment",
      "NICE-aligned consultation framework + severity scoring",
      "Treatment pathway decision tree (mild / moderate / severe)",
      "Real case study walkthroughs",
      "Certificate of Completion for CPD evidence",
      "Lifetime access — including future updates",
      "Self-paced · self-marked knowledge check",
    ],
    faqs: [
      {
        q: "Is this CPD-accredited?",
        a: "Acne Decoded is designed to count toward CPD evidence and is appropriate as reflective practice for NMC revalidation. The Certificate of Completion at the end gives you the documentation to attach to your portfolio.",
      },
      {
        q: "Will this teach me to inject?",
        a: "No. This is clinical reasoning around acne — assessment, treatment decisions, NICE-aligned pathways, when to escalate. Hands-on technical training requires a separate insured pathway.",
      },
      {
        q: "Do I need to be a nurse to take it?",
        a: "No. The course is designed for any practitioner working with skin who wants the clinical reasoning behind acne decisions — including aestheticians, beauty therapists, advanced facialists, and prescribing clinicians.",
      },
      {
        q: "Is it really £79 with no upsells?",
        a: "Yes. £79 one-time, lifetime access, no upsells inside the course. Bernadette's stance is that clinical education should be priced honestly.",
      },
    ],
  },
  {
    slug: "rosacea-beyond-redness",
    kartraMembershipName: "Rosacea Beyond Redness",
    eyebrow: "Clinical · £79",
    title: "Rosacea Beyond Redness",
    summary:
      "Pathophysiology, barrier integrity, microbiome, NICE-aligned management — the rosacea course UK practitioners have been waiting for.",
    body: "Rosacea is rarely just about redness. I built this course to unpack the four subtypes, the barrier story, the microbiome, and the long-term management strategy NICE backs. For practitioners who want to stop reaching for the same flare-management tool and start treating the condition. One course. £79. No upsells.",
    voiceQuote:
      "Build knowledge, confidence, and safe decision-making when working with clients who may present with rosacea.",
    bullets: [
      "Rosacea subtypes & pathophysiology",
      "Barrier integrity & microbiome",
      "NICE-aligned management",
      "Trigger identification",
    ],
    stats: ["12 sections", "Self-paced", "£79"],
    modules: [
      {
        num: "01",
        title: "What is rosacea?",
        body: "Erythematotelangiectatic, papulopustular, phymatous, ocular. The four faces of rosacea and what each one tells you about the underlying drivers.",
      },
      {
        num: "02",
        title: "Pathophysiology & skin science",
        body: "Vascular, neurological, immunological. The three systems that conspire to make rosacea unpredictable — and how to read them.",
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
    price: 79,
    ctaText: "View course",
    kartraUrl: courseKartraPlaceholder("rosacea-beyond-redness"),
    tone: "pink-soft",
    category: "Clinical",
    format: "Self-paced · 12 sections",
    availability: "available",
    bgImage: "/backgrounds/cream-halftone.png",
    promise:
      "Stop managing flares with the same tool. Start treating the condition — barrier, microbiome, vascular, neurological — with NICE-aligned clinical reasoning.",
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
          "Clear escalation criteria — phymatous progression, ocular involvement, treatment-resistant inflammation.",
      },
    ],
    whyBernadette:
      "I'm an Advanced Nurse Practitioner with twenty years' clinical experience and twelve in aesthetics. My clinic — Visage Aesthetics, Best Non-Surgical Aesthetics Clinic 2026 (Essex) — sees rosacea every week. I built this course on the NICE pathway, the RCN's clinical guidance, and the realities of treating rosacea inside a private clinic at premium fees.",
    includes: [
      "12 sections covering subtypes, assessment, and treatment ladders",
      "Barrier-first vs anti-inflammatory-first decision framework",
      "Trigger-mapping protocol clients will actually follow",
      "NICE-aligned topical + oral treatment pathway",
      "Real case study walkthroughs",
      "Certificate of Completion for CPD evidence",
      "Lifetime access — including future updates",
    ],
    faqs: [
      {
        q: "Will this help me distinguish rosacea from acne or perioral dermatitis?",
        a: "Yes. The clinical assessment module covers all the common mimickers and the differential reasoning to catch misdiagnoses before they cost you a treatment plan.",
      },
      {
        q: "Does it cover ocular rosacea?",
        a: "Yes — including when to refer to ophthalmology and how to document the conversation. Ocular involvement is one of the most under-recognised aspects of rosacea in private practice.",
      },
      {
        q: "Is it CPD-accredited?",
        a: "Designed to count toward CPD and appropriate as NMC revalidation reflective practice. Includes a Certificate of Completion.",
      },
    ],
  },

  /* ============================================================
     BUSINESS / REGULATORY (PAID, WAITLIST)
     ============================================================ */
  {
    slug: "rag-pathway",
    kartraMembershipName: "From Regulation to Reputation™ — The RAG Pathway",
    eyebrow: "Regulatory · 4 weeks · waitlist",
    title: "From Regulation to Reputation™ — The RAG Pathway",
    summary:
      "The structured 4-week, educator-led RAG Pathway. For England-based practitioners who want to practise safely, ethically, and defensibly.",
    body: "Aesthetics isn't unregulated. It's misunderstood — and that's where careers, confidence, and reputations get lost. From Regulation to Reputation™ is the RAG Pathway in full: a 4-week, educator-led programme I designed for England-based practitioners. Without fear. Without guesswork. Without cutting corners. This isn't a “how to inject” course. It's the framework that keeps you compliant, in business, and building a reputation that compounds — the same one I run my own award-winning clinic on.",
    voiceQuote:
      "As your mentor on this journey, my role is to help you move beyond confusion and fear around regulation and instead use it as a strategic advantage.",
    bullets: [
      "JCCP & MHRA-aligned practice",
      "Scope-of-practice clarity",
      "Risk-gap auditing",
      "ASA-safe marketing",
      "Defensible documentation",
    ],
    stats: ["8 modules", "4 weeks", "Waitlist"],
    modules: [
      {
        num: "01",
        title: "Module 1 — The aesthetics reality check",
        body: "Where England's aesthetics industry actually sits today. The licensing landscape, the JCCP register, the MHRA expectations.",
      },
      {
        num: "02",
        title: "Module 2 — The Traffic Light System",
        body: "🔴 Red, 🟠 Amber, 🟢 Green. The decision-making muscle for every procedure, marketing claim, and treatment offer.",
      },
      {
        num: "03",
        title: "Module 3 — Legal essentials",
        body: "Consent, capacity, supervision, prescribing pathways, indemnity. The non-negotiables, in plain English.",
      },
      {
        num: "04",
        title: "Module 4 — Setting up your clinic",
        body: "Premises, infection control, sharps, waste, oversight. What inspectors look for and what gets you closed.",
      },
      {
        num: "05",
        title: "Module 5 — Clinical governance",
        body: "Documentation, audit, complaints, escalation. The systems that turn complaints into evidence of good practice.",
      },
      {
        num: "06",
        title: "Module 6 — Staying ASA safe",
        body: "What you can claim, what you can't, what gets your ads pulled. Marketing rules, made workable.",
      },
      {
        num: "07",
        title: "Module 7 — Training, qualifications & CPD",
        body: "What counts, what doesn't, and how to evidence ongoing competence to insurers and clients.",
      },
      {
        num: "08",
        title: "Module 8 — Integration & reflection",
        body: "Pulling the framework into a sustainable practice rhythm. Certificate of Completion.",
      },
    ],
    ctaText: "Join the waitlist",
    kartraUrl: courseKartraPlaceholder("rag-pathway"),
    tone: "pink",
    category: "Regulatory",
    format: "8 modules · 4 weeks · educator-led",
    availability: "waitlist",
    bgImage: "/backgrounds/pink-fade-charcoal.png",
    promise:
      "Four weeks. Eight modules. The structured framework that turns regulation from a source of anxiety into a strategic advantage you can defend in any room.",
    transformations: [
      {
        before:
          "Vaguely anxious. Hoping no one looks too closely at the documentation.",
        after:
          "A defensible practice — scope, premises, consent, governance, marketing — every layer aligned to JCCP / CPSA / MHRA expectations.",
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
          "Clear answer to the question: “If a complaint landed today, could I justify and defend every decision?” Yes — on paper.",
      },
      {
        before:
          "Worried about the licensing direction of travel.",
        after:
          "Future-proofed. Aligned with where statutory licensing is heading before it lands.",
      },
    ],
    whyBernadette:
      "I lead clinical workforce governance for an NHS Trust with oversight of over 1,000 nurses. I lecture postgraduate clinicians on advanced practice, regulation, and clinical governance — at the same level the rules in this course were designed for. The RAG Pathway is what I distilled from teaching inside the NHS into a framework private aesthetic practitioners can actually use — and it's how I run my own clinic.",
    includes: [
      "8 modules across 4 weeks · educator-led",
      "The full Traffic Light System decision framework",
      "Documentation, governance, and audit templates",
      "ASA-safe content frameworks (what you can and can't claim)",
      "Small first cohort with live touch-points",
      "Launch discount (waitlist priority)",
      "Certificate of Completion for CPD + revalidation",
      "Lifetime access — including future regulatory updates",
    ],
    faqs: [
      {
        q: "When does the next cohort run?",
        a: "Cohort dates are released to the waitlist first. Waitlist members get priority enrolment plus a launch discount before public release.",
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
        a: "The Mini gives you the conceptual framework. The full RAG Pathway gives you the documented, defensible practice records to actually operate inside it — including templates, audit checklists, and ASA-safe marketing modules.",
      },
    ],
  },
  {
    slug: "5k-formula",
    kartraMembershipName: "The 5K+ Formula™",
    eyebrow: "Business · 12 weeks · waitlist",
    title: "The 5K+ Formula™",
    summary:
      "Consistent £5K+ months. Without chasing clients, discounting, or doing more treatments.",
    body: "12-week aesthetics business system built around the UNLOCK PROFIT™ Framework I refined inside my own clinic. Niche, signature offers, confident pricing, the systems that hold a clinic together. For clinic owners ready to build consistent £5K+ months without burning out, racing on price, or chasing the next viral treatment. Waitlist open. Launch discount included. Small first cohort.",
    voiceQuote:
      "You're not here to learn generic business tips — you're here to master the art of building a profitable, personal, and professional aesthetics brand.",
    bullets: [
      "The UNLOCK PROFIT™ Framework",
      "Three Pillars of the Clinical Core",
      "Signature offer building",
      "Confident pricing & systems",
      "Client journey mapping",
      "Monthly business rituals",
    ],
    stats: ["12 modules", "12 weeks", "Waitlist"],
    modules: [
      {
        num: "01",
        title: "Module 1 — Niche",
        body: "The Three Pillars of the Clinical Core: Expertise. Excitement. Economics. The exercise that turns a generalist clinic into a destination practice.",
      },
      {
        num: "02",
        title: "Module 2 — Branding",
        body: "Voice, visual, and the one-line proposition that turns “another injector” into “the practitioner I trust.”",
      },
      {
        num: "03",
        title: "Module 3 — Leveraging",
        body: "Where your time, energy and authority compound — and the busywork to drop today.",
      },
      {
        num: "04",
        title: "Module 4 — Optimise the client experience",
        body: "Pre-consult, consult, post-treatment, reactivation. The four touch-points that decide whether one client becomes ten.",
      },
      {
        num: "05",
        title: "Module 5 — Create authority via content",
        body: "Educational content that converts without pandering. The minimum-viable rhythm that fills the diary.",
      },
      {
        num: "06",
        title: "Module 6 — Becoming fully booked",
        body: "Diary management, retention, the invisible scarcity that makes you the practitioner they wait for.",
      },
      {
        num: "07",
        title: "Module 7 — Pricing mastery",
        body: "How to set, hold, and raise prices without losing the clients you actually want.",
      },
      {
        num: "08",
        title: "Module 8 — Refine your sales skills",
        body: "Ethical sales as patient-centred guidance. Closing without ever sounding like a salesperson.",
      },
      {
        num: "09",
        title: "Module 9 — Organise your operations",
        body: "The systems, SOPs, and rhythms that keep a busy clinic from owning your weekends.",
      },
      {
        num: "10",
        title: "Module 10 — Forecast & scale",
        body: "Numbers you actually run on. The monthly read-out that decides what to grow and what to cut.",
      },
      {
        num: "11",
        title: "Module 11 — Long-term strategy",
        body: "Where the practice goes in year three, five, ten — and how to plan back from it.",
      },
      {
        num: "12",
        title: "Module 12 — The compound effect",
        body: "Integration & reflection. Why the practitioners who stay still eventually win. Certificate of Completion.",
      },
    ],
    ctaText: "Join the waitlist",
    kartraUrl: courseKartraPlaceholder("5k-formula"),
    tone: "black",
    category: "Business",
    format: "12 modules · 12 weeks · educator-led",
    availability: "waitlist",
    bgImage: "/backgrounds/pink-fade-charcoal-2.png",
    promise:
      "Twelve weeks. Twelve modules. The UNLOCK PROFIT™ Framework I built my own award-winning clinic on — translated for practitioners who want consistent £5K+ months without burning out.",
    transformations: [
      {
        before:
          "Busy diary, but quietly unsure if the clinic is actually paying you.",
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
          "Systems that hold the clinic without you. Pre-consult, consult, post-treatment, reactivation — automated where it should be, personal where it matters.",
      },
      {
        before:
          "Running on instinct and exhaustion.",
        after:
          "An hour-a-week business rhythm. Forecasts, reviews, and the compound effect of small decisions made consistently.",
      },
    ],
    whyBernadette:
      "I built Visage Aesthetics — winner of Best Non-Surgical Aesthetics Clinic 2026 (Essex, Health, Beauty & Wellness Awards) — using the UNLOCK PROFIT™ Framework. I've been refining it for twelve years, in real clinic, at real fee pressure. This is the system — taught by the practitioner who proved it works.",
    includes: [
      "12 modules across 12 weeks · rolling release",
      "The complete UNLOCK PROFIT™ Framework",
      "Niche · branding · pricing · systems modules",
      "Live touch-points throughout the cohort",
      "Small first cohort (limited seats)",
      "Launch discount (waitlist priority)",
      "Certificate of Completion",
      "Lifetime access — including future updates",
    ],
    faqs: [
      {
        q: "When does the next cohort run?",
        a: "Cohort dates are released to the waitlist first. Waitlist members get priority enrolment plus a launch discount before doors open publicly.",
      },
      {
        q: "What if I already have a busy clinic?",
        a: "The 5K+ Formula™ is built specifically for practitioners who are already in clinic but feel busy-not-paid. It assumes you've got the technical skills — the work is on niche, pricing, signature offers, and the systems that turn busy weeks into profitable ones.",
      },
      {
        q: "How much time per week?",
        a: "Plan for ~2 hours of module work + ~1 hour of weekly business rituals applied inside your clinic. The framework is designed to integrate into your week, not replace it.",
      },
      {
        q: "Will it teach me marketing?",
        a: "Yes — but ASA-safe, ethical, content-first marketing. Not Instagram tactics, not paid ads. The marketing module is anchored to the same regulatory framework taught in the RAG Pathway.",
      },
      {
        q: "Do I get 1-1 support?",
        a: "The cohort runs with live group touch-points. 1-1 support sits outside this programme — speak to us directly if you're looking for that.",
      },
    ],
  },
] as const;

/** Look-up helper used by `/courses/[slug]/page.tsx`. */
export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/** Resolve a Kartra `lead.memberships[].membership_name` back to its
 *  Course entry. Returns undefined if no course matches that name —
 *  which is the right behaviour for a stale or misspelt mapping. */
export function getCourseByMembershipName(
  membershipName: string,
): Course | undefined {
  return COURSES.find((c) => c.kartraMembershipName === membershipName);
}
