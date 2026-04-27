/**
 * Regulatory Intelligence Feed Service
 * Fetches live cannabis regulatory news from Marijuana Moment RSS
 * Caches results in localStorage for 1 hour to avoid excessive API calls
 */

export interface RegulatoryUpdate {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  source: string;
  isBreaking: boolean;
}

const CACHE_KEY = 'ggpos_regulatory_feed';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in ms

// RSS feed URL via rss2json (free tier, CORS-safe)
const FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.marijuanamoment.net/feed/';

// Keywords that indicate breaking/urgent news
const BREAKING_KEYWORDS = [
  'rescheduling', 'reschedule', 'schedule iii', 'schedule 3',
  'dea', 'doj', 'fda', 'supreme court',
  'executive order', 'trump signs', 'governor signs',
  'emergency', 'ban', 'legalize', 'federal'
];

function isBreakingNews(title: string, description: string): boolean {
  const combined = `${title} ${description}`.toLowerCase();
  return BREAKING_KEYWORDS.some(kw => combined.includes(kw));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function truncateDescription(desc: string, maxLen: number = 160): string {
  const clean = stripHtml(desc);
  if (clean.length <= maxLen) return clean;
  return clean.substring(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

interface CachedFeed {
  timestamp: number;
  items: RegulatoryUpdate[];
}

function getCached(): RegulatoryUpdate[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedFeed = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.items;
  } catch {
    return null;
  }
}

function setCache(items: RegulatoryUpdate[]): void {
  try {
    const data: CachedFeed = { timestamp: Date.now(), items };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export async function fetchRegulatoryFeed(limit: number = 5, jurisdiction?: string): Promise<RegulatoryUpdate[]> {
  // Use a dynamic cache key if jurisdiction is provided
  const cacheKey = jurisdiction ? `${CACHE_KEY}_${jurisdiction}` : CACHE_KEY;
  
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.timestamp <= CACHE_TTL) {
        return cached.items.slice(0, limit);
      }
    }
  } catch {}

  try {
    let items: RegulatoryUpdate[] = [];

    if (jurisdiction) {
      // Localized News via Reddit Search
      const query = encodeURIComponent(`${jurisdiction} (marijuana OR cannabis OR weed OR dispensary)`);
      const res = await fetch(`https://www.reddit.com/search.json?q=${query}&sort=new&limit=${limit * 2}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      if (data?.data?.children?.length) {
        items = data.data.children
          .filter((child: any) => !child.data.over_18) // basic SFW filter
          .map((child: any) => ({
            title: child.data.title || 'Untitled Local Update',
            pubDate: new Date(child.data.created_utc * 1000).toISOString(),
            link: `https://www.reddit.com${child.data.permalink}`,
            description: truncateDescription(child.data.selftext || 'Click to view local jurisdiction discussion.'),
            source: `${jurisdiction} Local News`,
            isBreaking: isBreakingNews(child.data.title || '', ''),
          })).slice(0, limit);
      }
    }

    // Fallback to National RSS if local news fails or no jurisdiction
    if (items.length === 0) {
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.status !== 'ok' || !data.items?.length) {
        throw new Error('Invalid RSS response');
      }

      items = data.items.map((item: any) => ({
        title: item.title || 'Untitled',
        pubDate: item.pubDate || new Date().toISOString(),
        link: item.link || '#',
        description: truncateDescription(item.description || item.content || ''),
        source: 'National Cannabis Feed',
        isBreaking: isBreakingNews(item.title || '', item.description || ''),
      })).slice(0, limit);
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), items }));
    } catch {}

    return items;
  } catch (err) {
    console.warn('⚠️ Failed to fetch regulatory feed, using fallback:', err);
    return []; // caller will use fallback content
  }
}

/**
 * Format a date string into a readable format like "April 26, 2026"
 */
export function formatFeedDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
