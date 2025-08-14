### Slack slash commands — Werms backend

This folder contains the server endpoints that power Slack slash commands for transferring and checking Werms.

### Endpoints

- **POST `/api/slack/balance`**
  - Purpose: Responds to `/balance` to show the caller's current Werm balance.
  - Input: `application/x-www-form-urlencoded` body from Slack. Uses `user_name` to look up the employee by `slack_username` in Supabase.
  - Output: Ephemeral message with total and medal breakdown.
  - Source: `src/app/api/slack/balance/route.ts`

- **POST `/api/slack/transfer`**
  - Purpose: Responds to a transfer command (e.g., `/werm` or similar) to send Werms to another user.
  - Input: `application/x-www-form-urlencoded` body with:
    - `user_id`: Slack user ID of the command invoker (used to resolve sender email)
    - `text`: command arguments; see formats below
  - Output: On success, in-channel confirmation message; on error, ephemeral message.
  - Source: `src/app/api/slack/transfer/route.ts`

### Command text formats (transfer)

Both of the following are supported by `parseWermInput` in `src/lib/features.ts`:

- Minimal: `@username 5` → sends 5 bronze
- Explicit typed amounts: `@username 2 gold 3 silver 1 bronze Thanks for the help!`

Any trailing text is treated as an optional note and included in the confirmation message.

### Business logic

- Slack user resolution: `src/lib/services/slack-service.ts` calls Slack `users.info` with the `user_id` to obtain the sender's email.
- Transfer execution: `transferWerms` in `src/lib/features.ts`
  - Loads sender and receiver from Supabase (`employees`)
  - Validates balances, mutates in-memory, persists both rows with `upsert`
  - Logs per-coin transfers to `werm_transactions` with `source = 'slack'`
- Balance computation: `computeWormBalances` (imported by the balance endpoint) formats totals and medals.

### Environment variables

- `SLACK_BOT_USER_OAUTH_TOKEN` — Bot token used to call Slack Web API (`users.info`).
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase URL.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (required for server-side read/write).

### Slack app setup (high level)

- Create a Slack app and install it to your workspace.
- Add scope `users:read` (required for `users.info`).
- Create Slash Commands:
  - `/balance` → request URL: `<your-host>/api/slack/balance`
  - `/werm` (or your chosen command) → `<your-host>/api/slack/transfer`
- Ensure the app uses the Bot token for requests to Slack Web API.

### Security and validation

- Current state: Requests are not yet validated with the Slack Signing Secret. Add verification to reject non-Slack requests.
- Balance endpoint expects `application/x-www-form-urlencoded` and returns fast to meet Slack's 3s timeout.

### Testing locally (examples)

Balance (ephemeral):

```bash
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'user_name=jane' \
  http://localhost:3000/api/slack/balance
```

Transfer (in-channel on success):

```bash
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'user_id=U12345678&text=@john 2 gold 3 bronze Great work!' \
  http://localhost:3000/api/slack/transfer
```

### Related files

- `src/app/api/slack/balance/route.ts`
- `src/app/api/slack/transfer/route.ts`
- `src/lib/services/slack-service.ts`
- `src/lib/features.ts`
- Helper: `src/app/api/link-slack-user/route.ts` (resolves Slack `user_id` → profile; useful for linking accounts)

### Known limitations / TODOs

- Add Slack signing secret verification middleware.
- Improve error messages and i18n.
- Rate-limit transfers to prevent abuse.
- Add unit tests for `parseWermInput` and transfer edge cases.


