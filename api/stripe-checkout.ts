import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items, billing, trialDays } = req.body;

    // Format items for Stripe Checkout
    const lineItems = items.map((item: any) => {
      // In a pure live production setup without pre-defined prices, 
      // we use price_data to create prices on the fly.
      
      let unitAmount = 0;
      if (typeof item.price === 'number') {
        unitAmount = Math.round(item.price * 100);
      } else if (typeof item.price === 'string' && !isNaN(Number(item.price.replace(/[^0-9.-]+/g, "")))) {
        unitAmount = Math.round(Number(item.price.replace(/[^0-9.-]+/g, "")) * 100);
      } else {
        // If price is 'Free', Custom, etc.
        unitAmount = 0;
      }

      if (billing === 'annual' && item.type === 'addon' && !item.per) {
        // Addons are generally priced monthly; multiply by 12 if annual
        unitAmount = unitAmount * 12;
      }

      const isRecurring = unitAmount > 0;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.type === 'plan' ? \`\${billing} Subscription\` : 'Add-on module',
          },
          unit_amount: unitAmount,
          ...(isRecurring ? {
            recurring: {
              interval: billing === 'annual' ? 'year' : 'month',
            }
          } : {})
        },
        quantity: 1,
      };
    }).filter((li: any) => li.price_data.unit_amount > 0);

    if (lineItems.length === 0) {
      return res.status(400).json({ error: 'Checkout total is $0. No payment required.' });
    }

    const sessionConfig: any = {
      payment_method_types: ['card', 'us_bank_account'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: \`\${req.headers.origin || process.env.APP_URL || 'http://localhost:5173'}?checkout=success\`,
      cancel_url: \`\${req.headers.origin || process.env.APP_URL || 'http://localhost:5173'}?checkout=cancel\`,
    };

    if (trialDays && trialDays > 0) {
      sessionConfig.subscription_data = {
        trial_period_days: trialDays,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}
