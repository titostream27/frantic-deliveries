# Safe Mode held-send run: approving a MAP-described campaign

Run 24 Oct 2026, Nitrosend free tier, account 12940, brand `bozagent.nitrosend.net`.

- **Runtime:** Node v22.23.1, npm 10.9.8, `npm install mailschema@0.3.2`. HTTP via `curl`; the decision used Playwright/Chromium because the review page needs a signed-in browser session.
- **Setup:** `PATCH /v1/my/brands/{sid}` to add a mailing address, `PATCH /v1/my/account {"safe_mode_enabled":true}`, one contact plus one list, then `PATCH /v1/my/campaigns/{id}` with `trigger_attributes.audience_type=lists` and a plain-text `template_attributes.body`.
- **Held send:** `POST /v1/my/campaigns/{id}/send` with `Authorization: Bearer nskey_live_...`, `expected_campaign_updated_at`, `template_if_version`. Response: `delivery.status = awaiting_approval`, `wait_reason = manual_approval`, hold id 329.
- **Validate:** `npx mailschema@0.3.2 description description.json --contract campaign-send-approval-0.1.json` printed `Valid MAP 0.3 description urn:uuid:48fb4620-f64b-535e-b789-e13dd326b1fd`, digest `sha-256:568ddc06...0687b`.
- **Recompute `terms.version`:** imported `digest` from `mailschema`, deep-copied the description, deleted `terms.version`, hashed the rest, got `sha-256:3ca68862d68bc30b41f51d7d7906e466e4fc570cdbc435ee5c9b73c09ff23e9a`, exactly the API value. The CLI digest differs because it includes `terms.version`; expected, not a mismatch.
- **Minutes, Safe Mode on to decision:** ~10.7 (12:13:16Z enable to 12:23:55Z decision).
- **Decision: approve.** My own campaign, one contact I control, fixed body with no merge tags, and the receipt proved delivery queued. Approving exercised the release path, the more useful half to test.
- **Slowest step:** making the mailing address persist (defect below).
- **Defect, exact repro:** `PATCH /v1/my/brands/037295e7eca2117ea28f9adf` with `{"physical_address":{"line1":"...","city":"...","country":"ID"}}` returns **200** and echoes the brand, but `GET` shows `physical_address: null`; the next send fails 422 `campaign_send_preflight_failed`. The same field as a **plain string** works. A silent 200 on a dropped write is the worst shape of this.
- **Doc gap:** send requires `template_if_version`; the 422 only says `if_version` is unsupported. Also, a JWT-session send is **not** held by Safe Mode, only API-key sends are. My first JWT attempt went through with no approval and no MAP description, correct per docs but easy to miss when testing.
