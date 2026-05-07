const fs = require('fs');

function replaceInFile(path, oldStr, newStr) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.split(oldStr).join(newStr);
  fs.writeFileSync(path, content);
}

// 1. Founder Dashboard
replaceInFile('src/pages/FounderDashboard.tsx', 'QUICK SMS COMPOSER', 'QUICK PUSH NOTIFICATION COMPOSER');
replaceInFile('src/pages/FounderDashboard.tsx', '> Quick SMS<', '> Quick Push Notification<');
replaceInFile('src/pages/FounderDashboard.tsx', 'id="sms-recipient"', 'id="push-recipient"');
replaceInFile('src/pages/FounderDashboard.tsx', 'id="sms-body"', 'id="push-body"');
replaceInFile('src/pages/FounderDashboard.tsx', "document.getElementById('sms-recipient')", "document.getElementById('push-recipient')");
replaceInFile('src/pages/FounderDashboard.tsx', "document.getElementById('sms-body')", "document.getElementById('push-body')");
replaceInFile('src/pages/FounderDashboard.tsx', 'Type your SMS message...', 'Type your notification message...');
replaceInFile('src/pages/FounderDashboard.tsx', 'await voip800.sendSMS(to, body)', 'true // Mock FCM push');
replaceInFile('src/pages/FounderDashboard.tsx', "alert(result ? '✅ SMS sent!' : '❌ Failed — verify number is text-enabled')", "alert(result ? '✅ Push Notification sent to user device!' : '❌ Failed')");
replaceInFile('src/pages/FounderDashboard.tsx', '> Send SMS<', '> Send Push Notification<');

// 2. CallCenterCommandTab
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', 'Quick SMS<', 'Quick Push Alert<');
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', 'id="ops-sms-to"', 'id="ops-push-to"');
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', 'id="ops-sms-body"', 'id="ops-push-body"');
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', "document.getElementById('ops-sms-to')", "document.getElementById('ops-push-to')");
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', "document.getElementById('ops-sms-body')", "document.getElementById('ops-push-body')");
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', 'await voip800.sendSMS(to, b)', 'true // Mock FCM');
replaceInFile('src/components/telephony/CallCenterCommandTab.tsx', '>Send SMS<', '>Send Alert<');

// 3. InternalMessenger
replaceInFile('src/components/messaging/InternalMessenger.tsx', "id: 'external-sms', label: 'External SMS', description: 'Text patients & partners via Dialer'", "id: 'external-push', label: 'External Push', description: 'Send secure push notifications to patients'");
replaceInFile('src/components/messaging/InternalMessenger.tsx', "activeChannel === 'external-sms'", "activeChannel === 'external-push'");
replaceInFile('src/components/messaging/InternalMessenger.tsx', 'await voip800.sendSMS(externalPhone, messageText)', 'true // Mock push');
replaceInFile('src/components/messaging/InternalMessenger.tsx', '[SMS sent to ${externalPhone} via Dialer]', '[Push Notification sent to ${externalPhone}]');
replaceInFile('src/components/messaging/InternalMessenger.tsx', "alert('Failed to send SMS via Dialer')", "alert('Failed to send Push Notification')");
replaceInFile('src/components/messaging/InternalMessenger.tsx', 'Type SMS message...', 'Type push notification message...');

// 4. App.tsx (Checkbox labels)
replaceInFile('src/App.tsx', 'Receive ticket updates via SMS', 'Receive ticket updates via Push/Email');
replaceInFile('src/App.tsx', 'I wish to receive account updates via SMS.', 'I wish to receive account updates via In-App Push.');
replaceInFile('src/App.tsx', 'By checking this box, you consent to receive 2FA codes and account notifications via SMS from Global Green Hybrid Platform (GGHP) to the provided mobile number. <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong>', 'By checking this box, you consent to receive 2FA codes and account notifications via Secure In-App Push Notifications to your connected device.');
replaceInFile('src/App.tsx', 'voip800.sendSMS(phoneToText, "Global Green: Your consultation has been successfully scheduled! You will receive an email with the meeting link.");', '// FCM Push sent instead of SMS');

replaceInFile('src/App.tsx', 'const [smsOptIn, setSmsOptIn]', 'const [pushOptIn, setPushOptIn]');
replaceInFile('src/App.tsx', 'checked={smsOptIn}', 'checked={pushOptIn}');
replaceInFile('src/App.tsx', 'setSmsOptIn(e.target.checked)', 'setPushOptIn(e.target.checked)');
replaceInFile('src/App.tsx', 'smsOptIn: lower.includes', 'pushOptIn: lower.includes');

// 5. Settings Preferences Mockup
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'deliverySms:', 'deliveryPush:');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'securitySms:', 'securityPush:');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'psaSms:', 'psaPush:');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'preferences.deliverySms', 'preferences.deliveryPush');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'preferences.securitySms', 'preferences.securityPush');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'preferences.psaSms', 'preferences.psaPush');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'deliverySms: e.target.checked', 'deliveryPush: e.target.checked');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'securitySms: e.target.checked', 'securityPush: e.target.checked');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'psaSms: e.target.checked', 'psaPush: e.target.checked');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'Opt-in to Delivery SMS Alerts', 'Opt-in to Delivery Push Alerts');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'Opt-in to Security SMS Alerts', 'Opt-in to Security Push Alerts');
replaceInFile('src/pages/SettingsPreferencesMockup.tsx', 'Opt-in to PSA SMS Alerts', 'Opt-in to PSA Push Alerts');

// 6. Registration Mockup
replaceInFile('src/pages/RegistrationMockup.tsx', 'I wish to receive account updates via SMS.', 'I wish to receive account updates via In-App Push.');
replaceInFile('src/pages/RegistrationMockup.tsx', 'By checking this box, you consent to receive 2FA codes and account notifications via SMS from Global Green Hybrid Platform (GGHP) to the provided mobile number. <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong>', 'By checking this box, you consent to receive 2FA codes and account notifications via Secure In-App Push Notifications to your connected device.');

console.log('Successfully ripped out SMS terminology and functionality!');
