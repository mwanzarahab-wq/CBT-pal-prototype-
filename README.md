# CBT Pal

**An AI-powered anxiety support application for Zambian university students.**

CBT Pal meets students at the moment they notice something is wrong — before they are misdiagnosed, dismissed, or redirected into harmful alternatives — and walks them toward professional help.

---

## The problem

At Zambian universities, **46.2% of students report anxiety symptoms**, yet formal diagnosis takes an average of nine months. The reason: anxiety in Zambia presents predominantly as physical symptoms — chest pain, headaches, fatigue, stomach problems — so students are treated for physical illness while the real cause goes unaddressed. When the formal system fails to diagnose, students and families turn to traditional healers, a pipeline that frequently results in financial exploitation and, in documented cases, physical and sexual harm of vulnerable patients.

Zambia has **3 psychiatrists for a population of over 19 million**. The diagnostic gap is the root cause. CBT Pal is designed to close it.

---

## What CBT Pal does

| Feature | Description |
|---|---|
| **Symptom check-in** | Interactive questionnaire that maps physical and emotional symptoms to common anxiety presentations — intercepting the diagnostic gap before students are redirected elsewhere |
| **The Navigator** | AI conversational agent that listens, explains anxiety in plain language, and directs the user toward professional help — constrained to a navigational role, never diagnostic |
| **Thought records** | CBT-based guided journaling: identify the thought, examine the evidence, reframe toward balance |
| **Wellness planner** | Behavioural-activation daily checklist (sleep, study breaks, meals, self-care, movement) with a 7-day streak view |
| **Psychoeducation library** | Plain-language articles explaining anxiety, its physical presentations, and why it gets missed — written for a Zambian university student audience |
| **Support & referrals** | UNZA Student Counselling Centre information plus verified national helplines with operating hours |
| **Crisis protocol** | Hardcoded crisis detection that fires before any AI call, surfaces Zambian helplines immediately, and logs a crisis event server-side — non-negotiable and the first feature reviewed by clinical collaborators |

---

## Tech stack

### Prototype (this repo)
- **React** (via Babel CDN) — single self-contained HTML file, no build step
- **Anthropic Claude API** — powers The Navigator (claude-sonnet-4-6)
- **Artifact storage** — lightweight key-value persistence for journal/planner/check-in data

### Production backend (planned)
- **Supabase** — Postgres database, Auth, Row-Level Security
- **Supabase Edge Functions (Deno/TypeScript)** — server-side API proxy so the Anthropic key is never shipped inside the APK
- **Android (Kotlin)** — primary target platform

---

## Repository structure

```
cbtpal-prototype/
├── prototype/
│   ├── CBTPal.html          # Self-contained working prototype (open in any browser)
│   └── CBTPal.jsx           # React component version (for Claude artifact / dev environments)
├── backend/
│   ├── schema.sql           # Supabase Postgres schema with RLS policies
│   └── navigator-chat.ts    # Supabase Edge Function — Navigator API proxy + crisis logging
└── README.md
```

---

## Running the prototype

No installation required.

1. Download `prototype/CBTPal.html`
2. Open it in any modern browser
3. The Navigator chat requires an internet connection (it calls the Anthropic API)

All other features — symptom check-in, journal, planner, library, support — work fully offline once the page has loaded.

---

## Backend setup (Supabase)

If you want to run the full backend locally or deploy it:

**1. Create a Supabase project** at [supabase.com](https://supabase.com)

**2. Run the schema**
```bash
# Via the Supabase SQL editor, paste and run:
backend/schema.sql
```

**3. Deploy the Edge Function**
```bash
supabase functions deploy navigator-chat
```

**4. Set secrets**
```bash
supabase secrets set ANTHROPIC_API_KEY=your_key_here
```

The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets are injected automatically by Supabase at runtime — you do not need to set them manually.

---

## Design principles

**Constraint-first prompt engineering.** The Navigator's system prompt defines what it must never do before defining what it should do — no diagnosis, no prescriptions, no open-ended therapy. Every response pathway ends with a referral. Crisis detection runs server-side in code before the LLM is called, not as an instruction to the model.

**Privacy by design.** Row-Level Security is enabled on every table. The `crisis_events` table stores only a flag and a timestamp by default — not the triggering message text — until a future opt-in escalation flow is designed with clinical input.

**Culturally grounded language.** The system prompt instructs the agent to use plain, non-clinical language appropriate for a Zambian university student, avoiding Western mental health terminology that may be unfamiliar or alienating.

---

## Crisis resources

CBT Pal surfaces these resources immediately when crisis language is detected, regardless of network state:

| Helpline | Number | Hours |
|---|---|---|
| Lifeline Zambia | 933 | Free, toll-free, 24/7 |
| Childline Zambia | 116 | Free, toll-free, 24/7 |
| UNICEF Zambia Youth Mental Health & Suicide Prevention | +260 977 770 774 | Mon–Fri, 9am–5pm |

---

## Roadmap

- [ ] Android app (Kotlin) with Supabase Auth
- [ ] Full backend integration (navigator-chat Edge Function live)
- [ ] Clinical collaborator review of Navigator system prompt and crisis protocol (UNZA Counselling Centre)
- [ ] User research beyond close network — structured interviews with UNZA students
- [ ] Presidential Innovators Award funding application
- [ ] Pilot launch at UNZA (target: 200 downloads within 3 months)
- [ ] Expand to other Zambian universities

---

## About

CBT Pal was conceived by **Rahab Juvenalis Mwanza**, a Software Engineering student at the University of Zambia, based on nine months of personal experience with undiagnosed anxiety. It was first developed as part of the Founderz AI Business & Prompt Engineering course and is actively being built toward a December 2025 launch.

> *From a diagnosis that came nine months too late — to a tool that arrives on day one.*

---

## Disclaimer

CBT Pal is a wellness navigation tool, not a medical device. The Navigator agent is not a therapist, counsellor, or doctor. It does not diagnose, prescribe, or provide clinical treatment. Users experiencing a mental health crisis should contact a qualified professional or one of the helplines listed above.
