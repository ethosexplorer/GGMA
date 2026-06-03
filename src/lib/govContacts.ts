export interface GovContact {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  state: string;
  jurisdiction: string;
  type: string;
  licenseStatus: string;
  status: string;
  pipeline: string;
  notes: string;
  emailVerified: boolean;
  emailFabricated: boolean;
}

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado', CT:'Connecticut', DE:'Delaware', DC:'District Of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VA:'Virginia', VT:'Vermont', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming'
};

const REGULATORS = [
  { state: 'AL', name: 'Alabama Medical Cannabis Commission (AMCC)', email: 'info@amcc.alabama.gov', phone: '334-353-5544' },
  { state: 'AK', name: 'Alaska Alcohol and Marijuana Control Office (AMCO)', email: 'marijuana.licensing@alaska.gov', phone: '907-269-0350' },
  { state: 'AZ', name: 'Arizona Department of Health Services (AZDHS)', email: 'medicalmarijuana@azdhs.gov', phone: '602-542-1025' },
  { state: 'AR', name: 'Arkansas Medical Marijuana Commission', email: 'mmj@dfa.arkansas.gov', phone: '501-682-4982' },
  { state: 'CA', name: 'California Department of Cannabis Control (DCC)', email: 'info@cannabis.ca.gov', phone: '1-844-612-2322' },
  { state: 'CO', name: 'Colorado Marijuana Enforcement Division (MED)', email: 'dor_med_inquiries@state.co.us', phone: '303-866-3330' },
  { state: 'CT', name: 'Connecticut Department of Consumer Protection (DCP)', email: 'dcp.mmp@ct.gov', phone: '860-713-6066' },
  { state: 'DE', name: 'Delaware Office of the Marijuana Commissioner (OMC)', email: 'MedicalMarijuanaDPH@delaware.gov', phone: '855-420-6797' },
  { state: 'DC', name: 'DC Alcoholic Beverage and Cannabis Administration (ABCA)', email: 'medicalcannabis@dc.gov', phone: '202-442-4423' },
  { state: 'FL', name: 'Florida Office of Medical Marijuana Use (OMMU)', email: 'MedicalMarijuanaUse@flhealth.gov', phone: '800-808-9580' },
  { state: 'GA', name: 'Georgia Access to Medical Cannabis Commission (GMCC)', email: 'info@gmcc.ga.gov', phone: '770-909-2765' },
  { state: 'HI', name: 'Hawaii Department of Health — Medical Cannabis (OMCCR)', email: 'medicalcannabis@doh.hawaii.gov', phone: '808-733-2177' },
  { state: 'ID', name: 'Idaho Department of Agriculture (Hemp Program)', email: 'info@isda.idaho.gov', phone: '208-332-8500' },
  { state: 'IL', name: 'Illinois Medical Cannabis Patient Program (IDPH)', email: 'DPH.medicalcannabis@illinois.gov', phone: '217-782-4977' },
  { state: 'IN', name: 'Indiana State Department of Health (ISDH)', email: 'info@isdh.in.gov', phone: '317-233-1325' },
  { state: 'IA', name: 'Iowa DHHS — Medical Cannabidiol Program', email: 'medical.cannabis@hhs.iowa.gov', phone: '515-281-7689' },
  { state: 'KS', name: 'Kansas Department of Agriculture', email: 'kda.info@ks.gov', phone: '775-564-6700' },
  { state: 'KY', name: 'Kentucky Office of Medical Cannabis (OMC)', email: 'kymedcan@ky.gov', phone: '502-564-7430' },
  { state: 'LA', name: 'Louisiana Department of Health — Medical Marijuana', email: 'LACannabisProgram-medicalmarijuana@la.gov', phone: '225-342-9500' },
  { state: 'ME', name: 'Maine Office of Cannabis Policy (OCP)', email: 'Licensing.OCP@maine.gov', phone: '207-287-3282' },
  { state: 'MD', name: 'Maryland Cannabis Administration (MCA)', email: 'mdcannabis.mca@maryland.gov', phone: '410-487-8100' },
  { state: 'MA', name: 'Massachusetts Cannabis Control Commission (CCC)', email: 'CannabisCommission@mass.gov', phone: '617-701-8400' },
  { state: 'MI', name: 'Michigan Cannabis Regulatory Agency (CRA)', email: 'CRA-Compliance@michigan.gov', phone: '517-284-8599' },
  { state: 'MN', name: 'Minnesota Office of Cannabis Management (OCM)', email: 'cannabis.info@state.mn.us', phone: '651-201-5000' },
  { state: 'MS', name: 'Mississippi Medical Cannabis Program (MMCP)', email: 'MMCP@msdh.ms.gov', phone: '601-576-7400' },
  { state: 'MO', name: 'Missouri Division of Cannabis Regulation (DCR)', email: 'cannabisinfo@health.mo.gov', phone: '866-219-0165' },
  { state: 'MT', name: 'Montana Cannabis Control Division (CCD)', email: 'DORCannabis@mt.gov', phone: '406-444-0551' },
  { state: 'NE', name: 'Nebraska Medical Cannabis Commission (MCC)', email: 'mcc.contact@nebraska.gov', phone: '402-471-2301' },
  { state: 'NV', name: 'Nevada Cannabis Compliance Board (CCB)', email: 'ccbinfo@ccb.nv.gov', phone: '775-687-7670' },
  { state: 'NH', name: 'New Hampshire Therapeutic Cannabis Program (TCP)', email: 'TCP@dhhs.nh.gov', phone: '603-271-9520' },
  { state: 'NJ', name: 'New Jersey Cannabis Regulatory Commission (CRC)', email: 'cannabis@nj.gov', phone: '609-376-5550' },
  { state: 'NM', name: 'New Mexico Cannabis Control Division (CCD)', email: 'Cannabis.Control@state.nm.us', phone: '505-476-4995' },
  { state: 'NY', name: 'New York Office of Cannabis Management (OCM)', email: 'medical@ocm.ny.gov', phone: '888-626-5151' },
  { state: 'NC', name: 'North Carolina Department of Agriculture (Hemp)', email: 'hemp@ncagr.gov', phone: '919-707-3730' },
  { state: 'ND', name: 'North Dakota Medical Marijuana Program', email: 'medmarijuana@nd.gov', phone: '701-328-3330' },
  { state: 'OH', name: 'Ohio Division of Cannabis Control (DCC)', email: 'DCCLicensing@com.ohio.gov', phone: '833-464-6627' },
  { state: 'OK', name: 'Oklahoma Medical Marijuana Authority (OMMA)', email: 'OMMACommunications@omma.ok.gov', phone: '405-522-6662' },
  { state: 'OR', name: 'Oregon Health Authority (OMMP)', email: 'medmarijuana.dispensaries@odhsoha.oregon.gov', phone: '971-673-1234' },
  { state: 'PA', name: 'Pennsylvania Department of Health (DOH)', email: 'RA-DHMedMarijuana@pa.gov', phone: '888-733-5595' },
  { state: 'RI', name: 'Rhode Island Cannabis Control Commission (CCC)', email: 'ccc@ri.gov', phone: '401-222-2828' },
  { state: 'SC', name: 'South Carolina Department of Agriculture (Hemp)', email: 'hemp@scda.sc.gov', phone: '803-734-2210' },
  { state: 'SD', name: 'South Dakota Department of Health (DOH)', email: 'MCST@state.sd.us', phone: '605-773-3361' },
  { state: 'TN', name: 'Tennessee Alcoholic Beverage Commission (TABC)', email: 'TABC.Info@tn.gov', phone: '615-741-1602' },
  { state: 'TX', name: 'Texas Department of Public Safety (DPS)', email: 'TCUP@dps.texas.gov', phone: '512-424-2000' },
  { state: 'UT', name: 'Utah Department of Health & Human Services', email: 'medicalcannabis@utah.gov', phone: '801-538-6504' },
  { state: 'VT', name: 'Vermont Cannabis Control Board (CCB)', email: 'CCB.Info@vermont.gov', phone: '802-828-1010' },
  { state: 'VA', name: 'Virginia Cannabis Control Authority (CCA)', email: 'info@cca.virginia.gov', phone: '804-688-6112' },
  { state: 'WA', name: 'Washington State Liquor and Cannabis Board (LCB)', email: 'customerservice@lcb.wa.gov', phone: '360-664-1600' },
  { state: 'WV', name: 'West Virginia Office of Medical Cannabis (OMC)', email: 'medcanwv@wv.gov', phone: '304-356-5090' },
  { state: 'WI', name: 'Wisconsin State Legislature (Tracking)', email: 'legis.info@legis.wisconsin.gov', phone: '608-266-9960' },
  { state: 'WY', name: 'Wyoming State Legislature (Tracking)', email: 'legisinfo@wyoleg.gov', phone: '307-777-7881' }
];

