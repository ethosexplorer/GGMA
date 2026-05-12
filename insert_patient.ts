import { turso } from './src/lib/turso';

async function main() {
  try {
    const res = await turso.execute("INSERT INTO patients (name, email, medical_condition, status, state) VALUES ('Jasmin Garrett', 'jasmingarrett.jg@gmail.com', 'Medicaid', 'Pending', 'Oklahoma')");
    console.log("Patient Inserted!");
  } catch (err) {
    console.error(err);
  }
}

main();
