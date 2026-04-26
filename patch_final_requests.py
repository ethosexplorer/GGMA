import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# Add useEffect for Live News Scraping
news_effect = """
    const [inTheKnowNews, setInTheKnowNews] = useState([
      '🔴 BREAKING: Federal Marijuana Rescheduling - Schedule I → Schedule III NOW OFFICIAL',
      'Sylara AI processed 50,000+ compliance checks this hour'
    ]);

    useEffect(() => {
      const fetchNews = async () => {
        try {
          // Live API Scraping for hottest hourly news
          const res = await fetch('https://www.reddit.com/r/medicalmarijuana/new.json?limit=5');
          const json = await res.json();
          if (json?.data?.children?.length > 0) {
            const livePosts = json.data.children.map((child: any) => `🔴 LIVE NEWS: ${child.data.title.substring(0, 80)}...`);
            setInTheKnowNews((prev) => [...livePosts, ...prev.slice(0, 3)]);
          }
        } catch (err) {
          console.error('Failed to auto-scrape news:', err);
        }
      };
      fetchNews();
      const interval = setInterval(fetchNews, 3600000); // Scrape hourly
      return () => clearInterval(interval);
    }, []);
"""

if 'fetchNews' not in app:
    app = re.sub(r'const \[inTheKnowNews, setInTheKnowNews\] = useState\(\[.*?\]\);', news_effect, app, flags=re.DOTALL)
    
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)


# Fix Subscription Prices
with open('src/lib/subscriptionPlans.ts', 'r', encoding='utf-8') as f:
    plans = f.read()

# I will update B2C plans to .99 prices
plans = re.sub(r'monthlyPrice: 49\.99', 'monthlyPrice: 0.99', plans)
plans = re.sub(r'monthlyPrice: 99, annualPrice: 1009(.*?)"B2C Medium"', r'monthlyPrice: 2.99, annualPrice: 29\1"B2C Medium"', plans)
plans = re.sub(r'monthlyPrice: 199, annualPrice: 2029(.*?)"B2C Full AI"', r'monthlyPrice: 4.99, annualPrice: 49\1"B2C Full AI"', plans)

with open('src/lib/subscriptionPlans.ts', 'w', encoding='utf-8') as f:
    f.write(plans)

print('done')
