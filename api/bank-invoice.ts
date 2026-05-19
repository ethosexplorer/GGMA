import { createClient } from '@libsql/client/web';

// This is a Vercel Serverless Function to handle the Bank "Request for Pay" integration
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Retrieve API Keys from Vercel Environment Variables
  const tursoUrl = process.env.VITE_TURSO_DATABASE_URL || '';
  const tursoToken = process.env.VITE_TURSO_AUTH_TOKEN || '';
  // e.g., Your Bank's API Key
  const bankApiKey = process.env.BANK_API_KEY || '';

  try {
    const { orgId, amount, clientEmail, description } = req.body;

    if (!orgId || !amount || !clientEmail) {
      return res.status(400).json({ error: 'Missing required invoice details' });
    }

    // 1. Connect to Turso Cloud DB
    const db = createClient({ url: tursoUrl, authToken: tursoToken });

    // 2. Simulate or call actual Bank API for "Request for Pay" ACH/Invoice
    /*
    const bankResponse = await fetch('https://api.yourbank.com/v1/request-for-pay', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bankApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'USD',
        recipient_email: clientEmail,
        memo: description
      })
    });
    const bankData = await bankResponse.json();
    const invoiceId = bankData.invoice_id; // Get the ID from the bank
    */
   
    // Simulation for now
    const invoiceId = 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 3. Save the pending invoice in your Turso Cloud Database
    await db.execute({
      sql: `INSERT INTO invoices (id, org_id, amount, status, payment_method, bank_reference_id) 
            VALUES (?, ?, ?, 'pending', 'ACH/Bank Transfer', ?)`,
      args: [invoiceId, orgId, amount, invoiceId]
    });

    return res.status(200).json({ 
      success: true, 
      invoiceId: invoiceId, 
      message: 'Bank Request for Pay sent successfully.' 
    });

  } catch (error: any) {
    console.error('Invoice generation failed:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
