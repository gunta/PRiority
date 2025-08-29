#!/usr/bin/env tsx

import Stripe from 'stripe';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const CAMPAIGN_PRICE_ID = process.env.STRIPE_CAMPAIGN_PRICE_ID || '';
const CAMPAIGN_PRODUCT_ID = process.env.STRIPE_CAMPAIGN_PRODUCT_ID || '';
const CAMPAIGN_GOAL = parseInt(process.env.CAMPAIGN_GOAL || '10000'); // Default $10,000 goal
const CAMPAIGN_END_DATE = process.env.CAMPAIGN_END_DATE ? new Date(process.env.CAMPAIGN_END_DATE) : null;

// Stats file path
const STATS_FILE = path.join(__dirname, '../src/data/campaign-stats.json');

// Mock data for when Stripe is not configured
const MOCK_DATA = {
  campaign: {
    goal: CAMPAIGN_GOAL,
    raised: 1247,
    supporters: 23,
    daysLeft: CAMPAIGN_END_DATE ? Math.ceil((CAMPAIGN_END_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
    lastContribution: {
      amount: 100,
      timeAgo: "2 hours ago"
    },
    recentSupporters: [
      {
        amount: 500,
        timeAgo: "1 hour ago",
        location: "United States"
      },
      {
        amount: 100,
        timeAgo: "2 hours ago",
        location: "Germany"
      },
      {
        amount: 2500,
        timeAgo: "5 hours ago",
        location: "Japan"
      }
    ],
    limitedRewards: {
      earlyBird: {
        total: 100,
        remaining: 17,
        discount: "50% off first year"
      },
      foundingMember: {
        total: 50,
        remaining: 8,
        perk: "Lifetime Pro access"
      },
      advisoryBoard: {
        total: 10,
        remaining: 3,
        perk: "Direct input on features"
      }
    },
    milestones: {
      current: 1247,
      next: 2500,
      nextUnlock: "AI Agent Development",
      ultimateGoal: CAMPAIGN_GOAL,
      ultimateUnlock: "Full MVP Launch"
    },
    momentum: {
      last24Hours: 347,
      last7Days: 892,
      trending: "up",
      percentIncrease: 38
    }
  },
  liveStats: {
    issuesUnfixed: 2341567,
    hoursWastedToday: 8847,
    moneyLostToday: 442350,
    maintainersBurnedOut: 147,
    criticalBugsWaiting: 47892
  }
};

async function fetchStripeData() {
  if (!STRIPE_SECRET_KEY) {
    console.log('⚠️  No Stripe API key found. Using mock data.');
    console.log('   Set STRIPE_SECRET_KEY environment variable to fetch real data.');
    return MOCK_DATA;
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia'
    });

    console.log('🔄 Fetching data from Stripe...');

    // Fetch all payments/charges
    // You might want to use Payment Intents or Checkout Sessions depending on your setup
    const charges = await stripe.charges.list({
      limit: 100,
      expand: ['data.customer', 'data.payment_intent', 'data.billing_details']
    });

    // If using Payment Links or Checkout, you might want to fetch sessions instead:
    // const sessions = await stripe.checkout.sessions.list({
    //   limit: 100,
    //   expand: ['data.line_items', 'data.customer']
    // });
    
    let totalRaised = 0;
    let supporters = new Set();
    const recentContributions = [];
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let raised24Hours = 0;
    let raised7Days = 0;
    
    for (const charge of charges.data) {
      if (charge.status === 'succeeded') {
        const amount = charge.amount / 100; // Convert from cents
        totalRaised += amount;
        
        // Track unique supporters
        const customerKey = charge.customer || charge.billing_details?.email || charge.id;
        supporters.add(customerKey);
        
        // Track momentum
        const chargeTime = charge.created * 1000;
        if (chargeTime > last24Hours) raised24Hours += amount;
        if (chargeTime > last7Days) raised7Days += amount;
        
        // Add to recent contributions (first 3)
        if (recentContributions.length < 3) {
          const timeAgo = getTimeAgo(new Date(chargeTime));
          
          // Extract location from billing details
          const location = charge.billing_details?.address?.country || 
                          charge.billing_details?.address?.city ||
                          'Unknown';
          
          recentContributions.push({
            amount,
            timeAgo,
            location: getCountryName(location)
          });
        }
      }
    }

    // Calculate stats
    const daysLeft = CAMPAIGN_END_DATE ? 
      Math.ceil((CAMPAIGN_END_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
      null;
    
    // Calculate trend
    const previousWeekRaised = raised7Days - raised24Hours;
    const percentIncrease = previousWeekRaised > 0 ? 
      Math.round(((raised24Hours - previousWeekRaised) / previousWeekRaised) * 100) : 
      0;
    
    // Get last contribution details
    const lastCharge = charges.data[0];
    const lastContribution = lastCharge ? {
      amount: lastCharge.amount / 100,
      timeAgo: getTimeAgo(new Date(lastCharge.created * 1000))
    } : MOCK_DATA.campaign.lastContribution;
    
    // Merge with mock data structure
    const stats = {
      ...MOCK_DATA,
      campaign: {
        ...MOCK_DATA.campaign,
        raised: totalRaised || MOCK_DATA.campaign.raised,
        supporters: supporters.size || MOCK_DATA.campaign.supporters,
        daysLeft,
        lastContribution,
        recentSupporters: recentContributions.length > 0 ? recentContributions : MOCK_DATA.campaign.recentSupporters,
        milestones: {
          ...MOCK_DATA.campaign.milestones,
          current: totalRaised || MOCK_DATA.campaign.raised
        },
        momentum: {
          last24Hours: raised24Hours || MOCK_DATA.campaign.momentum.last24Hours,
          last7Days: raised7Days || MOCK_DATA.campaign.momentum.last7Days,
          trending: percentIncrease > 0 ? 'up' : percentIncrease < 0 ? 'down' : 'stable',
          percentIncrease: Math.abs(percentIncrease) || MOCK_DATA.campaign.momentum.percentIncrease
        }
      }
    };

    console.log('✅ Successfully fetched Stripe data');
    console.log(`   Total raised: $${totalRaised}`);
    console.log(`   Supporters: ${supporters.size}`);
    
    return stats;

  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error);
    console.log('   Using mock data as fallback.');
    return MOCK_DATA;
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}

function getCountryName(code: string): string {
  // Map common country codes to names
  const countryMap: { [key: string]: string } = {
    'US': 'United States',
    'USA': 'United States',
    'UK': 'United Kingdom',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'CA': 'Canada',
    'AU': 'Australia',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'IT': 'Italy',
    'ES': 'Spain',
    'BR': 'Brazil',
    'IN': 'India',
    'KR': 'South Korea',
    'SG': 'Singapore',
    'HK': 'Hong Kong'
  };
  
  // If it's a known code, return the country name
  const upperCode = code.toUpperCase();
  if (countryMap[upperCode]) {
    return countryMap[upperCode];
  }
  
  // If it looks like a city name (has spaces or is longer than 3 chars), return as-is
  if (code.includes(' ') || code.length > 3) {
    return code;
  }
  
  // Default to the code itself
  return upperCode;
}

async function updateStatsFile(stats: any) {
  try {
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
    console.log(`📝 Updated stats file: ${STATS_FILE}`);
  } catch (error) {
    console.error('❌ Error writing stats file:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Campaign Stats Updater');
  console.log('========================\n');

  // Check for environment variables
  if (!STRIPE_SECRET_KEY) {
    console.log('📌 To use real Stripe data, set these environment variables:');
    console.log('   STRIPE_SECRET_KEY=sk_test_...');
    console.log('   STRIPE_CAMPAIGN_PRICE_ID=price_...');
    console.log('   STRIPE_CAMPAIGN_PRODUCT_ID=prod_...\n');
  }

  // Fetch data
  const stats = await fetchStripeData();

  // Update file
  await updateStatsFile(stats);

  console.log('\n✨ Done! Campaign stats have been updated.');
  
  // Display summary
  console.log('\n📊 Campaign Summary:');
  console.log(`   Goal: $${stats.campaign.goal}`);
  console.log(`   Raised: $${stats.campaign.raised} (${Math.round((stats.campaign.raised / stats.campaign.goal) * 100)}%)`);
  console.log(`   Supporters: ${stats.campaign.supporters}`);
  if (stats.campaign.daysLeft !== null) {
    console.log(`   Days left: ${stats.campaign.daysLeft}`);
  } else {
    console.log(`   Duration: Ongoing (no end date set)`);
  }
}

// Run the script
main().catch(console.error);