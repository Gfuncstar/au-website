/**
 * lib/faqs.ts
 *
 * General site-wide FAQs. Course-specific FAQs live alongside their
 * course in `lib/courses.ts`.
 *
 * Voice rule: NEVER abbreviate to "AU" in user-facing copy. Always
 * "Aesthetics Unlocked", "we", "the courses", or "the platform".
 */

import type { FAQItem } from "@/components/FAQ";

export type FAQGroup = {
  heading: string;
  items: readonly FAQItem[];
};

export const GENERAL_FAQS: readonly FAQGroup[] = [
  {
    heading: "About Aesthetics Unlocked",
    items: [
      {
        q: "Who is Aesthetics Unlocked for?",
        a: "I built it for UK aesthetic practitioners and clinic owners — injectors, advanced practitioners, skin specialists, aesthetic nurses, and the doctors who lead them. The free tasters suit anyone exploring the field; the clinical and business courses suit practitioners who are already qualified and want to operate at a higher standard.",
      },
      {
        q: "Who is Bernadette Tobin?",
        a: "I'm the founder of Aesthetics Unlocked. I'm an Advanced Nurse Practitioner with an MSc Advanced Practice (Level 7), NMC registered (verifiable on the public register), a member of the Royal College of Nursing, Senior Lecturer to postgraduate clinicians, Head of Clinical Workforce at an NHS Trust, and founder of Visage Aesthetics — Best Non-Surgical Aesthetics Clinic 2026 (Essex). I'm also a Beauty & Aesthetics Awards Educator of the Year 2026 Nominee.",
      },
      {
        q: "Why should I learn from Bernadette?",
        a: "Because the framework I teach has been tested under real fee pressure inside my own award-winning clinic, and at postgraduate level inside the NHS — not invented for an Instagram audience. Aesthetics Unlocked is the only UK platform where the educator is registered, regulated, and clinically accountable for what she teaches.",
      },
      {
        q: "Is Aesthetics Unlocked regulated?",
        a: "Aesthetics Unlocked is an education brand, not a clinical service — so it sits outside CQC registration. I'm statutorily regulated by the NMC and a member of the Royal College of Nursing. The course content is anchored to NICE, JCCP, CPSA, MHRA, CQC, RCN and ASA standards. See /standards for the full read-out.",
      },
      {
        q: "What does “unlocking your profit potential” actually mean?",
        a: "I designed the courses to unlock three things, in this order: clinical confidence, regulatory clarity, and profitable practice. Most practitioners are stuck on one of those three. The framework moves you across all three so the next chapter of your practice — the higher fees, the better clients, the calmer week — becomes possible.",
      },
    ],
  },
  {
    heading: "Courses & access",
    items: [
      {
        q: "How do the courses work?",
        a: "Courses are hosted in Kartra, the secure Aesthetics Unlocked members area. After you enrol I'll send you a login email; courses are then accessible 24/7 from any device. Self-paced courses can be taken at your own speed; cohort-based programmes (the 12-week 5K+ Formula and the 4-week RAG Pathway) follow a release schedule.",
      },
      {
        q: "Are the courses self-paced or live?",
        a: "Acne Decoded, Rosacea Beyond Redness, the 5K+ Formula 3-Day Mini and the RAG 2-Day Mini are all self-paced. The full 5K+ Formula (12 weeks) and the RAG Pathway (4 weeks) are educator-led with a structured release schedule and live touch-points. Both run in small first cohorts.",
      },
      {
        q: "Will I get a certificate?",
        a: "Yes. Every paid course closes with a Certificate of Completion that you can use as evidence of CPD for revalidation, insurance, or your own portfolio. The free tasters do not include certificates.",
      },
      {
        q: "Can I count this toward CPD or NMC revalidation?",
        a: "Yes — the clinical Aesthetics Unlocked courses are designed to count toward CPD and are appropriate as reflective practice evidence for NMC revalidation. Each course closes with a knowledge-check and a Certificate of Completion you can attach to your portfolio.",
      },
      {
        q: "Do I need to be a nurse or doctor to take a course?",
        a: "No. The clinical courses (Acne Decoded, Rosacea Beyond Redness) are designed for any practitioner working with skin who wants NICE-aligned reasoning behind their decisions. The regulatory and business courses suit anyone running an aesthetics practice in England.",
      },
    ],
  },
  {
    heading: "Payments, refunds & support",
    items: [
      {
        q: "How do I pay?",
        a: "Card payments via Stripe (Visa, Mastercard, Amex). Prices are in GBP. VAT applied where required.",
      },
      {
        q: "What's the refund policy?",
        a: "I offer a 14-day money-back guarantee on every paid course, no questions asked, provided you've completed less than 30% of the modules. Email hello@aunlock.co.uk to request a refund.",
      },
      {
        q: "How long do I have access for?",
        a: "Lifetime access on every paid course (Acne Decoded, Rosacea Beyond Redness, the 5K+ Formula, the RAG Pathway). You'll have access to all content updates as they're released.",
      },
      {
        q: "How do I get in touch?",
        a: "Email hello@aunlock.co.uk. Monday to Friday, 09:00–17:30 GMT. I reply within one working day.",
      },
    ],
  },
  {
    heading: "Standards & ethics",
    items: [
      {
        q: "What standards are the clinical courses aligned to?",
        a: "NICE (the National Institute for Health and Care Excellence) — the same evidence-based guidance the NHS uses. Every clinical course mirrors the NICE pathway for that condition. For practitioner conduct: the NMC Code, RCN guidance on advanced practice, and the JCCP / CPSA risk-based competence framework.",
      },
      {
        q: "Will Aesthetics Unlocked teach me to inject?",
        a: "No. The platform teaches clinical reasoning, regulation, business, and the systems behind a defensible practice. Hands-on injection training requires in-person, supervised teaching that Aesthetics Unlocked does not provide — and would always require a separate insured training pathway.",
      },
      {
        q: "Does Aesthetics Unlocked give legal advice?",
        a: "No. Aesthetics Unlocked is education, not regulated legal counsel. The RAG Pathway translates regulatory frameworks (JCCP, CPSA, MHRA, CQC, ASA) into practical decision-making for practitioners — but where a specific situation needs legal guidance, the courses teach you when and how to seek it.",
      },
    ],
  },
];