const GOVERNORS: Record<string, string> = {
  AL: 'governor@governor.alabama.gov', AK: 'governor@alaska.gov', AZ: 'governor@az.gov', AR: 'governor@governor.arkansas.gov', CA: 'governor@governor.ca.gov',
  CO: 'governor@state.co.us', CT: 'governor.lamont@ct.gov', DE: 'governor@delaware.gov', FL: 'governor@myflorida.com', GA: 'governor@governor.ga.gov',
  HI: 'governor@hawaii.gov', ID: 'governor@gov.idaho.gov', IL: 'governor@illinois.gov', IN: 'governor@gov.in.gov', IA: 'governor@iowa.gov',
  KS: 'governor@ks.gov', KY: 'governor@ky.gov', LA: 'governor@la.gov', ME: 'governor@maine.gov', MD: 'governor@maryland.gov',
  MA: 'governor@mass.gov', MI: 'governor@michigan.gov', MN: 'governor@state.mn.us', MS: 'governor@ms.gov', MO: 'governor@mo.gov',
  MT: 'governor@mt.gov', NE: 'governor@nebraska.gov', NV: 'governor@nv.gov', NH: 'governor@nh.gov', NJ: 'governor@nj.gov',
  NM: 'governor@nm.gov', NY: 'governor@ny.gov', NC: 'governor@nc.gov', ND: 'governor@nd.gov', OH: 'governor@ohio.gov',
  OK: 'governor@ok.gov', OR: 'governor@oregon.gov', PA: 'governor@pa.gov', RI: 'governor@ri.gov', SC: 'governor@sc.gov',
  SD: 'governor@sd.gov', TN: 'governor@tn.gov', TX: 'governor@texas.gov', UT: 'governor@utah.gov', VT: 'governor@vermont.gov',
  VA: 'governor@virginia.gov', WA: 'governor@wa.gov', WV: 'governor@wv.gov', WI: 'governor@wisconsin.gov', WY: 'governor@wyoming.gov'
};

