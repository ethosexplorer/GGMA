import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log("Account SID:", accountSid);
console.log("Auth Token present:", !!authToken);

if (!accountSid || !authToken) {
  console.error("Missing Twilio credentials in environment");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function checkTwilio() {
  try {
    // 1. Fetch incoming phone numbers
    console.log("\n=== TWILIO INCOMING NUMBERS ===");
    const incomingNumbers = await client.incomingPhoneNumbers.list({ limit: 10 });
    for (const num of incomingNumbers) {
      console.log(`Phone Number: ${num.phoneNumber} | Friendly Name: ${num.friendlyName} | SID: ${num.sid}`);
      console.log(` Voice URL: ${num.voiceUrl} | Voice Method: ${num.voiceMethod}`);
    }

    // 2. Fetch TwiML App details
    console.log("\n=== TWIML APP DETAILS ===");
    const appSid = process.env.TWILIO_TWIML_APP_SID || 'APa8e0bede79b17515e50cce759c93b935';
    try {
      const app = await client.applications(appSid).fetch();
      console.log(`App Name: ${app.friendlyName} | SID: ${app.sid}`);
      console.log(` Voice URL: ${app.voiceUrl} | Voice Method: ${app.voiceMethod}`);
    } catch (appErr) {
      console.error(`Error fetching TwiML App ${appSid}:`, appErr.message);
    }

    // 3. Fetch recent calls
    console.log("\n=== RECENT TWILIO CALLS ===");
    const calls = await client.calls.list({ limit: 10 });
    for (const call of calls) {
      console.log(`Call SID: ${call.sid}`);
      console.log(`  From: ${call.from} | To: ${call.to} | Direction: ${call.direction}`);
      console.log(`  Status: ${call.status} | Duration: ${call.duration}s`);
      console.log("-".repeat(40));
    }

  } catch (err) {
    console.error("Error executing Twilio checks:", err);
  }
}

checkTwilio();
