/**
 * Gmail Inbox Reader API — IMAP with App Password
 * 
 * Reads marketing.globalgreenhp@gmail.com inbox via IMAP
 * No OAuth2 needed — uses Google App Password
 * 
 * Env vars needed:
 *   GMAIL_MARKETING_EMAIL = marketing.globalgreenhp@gmail.com
 *   GMAIL_MARKETING_APP_PASSWORD = bzrprqjdstcjudlg (no spaces)
 */

import { ImapFlow } from 'imapflow';

async function getClient() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.GMAIL_MARKETING_EMAIL || 'marketing.globalgreenhp@gmail.com',
      pass: process.env.GMAIL_MARKETING_APP_PASSWORD || ''
    },
    logger: false
  });
  await client.connect();
  return client;
}

function parseAddress(addr) {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  if (Array.isArray(addr)) return addr.map(a => a.address || `${a.name || ''} <${a.address || ''}>`).join(', ');
  return addr.address || `${addr.name || ''} <${addr.address || ''}>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.GMAIL_MARKETING_APP_PASSWORD) {
    return res.status(503).json({
      error: 'Gmail not configured',
      setup: 'Add GMAIL_MARKETING_EMAIL and GMAIL_MARKETING_APP_PASSWORD to Vercel env vars'
    });
  }

  const { action, maxResults = '20', q } = req.query;
  let client;

  try {
    client = await getClient();

    switch (action) {
      // ---- INBOX MESSAGES ----
      case 'inbox': {
        await client.mailboxOpen('INBOX');
        const messages = [];
        
        // Get most recent messages
        const limit = Math.min(parseInt(maxResults) || 20, 50);
        let searchCriteria = { seen: false }; // unread by default
        if (q === 'all') searchCriteria = {};

        // Fetch recent messages by sequence number (newest first)
        const status = await client.status('INBOX', { messages: true, unseen: true });
        const total = status.messages || 0;
        const start = Math.max(1, total - limit + 1);
        
        for await (const msg of client.fetch(`${start}:*`, { 
          envelope: true, 
          bodyStructure: true,
          flags: true,
          uid: true 
        })) {
          messages.push({
            id: msg.uid,
            seq: msg.seq,
            from: parseAddress(msg.envelope?.from),
            to: parseAddress(msg.envelope?.to),
            subject: msg.envelope?.subject || '(no subject)',
            date: msg.envelope?.date?.toISOString() || '',
            isRead: msg.flags?.has('\\Seen') || false,
            isReply: !!(msg.envelope?.inReplyTo),
            messageId: msg.envelope?.messageId || '',
          });
        }

        // Reverse to show newest first
        messages.reverse();

        await client.logout();
        return res.json({ 
          messages, 
          total: status.messages,
          unread: status.unseen 
        });
      }

      // ---- BOUNCES ----
      case 'bounces': {
        await client.mailboxOpen('INBOX');
        const bounces = [];

        // Search for delivery failure messages
        const uids = await client.search({
          or: [
            { from: 'mailer-daemon@googlemail.com' },
            { from: 'mailer-daemon@google.com' },
            { from: 'postmaster' },
            { subject: 'Delivery Status Notification' },
            { subject: 'Mail delivery failed' },
            { subject: 'Undeliverable' },
            { subject: 'Returned mail' },
          ]
        });

        if (uids.length > 0) {
          const limit = Math.min(uids.length, parseInt(maxResults) || 20);
          const recentUids = uids.slice(-limit);
          
          for await (const msg of client.fetch(recentUids, {
            envelope: true,
            source: { maxBytes: 5000 } // Just enough to extract bounced email
          }, { uid: true })) {
            let bouncedEmail = '';
            if (msg.source) {
              const body = msg.source.toString();
              const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
              const found = body.match(emailRegex) || [];
              bouncedEmail = found.find(e => 
                !e.includes('mailer-daemon') && 
                !e.includes('postmaster') &&
                !e.includes('marketing.globalgreen')
              ) || '';
            }
            bounces.push({
              id: msg.uid,
              subject: msg.envelope?.subject || '',
              date: msg.envelope?.date?.toISOString() || '',
              from: parseAddress(msg.envelope?.from),
              bouncedEmail,
            });
          }
        }

        bounces.reverse();
        await client.logout();
        return res.json({ bounces, total: bounces.length });
      }

      // ---- REPLIES (messages that are responses to our campaigns) ----
      case 'replies': {
        await client.mailboxOpen('INBOX');
        const replies = [];

        // Get messages with In-Reply-To header (responses)
        const uids = await client.search({
          header: { 'In-Reply-To': '' }
        }).catch(() => []);

        // Also get recent inbox messages that are NOT from us
        const recentUids = await client.search({
          not: { from: 'marketing.globalgreenhp@gmail.com' },
          since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }).catch(() => []);

        const allUids = [...new Set([...uids, ...recentUids])];
        const limit = Math.min(allUids.length, parseInt(maxResults) || 20);
        const recentSlice = allUids.slice(-limit);

        if (recentSlice.length > 0) {
          for await (const msg of client.fetch(recentSlice, {
            envelope: true,
            flags: true
          }, { uid: true })) {
            // Exclude our own messages
            const fromAddr = parseAddress(msg.envelope?.from);
            if (fromAddr.includes('marketing.globalgreenhp')) continue;
            
            replies.push({
              id: msg.uid,
              from: fromAddr,
              subject: msg.envelope?.subject || '',
              date: msg.envelope?.date?.toISOString() || '',
              isReply: !!msg.envelope?.inReplyTo,
              isRead: msg.flags?.has('\\Seen') || false,
            });
          }
        }

        replies.reverse();
        await client.logout();
        return res.json({ replies, total: replies.length });
      }

      // ---- PROFILE / MAILBOX STATS ----
      case 'profile': {
        const inbox = await client.status('INBOX', { messages: true, unseen: true, recent: true });
        const sent = await client.status('[Gmail]/Sent Mail', { messages: true }).catch(() => ({ messages: 0 }));
        const spam = await client.status('[Gmail]/Spam', { messages: true }).catch(() => ({ messages: 0 }));
        
        await client.logout();
        return res.json({
          email: process.env.GMAIL_MARKETING_EMAIL || 'marketing.globalgreenhp@gmail.com',
          inbox: inbox.messages || 0,
          unread: inbox.unseen || 0,
          sent: sent.messages || 0,
          spam: spam.messages || 0,
        });
      }

      default:
        await client.logout();
        return res.status(400).json({
          error: 'Invalid action',
          validActions: ['inbox', 'bounces', 'replies', 'profile']
        });
    }
  } catch (err) {
    console.error('[Gmail IMAP]', err);
    if (client) await client.logout().catch(() => {});
    return res.status(500).json({ error: err.message || 'Gmail connection failed' });
  }
}
