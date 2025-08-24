Awesome—locking in PRiority and your “Actions-first, repo-owned payments” constraint. Here’s the full PRD tailored to: no server, no first-party wallet, Stripe/Autumn/Polar/GitHub Sponsors, and GitHub Actions + repo secrets from day one.

PRiority — Full PRD (Actions-First)

0) One-liner & Promise

One-liner: Pay to prioritize. Estimate, fund, ship—directly in GitHub Issues.
Promise: Funding prioritizes, not guarantees delivery. Estimates learn from history (ccusage) and include Claude Code token budgets.

⸻

1) Scope (v1)
	•	Where it runs: GitHub Actions + (optional) GitHub App for nicer comments/labels. No external backend.
	•	Payments: We don’t process money. We generate provider checkout links (Stripe Payment Links / Polar / Autumn) using keys stored in repo/org secrets, or link out to GitHub Sponsors/OpenCollective.
	•	Verification: A lightweight Action verifies the payment after the payer posts a /confirm command with the provider payment reference (PaymentIntent ID, Polar/Autumn invoice ID, etc.).
	•	Work execution: After confirmation, a priority workflow can kick off an agent run (Claude Code) or assign to maintainers, then open a PR.
	•	Ledger: All state lives in GitHub: issue comments, labels, and a JSON ledger committed to .github/priority/ledger.json.

Non-Goals (v1):
	•	Escrow/arbitration, chargeback mediation, marketplace of human devs, payouts automation (we rely on the provider’s rails & your settings).

⸻

2) Personas
	•	Maintainer: Wants fewer nags, sustainable income, repo-owned rails, and no new dashboard to babysit.
	•	Requester (Issue author): Wants a quick estimate + pay link + predictable next steps.
	•	Backer (3rd party): Wants to fund someone else’s issue without write access.
	•	Agent Operator: Uses Claude Code; needs pre-funded token budget and transparent burn.

⸻

3) Objectives & Metrics
	•	O1 Reduce maintainer response time for funded issues by >50%.
	•	O2 Estimation MAPE <35% by week 8 per repo (learned from ccusage).
	•	O3 ≥ 40% of “estimated” issues get at least one backer.
	•	O4 Refund/partial-refund rate <10% (excl. auto-refunds for inactivity).

⸻

4) Core Concepts

4.1 Repo Config (.prio.yml)

payout:
  split: { maintainer: 0.70, agent_tokens: 0.20, platform_fee: 0.10 } # informational only in v1
  min_payout_usd: 20
  refund_window_days: 14
  auto_refund_if_no_activity_days: 10

estimates:
  model: cc            # ccusage-backed heuristic
  maintainer_rate_usd: 60
  token_rate_usd_per_million: 6.0
  risk_multiplier: 1.2            # pad for unknowns
  bands: { S: "1-3h", M: "4-8h", L: "9-16h", XL: "17-32h" }

policies:
  promise: "Payment prioritizes; not a delivery guarantee."
  auto_merge_if: { tests_pass: true, changed_lines_lt: 300, critical_files: false }
  allow_third_party_funding: true
  security_sensitive_labels: ["security","infra-critical"]

payments:
  provider_priority: ["stripe", "polar", "autumn", "sponsors"]
  stripe: { enabled: true, currency: "usd" }
  polar:  { enabled: false }
  autumn: { enabled: false }
  sponsors: { enabled: true }   # link-out fallback
  success_comment_template: "PAID – {tier} (${amount}) → tokens ${tokens}, maintainer ${maintainer}"

agent:
  enabled: true
  provider: "claude"          # “any agent” later
  max_tokens_millions: 2
  allow_push_branches: true

4.2 Secrets (repo/org)
	•	STRIPE_SECRET_KEY (restricted live key for Payment Links API)
	•	POLAR_API_KEY (optional)
	•	AUTUMN_API_KEY (optional)
	•	ANTHROPIC_API_KEY
	•	PRIORITY_MAINTAINER_RATE_USD (optional override)
	•	PRIORITY_TOKEN_RATE_USD_PER_MILLION (optional override)