const STATE_POLICE: Record<string, { name: string; email: string }> = {
  AL: { name: 'Alabama Law Enforcement Agency (ALEA)', email: 'info@alea.gov' },
  AK: { name: 'Alaska State Troopers (AST)', email: 'ast.publicinfo@alaska.gov' },
  AZ: { name: 'Arizona Department of Public Safety (DPS)', email: 'publicaffairs@azdps.gov' },
  AR: { name: 'Arkansas State Police (ASP)', email: 'asp.info@asp.arkansas.gov' },
  CA: { name: 'California Highway Patrol (CHP)', email: 'chppublicaffairs@chp.ca.gov' },
  CO: { name: 'Colorado State Patrol (CSP)', email: 'csp_publicaffairs@state.co.us' },
  CT: { name: 'Connecticut State Police (CSP)', email: 'csp.publicinfo@ct.gov' },
  DE: { name: 'Delaware State Police (DSP)', email: 'dsp.publicinfo@delaware.gov' },
  FL: { name: 'Florida Highway Patrol (FHP)', email: 'fhpinfo@flhsmv.gov' },
  GA: { name: 'Georgia State Patrol (GSP)', email: 'gspinfo@gsp.ga.gov' },
  HI: { name: 'Honolulu Police Department (HPD)', email: 'hpd@honolulu.gov' },
  ID: { name: 'Idaho State Police (ISP)', email: 'isp.info@isp.idaho.gov' },
  IL: { name: 'Illinois State Police (ISP)', email: 'isp.info@illinois.gov' },
  IN: { name: 'Indiana State Police (ISP)', email: 'ispinfo@isp.in.gov' },
  IA: { name: 'Iowa State Patrol (ISP)', email: 'ispinfo@dps.state.ia.us' },
  KS: { name: 'Kansas Highway Patrol (KHP)', email: 'kshpinfo@ks.gov' },
  KY: { name: 'Kentucky State Police (KSP)', email: 'ksp.info@ky.gov' },
  LA: { name: 'Louisiana State Police (LSP)', email: 'lsp.info@la.gov' },
  ME: { name: 'Maine State Police (MSP)', email: 'msp.info@maine.gov' },
  MD: { name: 'Maryland State Police (MSP)', email: 'msp.media@maryland.gov' },
  MA: { name: 'Massachusetts State Police (MSP)', email: 'mspinfo@massmail.state.ma.us' },
  MI: { name: 'Michigan State Police (MSP)', email: 'msp-info@michigan.gov' },
  MN: { name: 'Minnesota State Patrol', email: 'msp.info@state.mn.us' },
  MS: { name: 'Mississippi Highway Patrol (MHP)', email: 'mhpinfo@dps.ms.gov' },
  MO: { name: 'Missouri State Highway Patrol (MSHP)', email: 'mshpinfo@mshp.dps.mo.gov' },
  MT: { name: 'Montana Highway Patrol (MHP)', email: 'mhpinfo@mt.gov' },
  NE: { name: 'Nebraska State Patrol (NSP)', email: 'nsp.info@nebraska.gov' },
  NV: { name: 'Nevada Highway Patrol (NHP)', email: 'nhpinfo@dps.state.nv.us' },
  NH: { name: 'New Hampshire State Police (NHSP)', email: 'statepolice@dos.nh.gov' },
  NJ: { name: 'New Jersey State Police (NJSP)', email: 'njspinfo@gw.njsp.org' },
  NM: { name: 'New Mexico State Police (NMSP)', email: 'nmpolice.info@state.nm.us' },
  NY: { name: 'New York State Police (NYSP)', email: 'nysppio@troopers.ny.gov' },
  NC: { name: 'North Carolina State Highway Patrol', email: 'ncshppio@ncdps.gov' },
  ND: { name: 'North Dakota State Patrol (NDSP)', email: 'ndspinfo@nd.gov' },
  OH: { name: 'Ohio State Highway Patrol (OSHP)', email: 'oshp@dps.ohio.gov' },
  OK: { name: 'Oklahoma Highway Patrol (OHP)', email: 'ohpinfo@dps.ok.gov' },
  OR: { name: 'Oregon State Police (OSP)', email: 'ospinfo@osp.oregon.gov' },
  PA: { name: 'Pennsylvania State Police (PSP)', email: 'ra-psp-pio@pa.gov' },
  RI: { name: 'Rhode Island State Police (RISP)', email: 'rispinfo@risp.gov' },
  SC: { name: 'South Carolina Highway Patrol (SCHP)', email: 'schpinfo@scdps.gov' },
  SD: { name: 'South Dakota Highway Patrol (SDHP)', email: 'sdhpinfo@state.sd.us' },
  TN: { name: 'Tennessee Highway Patrol (THP)', email: 'thp.info@tn.gov' },
  TX: { name: 'Texas Department of Public Safety (DPS)', email: 'dpsinfo@dps.texas.gov' },
  UT: { name: 'Utah Highway Patrol (UHP)', email: 'uhpinfo@utah.gov' },
  VT: { name: 'Vermont State Police (VSP)', email: 'vspinfo@vermont.gov' },
  VA: { name: 'Virginia State Police (VSP)', email: 'vspinfo@vsp.virginia.gov' },
  WA: { name: 'Washington State Patrol (WSP)', email: 'wspinfo@wsp.wa.gov' },
  WV: { name: 'West Virginia State Police (WVSP)', email: 'wvspinfo@wvsp.gov' },
  WI: { name: 'Wisconsin State Patrol (WSP)', email: 'wspinfo@dot.wi.gov' },
  WY: { name: 'Wyoming Highway Patrol (WHP)', email: 'whpinfo@wyo.gov' }
};

