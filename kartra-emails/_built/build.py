"""
Builds 14 per-email customised HTML templates from the AU Broadcast base.
Each uses Bernadette's disk-draft body content as source-of-truth wording.
"""
import os
import pathlib

BASE_DIR = pathlib.Path("/Users/gilestobin/Library/CloudStorage/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/au-website/kartra-emails")
OUT_DIR = BASE_DIR / "_built"
OUT_DIR.mkdir(exist_ok=True)

LOGO = "https://au-website-one.vercel.app/brand/au-logo-pink-on-dark.png"
SITE = "https://au-website-one.vercel.app"
RAG_PORTAL = "https://aestheticsunlock.kartra.com/portal/from-regulation-to-reputation"
FIVEK_PORTAL = "https://aestheticsunlock.kartra.com/portal/the-5k-formula"
ROSACEA_CHECKOUT = "https://aestheticsunlock.kartra.com/pay/cgWTUaFKr9"
FIVEK_CHECKOUT = "https://aestheticsunlock.kartra.com/page/the-5k-formula"
PROFIT_VIDEO = "https://aestheticsunlock.kartra.com/page/the-profit-shift"

BROADCAST_TPL = """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>__TITLE__</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Lato:wght@400;700&family=Oswald:wght@500;600&display=swap" rel="stylesheet" />
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-h1 { font-size: 28px !important; line-height: 1.1 !important; }
      .body-p { font-size: 16px !important; line-height: 1.6 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAF6F1;font-family:'Lato',Helvetica,Arial,sans-serif;color:#212121;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#FAF6F1;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">__PREHEADER__</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF6F1;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:5px;overflow:hidden;">
          <tr>
            <td style="background-color:#212121;padding:32px 40px 28px 40px;" class="px">
              <div style="width:48px;height:3px;background-color:#EE5A8E;margin-bottom:18px;line-height:3px;font-size:0;">&nbsp;</div>
              <a href="__SITE__" target="_blank" style="display:inline-block;text-decoration:none;border:0;">
                <img src="__LOGO__" width="180" height="65" alt="Aesthetics Unlocked" style="display:block;border:0;outline:none;text-decoration:none;height:65px;width:180px;max-width:180px;line-height:100%;-ms-interpolation-mode:bicubic;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:48px 40px 24px 40px;" class="px">
              <p style="margin:0 0 18px 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#EE5A8E;line-height:1;">__EYEBROW__</p>
              <h1 class="hero-h1" style="margin:0;font-family:'Montserrat',Helvetica,Arial,sans-serif;font-weight:900;font-size:32px;line-height:1.1;letter-spacing:-1px;color:#212121;">__H1__</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;" class="px">
__BODY_PARAS__
            </td>
          </tr>
__CTA_BLOCK__
          <tr>
            <td style="padding:8px 40px 48px 40px;" class="px">
              <p class="body-p" style="margin:0 0 6px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#212121;">__CLOSING__</p>
              <p style="margin:0;font-family:Georgia,'Spectral',serif;font-style:italic;font-size:24px;line-height:1.2;color:#EE5A8E;">Bernadette</p>
              <p style="margin:6px 0 0 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#212121;opacity:0.65;">Bernadette Tobin RN, MSc &middot; Aesthetics Unlocked</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#212121;padding:32px 40px;" class="px">
              <p style="margin:0 0 12px 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#EE5A8E;line-height:1.4;">Aesthetics Unlocked&reg;</p>
              <p style="margin:0 0 14px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#FFFFFF;opacity:0.8;">Education for UK aesthetic practitioners by Bernadette Tobin RN, MSc &mdash; Educator of the Year 2026 Nominee, Beauty &amp; Aesthetics Awards.</p>
              <p style="margin:0 0 12px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#FFFFFF;opacity:0.55;">Aesthetics Unlocked, [Postal address pending]<br />Replies welcome &mdash; <a href="mailto:hello@aunlock.co.uk" style="color:#FFFFFF;text-decoration:underline;">hello@aunlock.co.uk</a>.</p>
              <p style="margin:0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;opacity:0.55;"><a href="{unsubscribe_link}" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a> &nbsp;&middot;&nbsp; <a href="{site_url}/privacy" style="color:#FFFFFF;text-decoration:underline;">Privacy</a> &nbsp;&middot;&nbsp; <a href="{site_url}" style="color:#FFFFFF;text-decoration:underline;">aestheticsunlocked.co.uk</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

CTA_TPL = """          <tr>
            <td align="left" style="padding:0 40px 40px 40px;" class="px">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#EE5A8E" style="border-radius:5px;">
                    <a href="__CTA_URL__" target="_blank" style="display:inline-block;padding:14px 28px;font-family:'Montserrat',Helvetica,Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;border-radius:5px;">__CTA_LABEL__ &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
