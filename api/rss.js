/**
 * Public Intelligence & RSS Feed Proxy API
 * Server-side scraper and RSS fetcher (bypasses CORS)
 * 
 * Routes:
 *   GET /api/rss?source=national            — Marijuana Moment feed
 *   GET /api/rss?source=local&q=Oklahoma    — Google News local feed
 *   GET /api/rss?source=omma-recalls        — Live Oklahoma safety recalls scraper
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { source = 'national', q = 'cannabis' } = req.query;

  // ─── CASE 1: LIVE OMMA RECALLS SCRAPER ────────────────────────────────────
  if (source === 'omma-recalls') {
    res.setHeader('Content-Type', 'application/json');
    
    const fallbackRecalls = [
      {
        id: 'OMMA-2026-05-15',
        date: '2026-05-15',
        displayDate: 'May 15, 2026 (Expanded from March 23, 2026)',
        type: 'recall',
        businessName: 'Sunny Roads Processing 2, LLC',
        licenseNumber: 'PAAA-8JA2-CK1Z',
        licenseType: 'processor',
        products: 'Medical marijuana pre-roll batches',
        reason: 'Failed testing due to pesticide content above allowable thresholds',
        contaminant: 'pesticide',
        newsUrl: 'https://oklahoma.gov/omma/about/news/2026/update-recall-expanded-for-products-processed-by-sunny-roads-processing-2-llc.html',
        isActive: true
      },
      {
        id: 'OMMA-2026-03-19',
        date: '2026-03-19',
        displayDate: 'March 19, 2026',
        type: 'recall',
        businessName: 'Greenleaf Labs LLC',
        licenseNumber: 'LAAA-MP4O-T1EE',
        licenseType: 'lab',
        products: 'Products tested between April 2023 and July 2025',
        reason: 'Failed testing — mold and yeast levels exceeding compliance thresholds',
        contaminant: 'microbial',
        pdfUrl: 'https://oklahoma.gov/content/dam/ok/en/omma/content/embargoed-and-recalled-products/2026-3-19/Product%20and%20Business%20Recall%20List%20March%2019%202026.pdf',
        isActive: true
      },
      {
        id: 'OMMA-2026-01-21',
        date: '2026-01-21',
        displayDate: 'Jan. 21, 2026',
        type: 'embargo',
        businessName: 'OK Farms / RX Harvest Botanicals',
        licenseNumber: 'PAAA-FQG6-QLJP / PAAA-F0B4-WJQP',
        licenseType: 'processor',
        products: 'Untagged products discovered at Bud Guys LLP (DAAA-X7XP-Q2J9) in Tulsa',
        reason: 'Non-licensed operators — products untagged in state inventory tracking system, testing unconfirmed',
        contaminant: 'unlicensed',
        isActive: true
      },
      {
        id: 'OMMA-2025-12-23',
        date: '2025-12-23',
        displayDate: 'Dec. 23, 2025 (Embargo Dec. 11, 2025)',
        type: 'recall_embargo',
        businessName: 'Carter County Extracts, Inc.',
        licenseNumber: 'PAAA-NKNM-0GP0',
        licenseType: 'processor',
        products: 'Concentrates originating from processor',
        reason: 'Failed for pesticides (Myclobutanil)',
        contaminant: 'pesticide',
        isActive: true
      },
      {
        id: 'OMMA-2025-11-25',
        date: '2025-11-25',
        displayDate: 'Nov. 25, 2025',
        type: 'voluntary_recall',
        businessName: 'Vice Capital Extraction, LLC',
        licenseNumber: 'Unknown',
        licenseType: 'processor',
        products: 'Pre-rolls',
        reason: 'Flower failed microbial testing was combined with other flower material, contaminating the product',
        contaminant: 'microbial',
        isActive: false
      },
      {
        id: 'OMMA-2025-10-24',
        date: '2025-10-24',
        displayDate: 'Oct. 24, 2025 (Embargo Oct. 13, 2025)',
        type: 'recall_embargo',
        businessName: 'Green Delight 2 LLC',
        licenseNumber: 'DAAA-4JYA-UHMD',
        licenseType: 'dispensary',
        products: 'Medical marijuana products',
        reason: 'Failed for pesticides',
        contaminant: 'pesticide',
        isActive: false
      },
      {
        id: 'OMMA-2025-10-23',
        date: '2025-10-23',
        displayDate: 'Oct. 23, 2025 (Embargo Oct. 13, 2025)',
        type: 'recall_embargo',
        businessName: "Ruby Mae's LLC",
        licenseNumber: 'PAAA-EKRQ-5DLS',
        licenseType: 'processor',
        products: 'Medical marijuana products',
        reason: 'Improper testing methods',
        contaminant: 'testing_failure',
        isActive: false
      },
      {
        id: 'OMMA-2025-10-10',
        date: '2025-10-10',
        displayDate: 'Oct. 10, 2025 (Embargo Sept. 25, 2025)',
        type: 'recall_embargo',
        businessName: 'Michael William Redus DBA Rocking R Cannabis',
        licenseNumber: 'PAAA-1H79-INUS',
        licenseType: 'processor',
        products: 'Medical marijuana products',
        reason: 'Failed testing',
        isActive: false
      },
      {
        id: 'OMMA-2025-03-25',
        date: '2025-03-25',
        displayDate: 'March 25, 2025',
        type: 'recall_embargo',
        businessName: 'PAK Family Farm, LLC / Clever Leaf Outdoor, LLC',
        licenseNumber: 'GAAI-VYPS-KBZ2 / GAAA-VFSO-CG6V',
        licenseType: 'grower',
        products: 'Payzos Flower (arsenic), Grape Cream Cake Flower (cadmium), Zour Apples Flower (cadmium)',
        reason: 'Heavy metals present due to test reporting issues by lab',
        contaminant: 'heavy_metals',
        isActive: false
      },
      {
        id: 'OMMA-2024-06-10',
        date: '2024-06-10',
        displayDate: 'June 10, 2024 (Embargo June 7, 2024)',
        type: 'recall_embargo',
        businessName: 'Graves Farm Organics LLC',
        licenseNumber: 'PAAA-EYKG-PCTX',
        licenseType: 'processor',
        products: 'Medical marijuana products',
        reason: 'Failed re-testing for pesticides during investigation',
        contaminant: 'pesticide',
        isActive: false
      },
      {
        id: 'OMMA-2023-11-03',
        date: '2023-11-03',
        displayDate: 'Nov. 3, 2023',
        type: 'recall',
        businessName: 'Unknown Processor',
        licenseNumber: '',
        licenseType: 'processor',
        products: 'Products not properly tested',
        reason: 'Not properly tested by processor in violation of OAC 442:10-8',
        contaminant: 'testing_failure',
        isActive: false
      },
      {
        id: 'OMMA-2023-06-30',
        date: '2023-06-30',
        displayDate: 'June 30, 2023',
        type: 'recall',
        businessName: 'Graves Farm Organics, LLC',
        licenseNumber: 'PAAA-EYKG-PCTX',
        licenseType: 'processor',
        products: 'Prerolls — "Space Rocks" (Jan 1 – June 20, 2023)',
        reason: 'Not properly tested',
        contaminant: 'testing_failure',
        isActive: false
      }
    ];

    try {
      const url = 'https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html';
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        console.warn(`OMMA page fetch failed: ${response.status}. Using verified fallbacks.`);
        return res.status(200).json({ status: 'fallback', recalls: fallbackRecalls });
      }

      const html = await response.text();

      const decodeHtmlEntities = (str) => {
        return str
          .replace(/&quot;/g, '"')
          .replace(/&#34;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#183;/g, '·');
      };

      const recalls = [];
      const regex = /data-cmp-data-layer="([^"]+)"/g;
      let match;
      
      const textBlocks = [];
      const accordionItems = {};

      while ((match = regex.exec(html)) !== null) {
        const rawJson = decodeHtmlEntities(match[1]);
        try {
          const data = JSON.parse(rawJson);
          const key = Object.keys(data)[0];
          const details = data[key];
          
          if (details['@type'] === 'sok-wcm/components/content/v1/text') {
            const text = decodeHtmlEntities(details['xdm:text'] || '');
            const modifyDate = details['repo:modifyDate'] || '';
            textBlocks.push({ id: key, text, modifyDate });
          } else if (details['@type'] === 'sok-wcm/components/content/v1/accordion/item') {
            const title = decodeHtmlEntities(details['dc:title'] || '');
            const id = key.replace('item-', '');
            accordionItems[id] = title;
          }
        } catch (e) {}
      }

      const seenKeys = new Set();

      for (const block of textBlocks) {
        const text = block.text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const cleanText = text.toLowerCase();
        
        if (!cleanText.includes('recall') && !cleanText.includes('embargo')) continue;
        if (cleanText.includes('formal recalls and administrative embargoes') || cleanText.includes('in accordance with oac')) continue;
        if (cleanText.includes('the following list contains') || cleanText.includes('active and resolved recalls')) continue;

        const licenseRegex = /([A-Z]{3,4}-[A-Z0-9]{4}-[A-Z0-9]{4})/gi;
        const licenseMatches = text.match(licenseRegex) || [];
        
        let businessName = '';
        if (licenseMatches.length > 0) {
          const lic = licenseMatches[0];
          const parts = block.text.split(lic);
          if (parts.length > 0) {
            const preLic = parts[0].trim();
            const lastParen = preLic.lastIndexOf('(');
            if (lastParen !== -1) {
              const matchText = preLic.substring(0, lastParen).trim();
              const phraseIndex = Math.max(
                matchText.lastIndexOf('by '),
                matchText.lastIndexOf('from '),
                matchText.lastIndexOf('for ')
              );
              if (phraseIndex !== -1) {
                businessName = matchText.substring(phraseIndex + 3).trim().replace(/<[^>]*>/g, '').replace(/^[,\s\(\)]+|[,\s\(\)]+$/g, '');
              } else {
                const words = matchText.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w);
                businessName = words.slice(-3).join(' ').replace(/^[,\s\(\)]+|[,\s\(\)]+$/g, '');
              }
            }
          }
        }

        if (!businessName || businessName.toLowerCase().includes('authority') || businessName.toLowerCase().includes('omma') || businessName.toLowerCase().includes('marijuana')) {
          const matches = block.text.match(/(?:by|from)\s+([^,]+(?:LLC|Inc|Corporation|Farms|Botanicals|Extracts|Laboratories|Labs|Cannabis))/i);
          if (matches) {
            businessName = matches[1].replace(/<[^>]*>/g, '').trim();
          } else {
            if (cleanText.includes('sunny roads')) businessName = 'Sunny Roads Processing 2, LLC';
            else if (cleanText.includes('greenleaf labs')) businessName = 'Greenleaf Labs LLC';
            else if (cleanText.includes('ok farms')) businessName = 'OK Farms / RX Harvest Botanicals';
            else if (cleanText.includes('carter county')) businessName = 'Carter County Extracts, Inc.';
            else if (cleanText.includes('vice capital')) businessName = 'Vice Capital Extraction, LLC';
            else if (cleanText.includes('green delight')) businessName = 'Green Delight 2 LLC';
            else if (cleanText.includes('ruby mae')) businessName = "Ruby Mae's LLC";
            else if (cleanText.includes('rocking r')) businessName = 'Rocking R Cannabis';
            else if (cleanText.includes('pak family')) businessName = 'PAK Family Farm, LLC';
            else if (cleanText.includes('graves farm')) businessName = 'Graves Farm Organics LLC';
            else continue;
          }
        }

        businessName = businessName
          .replace(/processed and\/or labeled by\s+/i, '')
          .replace(/processed by\s+/i, '')
          .replace(/^[a-z\.\s\n]+Farms/i, 'Farms')
          .replace(/^[a-z\.\s\n]+Family/i, 'PAK Family Farm, LLC')
          .replace(/^[a-z\.\s\n]+Carter/i, 'Carter County Extracts, Inc.')
          .replace(/^m\s+/i, '')
          .replace(/^Mae’s/i, 'Ruby Mae’s')
          .replace(/^[,\s\(\)\.\n\r]+|[,\s\(\)\.\n\r]+$/g, '')
          .trim();

        let type = 'recall';
        if (cleanText.includes('embargo') && cleanText.includes('recall')) {
          type = 'recall_embargo';
        } else if (cleanText.includes('embargo')) {
          type = 'embargo';
        } else if (cleanText.includes('voluntary')) {
          type = 'voluntary_recall';
        }

        let contaminant = 'unknown';
        if (cleanText.includes('pesticide')) contaminant = 'pesticide';
        else if (cleanText.includes('microbial') || cleanText.includes('mold') || cleanText.includes('yeast') || cleanText.includes('bacteria') || cleanText.includes('cfu/g')) contaminant = 'microbial';
        else if (cleanText.includes('heavy metal') || cleanText.includes('arsenic') || cleanText.includes('cadmium') || cleanText.includes('lead')) contaminant = 'heavy_metals';
        else if (cleanText.includes('testing') || cleanText.includes('labeling') || cleanText.includes('tested')) contaminant = 'testing_failure';
        else if (cleanText.includes('unlicensed') || cleanText.includes('legal operator')) contaminant = 'unlicensed';

        let date = block.modifyDate.split('T')[0];
        let displayDate = '';
        const accordionId = block.id.replace('text-', '');
        if (accordionItems[accordionId]) {
          displayDate = accordionItems[accordionId];
          try {
            const parsedDate = new Date(displayDate);
            if (!isNaN(parsedDate.getTime())) {
              date = parsedDate.toISOString().split('T')[0];
            }
          } catch (e) {}
        } else {
          const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},\s+\d{4}/i);
          if (dateMatch) {
            displayDate = dateMatch[0];
            try {
              const parsedDate = new Date(displayDate);
              if (!isNaN(parsedDate.getTime())) {
                date = parsedDate.toISOString().split('T')[0];
              }
            } catch (e) {}
          } else {
            displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
        }

        let reason = text;
        if (reason.length > 250) {
          reason = reason.substring(0, 247) + '...';
        }

        const dedupKey = `${date}_${businessName.toLowerCase()}`;
        const existingIndex = recalls.findIndex(r => r.date === date && r.businessName.toLowerCase() === businessName.toLowerCase());
        if (existingIndex !== -1) {
          if (recalls[existingIndex].contaminant === 'unknown' && contaminant !== 'unknown') {
            recalls[existingIndex].contaminant = contaminant;
          }
          if (recalls[existingIndex].reason.length < reason.length) {
            recalls[existingIndex].reason = reason;
          }
          continue;
        }
        seenKeys.add(dedupKey);

        let products = 'Medical marijuana products';
        if (cleanText.includes('pre-roll')) products = 'Medical marijuana pre-rolls';
        else if (cleanText.includes('flower') || cleanText.includes('buds')) products = 'Medical marijuana flower';
        else if (cleanText.includes('concentrate') || cleanText.includes('oil')) products = 'Medical marijuana concentrates';

        const isActive = new Date(date) >= new Date('2025-10-01');

        recalls.push({
          id: 'OMMA-' + date,
          date,
          displayDate,
          type,
          businessName,
          licenseNumber: licenseMatches.join(' / ') || 'Unknown',
          licenseType: businessName.toLowerCase().includes('lab') ? 'lab' : 'processor',
          products,
          reason,
          contaminant,
          isActive
        });
      }

      const sortedRecalls = recalls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return res.status(200).json({
        status: 'ok',
        recalls: sortedRecalls.length > 0 ? sortedRecalls : fallbackRecalls,
        fetchedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('OMMA Recall Scraper Error:', error);
      return res.status(200).json({
        status: 'fallback',
        recalls: fallbackRecalls,
        error: error.message
      });
    }
  }

  // ─── CASE 2: GOOGLE NEWS OR MARIJUANA MOMENT RSS ─────────────────────────
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
          title: title.replace(/ - [^-]+$/, ''),
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
