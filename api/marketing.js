/**
 * CONSOLIDATED MARKETING API — Single serverless function
 * 
 * Routes:
 *   POST /api/marketing?route=send        — Send email/SMS campaign
 *   GET  /api/marketing?route=track       — Open/click tracking pixel
 *   GET  /api/marketing?route=gmail       — Gmail inbox reader (IMAP)
 */

import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ============================================================
// FIREBASE ADMIN (for tracking)
// ============================================================
let adminDb;
function getAdminDb() {
  if (adminDb) return adminDb;
  if (!getApps().length) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    initializeApp({ credential: cert(sa) });
  }
  adminDb = getFirestore();
  return adminDb;
}

// ============================================================
// SMTP
// ============================================================
const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY || 'db52652f3be5c4f6d222f51f0baec042c9c2de1dj5ZJQqhgFMxflAFaM9KXOLUAK';

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'marketing.globalgreenhp@gmail.com',
    pass: process.env.SMTP_PASS || process.env.GMAIL_MARKETING_APP_PASSWORD || '',
  },
});

// ============================================================
// TRACKING PIXEL
// ============================================================
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// ============================================================
// IMAP
// ============================================================
async function getImapClient() {
  const client = new ImapFlow({
    host: 'imap.gmail.com', port: 993, secure: true,
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

// ============================================================
// MAIN ROUTER
// ============================================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const route = req.query.route || '';

  // ---- ROUTE: SEND CAMPAIGN ----
  if (route === 'send') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    
    try {
      const { type, subject, message, recipients, attachments, cc, bcc, campaignId } = req.body;
      if (!message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Message and a non-empty recipients array are required.' });
      }

      const results = { total: recipients.length, successful: 0, failed: 0, errors: [] };

      if (type === 'email') {
        const transporter = createTransporter();
        const emailAttachments = (attachments || []).map(att => ({
          filename: att.filename, content: Buffer.from(att.content, 'base64'),
          contentType: att.contentType, cid: att.cid
        }));

        const TRACK_BASE = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.ggp-os.com';
        
        const emailPromises = recipients.map(async (recipient) => {
          if (!recipient.email) throw new Error('Missing email address');
          let htmlBody = `<div style="font-family: sans-serif; padding: 20px; color: #333;">${message.replace(/\n/g, '<br/>')}</div>`;
          
          if (campaignId) {
            const rid = encodeURIComponent(recipient.email);
            htmlBody = htmlBody.replace(/href="(https?:\/\/[^"]+)"/gi, (match, url) => {
              return `href="${TRACK_BASE}/api/marketing?route=track&type=click&cid=${campaignId}&rid=${rid}&url=${encodeURIComponent(url)}"`;
            });
            htmlBody += `<img src="${TRACK_BASE}/api/marketing?route=track&type=open&cid=${campaignId}&rid=${rid}&t=${Date.now()}" width="1" height="1" style="display:none;border:0;" alt="" />`;
          }
          
          return transporter.sendMail({
            from: `"Global Green Enterprise - Marketing" <marketing.globalgreenhp@gmail.com>`,
            to: recipient.email,
            cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
            bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
            subject: subject || 'Important Update',
            text: message.replace(/<[^>]*>/g, ''),
            html: htmlBody, attachments: emailAttachments
          });
        });

        const outcomes = await Promise.allSettled(emailPromises);
        outcomes.forEach((o, i) => {
          if (o.status === 'fulfilled') results.successful++;
          else { results.failed++; results.errors.push({ recipient: recipients[i], error: o.reason.message }); }
        });

      } else if (type === 'sms') {
        const smsPromises = recipients.map(async (recipient) => {
          if (!recipient.phone) throw new Error('Missing phone number');
          const cleanNumber = recipient.phone.replace(/[\s\-\(\)\+]/g, '');
          const response = await fetch('https://textbelt.com/text', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: cleanNumber, message, key: TEXTBELT_API_KEY })
          });
          const data = await response.json();
          if (!data.success) throw new Error(data.error || 'TextBelt API Error');
          return data;
        });
        const outcomes = await Promise.allSettled(smsPromises);
        outcomes.forEach((o, i) => {
          if (o.status === 'fulfilled') results.successful++;
          else { results.failed++; results.errors.push({ recipient: recipients[i], error: o.reason.message }); }
        });
      } else {
        return res.status(400).json({ error: 'Invalid campaign type. Must be "email" or "sms".' });
      }

      return res.json({ success: true, message: `Campaign completed. Sent: ${results.successful}, Failed: ${results.failed}`, results });
    } catch (error) {
      console.error('Marketing Send Error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  // ---- ROUTE: TRACKING PIXEL ----
  if (route === 'track') {
    const { type, cid, rid, url } = req.query;

    if (!cid || !rid) {
      if (type === 'open') { res.setHeader('Content-Type', 'image/gif'); res.setHeader('Cache-Control', 'no-store'); return res.end(PIXEL); }
      return res.redirect(url || 'https://www.ggp-os.com');
    }

    const timestamp = new Date().toISOString();
    try {
      const db = getAdminDb();
      await db.collection('marketing_tracking').add({
        campaignId: cid, recipientEmail: decodeURIComponent(rid),
        type: type || 'open', timestamp,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.headers['x-forwarded-for'] || 'unknown'
      });

      const campaignRef = db.collection('marketing_campaigns').doc(cid);
      const campaignDoc = await campaignRef.get();
      if (campaignDoc.exists) {
        const decodedRid = decodeURIComponent(rid);
        if (type === 'open') {
          const data = campaignDoc.data();
          if (!(data.openedEmails || []).includes(decodedRid)) {
            await campaignRef.update({ openedEmails: FieldValue.arrayUnion(decodedRid), totalOpens: FieldValue.increment(1), lastOpenAt: timestamp });
          } else {
            await campaignRef.update({ totalOpens: FieldValue.increment(1), lastOpenAt: timestamp });
          }
        } else if (type === 'click') {
          await campaignRef.update({ clickedEmails: FieldValue.arrayUnion(decodedRid), totalClicks: FieldValue.increment(1), lastClickAt: timestamp });
        }
      }
    } catch (err) { console.error('[Track]', err); }

    if (type === 'click' && url) return res.redirect(decodeURIComponent(url));
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.end(PIXEL);
  }

  // ---- ROUTE: GMAIL INBOX ----
  if (route === 'gmail') {
    if (!process.env.GMAIL_MARKETING_APP_PASSWORD) {
      return res.status(503).json({ error: 'Gmail not configured', setup: 'Add GMAIL_MARKETING_APP_PASSWORD env var' });
    }
    const { action, maxResults = '20', q } = req.query;
    let client;
    try {
      client = await getImapClient();

      if (action === 'inbox') {
        await client.mailboxOpen('INBOX');
        const messages = [];
        const limit = Math.min(parseInt(maxResults) || 20, 50);
        const status = await client.status('INBOX', { messages: true, unseen: true });
        const total = status.messages || 0;
        const start = Math.max(1, total - limit + 1);
        for await (const msg of client.fetch(`${start}:*`, { envelope: true, bodyStructure: true, flags: true, uid: true })) {
          messages.push({
            id: msg.uid, seq: msg.seq, from: parseAddress(msg.envelope?.from),
            to: parseAddress(msg.envelope?.to), subject: msg.envelope?.subject || '(no subject)',
            date: msg.envelope?.date?.toISOString() || '', isRead: msg.flags?.has('\\Seen') || false,
            isReply: !!(msg.envelope?.inReplyTo), messageId: msg.envelope?.messageId || '',
          });
        }
        messages.reverse();
        await client.logout();
        return res.json({ messages, total: status.messages, unread: status.unseen });
      }

      if (action === 'bounces') {
        await client.mailboxOpen('INBOX');
        const bounces = [];
        const uids = await client.search({
          or: [{ from: 'mailer-daemon@googlemail.com' }, { from: 'mailer-daemon@google.com' },
               { from: 'postmaster' }, { subject: 'Delivery Status Notification' },
               { subject: 'Mail delivery failed' }, { subject: 'Undeliverable' }]
        }).catch(() => []);
        if (uids.length > 0) {
          const recentUids = uids.slice(-(parseInt(maxResults) || 20));
          for await (const msg of client.fetch(recentUids, { envelope: true, source: { maxBytes: 5000 } }, { uid: true })) {
            let bouncedEmail = '';
            if (msg.source) {
              const found = msg.source.toString().match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [];
              bouncedEmail = found.find(e => !e.includes('mailer-daemon') && !e.includes('postmaster') && !e.includes('marketing.globalgreen')) || '';
            }
            bounces.push({ id: msg.uid, subject: msg.envelope?.subject || '', date: msg.envelope?.date?.toISOString() || '', from: parseAddress(msg.envelope?.from), bouncedEmail });
          }
        }
        bounces.reverse(); await client.logout();
        return res.json({ bounces, total: bounces.length });
      }

      if (action === 'replies') {
        await client.mailboxOpen('INBOX');
        const replies = [];
        const uids = await client.search({ header: { 'In-Reply-To': '' } }).catch(() => []);
        const recentUids = await client.search({ not: { from: 'marketing.globalgreenhp@gmail.com' }, since: new Date(Date.now() - 7*24*60*60*1000) }).catch(() => []);
        const allUids = [...new Set([...uids, ...recentUids])];
        const recentSlice = allUids.slice(-(parseInt(maxResults) || 20));
        if (recentSlice.length > 0) {
          for await (const msg of client.fetch(recentSlice, { envelope: true, flags: true }, { uid: true })) {
            const fromAddr = parseAddress(msg.envelope?.from);
            if (fromAddr.includes('marketing.globalgreenhp')) continue;
            replies.push({ id: msg.uid, from: fromAddr, subject: msg.envelope?.subject || '', date: msg.envelope?.date?.toISOString() || '', isReply: !!msg.envelope?.inReplyTo, isRead: msg.flags?.has('\\Seen') || false });
          }
        }
        replies.reverse(); await client.logout();
        return res.json({ replies, total: replies.length });
      }

      if (action === 'profile') {
        const inbox = await client.status('INBOX', { messages: true, unseen: true, recent: true });
        const sent = await client.status('[Gmail]/Sent Mail', { messages: true }).catch(() => ({ messages: 0 }));
        const spam = await client.status('[Gmail]/Spam', { messages: true }).catch(() => ({ messages: 0 }));
        await client.logout();
        return res.json({ email: process.env.GMAIL_MARKETING_EMAIL || 'marketing.globalgreenhp@gmail.com', inbox: inbox.messages || 0, unread: inbox.unseen || 0, sent: sent.messages || 0, spam: spam.messages || 0 });
      }

      await client.logout();
      return res.status(400).json({ error: 'Invalid action', validActions: ['inbox', 'bounces', 'replies', 'profile'] });
    } catch (err) {
      console.error('[Gmail IMAP]', err);
      if (client) await client.logout().catch(() => {});
      return res.status(500).json({ error: err.message || 'Gmail connection failed' });
    }
  }

  return res.status(400).json({ error: 'Invalid route', validRoutes: ['send', 'track', 'gmail'] });
}
