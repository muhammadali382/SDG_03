# AGENTS.md — TabeebCare Implementation Guide

This file is the authoritative reference for any AI agent implementing this project.
Read this fully before writing a single line of code.

> **Branch Evolution Note (`dev`):** The sections below capture the original hackathon MVP bootstrap spec. The **Design System (light theme only)**, **Git Branching Strategy (`dev` vs `main`)**, **RAG Architecture**, and **Clinical Safety / Emergency Escalation rules** remain strictly enforced. On `dev`, the stack has since been upgraded beyond the initial prototype constraints to include `@libsql/client` (local SQLite in dev + Turso libSQL in production), `scrypt` + signed `HttpOnly` cookie auth, API rate limiting, local server OCR (`tesseract.js`), Whisper transcription (`whisper-large-v3-turbo`), Guided 5-Question Doctor Report Intake, and automated unit tests (`npm test`). See `README.md` for the live architecture reference.

---

## Project Identity
- **Name**: TabeebCare (طبیب کیئر)
- **Purpose**: SDG 3 Hackathon — AI health literacy, prescription demystifier, symptom triage
- **Stack**: Next.js 15 (App Router, TypeScript), Tailwind CSS, Groq SDK, better-sqlite3
- **Repo**: https://github.com/muhammadali382/SDG_03

## Project Concept (What We Are Building)
TabeebCare solves 3 problems for Pakistani patients:
1. **Medicine Demystifier** — patient types medicine names → AI outputs clear morning/noon/night schedule in English + Urdu, food precautions, allergy conflict alerts
2. **Symptom Triage Chat** — multilingual conversational intake → AI classifies urgency (Emergency / Urgent / Routine / Home Care) using WHO protocol RAG context
3. **Doctor Handover Card (SBAR)** — 1-click clinical summary the patient brings to the doctor

---

## Hard Constraints — Never Violate These

1. **NO external database services** — SQLite only (`tabibcare.db` in project root). No Supabase, Firebase, Mongo, Postgres.
2. **NO external auth library** — Prototype auth only. `localStorage` stores `{id, name, email}` as `tabibcare_user`. `/api/auth/*` reads/writes the SQLite `users` table in plain text. No NextAuth, no JWT, no bcrypt.
3. **NO extra paid APIs** — Groq only. Model: `llama-3.1-8b-instant`. No OpenAI, no Gemini, no Anthropic.
4. **NO vector databases** — RAG uses keyword matching over TypeScript objects in `clinical_protocols.ts`. No Pinecone, no Chroma, no embeddings API.
5. **NO CSS libraries beyond Tailwind** — No MUI, no Chakra, no Bootstrap. Tailwind classes + Lucide icons only.
6. **NO dark colors** — Light theme only. No dark blue, no navy, no slate-900/gray-900. See Design System below.
7. **NO pages beyond the defined scope** — Only: `/`, `/login`, `/signup`, `/dashboard`, `/meds`, `/triage`, `/profile`, and `/api/*` routes.
8. **`docs/` is gitignored** — Never commit anything from `docs/`.
9. **ALWAYS work on `dev` branch** — Never push application code directly to `main`.

---

## Git Branching Strategy

```
main   ← Protected. CI/CD here (.github/workflows/ci.yml).
dev    ← All development. Always checkout dev before coding.
```

- Always `git checkout dev` before coding.
- Commit messages: present tense, e.g. `"Add SQLite schema and db singleton"`.
- Never commit: `tabibcare.db`, `.env`, `.env.local`, `docs/`.

---

## Design System — Light Theme ONLY

| Role | Tailwind Class | Usage |
|:---|:---|:---|
| Primary | `teal-600` / `teal-700` | Buttons, links, active states |
| Primary light | `teal-50` / `teal-100` | Card backgrounds, badges, chips |
| Page background | `slate-50` | All page backgrounds |
| Card background | `white` | All card backgrounds |
| Border | `slate-200` | Card borders, dividers |
| Body text | `slate-700` | All readable text |
| Muted text | `slate-400` | Placeholders, labels |
| Emergency | `red-500` / `red-50` | Emergency banners, allergy alerts |
| Warning | `amber-500` / `amber-50` | Urgent care |
| Safe | `emerald-500` / `emerald-50` | Home care |
| Info | `sky-500` / `sky-50` | Routine care |

