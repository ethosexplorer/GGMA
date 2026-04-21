/**
 * Metrc Connector (Production Grade)
 * Implements the technical handshake for the Metrc REST API v2.
 */

export interface MetrcConfig {
  integratorApiKey: string;
  userApiKey: string;
  licenseNumber: string;
  environment: 'sandbox' | 'production';
}

export class MetrcConnector {
  private baseUrl: string;
  private authHeader: string;

  constructor(private config: MetrcConfig) {
    this.baseUrl = config.environment === 'production' 
      ? 'https://api-ok.metrc.com' 
      : 'https://sandbox-api-ok.metrc.com';
    
    // Standard Auth: Basic [Base64(integrator_api_key:user_api_key)]
    // Connect Auth: x-metrc-key (for sandbox setup)
    const credentials = btoa(`${config.integratorApiKey}:${config.userApiKey}`);
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Performs the initial sandbox provisioning to generate a User API Key.
   * This is required if you are not pairing with a licensee.
   */
  async setupSandbox() {
    const url = `${this.baseUrl}/sandbox/v2/integrator/setup`;
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
      throw new Error(`Sandbox Setup Failed (${response.status}): ${JSON.stringify(errorData)}`);
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

    return response.json();
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
    return this.request('/facilities/v1');
  }
}
