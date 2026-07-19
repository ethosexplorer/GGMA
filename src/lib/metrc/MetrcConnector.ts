/**
 * Metrc Connector (Production Grade)
 * Implements the technical handshake for the Metrc REST API v2.
 */

export interface MetrcConfig {
  integratorApiKey: string;
  userApiKey: string;
  licenseNumber: string;
  environment: 'production' | 'sandbox';
}

export class MetrcConnector {
  private baseUrl: string;
  private authHeader: string;

  private config: MetrcConfig;

  constructor(config: MetrcConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api-ok.metrc.com' 
      : 'https://api-ok.metrc.com';
    
    // Standard Auth: Basic [Base64(integrator_api_key:user_api_key)]
    // Connect Auth: x-metrc-key (for setup)
    const credentials = btoa(`${config.integratorApiKey}:${config.userApiKey}`);
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Performs the initial provisioning to generate a User API Key.
   */
  async setupProduction() {
    const url = `${this.baseUrl}/production/v2/integrator/setup`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-metrc-key': this.config.integratorApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Production Setup Failed (${response.status}): ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  /**
   * Encodes a timestamp for use in a query string, specifically handling the '+' sign
   * as required by Metrc documentation.
   */
  private encodeTimestamp(timestamp: string): string {
    return encodeURIComponent(timestamp).replace(/\+/g, '%2B');
  }

  /**
   * Universal fetch wrapper for Metrc API
   */
  private async request(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) {
    const separator = path.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${path}${separator}licenseNumber=${this.config.licenseNumber}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Metrc API Error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  }

  // --- Plants ---
  async getActivePlants() {
    return this.request('/plants/v2/active');
  }

  async createPlantBatches(batches: any[]) {
    return this.request('/plants/v2/createplantbatches', 'POST', batches);
  }

  async movePlants(movements: any[]) {
    return this.request('/plants/v2/moveplants', 'POST', movements);
  }

  // --- Packages ---
  async getActivePackages() {
    return this.request('/packages/v2/active');
  }

  async createPackages(packages: any[]) {
    return this.request('/packages/v2/create', 'POST', packages);
  }

  // --- Sales ---
  async postReceipts(receipts: any[]) {
    return this.request('/sales/v2/receipts', 'POST', receipts);
  }

  // --- General ---
  async getFacilities() {
    return this.request('/facilities/v2');
  }

  async getFacilitiesV2() {
    return this.request('/facilities/v2');
  }

  // --- Setup ---
  async createStrains(strains: any[]) {
    return this.request('/strains/v1/create', 'POST', strains);
  }

  async createLocations(locations: any[]) {
    return this.request('/locations/v1/create', 'POST', locations);
  }

  async createItems(items: any[]) {
    return this.request('/items/v1/create', 'POST', items);
  }

  // --- Waste ---
  async recordPlantWaste(wasteData: any[]) {
    return this.request('/plants/v2/recordwaste', 'POST', wasteData);
  }

  async getWasteReasons() {
    return this.request('/plants/v2/waste/reasons');
  }

  // --- Lab Tests (v2) ---
  /** Get lab test results for a specific package */
  async getLabTestResults(packageId: number) {
    return this.request(`/labtests/v2/results?packageId=${packageId}`);
  }

  /** Get all possible lab testing states (TestPassed, TestFailed, etc.) */
  async getLabTestStates() {
    return this.request('/labtests/v2/states');
  }

  /** Get all available lab test types */
  async getLabTestTypes() {
    return this.request('/labtests/v2/types');
  }

  /** Get lab test batches */
  async getLabTestBatches() {
    return this.request('/labtests/v2/batches');
  }

  // --- Packages (for recall detection) ---
  /** Get all active packages — check for administrative recall flags */
  async getActivePackagesForRecalls() {
    const packages = await this.request('/packages/v2/active');
    // Filter for packages that are under recall/administrative hold
    return packages.filter ? packages.filter((pkg: any) =>
      pkg.IsOnAdministrativeHold || pkg.IsRecalled || 
      (pkg.LabTestingState && pkg.LabTestingState.toLowerCase().includes('fail'))
    ) : [];
  }

  /** Get packages on hold (potential recalls) */
  async getOnHoldPackages() {
    return this.request('/packages/v2/onhold');
  }

  /** 
   * Calculate facility pass rate from lab test data
   * Returns { passed: number, failed: number, total: number, rate: number }
   */
  async calculateFacilityPassRate(): Promise<{ passed: number; failed: number; total: number; rate: number }> {
    try {
      const packages = await this.getActivePackages();
      let passed = 0, failed = 0;
      for (const pkg of (packages || [])) {
        if (pkg.LabTestingState === 'TestPassed') passed++;
        else if (pkg.LabTestingState === 'TestFailed') failed++;
      }
      const total = passed + failed;
      return { passed, failed, total, rate: total > 0 ? Math.round((passed / total) * 1000) / 10 : 0 };
    } catch {
      return { passed: 0, failed: 0, total: 0, rate: 0 };
    }
  }
}

