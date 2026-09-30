async function testLive() {
  const endpoints = [
    "/api/analytics",
    "/api/patients",
    "/api/conversations",
    "/api/canned-responses",
    "/api/automations"
  ];

  console.log("==========================================");
  console.log("🌐 TESTING LIVE RENDER DEPLOYMENT");
  console.log("URL: https://activerehab-crm.onrender.com");
  console.log("==========================================");

  for (const ep of endpoints) {
    try {
      const res = await fetch(`https://activerehab-crm.onrender.com${ep}`);
      const json = await res.json();
      console.log(`✅ ${ep} -> Status: ${res.status} OK (Success: ${json.success})`);
    } catch (e) {
      console.error(`❌ ${ep} -> Error:`, e.message);
    }
  }
}
testLive();