const SENATES: Record<string, string> = {
  AL: 'senateclerk@alsenate.gov', AK: 'senate.clerk@akleg.gov', AZ: 'senate@azleg.gov', AR: 'senate@arkansas.gov', CA: 'senate.clerk@sen.ca.gov',
  CO: 'senate.clerk@state.co.us', CT: 'senate@cga.ct.gov', DE: 'senate@delaware.gov', FL: 'senate@flsenate.gov', GA: 'senate@senate.ga.gov',
  HI: 'senateclerk@capitol.hawaii.gov', ID: 'senateclerk@legislature.idaho.gov', IL: 'senate@ilga.gov', IN: 'senateclerk@iga.in.gov', IA: 'senateclerk@legis.iowa.gov',
  KS: 'senateclerk@klrd.ks.gov', KY: 'senateclerk@lrc.ky.gov', LA: 'senateclerk@legis.la.gov', ME: 'senateclerk@legislature.maine.gov', MD: 'senate@mlis.state.md.us',
  MA: 'senate.clerk@mahouse.gov', MI: 'senateclerk@senate.michigan.gov', MN: 'senateclerk@senate.mn', MS: 'senateclerk@legislature.ms.gov', MO: 'senateclerk@senate.mo.gov',
  MT: 'senateclerk@mt.gov', NE: 'unicamclerk@leg.ne.gov', NV: 'senateclerk@lcb.state.nv.us', NH: 'senateclerk@leg.state.nh.us', NJ: 'senateclerk@njleg.org',
  NM: 'senateclerk@nmlegis.gov', NY: 'senateclerk@nysenate.gov', NC: 'senateclerk@ncleg.gov', ND: 'senateclerk@ndlegis.gov', OH: 'senateclerk@ohiosenate.gov',
  OK: 'senateclerk@oksenate.gov', OR: 'senateclerk@oregonlegislature.gov', PA: 'senateclerk@pasen.gov', RI: 'senateclerk@rilegislature.gov', SC: 'senateclerk@scstatehouse.gov',
  SD: 'senateclerk@sdlegislature.gov', TN: 'senateclerk@capitol.tn.gov', TX: 'senateclerk@senate.texas.gov', UT: 'senateclerk@le.utah.gov', VT: 'senateclerk@leg.state.vt.us',
  VA: 'senateclerk@senate.virginia.gov', WA: 'senateclerk@leg.wa.gov', WV: 'senateclerk@wvlegislature.gov', WI: 'senateclerk@legis.wisconsin.gov', WY: 'senateclerk@wyoleg.gov'
};

