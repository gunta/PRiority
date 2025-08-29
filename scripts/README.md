# Campaign Stats Updater

A TypeScript CLI tool to fetch crowd-validation campaign data from Stripe and update the local JSON file used by the PRiority website.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your Stripe API credentials:

```env
# Your Stripe Secret Key (test or live)
STRIPE_SECRET_KEY=sk_test_...

# Optional: Specific product/price IDs if using Stripe Products
STRIPE_CAMPAIGN_PRICE_ID=price_...
STRIPE_CAMPAIGN_PRODUCT_ID=prod_...
```

### 3. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (use test mode for development)
4. Add it to your `.env` file

### 4. Stripe Payment Button Setup

Since this system uses Stripe Payment Buttons (no custom forms), the tool extracts data from:
- Standard Stripe charges
- Payment billing details for location
- Customer emails or IDs for tracking unique supporters

No custom metadata or messages are collected - just payment amounts and locations.

## Usage

### Update Campaign Stats

Run the updater script:

```bash
npm run update-stats
```

This will:
1. Connect to Stripe API (if configured)
2. Fetch recent payments and calculate totals
3. Update `src/data/campaign-stats.json`
4. Display a summary of the campaign status

### Manual Updates (No Stripe)

If you don't have Stripe configured, the tool will use mock data. You can manually edit the stats in `src/data/campaign-stats.json`:

```json
{
  "campaign": {
    "goal": 10000,        // Campaign goal in dollars
    "raised": 1247,       // Amount raised so far
    "supporters": 23,     // Number of backers
    "daysLeft": 47,       // Days until campaign ends
    ...
  }
}
```

## Campaign Stats Structure

The JSON file contains two main sections:

### Campaign Data
- **goal**: Total funding goal in dollars
- **raised**: Current amount raised from Stripe payments
- **supporters**: Number of unique contributors
- **daysLeft**: Remaining campaign days (null for ongoing campaigns)
- **lastContribution**: Most recent payment details
- **recentSupporters**: Latest 3 contributions with:
  - `amount`: Payment amount in dollars
  - `timeAgo`: Human-readable time since payment
  - `location`: Extracted from Stripe billing details (country/city)
- **limitedRewards**: Special tier availability
- **milestones**: Funding milestones and unlocks
- **momentum**: Recent activity metrics:
  - `last24Hours`: Amount raised in last 24 hours
  - `last7Days`: Amount raised in last 7 days
  - `trending`: Direction (up/down/stable)
  - `percentIncrease`: Change percentage

### Live Stats
- **issuesUnfixed**: Count of open GitHub issues
- **hoursWastedToday**: Estimated developer hours lost
- **moneyLostToday**: Estimated financial impact
- **maintainersBurnedOut**: Affected maintainers
- **criticalBugsWaiting**: High-priority issues

## Automation

You can automate updates using cron jobs:

### macOS/Linux

Add to crontab (`crontab -e`):

```bash
# Update every hour
0 * * * * cd /path/to/PRiority && npm run update-stats
```

### GitHub Actions

Create `.github/workflows/update-stats.yml`:

```yaml
name: Update Campaign Stats

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run update-stats
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
      - uses: actions/upload-artifact@v3
        with:
          name: campaign-stats
          path: src/data/campaign-stats.json
```

## Security Notes

⚠️ **Never commit your `.env` file or expose your Stripe Secret Key!**

- Add `.env` to `.gitignore`
- Use GitHub Secrets for CI/CD
- Use test keys for development
- Rotate keys regularly

## Troubleshooting

### "No Stripe API key found"
- Ensure `.env` file exists and contains `STRIPE_SECRET_KEY`
- Check that the key starts with `sk_test_` or `sk_live_`

### "Error fetching Stripe data"
- Verify your API key is valid
- Check your Stripe account status
- Ensure you have proper permissions

### Mock Data Being Used
- This is normal if no Stripe key is configured
- The tool will still update the JSON file with mock data
- You can manually edit the values as needed

## Development

To modify the updater script:

1. Edit `scripts/update-campaign-stats.ts`
2. Test with: `npm run update-stats`
3. Check output in `src/data/campaign-stats.json`

The script is designed to:
- Fail gracefully with mock data
- Provide clear error messages
- Be easily extendable for different payment providers