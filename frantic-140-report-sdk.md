# Frantic #140 — first send with @nitrosend/sdk

One transactional email to proof@dogfood.nitrosend.net by a 27-line TypeScript file.

- **Versions.** `@nitrosend/sdk` **0.11.6**, TypeScript **7.0.2**, Node **v22.23.1**, npm **10.9.8**, Windows 11 git-bash. Install `npm install @nitrosend/sdk typescript @types/node` — 5 s, 5 packages, no native build.
- **The send.** `npx tsc --noEmit --strict` → exit 0, then `node --experimental-strip-types send.ts` → `id: 5128685 status: queued`. First run, no retries. Install to queued send **~6 min**, of which ~3 writing the script and ~2 reading the README to find the right call.
- **Runtime.** Node **v22.23.1** with `--experimental-strip-types`, so no build step. The SDK is ESM-only (`"type": "module"`), so the project needs that too — a default `npm init -y` CommonJS package cannot `require` it, and the install section does not say so.
- **Slowest step: finding the send call.** The resource table lists `ns.messages` with `send`, but the working shape `ns.messages.send({channel, to, subject, body}, idempotencyKey)` appears only in a Quick Start block ~85 lines down. The table carries no signature, so it alone is not enough to write a call.
- **Doc gap, exact repro.** The README shows `new Nitrosend('nskey_live_...')`. Under `--strict`, `new Nitrosend(process.env.NITROSEND_API_KEY)` fails, verified with `npx tsc --noEmit --strict --types node probe-strict.ts`: `error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string | ClientOptions'.` The env var must be narrowed first. The README's note that `process.env` needs `"types": ["node"]` sits in the **browser** section, not the server one, and does not cover this.
- **One change.** Put the `messages.send` signature in the resource table beside `ns.messages`, and move the strict-`process.env` note into the server install steps.

No API key, token, or password appears here or in `send.ts`.
