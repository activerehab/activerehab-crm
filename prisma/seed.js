const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ActiveRehab official centres database...");

  // Clean old records
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.treatmentSession.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.broadcastCampaign.deleteMany();

  // 1. Canned Responses for ActiveRehab Odisha
  await prisma.cannedResponse.createMany({
    data: [
      {
        shortcut: "/bhubaneswar-centre",
        title: "ActiveRehab Patia, Bhubaneswar Location",
        language: "English",
        category: "Location",
        message: "📍 *ActiveRehab Chiropractic & Physiotherapy Centre (Bhubaneswar)*\n1st Floor, Pramila Tower, behind Pantaloons, Sishu Vihar, Patia, Bhubaneswar, Odisha 751024\n\n📌 Google Maps: https://maps.app.goo.gl/RussBK6BJ1vQ6N6S7\n📞 Phone / WhatsApp: +91 8260229039\n⏰ Mon - Sat: 9:00 AM - 9:00 PM\n🌐 Website: https://activerehab.in"
      },
      {
        shortcut: "/cuttack-centre",
        title: "ActiveRehab CDA Sector VI, Cuttack Location",
        language: "English",
        category: "Location",
        message: "📍 *ActiveRehab Chiropractic & Physiotherapy Centre (Cuttack)*\nVishwas Rehab Centre, Plot-C-1348/28, CDA Sector VI, Cuttack, Odisha 753014\n\n📌 Google Maps: https://maps.app.goo.gl/RussBK6BJ1vQ6N6S7\n📞 Phone / WhatsApp: +91 8260229039\n⏰ Mon - Sat: 9:00 AM - 9:00 PM\n🌐 Website: https://activerehab.in"
      },
      {
        shortcut: "/odia-welcome",
        title: "Welcome Message (Odia - ଓଡ଼ିଆ)",
        language: "Odia",
        category: "Greeting",
        message: "ନମସ୍କାର 🙏 *ActiveRehab Chiropractic & Physiotherapy Centre* (ପଟିଆ, ଭୁବନେଶ୍ୱର ଓ କଟକ) କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।\n\nDr. Ashok P. Kota ଙ୍କ ନେତୃତ୍ୱରେ ଆମର ବିଶେଷଜ୍ଞ କାଇରୋପ୍ରାକ୍ଟର ଓ ଫିଜିଓଥେରାପିଷ୍ଟମାନେ ଅସ୍ତ୍ରୋପଚାର ବିନା ଅଣ୍ଟା ବିନ୍ଧା, ବେକ ବିନ୍ଧା, ସାୟାଟିକା ଓ ଗଣ୍ଠି ଯନ୍ତ୍ରଣାରୁ ସ୍ଥାୟୀ ମୁକ୍ତି ଦିଅନ୍ତି।\n\nଆପଣ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ ପାଇଁ ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ କରିବାକୁ ଚାହାଁନ୍ତି କି? ଦୟାକରି ଆପଣଙ୍କ ସୁବିଧାଜନକ ସମୟ ଜଣାନ୍ତୁ।"
      },
      {
        shortcut: "/dr-kota-profile",
        title: "Dr. Ashok P. Kota Credentials",
        language: "English",
        category: "Treatment Info",
        message: "👨‍⚕️ *About Dr. Ashok P. Kota:*\n\n• Master of Chiropractic - Certified Chiropractor & Senior Physiotherapist\n• Renowned specialist in non-surgical spine alignment, disc herniation recovery, and posture rehabilitation.\n• Over 12+ years of clinical excellence treating Sciatica, Cervical Spondylosis, and chronic back pain.\n\n🌐 Learn more: https://activerehab.in"
      },
      {
        shortcut: "/pricing-packages",
        title: "ActiveRehab Care Packages",
        language: "English",
        category: "Pricing",
        message: "📋 *ActiveRehab Consultation & Care Packages:*\n\n1️⃣ *Initial Spine & Posture Assessment*: ₹800 (Detailed Orthopedic, Nerve & Spine evaluation with Senior Doctor)\n2️⃣ *5-Session Targeted Pain Relief Package*: ₹4,500\n3️⃣ *10-Session Complete Spine Alignment & Decompression*: ₹8,500 (Most Popular for Sciatica/Disc Bulge)\n4️⃣ *15-Session Advanced Chronic Rehab & Posture Restoration*: ₹12,000\n\n💡 *All packages include Chiropractic adjustment, Laser therapy, and personalized home exercise chart.*"
      },
      {
        shortcut: "/home-exercise-back",
        title: "ActiveRehab Lower Back Home Protocol",
        language: "English",
        category: "Exercises",
        message: "🎥 *ActiveRehab Daily Home Spine Protocol:*\n\nHere is your guided video routine:\n1. Pelvic Tilts (10 reps x 2 sets)\n2. Cat-Cow Spine Mobilization (10 reps)\n3. Gentle Knee-to-Chest stretch (Hold 15s)\n\n🔗 Watch Guided Video: https://activerehab.in/physiotherapy-treatment-in-hyderabad/\n⚠️ *Stop immediately if you experience sharp radiating pain.*"
      }
    ]
  });

  // 2. Automation Rules
  await prisma.automationRule.createMany({
    data: [
      {
        name: "Fees & Packages Trigger",
        triggerKeyword: "fees,price,cost,charges,package",
        matchType: "CONTAINS",
        responseText: "📋 *ActiveRehab Consultation & Treatment Packages:*\n\n• Initial Spine Assessment: ₹800\n• 5-Session Pain Relief Package: ₹4,500\n• 10-Session Complete Spine Alignment & Decompression: ₹8,500\n\nWould you like us to schedule an assessment at our Patia (Bhubaneswar) or CDA (Cuttack) centre? Please reply with *YES* or your preferred date.",
        isActive: true,
        language: "en"
      },
      {
        name: "Location / Address Trigger",
        triggerKeyword: "address,location,where,map,bhubaneswar,patia,cuttack",
        matchType: "CONTAINS",
        responseText: "📍 *ActiveRehab Odisha Centres:*\n\n1️⃣ *Bhubaneswar Centre:* 1st Floor, Pramila Tower, behind Pantaloons, Sishu Vihar, Patia, Bhubaneswar 751024.\n2️⃣ *Cuttack Centre:* Vishwas Rehab Centre, CDA Sector VI, Cuttack 753014.\n\n📞 Helpline: +91 8260229039\n🌐 Website: https://activerehab.in",
        isActive: true,
        language: "en"
      },
      {
        name: "Clinic Timings Trigger",
        triggerKeyword: "time,timing,open,sunday,hours",
        matchType: "CONTAINS",
        responseText: "⏰ *ActiveRehab Clinic Timings:*\n\n• Monday to Saturday: 9:00 AM – 9:00 PM\n• Sunday: 10:00 AM – 2:00 PM (By prior appointment)\n\nWould you prefer a Morning slot (10 AM - 1 PM) or Evening slot (4 PM - 8 PM)?",
        isActive: true,
        language: "en"
      },
      {
        name: "Sciatica & Chiropractic Trigger",
        triggerKeyword: "sciatica,back pain,slip disc,disc,spine,chiro,dr kota",
        matchType: "CONTAINS",
        responseText: "🦴 *Non-Surgical Spine Relief at ActiveRehab*\n\nLed by Dr. Ashok P. Kota, our team uses computerized Spinal Decompression + Chiropractic Alignment to relieve nerve pressure and heal disc bulges naturally without surgery.\n\nOver 92% of our patients report pain relief within 3-5 sessions. Let us schedule an assessment for you today!",
        isActive: true,
        language: "en"
      }
    ]
  });

  // 3. Broadcast Campaigns
  await prisma.broadcastCampaign.createMany({
    data: [
      {
        title: "ActiveRehab Complimentary Spine Assessment Camp - Patia",
        targetCondition: "ALL",
        messageTemplate: "Namaskar {{patient_name}} 🙏 ActiveRehab Chiropractic & Physiotherapy Centre is organizing a *Complimentary Spine & Posture Assessment Camp* this Sunday at Patia, Bhubaneswar. Limited to first 25 patients. Reply 'CAMP' to reserve your slot!",
        language: "en",
        totalRecipients: 140,
        sentCount: 140,
        deliveredCount: 136,
        readCount: 118,
        status: "COMPLETED"
      }
    ]
  });

  // 4. Patients with Realistic ActiveRehab Cases
  const patientsData = [
    {
      name: "Debashis Mohapatra",
      phone: "+919861012345",
      email: "debashis.m@gmail.com",
      city: "Bhubaneswar (Patia)",
      condition: "Lower Back Pain / Sciatica",
      painScore: 8,
      leadSource: "Facebook Ads",
      campaignName: "Sciatica & L4-L5 Non-Surgical Relief - ActiveRehab Ads",
      stage: "ACTIVE_TREATMENT",
      assignedDoctor: "Dr. Ashok P. Kota (Master of Chiropractic)",
      packageName: "10 Sessions Advanced Spine Alignment & Decompression",
      packagePrice: 8500,
      sessionsTotal: 10,
      sessionsDone: 6,
      notes: "Severe radiating pain down left leg. MRI confirmed L4-L5 disc protrusion. Pain reduced from 8/10 to 3/10 after 5 sessions of chiropractic adjustment + osteopathic mobilization under Dr. Ashok P. Kota.",
      tags: "L4-L5 Disc, Facebook Lead, High Intent, ActiveRehab Package",
      conversation: {
        messages: [
          {
            senderType: "SYSTEM",
            text: "Lead captured from Facebook Ad: 'Sciatica & L4-L5 Non-Surgical Relief - ActiveRehab Ads'",
            createdAt: new Date(Date.now() - 6 * 86400000)
          },
          {
            senderType: "BOT",
            text: "Namaskar Debashis Babu 🙏 Thank you for reaching out to *ActiveRehab Chiropractic & Physiotherapy Centre* (Patia, Bhubaneswar)! We noticed your enquiry regarding Sciatica & Back Pain. How long have you been experiencing this discomfort?",
            createdAt: new Date(Date.now() - 6 * 86400000 + 5000)
          },
          {
            senderType: "PATIENT",
            text: "Hello, since last 4 months. Pain radiates from waist to left foot when walking. I have MRI done at AIIMS Bhubaneswar.",
            createdAt: new Date(Date.now() - 6 * 86400000 + 60000)
          },
          {
            senderType: "CLINIC",
            text: "Thank you for sharing Debashis ji. Dr. Ashok P. Kota can review your MRI and perform a physical spine test tomorrow. Can we book your appointment at 11:30 AM at our Patia centre (behind Pantaloons)?",
            createdAt: new Date(Date.now() - 6 * 86400000 + 120000)
          },
          {
            senderType: "PATIENT",
            text: "Yes, 11:30 AM tomorrow is fine. Please confirm.",
            createdAt: new Date(Date.now() - 6 * 86400000 + 180000)
          },
          {
            senderType: "CLINIC",
            text: "✅ Appointment confirmed for tomorrow at 11:30 AM with Dr. Ashok P. Kota at ActiveRehab Patia.\n\n📍 1st Floor, Pramila Tower, behind Pantaloons, Sishu Vihar, Patia, Bhubaneswar.\nPlease bring your MRI films along. See you tomorrow!",
            createdAt: new Date(Date.now() - 6 * 86400000 + 240000)
          },
          {
            senderType: "PATIENT",
            text: "Today completed session 6 with Dr. Kota. Pain is much better now, able to walk comfortably!",
            createdAt: new Date(Date.now() - 3600000)
          },
          {
            senderType: "CLINIC",
            text: "That is wonderful progress Debashis ji! Keep doing the gentle pelvic tilts at home. Your next session 7 is scheduled for Thursday at 5:00 PM.",
            createdAt: new Date(Date.now() - 1800000)
          }
        ]
      },
      appointments: [
        {
          doctorName: "Dr. Ashok P. Kota (Master of Chiropractic)",
          date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
          timeSlot: "05:00 PM - 05:45 PM",
          type: "Session 7 (Chiropractic Alignment & Decompression)",
          status: "SCHEDULED",
          notes: "Focus on left sacroiliac joint mobilization and piriformis stretch."
        }
      ]
    },
    {
      name: "Priyanka Priyadarshini",
      phone: "+919437023456",
      email: "priyanka.p@outlook.com",
      city: "Cuttack (CDA Sector VI)",
      condition: "Cervical Spondylosis & Neck Stiffness",
      painScore: 7,
      leadSource: "Facebook Ads",
      campaignName: "Tech Neck & Cervical Pain Campaign - ActiveRehab",
      stage: "ASSESSMENT_BOOKED",
      assignedDoctor: "Senior Physiotherapist (ActiveRehab)",
      packageName: "5-Session Targeted Cervical Pain Relief",
      packagePrice: 4500,
      sessionsTotal: 5,
      sessionsDone: 0,
      notes: "Software professional. Severe neck spasm and headache. Initial assessment scheduled for Saturday 10:30 AM at ActiveRehab Cuttack centre.",
      tags: "Cervical, IT Professional, Cuttack Patient",
      conversation: {
        messages: [
          {
            senderType: "SYSTEM",
            text: "Lead captured from Facebook Ad: 'Tech Neck & Cervical Pain Campaign - ActiveRehab'",
            createdAt: new Date(Date.now() - 24 * 3600000)
          },
          {
            senderType: "BOT",
            text: "Namaskar Priyanka ji 🙏 Welcome to *ActiveRehab Chiropractic & Physiotherapy Centre*! We received your inquiry about Neck Pain & Cervical stiffness. Would you like to book a spine assessment with our specialists?",
            createdAt: new Date(Date.now() - 24 * 3600000 + 4000)
          },
          {
            senderType: "PATIENT",
            text: "Hi, I have severe neck stiffness and headache. Is there any weekend slot available at your Cuttack centre (CDA Sector VI)?",
            createdAt: new Date(Date.now() - 20 * 3600000)
          },
          {
            senderType: "CLINIC",
            text: "Hello Priyanka ji, yes! We have a slot available this Saturday at 10:30 AM at our CDA Sector VI centre. Would that work for you?",
            createdAt: new Date(Date.now() - 19 * 3600000)
          },
          {
            senderType: "PATIENT",
            text: "Yes please, book 10:30 AM for me. Also what is the assessment fee?",
            createdAt: new Date(Date.now() - 18 * 3600000)
          },
          {
            senderType: "CLINIC",
            text: "The Initial Spine Assessment fee is ₹800. It includes posture analysis, joint mobility test, and treatment prescription. Your slot is booked for Saturday 10:30 AM at Vishwas Rehab Centre, CDA Sector VI, Cuttack! 📍",
            createdAt: new Date(Date.now() - 17 * 3600000)
          }
        ]
      },
      appointments: [
        {
          doctorName: "Senior Physiotherapist (ActiveRehab)",
          date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
          timeSlot: "10:30 AM - 11:15 AM",
          type: "Initial Spine & Posture Assessment",
          status: "SCHEDULED",
          notes: "Assess C5-C6 nerve root impingement and thoracic spine kyphosis."
        }
      ]
    },
    {
      name: "Soumya Ranjan Patnaik",
      phone: "+919777034567",
      email: "soumya.patnaik@yahoo.in",
      city: "Bhubaneswar (Patia)",
      condition: "Frozen Shoulder & Rotator Cuff Tendinitis",
      painScore: 9,
      leadSource: "WhatsApp Direct",
      campaignName: "Website Click-to-WhatsApp (activerehab.in)",
      stage: "NEW_ENQUIRY",
      assignedDoctor: "Dr. Ashok P. Kota (Master of Chiropractic)",
      packageName: null,
      packagePrice: 0,
      sessionsTotal: 0,
      sessionsDone: 0,
      notes: "Unable to lift right arm above 90 degrees since 2 months. Extreme pain at night.",
      tags: "Frozen Shoulder, Urgent, New Lead",
      conversation: {
        messages: [
          {
            senderType: "PATIENT",
            text: "Namaskar Doctor, I cannot lift my right arm above shoulder level. Is this treatable at ActiveRehab without surgery?",
            createdAt: new Date(Date.now() - 2 * 3600000)
          },
          {
            senderType: "BOT",
            text: "Namaskar Soumya Babu 🙏 Yes, Frozen Shoulder and Rotator Cuff mobility can be restored quickly using our Advanced High-Intensity Laser Therapy, Joint Mobilization, and Chiropractic Shoulder Alignment under Dr. Ashok P. Kota without any painful surgery. What is your preferred time to visit our Patia centre?",
            createdAt: new Date(Date.now() - 2 * 3600000 + 8000)
          },
          {
            senderType: "PATIENT",
            text: "Can I come today evening around 6 PM?",
            createdAt: new Date(Date.now() - 30 * 60000)
          }
        ]
      }
    }
  ];

  for (const p of patientsData) {
    const { conversation, appointments, ...patientData } = p;
    const createdPatient = await prisma.patient.create({
      data: patientData
    });

    if (conversation) {
      const createdConv = await prisma.conversation.create({
        data: {
          patientId: createdPatient.id,
          lastMessageAt: new Date(),
          unreadCount: p.stage === "NEW_ENQUIRY" ? 1 : 0,
          status: "OPEN"
        }
      });

      for (const msg of conversation.messages) {
        await prisma.message.create({
          data: {
            conversationId: createdConv.id,
            senderType: msg.senderType,
            text: msg.text,
            createdAt: msg.createdAt || new Date()
          }
        });
      }
    }

    if (appointments && appointments.length > 0) {
      for (const apt of appointments) {
        await prisma.appointment.create({
          data: {
            patientId: createdPatient.id,
            ...apt
          }
        });
      }
    }
  }

  console.log("ActiveRehab official database re-seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
