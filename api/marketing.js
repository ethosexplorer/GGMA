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

function decodePart(body, headers) {
  const encodingMatch = headers.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i);
  const encoding = encodingMatch ? encodingMatch[1].trim().toLowerCase() : '';
  
  if (encoding === 'base64') {
    const cleanB64 = body.replace(/\s+/g, '');
    try {
      return Buffer.from(cleanB64, 'base64').toString('utf-8');
    } catch {
      return body;
    }
  } else if (encoding === 'quoted-printable') {
    return body
      .replace(/=\r?\n/g, '')
      .replace(/=([0-9A-F]{2})/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  return body;
}

function parseEmailSource(sourceBuffer) {
  const source = sourceBuffer.toString('utf-8');
  const separator = '\r\n\r\n';
  const firstSeparatorIdx = source.indexOf(separator);
  if (firstSeparatorIdx === -1) return source;
  
  const headersStr = source.substring(0, firstSeparatorIdx);
  const body = source.substring(firstSeparatorIdx + separator.length);
  
  const contentTypeMatch = headersStr.match(/Content-Type:\s*([^\r\n]+)/i);
  const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : '';
  
  if (contentType.toLowerCase().includes('multipart/')) {
    const boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/i);
    if (boundaryMatch) {
      const boundary = boundaryMatch[1];
      const parts = body.split('--' + boundary);
      for (const part of parts) {
        const partSepIdx = part.indexOf(separator);
        if (partSepIdx === -1) continue;
        const partHeaders = part.substring(0, partSepIdx);
        const partBody = part.substring(partSepIdx + separator.length).replace(/--\s*$/, '').trim();
        
        if (partHeaders.toLowerCase().includes('text/html')) {
          return decodePart(partBody, partHeaders);
        }
      }
      for (const part of parts) {
        const partSepIdx = part.indexOf(separator);
        if (partSepIdx === -1) continue;
        const partHeaders = part.substring(0, partSepIdx);
        const partBody = part.substring(partSepIdx + separator.length).replace(/--\s*$/, '').trim();
        
        if (partHeaders.toLowerCase().includes('text/plain')) {
          return decodePart(partBody, partHeaders);
        }
      }
    }
  }
  
  return decodePart(body, headersStr);
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

        // Auto-suppress bounced emails in Firestore
        const suppressedEmails = bounces.map(b => b.bouncedEmail).filter(Boolean);
        if (suppressedEmails.length > 0) {
          try {
            const db = getAdminDb();
            const batch = db.batch();
            for (const email of suppressedEmails) {
              const docRef = db.collection('suppressed_emails').doc(email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_'));
              batch.set(docRef, {
                email: email.toLowerCase(),
                reason: 'bounce',
                detectedAt: new Date().toISOString(),
                source: 'auto_bounce_detection'
              }, { merge: true });
            }
            await batch.commit();
            console.log(`[Bounce Suppression] Auto-suppressed ${suppressedEmails.length} emails:`, suppressedEmails);
          } catch (suppErr) {
            console.error('[Bounce Suppression] Failed to write suppression list:', suppErr);
          }
        }

        bounces.reverse(); await client.logout();
        return res.json({ bounces, total: bounces.length, suppressed: suppressedEmails.length });
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

      if (action === 'sent') {
        await client.mailboxOpen('[Gmail]/Sent Mail');
        const sentList = [];
        const limit = Math.min(parseInt(maxResults) || 20, 50);
        const status = await client.status('[Gmail]/Sent Mail', { messages: true });
        const total = status.messages || 0;
        const start = Math.max(1, total - limit + 1);
        for await (const msg of client.fetch(`${start}:*`, { envelope: true, bodyStructure: true, flags: true, uid: true })) {
          sentList.push({
            id: msg.uid, seq: msg.seq, from: parseAddress(msg.envelope?.from),
            to: parseAddress(msg.envelope?.to), subject: msg.envelope?.subject || '(no subject)',
            date: msg.envelope?.date?.toISOString() || '',
          });
        }
        sentList.reverse();
        await client.logout();
        return res.json({ sent: sentList, total });
      }

      if (action === 'message') {
        const { uid, mailbox = 'INBOX' } = req.query;
        if (!uid) return res.status(400).json({ error: 'uid parameter is required' });
        await client.mailboxOpen(mailbox);
        const msg = await client.fetchOne(uid, { source: true }, { uid: true });
        await client.logout();
        if (!msg || !msg.source) {
          return res.status(404).json({ error: 'Message body not found' });
        }
        const parsedBody = parseEmailSource(msg.source);
        return res.json({ body: parsedBody });
      }

      if (action === 'delete') {
        // Support GET (via query) or POST (via body) for deletion flexibility
        const uidsRaw = req.method === 'POST' ? req.body.uids : req.query.uids;
        const mailbox = (req.method === 'POST' ? req.body.mailbox : req.query.mailbox) || 'INBOX';
        if (!uidsRaw) return res.status(400).json({ error: 'uids is required' });
        const uidList = Array.isArray(uidsRaw) ? uidsRaw : String(uidsRaw).split(',').map(id => id.trim()).filter(Boolean);
        await client.mailboxOpen(mailbox);
        await client.messageFlagsAdd(uidList, ['\\Deleted'], { uid: true });
        await client.logout();
        return res.json({ success: true, deleted: uidList });
      }

      if (action === 'move') {
        const { uids, fromMailbox = 'INBOX', toMailbox } = req.body;
        if (!uids || !toMailbox) return res.status(400).json({ error: 'uids and toMailbox are required' });
        const uidList = Array.isArray(uids) ? uids : String(uids).split(',').map(id => id.trim()).filter(Boolean);
        await client.mailboxOpen(fromMailbox);
        
        // Ensure destination mailbox exists
        const mailboxes = await client.list();
        const exists = mailboxes.some(m => m.path === toMailbox || m.name === toMailbox);
        if (!exists) {
          await client.mailboxCreate(toMailbox);
        }
        
        await client.messageMove(uidList, toMailbox, { uid: true });
        await client.logout();
        return res.json({ success: true, moved: uidList, destination: toMailbox });
      }

      if (action === 'folders') {
        const mailboxes = await client.list();
        await client.logout();
        return res.json({ folders: mailboxes.map(m => ({ name: m.name, path: m.path })) });
      }

      if (action === 'profile') {
        const inbox = await client.status('INBOX', { messages: true, unseen: true, recent: true });
        const sent = await client.status('[Gmail]/Sent Mail', { messages: true }).catch(() => ({ messages: 0 }));
        const spam = await client.status('[Gmail]/Spam', { messages: true }).catch(() => ({ messages: 0 }));
        await client.logout();
        return res.json({ email: process.env.GMAIL_MARKETING_EMAIL || 'marketing.globalgreenhp@gmail.com', inbox: inbox.messages || 0, unread: inbox.unseen || 0, sent: sent.messages || 0, spam: spam.messages || 0 });
      }

      await client.logout();
      return res.status(400).json({ error: 'Invalid action', validActions: ['inbox', 'bounces', 'replies', 'sent', 'message', 'delete', 'move', 'folders', 'profile'] });
    } catch (err) {
      console.error('[Gmail IMAP]', err);
      if (client) await client.logout().catch(() => {});
      return res.status(500).json({ error: err.message || 'Gmail connection failed' });
    }
  }

  return res.status(400).json({ error: 'Invalid route', validRoutes: ['send', 'track', 'gmail'] });
}