"""

BODY_P_TPL = '              <p class="body-p" style="margin:0 0 20px 0;font-family:\'Lato\',Helvetica,Arial,sans-serif;font-size:17px;line-height:1.65;color:#212121;">__P__</p>\n'


def render(
    *, slug, title, preheader, eyebrow, h1, paragraphs, cta_label=None, cta_url=None, closing="Speak soon,"
):
    """Render one email and write it to disk."""
    body = "".join(BODY_P_TPL.replace("__P__", p) for p in paragraphs)
    cta = ""
    if cta_label and cta_url:
        cta = CTA_TPL.replace("__CTA_LABEL__", cta_label).replace("__CTA_URL__", cta_url)
    html = (
        BROADCAST_TPL
        .replace("__TITLE__", title)
        .replace("__PREHEADER__", preheader)
        .replace("__SITE__", SITE)
        .replace("__LOGO__", LOGO)
        .replace("__EYEBROW__", eyebrow)
        .replace("__H1__", h1)
        .replace("__BODY_PARAS__", body.rstrip("\n"))
        .replace("__CTA_BLOCK__", cta.rstrip("\n"))
        .replace("__CLOSING__", closing)
    )
    out = OUT_DIR / f"{slug}.html"
    out.write_text(html)
    return out, len(html)


def pink(text):
    """Wrap text in pink span for inline highlight inside H1 / paragraphs."""
    return f'<span style="color:#EE5A8E;">{text}</span>'


# ============================================================
# RAG Pathway Post Purchase
# ============================================================

render(
    slug="rag-pp-2",
    title="This is where the reputation work actually starts",
    preheader="Week 2 is where your positioning shifts from defensive to authoritative.",
    eyebrow="RAG Pathway · Week 2",
    h1=f"Where the {pink('reputation work')} actually starts.",
    paragraphs=[
        "Hi {first_name},",
        "The single biggest shift on this Pathway happens between Week 1 and Week 2.",
        "Week 1 lays out the regulation landscape, what's enforceable, what's guidance, what's advisory. Week 2 is where it starts to bite. Compliance, ethics, the lines practitioners cross without realising, and the ones they self-police harder than they need to.",
        f"Most practitioners come in worried about getting the compliance piece wrong. By the end of Week 2, they've worked out most of what they're already doing right, and sharpened the two or three things they weren't.",
        f"That's the moment your positioning starts to shift. You stop sounding defensive about regulation and start sounding {pink('authoritative')}.",
        "If you've only got fifteen minutes today, watch the opening of Week 2.",
    ],
    cta_label="Open Week 2",
    cta_url=RAG_PORTAL,
    closing="Bernadette",
)

render(
    slug="rag-pp-3",
    title="Governance is where most practitioners leave money on the table",
    preheader="Week 3 — the credentials hierarchy that justifies premium pricing.",
    eyebrow="RAG Pathway · Week 3",
    h1=f"Governance is where most practitioners {pink('leave money on the table')}.",
    paragraphs=[
        "Hi {first_name},",
        "Honest question. How much of your current pricing is justified by your positioning, and how much is justified by what the clinic down the road charges?",
        "Governance, the G in RAG, is where most practitioners leave the most obvious money on the table.",
        "Not because they're under-qualified. Because they're under-communicating what their qualifications actually mean.",
        f"Week 3 is the module that fixes this. By the end of it you'll have a governance framework clients can see, a credentials hierarchy they can read, and a positioning stack that justifies premium pricing without you having to defend it.",
        "The practitioners who nail Week 3 stop competing on price within a month.",
    ],
    cta_label="Open Week 3",
    cta_url=RAG_PORTAL,
    closing="Bernadette",
)

render(
    slug="rag-pp-4",
    title="Where are you stuck?",
    preheader="What regulation is actually asking you to prove — and what reputation is built on underneath.",
    eyebrow="Bernadette's note",
    h1=f"Where are you {pink('stuck')}?",
    paragraphs=[
        "Hi there,",
        "If the regulation side of aesthetics still feels like a minefield, there's usually a reason.",
        "Most practitioners focus on what's visible — qualifications, insurance, consent forms. But they don't go deep enough into the positioning underneath.",
        "So what happens? You get the compliance boxes ticked, it feels safer for a while, then the regulation conversation shifts again. And you're back trying to keep up instead of leading.",
        f"The real shift happens when you understand what regulation is actually asking you to prove, what reputation is built on underneath that, and how the two reinforce each other when you stop treating them {pink('separately')}.",
        "That's the part most practitioners never get properly taught.",
        "I'll explain more in my next email.",
    ],
    closing="Speak soon,",
)

render(
    slug="rag-pp-5",
    title="RAG is the foundation. 5K is what you build on it.",
    preheader="The regulation and reputation foundation is set. Here's how to grow the business around it.",
    eyebrow="Next step",
    h1=f"RAG is the foundation. {pink('5K')} is what you build on it.",
    paragraphs=[
        "Hi {first_name},",
        "If you've worked through the RAG Pathway, you've now got the regulation and reputation foundation most UK practitioners never build properly.",
        'Here\'s what practitioners tell us next: <em>"I know how to position myself now. I need to grow the business around it."</em>',
        "That's what the 5K Formula is for.",
        "Twelve weeks. Business strategy, pricing architecture, client journey, retention, and the operational scaffolding that gets a clinic from wherever it's at now to a consistent £5k+ month without burning out the founder.",
        f"RAG gets your positioning right. {pink('5K turns that positioning into revenue.')}",
        "If RAG has earned its place in your week, the 5K Formula is the logical next step.",
    ],
    cta_label="Look at the 5K Formula",
    cta_url=FIVEK_CHECKOUT,
    closing="Bernadette",
)


# ============================================================
# 12-Week Business Program Post Purchase  (5K Formula)
# ============================================================

render(
    slug="12w-pp-1",
    title="You're in. The next 12 weeks change the shape of your clinic.",
    preheader="Welcome to the 5K Formula. Here's the order to work through it in.",
    eyebrow="Welcome aboard",
    h1=f"You're in. The next {pink('12 weeks')} change the shape of your clinic.",
    paragraphs=[
        "Hi {first_name},",
        "Welcome to the 5K Formula. Your access is live.",
        "A quick note before you dive in. The Program is built to be worked through in order, one module per week for twelve weeks. Weeks 1 to 3 are foundation — positioning, pricing architecture, and what your numbers are actually telling you. Weeks 4 to 8 build the client journey and retention. Weeks 9 to 12 are operations, scaling, and the scaffolding that keeps £5k+ months consistent rather than lucky.",
        f"Don't skip the foundation weeks. Most practitioners want to leap to marketing tactics. {pink('Tactics without positioning and pricing fixed underneath are where revenue leaks.')}",
        "I'll send you short check-ins across the next few weeks to flag the points practitioners most commonly stall on.",
    ],
    cta_label="Open the program",
    cta_url=FIVEK_PORTAL,
    closing="Speak soon,",
)

render(
    slug="12w-pp-2",
    title="This is where the numbers actually change",
    preheader="Week 3 — your pricing architecture, not a price-list refresh.",
    eyebrow="5K Formula · Week 3",
    h1=f"Where the {pink('numbers')} actually change.",
    paragraphs=[
        "Hi {first_name},",
        "The single biggest shift in this Program happens around Week 3.",
        "Weeks 1 and 2 give you the positioning foundation. Week 3 is where you rebuild your pricing architecture on top of it.",
        "Not a price list refresh. A pricing architecture. The difference is huge.",
        "A price list is a menu. An architecture is a framework that tells you what to charge, when to charge it, what to bundle, what to never discount, and where the leverage points for premium are. " + pink("It&rsquo;s the difference between hoping the right clients book in and engineering it so they do."),
        "Most practitioners come into Week 3 nervous about raising prices. They leave it having worked out that they've been under-pricing the wrong things while over-discounting the right ones.",
        "If you've only got twenty minutes today, watch Week 3.",
    ],
    cta_label="Open Week 3",
    cta_url=FIVEK_PORTAL,
    closing="Bernadette",
)

render(
    slug="12w-pp-3",
    title="You don't need more clients. You need better retention.",
    preheader="Week 5 — the rebooking framework that makes £5k+ months consistent.",
    eyebrow="5K Formula · Week 5",
    h1=f"You don't need more clients. You need {pink('better retention')}.",
    paragraphs=[
        "Hi {first_name},",
        "Honest question. How many of the clients you saw this month are booked in again within eight weeks?",
        "There's a version of \"growing the clinic\" that looks like chasing more new clients. There's another version that looks like keeping the ones you've got coming back.",
        f"The second one makes £5k+ months consistent. {pink('The first one makes them exhausting.')}",
        "Week 5 of the Program is the module that fixes the retention piece. By the end of it you'll have a rebooking framework, a client journey that makes the next visit feel inevitable rather than pushed, and the pricing hooks that make retention profitable rather than just polite.",
        "Most practitioners discover they were leaving 30 to 40 percent of their potential revenue on the table simply because nobody had mapped the retention flow for them.",
    ],
    cta_label="Open Week 5",
    cta_url=FIVEK_PORTAL,
    closing="Bernadette",
)

render(
    slug="12w-pp-4",
    title="Where are you stuck?",
    preheader="What your numbers are telling you — and the retention flow most practitioners never get taught.",
    eyebrow="Bernadette's note",
    h1=f"Where are you {pink('stuck')}?",
    paragraphs=[
        "Hi there,",
        "If £5k months feel close but not consistent, there's usually a reason.",
        "Most practitioners focus on what's visible — bookings, marketing, social, referrals. But they don't go deep enough into what's actually driving the revenue underneath.",
        "So what happens? A good month happens, it feels like momentum, then the next month dips and you're back firefighting. And you're managing feast-and-famine instead of building a business.",
        f"The real shift happens when you understand what your numbers are actually telling you, what the retention flow beneath them looks like, and how positioning, pricing and journey reinforce each other when you stop treating them {pink('separately')}.",
        "That's the part most practitioners never get properly taught.",
        "I'll explain more in my next email.",
    ],
    closing="Speak soon,",
)

render(
    slug="12w-pp-5",
    title="The business is built. What are you selling into it?",
    preheader="Rosacea Beyond Redness — the clinical authority that makes premium pricing stick.",
    eyebrow="Next step",
    h1=f"The business is built. What are you {pink('selling into it')}?",
    paragraphs=[
        "Hi {first_name},",
        "If you've worked through the 5K Formula, you've now got the business scaffolding most UK practitioners never build. Positioning. Pricing. Retention. Operations.",
        'Here\'s the question most graduates ask next: <em>"What should I be doing clinically that justifies the pricing I\'ve just put in place?"</em>',
        "Fair question. A £5k+ month business needs premium clinical authority to match.",
        f"Rosacea Beyond Redness is one of the strongest positions to build that authority on. It's a condition that walks into every UK clinic, gets mis-treated more than almost any other, and is the exact kind of {pink('\"everyone else gets it wrong but this clinic gets it right\"')} story that makes premium pricing stick.",
        "Eight modules. NICE-aligned. Clinically grounded. The companion to the business systems you've just built.",
    ],
    cta_label="Look at Rosacea Beyond Redness",
    cta_url=ROSACEA_CHECKOUT,
    closing="Bernadette",
)


# ============================================================
# Profit Shift Nurture
# ============================================================

render(
    slug="ps-nur-1",
    title="The Profit Shift — watch this first",
    preheader="Where profit actually comes from in aesthetic practice.",
    eyebrow="The Profit Shift",
    h1=f"{pink('Watch')} this first.",
    paragraphs=[
        "Hi {first_name},",
        "The video is here.",
        "A few things to sit with while you watch.",
        "Most aesthetic practitioners don&rsquo;t have a profit problem. They have a " + pink("positioning problem") + ". They charge what the clinic down the road charges, attract the clients that pricing attracts, and then wonder why the numbers don&rsquo;t work.",
        "The video walks you through the shift — the mental and strategic move that changes your relationship with pricing, client selection and profit.",
        "Watch it once properly. Then I'll send a short note tomorrow with the first reflection.",
    ],
    cta_label="Watch The Profit Shift",
    cta_url=PROFIT_VIDEO,
    closing="Bernadette",
)

render(
    slug="ps-nur-2",
    title="The positioning question",
    preheader="What your pricing is telling your clients before they book.",
    eyebrow="Reflection 1",
    h1=f"The {pink('positioning')} question.",
    paragraphs=[
        "Hi {first_name},",
        "Quick reflection on the video.",
        "Your pricing is doing more than you think. Before a client books, before they read your reviews, before they see a result — your pricing is telling them who you are, who you serve, and what kind of clinic you run.",
        f"If your prices sit in the middle of the market, you're telling people you're a middle-of-the-market practitioner. The clients who respond to that price point are the ones who'll {pink('push back hardest')}, complain about results, and leave when someone cheaper opens up the road.",
        "Reflection: if you raised every price by 20% tomorrow, which clients would you lose? And would losing them actually hurt your business, or improve it?",
        "Most practitioners already know the answer. They just haven't acted on it.",
    ],
    closing="Bernadette",
)

render(
    slug="ps-nur-3",
    title="The 5K month isn't a money goal",
    preheader="It's a structure goal. Here's what makes it consistent.",
    eyebrow="Reflection 2",
    h1=f"The {pink('5K month')} isn't a money goal.",
    paragraphs=[
        "Hi {first_name},",
        "Most practitioners who want £5K months are thinking about the money. Understandable, but it's not the most useful frame.",
        f"£5K months are a {pink('structure outcome')}, not a revenue outcome. They happen when your niche is clear enough that the right clients self-select. Your pricing reflects the quality of your work, not the market average. Your client pathway has a clear next step — no one-and-done treatments. Your positioning is consistent across your website, socials and consultation.",
        "If those four things are in place, £5K happens. If they're not, you can hustle for it but you won't hold it.",
        "The Profit Shift video introduces the concept. The 5K Formula 12-Week Program is the full build.",
    ],
    cta_label="See the 12-Week Program",
    cta_url=FIVEK_CHECKOUT,
    closing="Bernadette",
)

render(
    slug="ps-nur-4",
    title="If the video landed, here's the full build",
    preheader="Twelve weeks, twelve modules, two 1:1 calls.",
    eyebrow="Soft pitch",
    h1=f"Here's the {pink('full build')}.",
    paragraphs=[
        "Hi {first_name},",
        "If the video made sense, the natural next step is the full framework behind it.",
        f"The {pink('5K Formula 12-Week Program')} is built on the UNLOCK PROFIT framework — twelve modules, one per week, covering identity, niche, positioning, pricing, offers, client pathway, and sustainable growth.",
        "It includes twelve modules of video training with worksheets, two 1:1 Unlock Calls with me personally, lifetime access, and the full framework my own clinic has been built on for 10+ years.",
        "£1,199. One payment.",
        "It's a commitment. If you're not ready for the full program, the RAG Pathway (£199) covers the compliance side of your business as a smaller first step.",
        "Either way, the video was a start, not a solution.",
    ],
    cta_label="Join the 12-Week",
    cta_url=FIVEK_CHECKOUT,
    closing="Bernadette",
)

render(
    slug="ps-nur-5",
    title="Where do you want to be in 12 months?",
    preheader="A question worth answering honestly.",
    eyebrow="One question",
    h1=f"Where do you want to be in {pink('12 months')}?",
    paragraphs=[
        "Hi {first_name},",
        "One question before I stop emailing you about this.",
        "Where do you want your practice to be in 12 months? Not what sounds realistic. Not what you think you should say. What do you actually want?",
        f"Because here's the pattern I see: practitioners who can answer that question clearly are the ones who sign up for programs like this. {pink('The clarity comes first. The growth follows it.')}",
        "If it's not the right time, stay on the list. I'll send the occasional insight.",
    ],
    cta_label="Join the 12-Week Program",
    cta_url=FIVEK_CHECKOUT,
    closing="Bernadette",
)


# ============================================================
# Summary
# ============================================================

print("Built files in:", OUT_DIR)
for f in sorted(OUT_DIR.glob("*.html")):
    print(f"  {f.name}  ({f.stat().st_size:>5} bytes)")
