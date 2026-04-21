export interface StateRules {
  jurisdiction: string;
  taxRate: number;
  maxPatientPurchaseGrams: number;
  reportFormat: 'JSON' | 'CSV' | 'XML';
  tagFormat: RegExp;
  requiresWetWeight: boolean;
}

export const STATE_CONFIGS: Record<string, StateRules> = {
  OKLAHOMA: {
    jurisdiction: 'OK-OMMA',
    taxRate: 0.07, // 7% excise
    maxPatientPurchaseGrams: 84.0, // 3 ounces
    reportFormat: 'JSON',
    tagFormat: /^1A4FF01[0-9A-Z]{17}$/,
    requiresWetWeight: true
  },
  CALIFORNIA: {
    jurisdiction: 'CA-DCC',
    taxRate: 0.15, // 15% excise
    maxPatientPurchaseGrams: 28.5, // 1 ounce
    reportFormat: 'JSON',
    tagFormat: /^1A40603[0-9A-Z]{17}$/,
    requiresWetWeight: true
  },
  NEW_YORK: {
    jurisdiction: 'NY-OCM',
    taxRate: 0.13, // 9% state + 4% local
    maxPatientPurchaseGrams: 85.0,
    reportFormat: 'CSV',
    tagFormat: /^1A4NY01[0-9A-Z]{17}$/,
    requiresWetWeight: false
  }
};

export class MultiStateAdapter {
  /**
   * Retrieves the rules for a specific jurisdiction.
   */
  static getRules(state: string): StateRules {
    const key = state.toUpperCase().replace(/\s/g, '_');
    return STATE_CONFIGS[key] || STATE_CONFIGS['OKLAHOMA'];
  }

  /**
   * Validates a Metrc tag against state-specific formatting rules.
   */
  static validateTag(tag: string, state: string): boolean {
    const rules = this.getRules(state);
    return rules.tagFormat.test(tag);
  }

  /**
   * Calculates jurisdiction-specific taxes for a transaction.
   */
  static calculateTax(subtotal: number, state: string): number {
    const rules = this.getRules(state);
    return subtotal * rules.taxRate;
  }
}
