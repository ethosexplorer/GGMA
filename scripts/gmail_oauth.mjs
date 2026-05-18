/**
 * Gmail OAuth2 Token Exchange Helper
 * 
 * Run this script locally once to get a refresh token for marketing.globalgreenhp@gmail.com
 * 
 * Usage:
 *   1. Run: node scripts/gmail_oauth.mjs
 *   2. Open the URL in browser
 *   3. Sign in with marketing.globalgreenhp@gmail.com
 *   4. Copy the refresh token and add to Vercel env vars
 */

import http from 'http';
import { URL } from 'url';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '';
const REDIRECT_URI = 'http://localhost:8000/oauth2callback';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels',
].join(' ');

// Step 1: Generate auth URL
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n════════════════════════════════════════════════════════════');
console.log('  Gmail OAuth2 Setup — GGP-OS Marketing');
console.log('════════════════════════════════════════════════════════════\n');
console.log('1. Open this URL in your browser:\n');
console.log(`   ${authUrl}\n`);
console.log('2. Sign in with: marketing.globalgreenhp@gmail.com');
console.log('3. Click "Allow" / "Continue"');
console.log('4. You will be redirected back here automatically.\n');
console.log('Waiting for OAuth callback on http://localhost:8000 ...\n');

// Step 2: Start temporary local server to catch the callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:8000`);
  
  if (url.pathname === '/oauth2callback') {
    const code = url.searchParams.get('code');
    
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: No authorization code received</h1>');
      return;
    }

    // Exchange code for tokens
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      });
      
      const tokens = await tokenRes.json();
      
      if (tokens.error) {
        console.error('\n❌ Token exchange failed:', tokens.error_description || tokens.error);
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error</h1><pre>${JSON.stringify(tokens, null, 2)}</pre>`);
        return;
      }

      console.log('\n✅ SUCCESS! OAuth2 tokens received:\n');
      console.log('════════════════════════════════════════════════════════════');
      console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('════════════════════════════════════════════════════════════\n');
      console.log('Access Token (temporary):', tokens.access_token?.substring(0, 30) + '...');
      console.log('Expires in:', tokens.expires_in, 'seconds');
      console.log('\n📋 Add these to your Vercel environment variables:');
      console.log('   GMAIL_CLIENT_ID=' + CLIENT_ID);
      console.log('   GMAIL_CLIENT_SECRET=' + CLIENT_SECRET);
      console.log('   GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('\n');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
        <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #e2e8f0;">
          <h1 style="color: #22c55e;">✅ Gmail OAuth2 Connected!</h1>
          <p>The refresh token has been printed in your terminal.</p>
          <h3>Add these to Vercel Environment Variables:</h3>
          <pre style="background: #1e293b; padding: 20px; border-radius: 12px; overflow-x: auto; color: #a5f3fc;">
GMAIL_CLIENT_ID=${CLIENT_ID}
GMAIL_CLIENT_SECRET=${CLIENT_SECRET}
GMAIL_REFRESH_TOKEN=${tokens.refresh_token}
          </pre>
          <p style="color: #94a3b8;">You can close this tab now.</p>
        </body>
        </html>
      `);
      
      setTimeout(() => { server.close(); process.exit(0); }, 2000);
    } catch (err) {
      console.error('\n❌ Error exchanging token:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error: ' + err.message);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8000, () => {
  console.log('✅ Local OAuth server running on http://localhost:8000');
});
