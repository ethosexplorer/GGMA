import { turso } from './src/lib/turso.js';

async function check() {
  try {
    const res = await turso.execute('SELECT * FROM patients WHERE first_name LIKE "%Jasmin%" OR last_name LIKE "%Jasmin%" OR name LIKE "%Jasmin%"');
    console.log("Patients:", res.rows);
  } catch (e) {
    console.error(e);
  }
}
check();
