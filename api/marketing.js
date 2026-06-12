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
const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY || '';

const createTransporter = () => {
  let host = process.env.SMTP_HOST;
  let port = parseInt(process.env.SMTP_PORT || '587');
  let secure = process.env.SMTP_SECURE === 'true';
  let user = process.env.SMTP_USER;
  let pass = process.env.SMTP_PASS;

  // Smart fallback: if RESEND_API_KEY is available and SMTP_HOST is not explicitly configured
  // or is set to Resend, default to Resend SMTP configuration settings.
  if (process.env.RESEND_API_KEY && (!host || host === 'smtp.resend.com' || host === 'smtp.gmail.com')) {
    host = 'smtp.resend.com';
    port = 587;
    secure = false;
    user = 'resend';
    pass = process.env.RESEND_API_KEY;
  } else {
    host = host || 'smtp.gmail.com';
    user = user || 'marketing@ggp-os.com';
    pass = pass || process.env.GMAIL_MARKETING_APP_PASSWORD || '';
  }

  // Clean copy-paste artifacts (quotes and whitespace)
  if (user.startsWith('"') && user.endsWith('"')) user = user.slice(1, -1);
  if (user.startsWith("'") && user.endsWith("'")) user = user.slice(1, -1);
  if (pass.startsWith('"') && pass.endsWith('"')) pass = pass.slice(1, -1);
  if (pass.startsWith("'") && pass.endsWith("'")) pass = pass.slice(1, -1);
  user = user.trim();
  pass = pass.trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 500,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 60000,
  });
};