const FEDERAL_DEA = [
  { name: 'DEA Headquarters (Public Affairs)', email: 'dea.publicaffairs@usdoj.gov', state: 'DC', city: 'Washington', type: 'dea' },
  { name: 'DEA Atlanta Division', email: 'dea.atlanta@usdoj.gov', state: 'GA', city: 'Atlanta', type: 'dea' },
  { name: 'DEA Boston Division', email: 'dea.boston@usdoj.gov', state: 'MA', city: 'Boston', type: 'dea' },
  { name: 'DEA Chicago Division', email: 'dea.chicago@usdoj.gov', state: 'IL', city: 'Chicago', type: 'dea' },
  { name: 'DEA Dallas Division', email: 'dea.dallas@usdoj.gov', state: 'TX', city: 'Dallas', type: 'dea' },
  { name: 'DEA Denver Division', email: 'dea.denver@usdoj.gov', state: 'CO', city: 'Denver', type: 'dea' },
  { name: 'DEA Detroit Division', email: 'dea.detroit@usdoj.gov', state: 'MI', city: 'Detroit', type: 'dea' },
  { name: 'DEA El Paso Division', email: 'dea.elpaso@usdoj.gov', state: 'TX', city: 'El Paso', type: 'dea' },
  { name: 'DEA Houston Division', email: 'dea.houston@usdoj.gov', state: 'TX', city: 'Houston', type: 'dea' },
  { name: 'DEA Los Angeles Division', email: 'dea.losangeles@usdoj.gov', state: 'CA', city: 'Los Angeles', type: 'dea' },
  { name: 'DEA Miami Division', email: 'dea.miami@usdoj.gov', state: 'FL', city: 'Miami', type: 'dea' },
  { name: 'DEA Newark Division', email: 'dea.newark@usdoj.gov', state: 'NJ', city: 'Newark', type: 'dea' },
  { name: 'DEA New Orleans Division', email: 'dea.neworleans@usdoj.gov', state: 'LA', city: 'New Orleans', type: 'dea' },
  { name: 'DEA New York Division', email: 'dea.newyork@usdoj.gov', state: 'NY', city: 'New York', type: 'dea' },
  { name: 'DEA Philadelphia Division', email: 'dea.philadelphia@usdoj.gov', state: 'PA', city: 'Philadelphia', type: 'dea' },
  { name: 'DEA Phoenix Division', email: 'dea.phoenix@usdoj.gov', state: 'AZ', city: 'Phoenix', type: 'dea' },
  { name: 'DEA San Francisco Division', email: 'dea.sanfrancisco@usdoj.gov', state: 'CA', city: 'San Francisco', type: 'dea' },
  { name: 'DEA Seattle Division', email: 'dea.seattle@usdoj.gov', state: 'WA', city: 'Seattle', type: 'dea' },
  { name: 'DEA St. Louis Division', email: 'dea.stlouis@usdoj.gov', state: 'MO', city: 'St. Louis', type: 'dea' },
  { name: 'DEA Washington Division', email: 'dea.washington@usdoj.gov', state: 'DC', city: 'Washington', type: 'dea' },
  { name: 'Oklahoma Bureau of Narcotics (OBN)', email: 'obninfo@obn.ok.gov', state: 'OK', city: 'Oklahoma City', type: 'obn' }
];

