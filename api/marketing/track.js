import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// 1x1 transparent GIF pixel
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export default async function handler(req, res) {
  const { type, cid, rid, url } = req.query;

  if (!cid || !rid) {
    // Still return pixel/redirect so email clients don't show errors
    if (type === 'open') {
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res.end(PIXEL);
    }
    return res.redirect(url || 'https://www.ggp-os.com');
  }

  const timestamp = new Date().toISOString();
  const eventData = {
    campaignId: cid,
    recipientEmail: decodeURIComponent(rid),
    type: type || 'open',
    timestamp,
    userAgent: req.headers['user-agent'] || 'unknown',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  };

  try {
    // Log the tracking event
    await db.collection('marketing_tracking').add(eventData);

    // Update campaign analytics aggregates
    const campaignRef = db.collection('marketing_campaigns').doc(cid);
    const campaignDoc = await campaignRef.get();
    
    if (campaignDoc.exists) {
      if (type === 'open') {
        // Track unique opens
        const data = campaignDoc.data();
        const openedEmails = data.openedEmails || [];
        const decodedRid = decodeURIComponent(rid);
        if (!openedEmails.includes(decodedRid)) {
          await campaignRef.update({
            openedEmails: FieldValue.arrayUnion(decodedRid),
            totalOpens: FieldValue.increment(1),
            lastOpenAt: timestamp
          });
        } else {
          // Repeat open — just increment total
          await campaignRef.update({
            totalOpens: FieldValue.increment(1),
            lastOpenAt: timestamp
          });
        }
      } else if (type === 'click') {
        const decodedRid = decodeURIComponent(rid);
        await campaignRef.update({
          clickedEmails: FieldValue.arrayUnion(decodedRid),
          totalClicks: FieldValue.increment(1),
          lastClickAt: timestamp
        });
      }
    }
  } catch (err) {
    console.error('[Track] Error logging event:', err);
    // Don't block the response — tracking is best-effort
  }

  // Return appropriate response
  if (type === 'click' && url) {
    return res.redirect(decodeURIComponent(url));
  }

  // Default: return tracking pixel
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.end(PIXEL);
}