4.3 Labels (convention)

priority/pending, priority/paid, priority/gold|silver|bronze, priority/delta-needed, priority/refund-offered.

⸻

5) Flows

5.1 Estimate → Fund → Confirm (No Server)
	1.	Issue opened/edited ⇒ Action posts Estimate Comment (hours band, token budget, suggested amount) and buttons/links:
	•	[Stripe] create Payment Link with metadata {repo, issue, payer_hint}; post link.
	•	[Polar/Autumn]: same idea (invoice/checkout link).
	•	[Sponsors/OpenCollective]: link to sponsor page with suggested note format (“Ref: repo#issue”).
	2.	Payer completes checkout.
	3.	Payer comments on the issue:
	•	/confirm stripe pi_3NX... amount=480
	•	/confirm polar inv_123 amount=480
	4.	Funding verification Action:
	•	Uses provider API + repo secrets to verify paid amount, currency, and metadata.
	•	If valid: add priority/paid + tier label (e.g., Gold for ≥$X), write ledger entry, and post a PAID comment.

Why a confirm command? It avoids webhooks/servers in v1. (Later: provider → GitHub repository_dispatch.)

5.2 Work Execution
	•	If agent.enabled: true: Action starts Claude Code job with the token budget (from estimate or funds split).
	•	Bot posts Work Log thread: steps, files targeted, tests status, token burn meter.
	•	On completion: open PR with summary + “auto-merge if” hints; otherwise ask maintainer review.

5.3 Delta / Top-up
	•	If burn ≥ 85% and tasks pending: bot posts a Delta Estimate and /topup shortcut.
	•	/topup stripe link → same confirm flow → update ledger, remove delta-needed.

5.4 Refunds & Inactivity
	•	If no “meaningful activity” in N days (config), Action posts a partial refund recommendation (minus tokens actually used + a small ops buffer), and a checklist for maintainers.
	•	Maintainer can post /refund amount=X provider=stripe ref=pi_... → bot records intent (manual refund via provider’s dashboard in v1), updates ledger and comments.

⸻

6) Estimation Model (v1)

6.1 Heuristics

Inputs: issue text, labels, code hotspots (recent churn), test coverage signals, file count hints, similarity to closed issues (cosine over titles/descriptions), and ccusage token stats on similar changes.

DMN-style slice

Type	Pattern/Signals	Hours band	Tokens (M)	Risk
bug	small diff; touched recently; tests exist	S (1–3h)	0.3–0.6	Low
feature	new file + API change; partial tests	M (4–8h)	1.0–1.8	Med
chore/doc	docs/config only	S (1–2h)	0.1–0.3	Low
security	critical paths; no tests	L–XL	1.5–3.0	High

Price = (hours_mid * maintainer_rate) + (tokens_mid * token_rate) * risk_multiplier + overhead(10–15%).
Learning loop: After close, log estimate vs. actual (hours proxy: queue time + PR iterations; tokens: ccusage) → update repo priors.

6.2 Comment Template (Estimate)

PRiority Estimate
Effort: M (4–8h) · Risk: Medium
Claude tokens budget: ~1.2M
Suggested funding: $480
Paying prioritizes, not guarantees.
Pay: [Stripe Link] · [Polar] · [Autumn] · [Sponsors]
After paying, comment:

/confirm stripe pi_XXXX amount=480



⸻

7) Workflows (YAML)

7.1 priority-estimate.yml

Triggers on issues: opened, edited, issue_comment: created (if /estimate).