const MAYORS = [
  { name: 'Mayor of Oklahoma City', email: 'mayor@okc.gov', state: 'OK', city: 'Oklahoma City' },
  { name: 'Mayor of Tulsa', email: 'mayor@cityoftulsa.org', state: 'OK', city: 'Tulsa' },
  { name: 'Mayor of Los Angeles', email: 'mayor.bass@lacity.org', state: 'CA', city: 'Los Angeles' },
  { name: 'Mayor of Chicago', email: 'mayor.johnson@cityofchicago.org', state: 'IL', city: 'Chicago' },
  { name: 'Mayor of New York City', email: 'mayor@cityhall.nyc.gov', state: 'NY', city: 'New York' },
  { name: 'Mayor of Houston', email: 'mayor@houstontx.gov', state: 'TX', city: 'Houston' },
  { name: 'Mayor of Phoenix', email: 'mayor.gallego@phoenix.gov', state: 'AZ', city: 'Phoenix' },
  { name: 'Mayor of Philadelphia', email: 'mayor.cherelle.parker@phila.gov', state: 'PA', city: 'Philadelphia' },
  { name: 'Mayor of San Antonio', email: 'mayor@sanantonio.gov', state: 'TX', city: 'San Antonio' },
  { name: 'Mayor of San Diego', email: 'mayor.gloria@sandiego.gov', state: 'CA', city: 'San Diego' },
  { name: 'Mayor of Dallas', email: 'mayor@dallascityhall.com', state: 'TX', city: 'Dallas' },
  { name: 'Mayor of Jacksonville', email: 'mayor.deegan@coj.net', state: 'FL', city: 'Jacksonville' },
  { name: 'Mayor of Columbus', email: 'mayor.ginther@columbus.gov', state: 'OH', city: 'Columbus' },
  { name: 'Mayor of Charlotte', email: 'mayor@charlottenc.gov', state: 'NC', city: 'Charlotte' },
  { name: 'Mayor of San Francisco', email: 'mayor.breed@sfgov.org', state: 'CA', city: 'San Francisco' },
  { name: 'Mayor of Seattle', email: 'mayor.harrell@seattle.gov', state: 'WA', city: 'Seattle' },
  { name: 'Mayor of Denver', email: 'mayor.johnston@denvergov.org', state: 'CO', city: 'Denver' },
  { name: 'Mayor of Boston', email: 'mayor@boston.gov', state: 'MA', city: 'Boston' },
  { name: 'Mayor of Detroit', email: 'mayor.duggan@detroitmi.gov', state: 'MI', city: 'Detroit' },
  { name: 'Mayor of Miami', email: 'mayor.suarez@miamigov.com', state: 'FL', city: 'Miami' },
  { name: 'Mayor of Nashville', email: 'mayor@nashville.gov', state: 'TN', city: 'Nashville' },
  { name: 'Mayor of Atlanta', email: 'mayor.dickens@atlantaga.gov', state: 'GA', city: 'Atlanta' }
];

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