**Component rules:**
- Rounded: `rounded-xl` (cards), `rounded-lg` (buttons/inputs)
- Shadow: `shadow-sm` only — never heavy shadows
- Container: `max-w-4xl mx-auto px-4`

---

## Project Structure (Frontend / Backend Labeled)

```
src/
│
│  ═══ FRONTEND (Client-Side) ═══
│
├── app/(pages)/              ← Next.js pages (React, runs in browser)
│   ├── layout.tsx            ← Root layout
│   ├── page.tsx              ← Landing
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx    ← Protected
│   ├── meds/page.tsx         ← Protected
│   ├── triage/page.tsx       ← Protected
│   └── profile/page.tsx      ← Protected
│
├── components/               ← Reusable UI (client-side only)
│   ├── ui/                   ← Button, Card, Input, Badge
│   ├── layout/               ← Navbar, MedicalDisclaimer
│   ├── triage/               ← ChatBubble, TriageBadge, EmergencyBanner, SbarCard
│   └── meds/                 ← MedicineCard
│
├── context/
│   └── UserContext.tsx       ← Global auth + profile state (React Context)
│
│  ═══ BACKEND (Server-Side Only) ═══
│
├── app/api/                  ← Next.js API Routes (Node.js, never runs in browser)
│   ├── auth/login/route.ts
│   ├── auth/signup/route.ts
│   ├── auth/demo/route.ts
│   ├── meds/route.ts
│   ├── triage/route.ts
│   └── profile/route.ts
│
└── lib/                      ← Server utilities (never import in client components)
    ├── db.ts                 ← SQLite singleton
    ├── schema.ts             ← initDB() — 4 CREATE TABLE statements
    ├── groq.ts               ← Groq client (llama-3.1-8b-instant)
    ├── rag/
    │   ├── clinical_protocols.ts   ← 15 protocol chunks
    │   └── retriever.ts            ← Keyword scorer
    ├── memory/
    │   └── context_builder.ts      ← buildSystemPrompt()
    └── prompts/
        ├── triage_prompt.ts
        └── meds_prompt.ts
```

---

## Implementation Order — Follow Exactly (36 Steps)

```
Step 01 — package.json + next.config.ts + tailwind.config.ts + tsconfig.json + .env.example
Step 02 — src/lib/db.ts
Step 03 — src/lib/schema.ts
Step 04 — src/lib/rag/clinical_protocols.ts
Step 05 — src/lib/rag/retriever.ts
Step 06 — src/lib/groq.ts
Step 07 — src/lib/prompts/triage_prompt.ts
Step 08 — src/lib/prompts/meds_prompt.ts
Step 09 — src/lib/memory/context_builder.ts
Step 10 — src/app/api/auth/login/route.ts
Step 11 — src/app/api/auth/signup/route.ts
Step 12 — src/app/api/auth/demo/route.ts
Step 13 — src/app/api/profile/route.ts
Step 14 — src/app/api/meds/route.ts
Step 15 — src/app/api/triage/route.ts
Step 16 — src/context/UserContext.tsx
Step 17 — src/components/ui/Button.tsx
Step 18 — src/components/ui/Card.tsx
Step 19 — src/components/ui/Input.tsx
Step 20 — src/components/ui/Badge.tsx
Step 21 — src/components/layout/Navbar.tsx
Step 22 — src/components/layout/MedicalDisclaimer.tsx
Step 23 — src/components/triage/ChatBubble.tsx
Step 24 — src/components/triage/TriageBadge.tsx
Step 25 — src/components/triage/EmergencyBanner.tsx
Step 26 — src/components/triage/SbarCard.tsx
Step 27 — src/components/meds/MedicineCard.tsx
Step 28 — src/app/layout.tsx
Step 29 — src/app/page.tsx
Step 30 — src/app/login/page.tsx
Step 31 — src/app/signup/page.tsx
Step 32 — src/app/dashboard/page.tsx
Step 33 — src/app/meds/page.tsx
Step 34 — src/app/triage/page.tsx
Step 35 — src/app/profile/page.tsx
Step 36 — README.md (final)
```

