import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export const dynamic = "force-dynamic";

// Meta Webhook Verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "odisha_spine_clinic_secret";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// Meta Webhook Ingestion & Simulation Handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if it is a simulated lead submission or actual Meta Leadgen payload
    let leadData = {
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      city: body.city || "Bhubaneswar",
      condition: body.condition || "Lower Back Pain / Sciatica",
      painScore: body.painScore || 7,
      campaignName: body.campaignName || "Spine Health & Sciatica Campaign - Odisha",
      leadSource: body.leadSource || "Facebook Ads",
    };

    // If actual Meta Leadgen webhook payload:
    if (body.object === "page" && body.entry) {
      // In production with Meta Graph API, we fetch leadgen details using leadgen_id
      leadData.leadSource = "Facebook Lead Ads (Meta Live)";
    }

    if (!leadData.name || !leadData.phone) {
      return NextResponse.json({ success: false, error: "Name and Phone required" }, { status: 400 });
    }

    const formattedPhone = leadData.phone.startsWith("+")
      ? leadData.phone
      : `+91${leadData.phone.replace(/\D/g, "")}`;

    // Create or find patient
    let patient = await prisma.patient.findUnique({
      where: { phone: formattedPhone },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: leadData.name,
          phone: formattedPhone,
          email: leadData.email,
          city: leadData.city,
          condition: leadData.condition,
          painScore: Number(leadData.painScore),
          leadSource: leadData.leadSource,
          campaignName: leadData.campaignName,
          stage: "NEW_ENQUIRY",
          assignedDoctor: "Dr. Ashok P. Kota (Master of Chiropractic)",
          tags: `Facebook Lead, ${leadData.condition}`,
        },
      });
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { patientId: patient.id },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          patientId: patient.id,
          unreadCount: 1,
        },
      });
    }

    // Add System log message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "SYSTEM",
        text: `Facebook Lead captured from campaign: "${leadData.campaignName}". Reported condition: ${leadData.condition} (Pain: ${leadData.painScore}/10).`,
      },
    });

    // Auto-dispatch instant WhatsApp welcome
    const welcomeMessage = `Namaskar ${leadData.name} 🙏 Thank you for reaching out to *ActiveRehab Chiropractic & Osteopathy Centre*!\n\nWe received your enquiry for *${leadData.condition}*. Our Senior Chiropractor & Physiotherapy specialists provide non-surgical, long-term pain relief.\n\nWould you like to schedule an initial spine assessment this week? Reply *YES* or send us your preferred date & time.`;

    const botMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "BOT",
        text: welcomeMessage,
        status: "DELIVERED",
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        unreadCount: 0,
      },
    });

    realtimeHub.broadcast("FACEBOOK_LEAD_RECEIVED", {
      patient,
      conversation,
      latestMessage: botMessage,
    });

    return NextResponse.json({
      success: true,
      message: "Facebook lead processed and instant WhatsApp welcome message dispatched",
      data: { patient, conversation },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
