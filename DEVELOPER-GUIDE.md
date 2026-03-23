# SkiLesson.ai — Developer Handoff Guide

**Last Updated:** March 15, 2026
**Project Owner:** Dogwood Brands Company
**Operator:** Tyler Berglund (Vail)
**Domain:** skilesson.ai

---

## Quick Start

```bash
npm install
npm run dev    # → http://localhost:3000
npm run build  # Production build
```

**Demo Login:** `demo@dogwoodbrands.com` / `vail`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter (body), Plus Jakarta Sans (headlines) via next/font/google |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing/hero page (public)
│   ├── layout.tsx                # Root layout (fonts, metadata, AuthProvider)
│   ├── globals.css               # Global styles, Tailwind config, snow animations
│   ├── about/page.tsx            # About page (public)
│   ├── pricing/page.tsx          # Pricing tiers (public)
│   ├── curriculum/               # Curriculum pages (public)
│   │   ├── page.tsx              # Overview with ski/snowboard toggle
│   │   └── [level]/page.tsx      # Level detail (beginner/intermediate/advanced)
│   ├── signin/page.tsx           # Sign in (demo auth functional)
│   ├── signup/page.tsx           # Sign up / free trial (demo auth)
│   ├── contact/page.tsx          # Contact form
│   ├── terms/page.tsx            # Terms of service
│   ├── privacy/page.tsx          # Privacy policy
│   ├── dashboard/                # Authenticated area
│   │   ├── layout.tsx            # Dashboard layout (AuthGuard + sidebar)
│   │   ├── page.tsx              # Student home (progress, streaks, stats)
│   │   ├── lessons/page.tsx      # Lesson library (filterable grid)
│   │   ├── lessons/[id]/page.tsx # Individual lesson (video player, notes)
│   │   └── progress/page.tsx     # Progress tracking (charts, badges)
│   └── api/                      # API route stubs
│       ├── auth/route.ts         # Auth stub → implement NextAuth.js
│       ├── subscribe/route.ts    # Subscription stub → implement Stripe
│       └── ai-coach/route.ts     # AI Coach stub → implement Claude API
├── components/
│   ├── Navbar.tsx                # Marketing navbar (transparent → glass on scroll)
│   ├── Footer.tsx                # Site footer
│   ├── RootLayoutShell.tsx       # Hides navbar/footer on dashboard routes
│   ├── DashboardLayout.tsx       # Dashboard wrapper (topbar + content area)
│   ├── DashboardSidebar.tsx      # Dashboard sidebar / mobile bottom tabs
│   ├── UserMenu.tsx              # Authenticated user dropdown
│   ├── VideoPlayer.tsx           # Mock video player (simulated playback)
│   └── DemoVideoCard.tsx         # Video lesson card for grids
└── lib/
    ├── auth-context.tsx          # Demo auth provider (localStorage)
    ├── auth-guard.tsx            # Route protection component
    ├── curriculum-data.ts        # Full curriculum: 161 lessons, 28 modules
    ├── demo-videos.ts            # 24 demo video entries with metadata
    └── thumbnail-gradients.ts    # 8 mountain-themed gradient configs