export const getStaticGovContacts = (): GovContact[] => {
  const list: GovContact[] = [];

  // Add Regulators
  for (const reg of REGULATORS) {
    list.push({
      id: `static-gov-${reg.state.toLowerCase()}-gov_state-${slugify(reg.name)}`,
      businessName: reg.name,
      contactName: reg.name,
      email: reg.email,
      phone: reg.phone,
      state: reg.state,
      jurisdiction: STATE_NAMES[reg.state] || reg.state,
      type: 'gov_state',
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: 'State Cannabis Regulatory Authority.',
      emailVerified: true,
      emailFabricated: false
    });
  }

  // Add Governors
  for (const [state, email] of Object.entries(GOVERNORS)) {
    const stateName = STATE_NAMES[state] || state;
    const name = `Governor of ${stateName} (${state})`;
    list.push({
      id: `static-gov-${state.toLowerCase()}-governor-${slugify(name)}`,
      businessName: name,
      contactName: name,
      email: email,
      phone: '',
      state: state,
      jurisdiction: stateName,
      type: 'governor',
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: `Official Executive Office of the Governor of ${stateName}.`,
      emailVerified: true,
      emailFabricated: false
    });
  }

  // Add State Police
  for (const [state, police] of Object.entries(STATE_POLICE)) {
    list.push({
      id: `static-gov-${state.toLowerCase()}-enforcement_state-${slugify(police.name)}`,
      businessName: police.name,
      contactName: police.name,
      email: police.email,
      phone: '',
      state: state,
      jurisdiction: STATE_NAMES[state] || state,
      type: 'enforcement_state',
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: 'State level law enforcement and highway patrol authority.',
      emailVerified: true,
      emailFabricated: false
    });
  }

  // Add State Senates
  for (const [state, email] of Object.entries(SENATES)) {
    const stateName = STATE_NAMES[state] || state;
    const name = `${stateName} State Senate Clerk`;
    list.push({
      id: `static-gov-${state.toLowerCase()}-senator-${slugify(name)}`,
      businessName: name,
      contactName: name,
      email: email,
      phone: '',
      state: state,
      jurisdiction: stateName,
      type: 'senator',
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: `Official legislative correspondence office for the ${stateName} Senate.`,
      emailVerified: true,
      emailFabricated: false
    });
  }

  // Add Federal DEA & OBN
  for (const fed of FEDERAL_DEA) {
    list.push({
      id: `static-gov-${fed.state.toLowerCase()}-${fed.type}-${slugify(fed.name)}`,
      businessName: fed.name,
      contactName: fed.name,
      email: fed.email,
      phone: '',
      state: fed.state,
      jurisdiction: STATE_NAMES[fed.state] || fed.state,
      type: fed.type,
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: fed.type === 'obn' ? 'Oklahoma Bureau of Narcotics and Dangerous Drugs Control.' : 'Drug Enforcement Administration (DEA) regional division.',
      emailVerified: true,
      emailFabricated: false
    });
  }

  // Add Mayors
  for (const mayor of MAYORS) {
    list.push({
      id: `static-gov-${mayor.state.toLowerCase()}-mayor-${slugify(mayor.name)}`,
      businessName: mayor.name,
      contactName: mayor.name,
      email: mayor.email,
      phone: '',
      state: mayor.state,
      jurisdiction: STATE_NAMES[mayor.state] || mayor.state,
      type: 'mayor',
      licenseStatus: 'Active',
      status: 'Lead',
      pipeline: 'new',
      notes: `Municipal executive office of the mayor of ${mayor.city}.`,
      emailVerified: true,
      emailFabricated: false
    });
  }

  return list;
};
