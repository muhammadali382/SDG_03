# Security Policy — TabeebCare (طبیب کیئر)

## Supported Branches

| Branch | Security Fixes Supported |
|---|---|
| `dev` | Yes (active development & hardening) |
| `main` | Yes (production releases) |

---

## Implemented Security Controls

- **Password Storage**: Salted `scrypt` password hashing (`src/lib/auth.ts`) with constant-time comparison (`crypto.timingSafeEqual`).
- **Session Management**: HMAC-SHA256 signed `HttpOnly`, `SameSite=Lax` session cookies (`tabeebcare_session`) verified server-side on protected API routes (`getSessionFromRequest`).
- **API Abuse Protection**: Sliding-window rate limiting (`src/lib/rate_limit.ts`) across authentication, AI inference, OCR, and voice transcription routes, plus upload size limits (`10 MB` cap) and MIME/extension checks.
- **HTTP Security Headers**: Configured in `next.config.mjs` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) alongside `Cache-Control: no-store` on sensitive API responses.
- **Secret Hygiene**: All API keys (`GROQ_API_KEY`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET`) are loaded strictly from environment variables and excluded via `.gitignore`.

---

## Reporting a Vulnerability

If you discover a security vulnerability, data exposure risk, or safety guardrail bypass:

1. **Do NOT open a public GitHub issue** with exploit details or exposed secrets.
2. Contact the repository maintainer directly via GitHub (`@muhammadali382`) or private advisory with:
   - Affected endpoint, component, or file path
   - Clear reproduction steps or proof-of-concept
   - Impact assessment and suggested remediation (if available)
3. We aim to acknowledge reports promptly and release a verified fix on `dev` before promoting to `main`.

---

## Clinical Safety Boundary

TabeebCare is an **educational health literacy and triage navigation tool** — it is **not** a certified medical device, does **not** claim HIPAA/regulatory certification, and does **not** replace licensed physicians or emergency medical services (`1122` / Umang `0317-4288665`).