name: PRiority · Estimate
on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]
jobs:
  estimate:
    if: github.event_name == 'issues' || (github.event_name == 'issue_comment' && contains(github.event.comment.body, '/estimate'))
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Load config
        run: |
          node .github/priority/scripts/estimate.mjs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          PRIORITY_MAINTAINER_RATE_USD: ${{ secrets.PRIORITY_MAINTAINER_RATE_USD }}
          PRIORITY_TOKEN_RATE_USD_PER_MILLION: ${{ secrets.PRIORITY_TOKEN_RATE_USD_PER_MILLION }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          POLAR_API_KEY: ${{ secrets.POLAR_API_KEY }}
          AUTUMN_API_KEY: ${{ secrets.AUTUMN_API_KEY }}

7.2 priority-funding.yml

Verifies /confirm & /topup.

name: PRiority · Funding
on:
  issue_comment:
    types: [created]
jobs:
  confirm:
    if: contains(github.event.comment.body, '/confirm') || contains(github.event.comment.body, '/topup')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Parse command & verify with provider
        run: node .github/priority/scripts/verify-payment.mjs
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          POLAR_API_KEY: ${{ secrets.POLAR_API_KEY }}
          AUTUMN_API_KEY: ${{ secrets.AUTUMN_API_KEY }}
      - name: Update labels + ledger
        run: node .github/priority/scripts/update-ledger.mjs
      - name: Comment PAID + next steps
        run: node .github/priority/scripts/comment-paid.mjs

7.3 priority-agent.yml

Runs Claude Code when funded.

name: PRiority · Agent Run
on:
  issues:
    types: [labeled]
jobs:
  run-agent:
    if: contains(github.event.label.name, 'priority/paid')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Run agent (Claude)
        run: node .github/priority/scripts/agent-run.mjs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - name: Open PR + work log
        run: node .github/priority/scripts/open-pr.mjs

7.4 priority-closeout.yml

Final accounting on merge/close; offer refunds on inactivity.

name: PRiority · Closeout & Refunds
on:
  pull_request:
    types: [closed]
  schedule:
    - cron: "0 9 * * *"  # daily inactivity check (UTC)
jobs:
  finalize:
    if: github.event_name == 'pull_request' && github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node .github/priority/scripts/finalize.mjs
  inactivity-refund:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node .github/priority/scripts/inactivity-check.mjs


⸻

8) Data Model (in-repo)

File: .github/priority/ledger.json

{
  "issues": {
    "123": {
      "estimates": [{"at":"2025-08-25","hours":"M","tokensM":1.2,"amount":480}],
      "fundings": [{"provider":"stripe","ref":"pi_XXX","amount":480,"currency":"usd","at":"..."}],
      "topups": [],
      "status": "paid",
      "labels": ["priority/paid","priority/gold"],
      "agent": {"runs":[{"tokensUsedM":0.9,"pr":"#456"}]}
    }
  }
}

Kept small; Actions commit changes on behalf of github-actions[bot].

⸻

9) Provider Integrations (v1)

Stripe Payment Links
	•	Create link via API with metadata: { repo, issue, provider: 'stripe' }.
	•	success_url → readme note instructing “Return to the issue and run /confirm stripe <payment_intent_id> amount=...”.
	•	Verification: retrieve PaymentIntent → status succeeded & amount ≥ suggested.

Polar / Autumn
	•	Create checkout/invoice via API with {repo, issue} metadata; post link.
	•	Verification: REST call to fetch invoice/payment status.

GitHub Sponsors / OpenCollective
	•	Link out with suggested note format; manual /confirm sponsors receipt=... amount=... path (cannot verify automatically in v1—flag as “unverified” unless maintainer approves with /approve-confirm).

⸻

10) Security & Compliance
	•	Secrets only in GitHub Secrets; never echo.
	•	Stripe key should be restricted (Payment Links only).
	•	Redact provider IDs in public comments (show short ref).
	•	“No guarantee” disclaimer everywhere.
	•	Security labels disable public funding flow automatically; require maintainer confirmation.

⸻

11) UX Copy (surface strings)

Estimate (comment)

PRiority Estimate — Effort M (4–8h), Risk Medium
Claude tokens: ~1.2M · Suggested: $480
Paying prioritizes, not guarantees.
Pay: [Stripe] · [Polar] · [Autumn] · [Sponsors]
After paying, comment:
/confirm stripe pi_XXXX amount=480

