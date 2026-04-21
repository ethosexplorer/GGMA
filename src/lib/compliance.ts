import { turso } from './turso';
import { v4 as uuidv4 } from 'uuid';

/**
 * Care OS Compliance Engine
 * Handles seed-to-sale lifecycle tracking and Metrc-level integrity.
 */

export const complianceService = {
  // --- Plant Management ---

  /**
   * Create a new plant batch (Immature phase)
   */
  async createPlantBatch(strain: string, count: number, facilityId: string) {
    const id = `pb-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO plant_batches (id, strain, count, status, facility_id) VALUES (?, ?, ?, 'IMMATURE', ?)`,
      args: [id, strain, count, facilityId]
    });
    
    await this.logAudit('CREATE_PLANT_BATCH', 'system', { id, strain, count, facilityId });
    return id;
  },

  /**
   * Move batch to Vegetative and assign individual RFID tags
   */
  async assignTags(batchId: string, tagStart: string, count: number, facilityId: string) {
    const plants = [];
    for (let i = 0; i < count; i++) {
      const tagId = this.incrementTag(tagStart, i);
      const id = uuidv4();
      plants.push({ id, batchId, tagId, phase: 'VEGETATIVE', facilityId });
    }

    // Batch insert plants
    for (const p of plants) {
      await turso.execute({
        sql: `INSERT INTO plants (id, batch_id, tag_id, phase, facility_id) VALUES (?, ?, ?, ?, ?)`,
        args: [p.id, p.batchId, p.tagId, p.phase, p.facilityId]
      });
    }

    await turso.execute({
      sql: `UPDATE plant_batches SET status = 'VEGETATIVE' WHERE id = ?`,
      args: [batchId]
    });

    await this.logAudit('ASSIGN_TAGS', 'system', { batchId, count, tagStart });
    return plants;
  },

  // --- Inventory & Packaging ---

  /**
   * Create a package (Inventory unit) from a source (Plant or Harvest)
   */
  async createPackage(sourceType: 'plant' | 'harvest' | 'package', sourceId: string, tagId: string, weight: number, facilityId: string) {
    const id = `pkg-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO packages (id, source_type, source_id, tag_id, weight, status, facility_id) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)`,
      args: [id, sourceType, sourceId, tagId, weight, facilityId]
    });

    await this.logAudit('CREATE_PACKAGE', 'system', { id, sourceType, sourceId, tagId, weight });
    return id;
  },

  /**
   * Split a package into smaller units
   */
  async splitPackage(packageId: string, splits: { tagId: string, weight: number }[], facilityId: string) {
    const newPackages = [];
    for (const split of splits) {
      const id = await this.createPackage('package', packageId, split.tagId, split.weight, facilityId);
      newPackages.push(id);
    }

    await turso.execute({
      sql: `UPDATE packages SET status = 'SPLIT' WHERE id = ?`,
      args: [packageId]
    });

    await this.logAudit('SPLIT_PACKAGE', 'system', { packageId, newPackages });
    return newPackages;
  },

  // --- Transfers ---

  /**
   * Initiate a B2B transfer
   */
  async createTransfer(fromFacility: string, toFacility: string, packageIds: string[]) {
    const transferId = `tr-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO transfers (id, from_facility, to_facility, status) VALUES (?, ?, ?, 'IN_TRANSIT')`,
      args: [transferId, fromFacility, toFacility]
    });

    for (const pkgId of packageIds) {
      await turso.execute({
        sql: `INSERT INTO transfer_items (id, transfer_id, package_id) VALUES (?, ?, ?)`,
        args: [uuidv4(), transferId, pkgId]
      });
      
      // Update package status to locked
      await turso.execute({
        sql: `UPDATE packages SET status = 'IN_TRANSIT' WHERE id = ?`,
        args: [pkgId]
      });
    }

    await this.logAudit('CREATE_TRANSFER', 'system', { transferId, fromFacility, toFacility, packageIds });
    return transferId;
  },

  // --- Wallet & Financials ---

  /**
   * Debit a wallet for a transaction
   */
  async debitWallet(walletId: string, amount: number, referenceId: string) {
    const res = await turso.execute({
      sql: `SELECT balance FROM wallets WHERE id = ?`,
      args: [walletId]
    });
    
    const balance = res.rows[0]?.balance as number;
    if (balance < amount) throw new Error('Insufficient funds');

    await turso.execute({
      sql: `UPDATE wallets SET balance = balance - ? WHERE id = ?`,
      args: [amount, walletId]
    });

    await turso.execute({
      sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, 'WALLET_DEBIT', ?, ?)`,
      args: [uuidv4(), 'system', JSON.stringify({ walletId, amount, referenceId })]
    });
  },

  // --- Utilities ---

  private incrementTag(tag: string, index: number) {
    // Simple mock tag incrementer
    const base = tag.slice(0, -4);
    const num = parseInt(tag.slice(-4)) + index;
    return base + num.toString().padStart(4, '0');
  },

  private async logAudit(action: string, userId: string, data: any) {
    await turso.execute({
      sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
      args: [uuidv4(), action, userId, JSON.stringify(data)]
    });
  }
};
