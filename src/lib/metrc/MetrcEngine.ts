import { turso } from '../turso';

export type PlantPhase = 'IMMATURE' | 'VEGETATIVE' | 'FLOWERING' | 'HARVESTED';

const VALID_TRANSITIONS: Record<PlantPhase, PlantPhase[]> = {
  IMMATURE: ['VEGETATIVE'],
  VEGETATIVE: ['FLOWERING'],
  FLOWERING: ['HARVESTED'],
  HARVESTED: []
};

export class MetrcEngine {
  /**
   * Updates a plant's growth phase following Metrc state machine rules.
   */
  static async updatePlantPhase(plantId: string, newPhase: PlantPhase, userId: string) {
    const { rows } = await turso.execute({
      sql: 'SELECT phase FROM plants WHERE id = ?',
      args: [plantId]
    });

    if (rows.length === 0) throw new Error('Plant not found');

    const currentPhase = rows[0].phase as PlantPhase;

    if (!VALID_TRANSITIONS[currentPhase].includes(newPhase)) {
      throw new Error(`Invalid transition from ${currentPhase} to ${newPhase}`);
    }

    await turso.execute({
      sql: 'UPDATE plants SET phase = ? WHERE id = ?',
      args: [newPhase, plantId]
    });

    // Record in Audit Log
    await turso.execute({
      sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
      args: [
        crypto.randomUUID(),
        'PLANT_PHASE_CHANGE',
        userId,
        JSON.stringify({ plantId, from: currentPhase, to: newPhase })
      ]
    });

    return { success: true };
  }

  /**
   * Promotes immature batches to vegetative with tag assignment.
   */
  static async promoteToVegetative(batchId: string, tagList: string[], userId: string) {
    const { rows } = await turso.execute({
      sql: 'SELECT id FROM plants WHERE batch_id = ? AND phase = "IMMATURE"',
      args: [batchId]
    });

    if (rows.length !== tagList.length) {
      throw new Error('Tag count must match plant count in batch');
    }

    for (let i = 0; i < rows.length; i++) {
      await turso.execute({
        sql: 'UPDATE plants SET tag_id = ?, phase = "VEGETATIVE" WHERE id = ?',
        args: [tagList[i], rows[i].id]
      });
    }

    await turso.execute({
      sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
      args: [
        crypto.randomUUID(),
        'PROMOTE_TO_VEG',
        userId,
        JSON.stringify({ batchId, tags: tagList })
      ]
    });
  }

  /**
   * Creates a harvest from flowering plants.
   */
  static async createHarvest(plantIds: string[], wetWeight: number, userId: string) {
    // 1. Validate all plants are flowering
    for (const id of plantIds) {
      const { rows } = await turso.execute({
        sql: 'SELECT phase FROM plants WHERE id = ?',
        args: [id]
      });
      if (rows[0]?.phase !== 'FLOWERING') {
        throw new Error(`Plant ${id} is not in FLOWERING phase`);
      }
    }

    // 2. Create Harvest record
    const harvestId = crypto.randomUUID();
    await turso.execute({
      sql: 'INSERT INTO harvests (id, plant_id, weight) VALUES (?, ?, ?)',
      args: [harvestId, plantIds[0], wetWeight] // Simplified: linked to first plant
    });

    // 3. Mark plants as harvested
    for (const id of plantIds) {
      await turso.execute({
        sql: 'UPDATE plants SET phase = "HARVESTED" WHERE id = ?',
        args: [id]
      });
    }

    await turso.execute({
      sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
      args: [
        crypto.randomUUID(),
        'HARVEST_CREATED',
        userId,
        JSON.stringify({ harvestId, plantIds, wetWeight })
      ]
    });

    return harvestId;
  }

  /**
   * Creates inventory packages from a harvest.
   */
  static async createPackage(harvestId: string, splits: { tagId: string, weight: number }[], facilityId: string, userId: string) {
    const { rows } = await turso.execute({
      sql: 'SELECT weight FROM harvests WHERE id = ?',
      args: [harvestId]
    });

    const totalSplitWeight = splits.reduce((sum, s) => sum + s.weight, 0);
    if (totalSplitWeight > Number(rows[0].weight)) {
      throw new Error('Total package weight exceeds harvest weight');
    }

    for (const split of splits) {
      await turso.execute({
        sql: 'INSERT INTO packages (id, source_type, source_id, tag_id, weight, status, facility_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [
          crypto.randomUUID(),
          'harvest',
          harvestId,
          split.tagId,
          split.weight,
          'ACTIVE',
          facilityId
        ]
      });
    }

    await turso.execute({
      sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
      args: [
        crypto.randomUUID(),
        'PACKAGE_CREATED',
        userId,
        JSON.stringify({ harvestId, splits })
      ]
    });
  }
}