Paid

PAID – Gold ($480) · Split: Maintainer $336 / Tokens $96 / Fee $48 (informational)
Token wallet available: $96. Starting work…

Delta

We’re at 85% of budget. Extra work detected. Add $120?
/topup stripe link_YYYY amount=120

Closeout

PR merged ✅ Breakdown: Maintainer $X / Tokens $Y / Fees $Z. Est. error +12%. Thank you!

Inactivity

No work logs in 10 days. Recommending partial refund (minus used tokens). Maintainer can /refund amount=... provider=... ref=....

⸻

12) Roadmap

Phase 0 (Days 1–5)
	•	Comment-only MVP: estimate, static Stripe Link (manual create), /confirm parser, priority/paid label.

Phase 1 (Weeks 1–3)
	•	Auto-generate Stripe/Polar/Autumn links via Actions.
	•	Token-aware agent run + PR open.
	•	Ledger JSON + daily inactivity check.
	•	Basic delta/top-up flow.

Phase 2 (Weeks 4–8)
	•	ccusage learning loop (improve priors).
	•	Sponsors/OpenCollective partial verification via maintainer /approve-confirm.
	•	Optional GitHub App for richer UI & installation simplicity.

Phase 3
	•	Provider webhooks → repository_dispatch to auto-confirm without /confirm.
	•	Org budgets, SSO (Private mode), audit trails.
	•	Multi-agent (“any agent”) selection and routing.

⸻

13) Growth & GTM
	•	README Badge (drop-in):

[![Fund PRiority](https://img.shields.io/badge/Fund%20priority-PRiority-black)](https://github.com/{owner}/{repo}/issues/new?labels=priority%2Fpending)

	•	“Fund this issue” comment template + leaderboard (later via GitHub Pages pulling ledger JSON).
	•	Seed 10–20 infra/tooling repos; publish a “State of Paid Issues 2025”.

⸻

14) Risks & Mitigations
	•	Webhook-less confirmation UX → Use /confirm for v1; later add repository_dispatch.
	•	Unverifiable Sponsors → require maintainer /approve-confirm.
	•	Estimation misses → show bands + risk + learning loop; simple top-up command.
	•	KYC/payout complexity → offloaded to Stripe/Polar/Autumn (repo-owned).

⸻

15) Deliverables (repo scaffold)

.github/
  workflows/
    priority-estimate.yml
    priority-funding.yml
    priority-agent.yml
    priority-closeout.yml
  priority/
    scripts/
      estimate.mjs
      create-links.mjs
      verify-payment.mjs
      update-ledger.mjs
      comment-paid.mjs
      agent-run.mjs
      open-pr.mjs
      finalize.mjs
      inactivity-check.mjs
    templates/
      comment-estimate.md
      comment-paid.md
      comment-delta.md
    schema/
      prio.schema.json
.prio.yml

	•	estimate.mjs: parse .prio.yml, call ccusage + heuristics, post comment, optionally call create-links.mjs.
	•	create-links.mjs: create Stripe/Polar/Autumn links via API, return URLs.
	•	verify-payment.mjs: parse /confirm or /topup, verify via provider API.
	•	agent-run.mjs: orchestrate Claude Code; write logs; respect token caps.
	•	open-pr.mjs: open branch/PR; post summary.
	•	inactivity-check.mjs: scan funded issues; post refund prompts.

⸻

16) License & Modes
	•	Public OSS mode: MIT/Apache-2 core. No SaaS fee; you run it in your repo.
	•	Private mode (later): optional managed app with dashboards, budgets, SSO.

⸻

17) Final Policy Strings (ship verbatim)
	•	“Funding prioritizes work. Delivery is not guaranteed.”
	•	“Refunds: partial (minus used agent tokens and reasonable ops) within {refund_window_days} days or on inactivity.”
	•	“Security-sensitive issues may disable public funding; maintainers decide workflow.”
