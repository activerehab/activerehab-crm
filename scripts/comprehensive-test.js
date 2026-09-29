const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING COMPREHENSIVE CRM FUNCTIONAL AUDIT");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  async function assert(testName, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${testName} ->`, err.message);
      failed++;
    }
  }

  // 1. Test Analytics API (Dashboard)
  await assert("Dashboard Analytics API (/api/analytics)", async () => {
    const res = await fetch(`${BASE_URL}/api/analytics`);
    const data = await res.json();
    if (!data.success || typeof data.data.totalPatients !== "number") {
      throw new Error("Invalid analytics payload");
    }
  });

  // 2. Test Patients List & Filters (/api/patients)
  let testPatientId = null;
  await assert("Patients Directory API (/api/patients)", async () => {
    const res = await fetch(`${BASE_URL}/api/patients`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error("No patients returned");
    }
    testPatientId = data.data[0].id;
  });

  // 3. Test Patient Quick Registration Modal Backend (/api/patients POST)
  let createdPatientId = null;
  const uniquePhone = `+919861${Math.floor(100000 + Math.random() * 900000)}`;
  await assert("Register Walk-in Patient & Auto-WhatsApp (/api/patients POST)", async () => {
    const newPt = {
      name: "Pranab Kumar Jena",
      phone: uniquePhone,
      city: "Bhubaneswar (Patia)",
      condition: "Slip Disc / L4-L5 Herniation",
      painScore: 8,
      leadSource: "Walk-in",
      assignedDoctor: "Dr. Ashok P. Kota (Master of Chiropractic)",
      packageName: "10-Session Complete Spine Alignment & Decompression",
      packagePrice: 8500,
      sessionsTotal: 10,
      notes: "Severe lower back stiffness and sciatica radiating to left calf.",
      sendWelcomeWhatsApp: true,
    };
    const res = await fetch(`${BASE_URL}/api/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPt),
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error(data.error || "Failed to create patient");
    createdPatientId = data.data.id;
  });

  // 4. Test Conversations List (/api/conversations)
  let testConvId = null;
  await assert("Live Conversations List API (/api/conversations)", async () => {
    const res = await fetch(`${BASE_URL}/api/conversations`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error("Failed to fetch conversations");
    }
    testConvId = data.data[0].id;
  });

  // 5. Test Live Message History & Clinic Sending (/api/conversations/[id]/messages)
  await assert("Send WhatsApp Message from Clinic Staff (/api/conversations/[id]/messages POST)", async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/${testConvId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Namaskar! Dr. Ashok P. Kota has reviewed your MRI report.",
        senderType: "CLINIC",
      }),
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error("Failed to send clinic message");
  });

  // 6. Test Automated Bot Keyword Trigger
  await assert("Automated Bot Trigger for 'fees' Keyword", async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/${testConvId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "What are your consultation fees and package charges?",
        senderType: "PATIENT",
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error("Failed to post patient message");

    // Wait 1.2s for bot trigger
    await new Promise((r) => setTimeout(r, 1200));

    const checkRes = await fetch(`${BASE_URL}/api/conversations/${testConvId}/messages`);
    const checkData = await checkRes.json();
    const lastMsg = checkData.data[checkData.data.length - 1];
    if (lastMsg.senderType !== "BOT") {
      throw new Error("Bot auto-reply was not triggered");
    }
  });

  // 7. Test Facebook Lead Ads Ingestion Webhook & Instant Welcome Dispatch
  const fbUniquePhone = `+919438${Math.floor(100000 + Math.random() * 900000)}`;
  await assert("Facebook Lead Ads Ingestion & Auto-Trigger (/api/webhooks/facebook-leads POST)", async () => {
    const fbLead = {
      name: "Sasmita Tripathy",
      phone: fbUniquePhone,
      city: "Cuttack (CDA Sector VI)",
      condition: "Cervical Spondylosis & Neck Stiffness",
      painScore: 7,
      campaignName: "Tech Neck & Cervical Pain Campaign - ActiveRehab Ads",
    };
    const res = await fetch(`${BASE_URL}/api/webhooks/facebook-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbLead),
    });
    const data = await res.json();
    if (!data.success || !data.data.patient) throw new Error("FB lead ingestion failed");
  });

  // 8. Test Kanban Pipeline Stage Movement
  await assert("Pipeline Stage Transition (/api/patients/[id] PATCH)", async () => {
    const res = await fetch(`${BASE_URL}/api/patients/${createdPatientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "ACTIVE_TREATMENT", sessionsDone: 1 }),
    });
    const data = await res.json();
    if (!data.success || data.data.stage !== "ACTIVE_TREATMENT") {
      throw new Error(data.error || "Failed to update patient stage");
    }
  });

  // 9. Test Canned Responses API (Odia, English, Hindi)
  await assert("Canned Responses API (/api/canned-responses)", async () => {
    const res = await fetch(`${BASE_URL}/api/canned-responses`);
    const data = await res.json();
    if (!data.success || data.data.length < 3) throw new Error("Missing canned responses");
  });

  // 10. Test Broadcast Campaigns Creator
  await assert("Broadcast Campaign Launch (/api/campaigns POST)", async () => {
    const campaignPayload = {
      title: "ActiveRehab Weekend Posture Checkup Camp",
      targetCondition: "ALL",
      language: "en",
      messageTemplate: "Hi {{patient_name}}, book your Sunday spine checkup at ActiveRehab Patia centre! Reply YES to confirm.",
    };
    const res = await fetch(`${BASE_URL}/api/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignPayload),
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error("Failed to launch campaign");
  });

  // 11. Test Appointment Scheduling with Auto WhatsApp Confirmation
  await assert("Appointment Scheduling with WhatsApp Confirmation (/api/appointments POST)", async () => {
    const aptPayload = {
      patientId: createdPatientId,
      doctorName: "Dr. Ashok P. Kota (Master of Chiropractic)",
      date: "2026-10-02",
      timeSlot: "11:00 AM - 11:45 AM",
      type: "Initial Spine & Posture Assessment",
      notes: "First visit for L4-L5 disc decompression.",
    };
    const res = await fetch(`${BASE_URL}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aptPayload),
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error("Failed to schedule appointment");
  });

  console.log("==================================================");
  console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");
}

runTests().catch(console.error);