// ============================================================
// TRACKING PIXEL
// ============================================================
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// ============================================================
// IMAP
// ============================================================
async function getImapClient(account = 'founder') {
  let user, pass;
  
  if (account === 'marketing') {
    // Marketing campaign account — for the Marketing Hub inbox
    user = process.env.GMAIL_MARKETING_EMAIL || process.env.SMTP_USER || 'marketing.globalgreenhp@gmail.com';
    pass = process.env.GMAIL_MARKETING_APP_PASSWORD || process.env.SMTP_PASS || '';
    if (!pass) throw new Error('GMAIL_MARKETING_APP_PASSWORD (or SMTP_PASS) is not set for marketing account.');
  } else {
    // Founder personal inbox — for the Founder Dashboard webmail
    user = process.env.FOUNDER_EMAIL || 'founder@ggp-os.com';
    pass = process.env.FOUNDER_APP_PASSWORD || '';
    if (!pass) throw new Error('FOUNDER_APP_PASSWORD is not set for founder account.');
  }
  
  console.log('[IMAP] Connecting to:', user, '(account:', account, ')');
  const client = new ImapFlow({
    host: 'imap.gmail.com', port: 993, secure: true,
    auth: { user, pass },
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
  const encodingMatch = headers.match(/Content-Transfer-Encoding:\s*([^\n\r]+)/i);
  const encoding = encodingMatch ? encodingMatch[1].trim().toLowerCase() : '';
  
  if (encoding === 'base64') {
    const cleanB64 = body.replace(/\s+/g, '');
    try {
      return Buffer.from(cleanB64, 'base64').toString('utf-8');
    } catch {
      return body;
    }
  } else if (encoding === 'quoted-printable') {
    const cleanStr = body.replace(/=\n/g, '');
    const bytes = [];
    for (let i = 0; i < cleanStr.length; i++) {
      const char = cleanStr[i];
      if (char === '=' && i + 2 < cleanStr.length) {
        const hex = cleanStr.substring(i + 1, i + 3);
        if (/^[0-9A-F]{2}$/i.test(hex)) {
          bytes.push(parseInt(hex, 16));
          i += 2;
          continue;
        }
      }
      bytes.push(cleanStr.charCodeAt(i));
    }
    return Buffer.from(bytes).toString('utf-8');
  }
  return body;
}

function parseMimePart(rawPart) {
  // Split headers from body
  const separator = '\n\n';
  const sepIdx = rawPart.indexOf(separator);
  if (sepIdx === -1) return { headers: '', body: rawPart, contentType: '' };
  
  const headers = rawPart.substring(0, sepIdx);
  const body = rawPart.substring(sepIdx + separator.length);
  
  // Extract content type (may span multiple lines with folding)
  const ctMatch = headers.match(/Content-Type:\s*([^\n]*(?:\n\s+[^\n]*)*)/i);
  const contentType = ctMatch ? ctMatch[1].replace(/\s+/g, ' ').trim() : '';
  
  return { headers, body, contentType };
}

function extractBestContent(rawSection) {
  const { headers, body, contentType } = parseMimePart(rawSection);
  
  // If this part is multipart, recurse into sub-parts
  if (contentType.toLowerCase().includes('multipart/')) {
    const boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/i);
    if (boundaryMatch) {
      const boundary = boundaryMatch[1];
      const subParts = body.split('--' + boundary);
      
      // Collect all sub-part results (skip first empty and last closing marker)
      let htmlResult = null;
      let plainResult = null;
      
      for (const subPart of subParts) {
        const trimmed = subPart.replace(/--\s*$/, '').trim();
        if (!trimmed || trimmed === '--') continue;
        
        const result = extractBestContent(trimmed);
        if (result.type === 'html' && !htmlResult) htmlResult = result;
        if (result.type === 'plain' && !plainResult) plainResult = result;
      }
      
      // Prefer HTML over plain text
      return htmlResult || plainResult || { content: body, type: 'unknown' };
    }
  }
  
  // Skip attachments — we only want inline body content
  if (headers.toLowerCase().includes('content-disposition: attachment')) {
    return { content: '', type: 'attachment' };
  }
  
  // Leaf node — decode and return
  const decoded = decodePart(body.replace(/--\s*$/, '').trim(), headers);
  
  if (contentType.toLowerCase().includes('text/html')) {
    return { content: decoded, type: 'html' };
  }
  if (contentType.toLowerCase().includes('text/plain')) {
    return { content: decoded, type: 'plain' };
  }
  
  return { content: decoded, type: 'unknown' };
}

function parseEmailSource(sourceBuffer) {
  const source = sourceBuffer.toString('utf-8');
  const cleanSource = source.replace(/\r\n/g, '\n');
  
  const result = extractBestContent(cleanSource);
  return result.content || source;
}

// ============================================================
// ATTACHMENT HELPER
// ============================================================
function extractAttachments(bodyStructure) {
  const attachments = [];
  function walk(node, partPath = '') {
    if (!node) return;
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach((child, i) => {
        const nextPath = partPath ? `${partPath}.${i + 1}` : `${i + 1}`;
        walk(child, nextPath);
      });
    } else {
      const disp = (node.disposition || '').toLowerCase();
      const type = (node.type || '').toLowerCase();
      const subtype = (node.subtype || '').toLowerCase();
      // Treat as attachment if disposition says so, or if it's not text/html or text/plain inline
      if (disp === 'attachment' || (type !== 'text' && type !== 'multipart' && type !== '')) {
        const filename = node.dispositionParameters?.filename
          || node.parameters?.name
          || `attachment.${subtype || 'bin'}`;
        attachments.push({
          filename,
          contentType: `${type}/${subtype}`,
          size: node.size || 0,
          part: node.part || partPath,
        });
      }
    }
  }
  walk(bodyStructure);
  return attachments;
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
      const { type, subject, message, recipients, attachments, cc, bcc, campaignId, fromEmail } = req.body;
      if (!message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Message and a non-empty recipients array are required.' });
      }

      const results = { total: recipients.length, successful: 0, failed: 0, errors: [] };

      // --- Throttled send helper: waits between sends to avoid rate limits ---
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      // --- Retry helper: retries a function up to maxRetries times with backoff ---
      const withRetry = async (fn, maxRetries = 2) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await fn();
          } catch (err) {
            if (attempt === maxRetries) throw err;
            // Exponential backoff: 500ms, 1500ms
            await delay(500 * (attempt + 1));
          }
        }
      };

      if (type === 'email') {
        const transporter = createTransporter();
        
        // Verify SMTP connection first
        try {
          await transporter.verify();
          console.log('[SMTP] Connection verified for', process.env.SMTP_USER || 'marketing@ggp-os.com');
        } catch (verifyErr) {
          console.error('[SMTP] Connection verification failed:', verifyErr.message);
          return res.status(503).json({ 
            error: `SMTP connection failed: ${verifyErr.message}. Check SMTP_USER and SMTP_PASS in your .env file.`,
            hint: 'If using marketing@ggp-os.com, ensure an App Password is generated in Google Admin.'
          });
        }

        const emailAttachments = (attachments || []).map(att => ({
          filename: att.filename, content: Buffer.from(att.content, 'base64'),
          contentType: att.contentType, cid: att.cid
        }));

        const TRACK_BASE = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.ggp-os.com';
        
        // Official domain sender — trusted by .gov mail servers
        const defaultFrom = process.env.SMTP_FROM_EMAIL || `"Global Green Enterprise" <marketing@ggp-os.com>`;
        
        // THROTTLED SEQUENTIAL SEND — 350ms between each email to avoid rate limits
        const THROTTLE_MS = 350;
        
        for (let i = 0; i < recipients.length; i++) {
          const recipient = recipients[i];
          if (!recipient.email) {
            results.failed++;
            results.errors.push({ recipient, error: 'Missing email address' });
            continue;
          }

          try {
            await withRetry(async () => {
              let htmlBody = `<div style="font-family: sans-serif; padding: 20px; color: #333;">${message.replace(/\n/g, '<br/>')}</div>`;
              
              if (campaignId) {
                const rid = encodeURIComponent(recipient.email);
                htmlBody = htmlBody.replace(/href="(https?:\/\/[^"]+)"/gi, (match, url) => {
                  return `href="${TRACK_BASE}/api/marketing?route=track&type=click&cid=${campaignId}&rid=${rid}&url=${encodeURIComponent(url)}"`;
                });
                htmlBody += `<img src="${TRACK_BASE}/api/marketing?route=track&type=open&cid=${campaignId}&rid=${rid}&t=${Date.now()}" width="1" height="1" style="display:none;border:0;" alt="" />`;
              }
              
              await transporter.sendMail({
                from: fromEmail || defaultFrom,
                to: recipient.email,
                cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
                bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
                subject: subject || 'Important Update',
                text: message.replace(/<[^>]*>/g, ''),
                html: htmlBody, attachments: emailAttachments
              });
            });
            results.successful++;
          } catch (err) {
            results.failed++;
            results.errors.push({ recipient, error: err.message });
            console.error(`[SMTP] Failed after retries: ${recipient.email} — ${err.message}`);
            
            // Real-time bounce quarantine: flag permanent SMTP failures (not rate limits)
            const errMsg = (err.message || '').toLowerCase();
            const errCode = err.responseCode || err.code || 0;
            const isPermanentBounce = 
              [550, 551, 552, 553, 554].includes(errCode) ||
              errMsg.includes('not exist') || errMsg.includes('invalid') ||
              errMsg.includes('unknown user') || errMsg.includes('no such user') ||
              errMsg.includes('mailbox not found') || errMsg.includes('rejected') ||
              errMsg.includes('undeliverable') || errMsg.includes('does not exist');
            const isRateLimit = errMsg.includes('rate') || errMsg.includes('quota') || 
              errMsg.includes('limit') || errMsg.includes('too many') || errCode === 429;
            
            if (isPermanentBounce && !isRateLimit && recipient.email) {
              try {
                const adminDb = getAdminDb();
                const emailKey = recipient.email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
                await adminDb.collection('suppressed_emails').doc(emailKey).set({
                  email: recipient.email.toLowerCase(),
                  reason: 'permanent_bounce',
                  smtpError: err.message,
                  smtpCode: errCode,
                  detectedAt: new Date().toISOString(),
                  source: 'realtime_send_quarantine'
                }, { merge: true });
                // Also flag in crm_deals
                const snap = await adminDb.collection('crm_deals').where('email', '==', recipient.email).limit(1).get();
                for (const d of snap.docs) {
                  await d.ref.update({ emailFabricated: true, email_original: recipient.email, email: '', emailFlagReason: `SMTP bounce: ${err.message}` });
                }
                console.log(`[Bounce] 🚫 Auto-quarantined: ${recipient.email} (${errCode})`);
                if (!results.quarantined) results.quarantined = 0;
                results.quarantined++;
              } catch (qErr) {
                console.error(`[Bounce] Failed to quarantine ${recipient.email}:`, qErr.message);
              }
            }
          }

          // Throttle: wait between sends (skip delay on last email)
          if (i < recipients.length - 1) {
            await delay(THROTTLE_MS);
          }
        }

      } else if (type === 'sms') {
        for (let i = 0; i < recipients.length; i++) {
          const recipient = recipients[i];
          try {
            if (!recipient.phone) throw new Error('Missing phone number');
            const cleanNumber = recipient.phone.replace(/[\s\-\(\)\+]/g, '');
            const response = await fetch('https://textbelt.com/text', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: cleanNumber, message, key: TEXTBELT_API_KEY })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'TextBelt API Error');
            results.successful++;
          } catch (err) {
            results.failed++;
            results.errors.push({ recipient, error: err.message });
          }
          // 200ms throttle for SMS
          if (i < recipients.length - 1) await delay(200);
        }
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
    const { action, maxResults = '20', q, account = 'founder' } = req.query;
    
    // Validate credentials based on which account is requested
    if (account === 'marketing') {
      if (!process.env.GMAIL_MARKETING_APP_PASSWORD && !process.env.SMTP_PASS) {
        return res.status(503).json({ error: 'Marketing inbox not configured', setup: 'Add GMAIL_MARKETING_EMAIL and GMAIL_MARKETING_APP_PASSWORD env vars' });
      }
    } else {
      if (!process.env.FOUNDER_APP_PASSWORD) {
        return res.status(503).json({ error: 'Founder inbox not configured', setup: 'Add FOUNDER_EMAIL and FOUNDER_APP_PASSWORD env vars' });
      }
    }
    
    let client;
    try {
      client = await getImapClient(account);

      if (action === 'inbox') {
        await client.mailboxOpen('INBOX');
        const messages = [];
        const limit = Math.min(parseInt(maxResults) || 50, 100);
        const status = await client.status('INBOX', { messages: true, unseen: true });
        const total = status.messages || 0;
        const start = Math.max(1, total - limit + 1);
        for await (const msg of client.fetch(`${start}:*`, { envelope: true, bodyStructure: true, flags: true })) {
          const attachments = extractAttachments(msg.bodyStructure);
          messages.push({
            id: msg.uid, seq: msg.seq, from: parseAddress(msg.envelope?.from),
            to: parseAddress(msg.envelope?.to), subject: msg.envelope?.subject || '(no subject)',
            date: msg.envelope?.date?.toISOString() || '', isRead: msg.flags?.has('\\Seen') || false,
            isReply: !!(msg.envelope?.inReplyTo), messageId: msg.envelope?.messageId || '',
            hasAttachments: attachments.length > 0, attachmentCount: attachments.length,
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
          for await (const msg of client.fetch(recentUids, { envelope: true, source: { maxBytes: 5000 } })) {
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
          for await (const msg of client.fetch(recentSlice, { envelope: true, flags: true })) {
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
        const limit = Math.min(parseInt(maxResults) || 20, 1000);
        const status = await client.status('[Gmail]/Sent Mail', { messages: true });
        const total = status.messages || 0;
        const start = Math.max(1, total - limit + 1);
        for await (const msg of client.fetch(`${start}:*`, { envelope: true, bodyStructure: true, flags: true })) {
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
        const msg = await client.fetchOne(uid, { source: true, bodyStructure: true }, { uid: true });
        await client.logout();
        if (!msg || !msg.source) {
          return res.status(404).json({ error: 'Message body not found' });
        }
        const parsedBody = parseEmailSource(msg.source);
        const attachments = extractAttachments(msg.bodyStructure);
        return res.json({ body: parsedBody, attachments });
      }

      if (action === 'attachment') {
        const { uid, part, mailbox = 'INBOX' } = req.query;
        if (!uid || !part) return res.status(400).json({ error: 'uid and part are required' });
        await client.mailboxOpen(mailbox);
        const download = await client.download(uid, part, { uid: true });
        if (!download || !download.content) {
          await client.logout();
          return res.status(404).json({ error: 'Attachment not found' });
        }
        const chunks = [];
        for await (const chunk of download.content) { chunks.push(chunk); }
        const buffer = Buffer.concat(chunks);
        await client.logout();
        res.setHeader('Content-Type', download.meta?.contentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${download.meta?.filename || 'attachment'}"`);
        return res.send(buffer);
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
        const emailForProfile = account === 'marketing'
          ? (process.env.GMAIL_MARKETING_EMAIL || process.env.SMTP_USER || 'marketing.globalgreenhp@gmail.com')
          : (process.env.FOUNDER_EMAIL || 'founder@ggp-os.com');
        return res.json({ email: emailForProfile, inbox: inbox.messages || 0, unread: inbox.unseen || 0, sent: sent.messages || 0, spam: spam.messages || 0 });
      }

      await client.logout();
      return res.status(400).json({ error: 'Invalid action', validActions: ['inbox', 'bounces', 'replies', 'sent', 'message', 'delete', 'move', 'folders', 'profile'] });
    } catch (err) {
      console.error('[Gmail IMAP]', err);
      if (client) await client.logout().catch(() => {});
      
      let errMsg = err.message || 'Gmail connection failed';
      const responseText = err.responseText || err.response || '';
      if (String(responseText).includes('Application-specific password required')) {
        errMsg = 'Gmail authentication failed: An Application-specific password is required for this Gmail account. Please generate one in your Google Account security settings and set it as GMAIL_MARKETING_APP_PASSWORD in your .env file.';
      } else if (err.authenticationFailed) {
        errMsg = 'Gmail authentication failed. Please verify that your email and App Password (GMAIL_MARKETING_APP_PASSWORD) are set correctly.';
      }
      
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(400).json({ error: 'Invalid route', validRoutes: ['send', 'track', 'gmail'] });
}
