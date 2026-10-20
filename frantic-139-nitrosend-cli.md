# Frantic #139 — first send with @nitrosend/cli

One transactional email sent to proof@dogfood.nitrosend.net from a free-plan account.

- **Versions.** `@nitrosend/cli` **0.3.8**, Node **v22.23.1**, npm **10.9.8**, Windows 11 git-bash. Installed via `npm install -g @nitrosend/cli` — 12 s, no native build.
- **Account, no browser.** `POST /v1/signup` returned **201** with the token in the `Authorization` response header, as documented. `POST /v1/my/api_keys` gave `secret_key` once. `nitrosend login --api-key … --no-browser`, then `whoami` reported `auth: api_key`.
- **The send.** `nitrosend send --to proof@dogfood.nitrosend.net --subject "…" --body "…"` → `ok: true`, id **5125983**, `queued`, `dry_run: false`. Signup to queued send: **2 min 38 s** (17:40:24 → 17:43:02 UTC).
- **Slowest step — sender activation, and it failed twice.** `send` returned `Complete the Brand Kit company name, or choose a sender name, before activating a sender`. I set `company_name` via `nitro_set_brand_kit`; the tool reported success and the brand renamed, but `nitrosend status` still showed `brand_kit_setup.completed: false` and the **same error returned**. What worked: `nitro_manage_domains` with `{operation:"prepare_brand_subdomain", params:{subdomain:"bozagent"}}` → `From email: hello@bozagent.nitrosend.net`, `Ready: true`. Next `send` succeeded.
- **Defect.** The error names one remedy that does not work alone. `company_name` is insufficient because Brand Kit also needs `physical_address` (CAN-SPAM), which the error never mentions. The zero-Brand-Kit path (`prepare_brand_subdomain`, whose schema says *"Sender name; needs no Brand Kit"*) is also unmentioned. **Repro:** fresh account → `nitro_set_brand_kit {fields:{company_name:"X"}}` → `status` shows `brand_kit_setup.completed:false` → `send` repeats `Complete the Brand Kit company name…`.
- **One change.** Make that error state the fix: *"no sender active — run `prepare_brand_subdomain` (no Brand Kit needed) or add `physical_address` to the Brand Kit."* It would have saved both failed attempts.

No API key, token, or password appears here.