```

---

## What's Done (Frontend Complete)

- Full marketing site: landing, pricing, curriculum, about, contact
- Full dashboard app: home, lessons, lesson detail, progress tracking
- Demo authentication with localStorage persistence
- Mock video player with simulated playback controls
- 161 real curriculum lessons across skiing & snowboarding
- Responsive design (mobile-first)
- Framer Motion animations throughout
- Terms of service & privacy policy
- SEO metadata
- Snow particle CSS animations

---

## What Needs Backend Implementation

### 1. Authentication (Priority: HIGH)

**Current state:** Demo-only auth via localStorage.
**Recommended:** NextAuth.js or Clerk

```bash
npm install next-auth
```

**Steps:**
- Set up NextAuth.js with Google + Credentials providers
- Create `/api/auth/[...nextauth]/route.ts`
- Replace `src/lib/auth-context.tsx` with real auth hooks
- Update `AuthGuard` to use NextAuth session
- Add user registration with email verification
- Set up a database (PostgreSQL recommended) for user records

**Environment variables needed:**
```env
NEXTAUTH_URL=https://skilesson.ai
NEXTAUTH_SECRET=<generate-random-secret>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
DATABASE_URL=<postgres-connection-string>
```

### 2. Payments / Subscriptions (Priority: HIGH)

**Current state:** Pricing page displays tiers, buttons are non-functional.
**Recommended:** Stripe

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

**Steps:**
- Create Stripe account and set up products:
  - Explorer: $29/mo ($249/yr)
  - Summit: $49/mo ($449/yr)
  - Apex: $79/mo ($699/yr)
- Implement `/api/subscribe/route.ts` with Stripe Checkout Sessions
- Create `/api/webhooks/stripe/route.ts` for subscription lifecycle events
- Build customer portal integration for plan management
- Add subscription status to user model
- Gate content access based on plan level

**Environment variables needed:**
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Stripe products to create:**
| Product | Monthly Price ID | Annual Price ID |
|---------|-----------------|-----------------|
| Explorer | price_explorer_monthly | price_explorer_annual |
| Summit | price_summit_monthly | price_summit_annual |
| Apex | price_apex_monthly | price_apex_annual |

### 3. Database (Priority: HIGH)

**Recommended:** PostgreSQL with Prisma ORM

```bash
npm install prisma @prisma/client
npx prisma init
```

**Core tables needed:**
- `users` — id, name, email, password_hash, plan, created_at
- `profiles` — user_id, sport_preference, skill_level, is_child, parent_id
- `progress` — user_id, lesson_id, status, completed_at, notes
- `streaks` — user_id, date, minutes_practiced
- `subscriptions` — user_id, stripe_customer_id, stripe_subscription_id, plan, status

### 4. Video Content / CMS (Priority: MEDIUM)

**Current state:** Mock video player with CSS gradient thumbnails.
**Options:**
- **Mux** (recommended) — Video hosting with adaptive streaming, analytics
- **Cloudflare Stream** — Simpler, cost-effective
- **Vimeo OTT** — Built for subscription video

**Steps:**
- Choose a video host and upload lesson content
- Replace `VideoPlayer.tsx` gradient backgrounds with actual video embeds
- Implement DRM/content protection for paid content
- Add video progress tracking (save timestamp on pause/exit)
- Generate real thumbnails from video content

### 5. AI Coach (Priority: MEDIUM)

**Current state:** Static motivational messages in dashboard.
**Recommended:** Anthropic Claude API

```bash
npm install @anthropic-ai/sdk
```

**Steps:**
- Implement `/api/ai-coach/route.ts` with Claude API integration
- System prompt should include: student's current level, completed lessons, current streak, sport preference
- Build a simple chat interface in the dashboard
- Add rate limiting (e.g., 20 messages/day per user)
- For youth users: add COPPA-compliant content filtering
- Store conversation history per user

**Environment variables needed:**
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 6. Email System (Priority: MEDIUM)

**Recommended:** Resend or SendGrid

**Emails to implement:**
- Welcome email on signup
- Email verification
- Password reset
- Weekly progress digest
- Streak reminders ("Don't break your streak!")
- Subscription confirmations / receipts
- Trial expiration warnings (day 5, day 7)

### 7. Analytics (Priority: LOW)

**Recommended:** Vercel Analytics + PostHog

- Page views and conversion tracking
- Funnel: Landing → Pricing → Signup → First Lesson → Subscription
- Video completion rates
- Feature usage metrics

---

## Deployment on Vercel

1. Push repo to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

**Vercel settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js Version: 20.x

**Custom domain setup:**
- Add `skilesson.ai` in Vercel Domains
- Update DNS: CNAME → `cname.vercel-dns.com`

---

## Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| Navy | #0f172a | Background, dark surfaces |
| Snow | #f8fafc | Text, light elements |
| Ice Blue | #38bdf8 | Primary accent, CTAs, beginner |
| Powder | #7dd3fc | Secondary accent, hover states |
| Slate | #475569 | Muted text, borders |
| Gold | #f59e0b | Highlights, intermediate, badges |
| Rose | #f43f5e | Advanced level accent |

**Glass morphism:** `backdrop-blur-xl bg-white/5 border border-white/10`

---

## Content TODO

- [ ] Record actual video lessons with Tyler Berglund's team
- [ ] Professional photography for team headshots
- [ ] Real testimonials from beta users
- [ ] Legal review of Terms of Service and Privacy Policy
- [ ] COPPA compliance review for youth features
- [ ] Finalize pricing with market research

---

*Built by Dogwood AI Agent — March 2026*