---

## SQLite Rules

- `better-sqlite3` is **synchronous** — no `await` needed in API routes.
- `db.ts` imports `schema.ts` and runs `initDB()` automatically on first import.
- JSON fields (`conditions`, `allergies`, `current_medications`, `messages`) stored as `JSON.stringify()` and parsed with `JSON.parse()` on read.
- DB file: `./tabibcare.db` (project root) — gitignored.

```ts
// db.ts pattern
import Database from 'better-sqlite3';
import { initDB } from './schema';
const db = new Database('./tabibcare.db');
initDB(db);
export default db;
```

---

## Auth Rules

- **Signup**: POST `/api/auth/signup` → INSERT users → INSERT health_profiles → return `{id, name, email}`
- **Login**: POST `/api/auth/login` → SELECT WHERE email=? AND password=? → return `{id, name, email}` or 401
- **Demo**: POST `/api/auth/demo` → return hardcoded object (id: 999, Ahmad Khan, Diabetes+Hypertension+Sulfa+Penicillin allergy) — do NOT write to DB
- **Session**: `localStorage.setItem('tabibcare_user', JSON.stringify({id, name, email}))`
- **Protected pages**: check localStorage on mount → null → `router.push('/login')`
- **Logout**: `localStorage.removeItem('tabibcare_user')` → redirect `/`

---

## Groq API Rules

- **Model**: `llama-3.1-8b-instant` — never change
- **Meds**: `response_format: { type: "json_object" }`, max_tokens: 1200, temperature: 0.5
- **Triage**: `stream: true`, max_tokens: 800, temperature: 0.3
- **Key**: `process.env.GROQ_API_KEY` — never hardcode

---

## RAG Rules

`retrieveContext(userMessage: string): string`
1. Lowercase the message
2. Count keyword matches per protocol chunk
3. Return top 1–2 chunks' `protocol` text as a single string
4. Return `""` if no keywords match (never hallucinate context)

---

## Context Assembly (`context_builder.ts`)

System prompt order:
1. Role definition + safety rules (always)
2. `[PATIENT PROFILE]` from SQLite health_profiles (if userId provided)
3. `[CLINICAL PROTOCOL CONTEXT]` from RAG (if matched)
4. `[SAFETY RULES]` enforcement (always, never removable)

---

## Emergency Escalation (Critical)

If `triage_level === 'emergency'`:
- Render `<EmergencyBanner>` at top of chat — full-width, `bg-red-50 border-red-500`
- Text: "🚨 This may be a medical emergency. Call 1122 immediately."
- `<a href="tel:1122">` button — large, `bg-red-500 text-white`
- Mental health crisis → Umang helpline: 0317-4288665
- Not dismissible

---

## Medical Disclaimer

- Footer of every page
- Modal on first visit to `/triage` and `/meds`
- Text: *"TabeebCare is an educational health literacy and triage navigation tool. It does not replace professional medical advice, diagnosis, or treatment."*

---

## Demo Presets

**`/meds`**: 3 quick-fill buttons:
1. "Diabetes" → `Metformin 500mg, Glibenclamide 5mg, Aspirin 75mg`
2. "Antibiotic" → `Augmentin 625mg, Panadol 500mg`
3. "Blood Pressure" → `Amlodipine 5mg, Losartan 50mg, Hydrochlorothiazide 25mg`

**`/triage`**: 3 starter chips:
1. `Mujhe 2 din se tez bukhar hai`
2. `I have chest pain and shortness of breath`
3. `Mere bacha ko ulti aur dast ho rahe hain`

---

## What NOT to Build

- No voice/audio input, no image upload, no vision model
- No email verification or password reset
- No WebSockets, no real-time
- No chart libraries
- No i18n library — simple `lang` state toggle
- No unit tests
- No deployment config — localhost:3000 only
