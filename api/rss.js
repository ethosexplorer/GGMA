/**
 * RSS Feed Proxy API — Server-side RSS fetcher (bypasses CORS + rss2json rate limits)
 * 
 * Routes:
 *   GET /api/rss?source=national            — Marijuana Moment feed
 *   GET /api/rss?source=local&q=Oklahoma    — Google News local feed
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { source = 'national', q = 'cannabis' } = req.query;

  try {
    let feedUrl;
    if (source === 'local') {
      const query = encodeURIComponent(`${q} cannabis OR marijuana OR dispensary`);
      feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    } else {
      feedUrl = 'https://www.marijuanamoment.net/feed/';
    }

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GGP-OS/1.0; +https://ggp-os.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
    const xml = await response.text();

    // Parse RSS XML → JSON items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const block = match[1];
      const getTag = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'))
          || block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };

      const title = getTag('title').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8230;/g, '…');
      const link = getTag('link');
      const pubDate = getTag('pubDate');
      const description = getTag('description').replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').substring(0, 200);
      const sourceTag = getTag('source') || (source === 'local' ? `${q} Local News` : 'Marijuana Moment');

      if (title) {
        items.push({
          title: title.replace(/ - [^-]+$/, ''), // strip trailing source name
          link,
          pubDate,
          description,
          source: sourceTag
        });
      }
    }

    return res.status(200).json({ 
      status: 'ok', 
      items, 
      total: items.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[RSS Proxy]', err);
    return res.status(500).json({ error: err.message || 'RSS fetch failed' });
  }
}
