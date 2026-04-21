import { turso } from './src/lib/turso.ts';

async function updateKey() {
  console.log('Updating Metrc Integrator Key...');
  try {
    await turso.execute({
      sql: 'UPDATE entities SET metrc_integrator_key = ? WHERE id = ?',
      args: ['nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v', 'ent-1']
    });
    console.log('SUCCESS: Integrator Key Updated in Database.');
  } catch (err) {
    console.error('FAILED to update database:', err.message);
  }
}

updateKey();
