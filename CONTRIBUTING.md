# Contributing to TabeebCare (طبیب کیئر)

Thank you for your interest in contributing to **TabeebCare**! This guide outlines our branching model, development setup, clinical safety standards, and pull request workflow.

---

## Branching Model

- **`main`** — Protected stable release branch. Never push directly to `main`.
- **`dev`** — Primary integration and active development branch. Base all feature and bug-fix branches off `dev`.

---

## Local Development Setup

1. **Fork & Clone**
   ```bash
   git clone https://github.com/<your-username>/SDG_03.git
   cd SDG_03
   git checkout dev
   ```
2. **Install Dependencies** (Node.js 22+ recommended)
   ```bash
   npm install
   ```
3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `GROQ_API_KEY` (required). Leaving `TURSO_DATABASE_URL` unset automatically uses a local SQLite file (`./tabibcare.db`).
4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## Quality & Safety Checklist (Required Before Opening a PR)

Run all local verification commands and confirm they pass with zero errors:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

### Mandatory Clinical & Design Standards
- **Light Theme Only**: Use `teal-600`, `slate-50`, `white`, `slate-200`, and semantic urgency colors (`red-500`, `amber-500`, `sky-500`, `emerald-500`). Do not introduce dark mode themes or dark backgrounds.
- **No Unverified Medical Claims**: Never phrase AI outputs as definitive clinical diagnoses; keep recommendations clearly educational and triage-oriented.
- **Preserve Emergency Escalations**: Do not disable or hide Rescue `1122`, Umang Helpline (`0317-4288665`), or pre-inference self-harm guardrails (`src/lib/guardrails.ts`).
- **Protect Sensitive Data**: Never commit `.env`, `.env.local`, `tabibcare.db`, or real patient records.
- **Bilingual Support**: Keep static UI strings updated in both English and Urdu (`src/lib/i18n/translations.ts`).

---

## Submitting a Pull Request

1. Create a descriptive branch from `dev`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Use clear, present-tense commit messages (e.g., `Add unit tests for crisis guardrails`).
3. Push to your fork and open a Pull Request targeting **`dev`**, filling out the PR checklist completely.
