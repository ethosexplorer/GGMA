export interface IntelligenceSource {
  title: string;
  url: string;
  category: 'Federal' | 'State' | 'Policy' | 'News' | 'Research';
  description: string;
}

export const INTELLIGENCE_RESOURCES: IntelligenceSource[] = [
  {
    title: 'CRS: Cannabis State of Play',
    url: 'https://www.congress.gov/crs-product/IF12270',
    category: 'Federal',
    description: 'Congressional Research Service report on federal cannabis policy.'
  },
  {
    title: 'Cannabis Policy in 2026',
    url: 'https://www.rockinst.org/blog/cannabis-policy-in-2026-setbacks-rollbacks-and-roadblocks/',
    category: 'Policy',
    description: 'Analysis of current policy setbacks and roadblocks for 2026.'
  },
  {
    title: 'NCSL State Legislation Database',
    url: 'https://www.ncsl.org/health/state-cannabis-legislation-database',
    category: 'State',
    description: 'Comprehensive database of state cannabis bills and statutes.'
  },
  {
    title: 'OMMA Legislative Updates',
    url: 'https://oklahoma.gov/omma/rules-and-legislation/legislative-updates.html',
    category: 'State',
    description: 'Official Oklahoma Medical Marijuana Authority updates.'
  },
  {
    title: 'MPP Key Policy Reforms',
    url: 'https://www.mpp.org/issues/legislation/key-marijuana-policy-reform/',
    category: 'Policy',
    description: 'Marijuana Policy Project trackings of key reforms.'
  },
  {
    title: 'DISA Legality Map',
    url: 'https://disa.com/marijuana-legality-by-state/',
    category: 'State',
    description: 'Industry-standard map of US cannabis legality.'
  },
  {
    title: 'Wikipedia: US Cannabis Legality',
    url: 'https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction',
    category: 'Research',
    description: 'Detailed breakdown of jurisdiction-specific cannabis laws.'
  },
  {
    title: 'MORE Act (H.R. 3617)',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/3617',
    category: 'Federal',
    description: 'Full text of the Marijuana Opportunity Reinvestment and Expungement Act.'
  },
  {
    title: 'Federal Study Directive',
    url: 'https://www.marijuanamoment.net/federal-agencies-would-have-to-study-state-marijuana-laws-under-new-directive-from-congressional-committee/',
    category: 'News',
    description: 'Congress directs federal agencies to study state marijuana laws.'
  },
  {
    title: 'NCSL Cannabis Overview',
    url: 'https://www.ncsl.org/civil-and-criminal-justice/cannabis-overview',
    category: 'Policy',
    description: 'Broad overview of state and federal cannabis landscape.'
  },
  {
    title: 'Nadler: MORE Act Progress',
    url: 'https://nadler.house.gov/news/documentsingle.aspx?DocumentID=397401',
    category: 'Federal',
    description: 'Official press releases on federal legalization efforts.'
  },
  {
    title: 'Current Federal Bills',
    url: 'https://www.mpp.org/policy/federal/current-marijuana-bills-before-congress/',
    category: 'Federal',
    description: 'Tracking active cannabis legislation in DC.'
  },
  {
    title: 'FDA Cannabis Regulation',
    url: 'https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd',
    category: 'Federal',
    description: 'Official FDA guidance on CBD and cannabis-derived products.'
  },
  {
    title: 'NORML State Laws',
    url: 'https://norml.org/laws/',
    category: 'State',
    description: 'State-by-state breakdown of penalties and legality.'
  },
  {
    title: 'Marijuana Moment',
    url: 'https://www.marijuanamoment.net/',
    category: 'News',
    description: 'Leading news source for cannabis policy and business.'
  },
  {
    title: 'BillTrack50 Search',
    url: 'https://www.billtrack50.com/account/search/bill',
    category: 'Research',
    description: 'Advanced legislative tracking and search tool.'
  }
];
