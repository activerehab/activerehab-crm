import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export const dynamic = "force-dynamic";

// Meta WhatsApp Cloud API verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "odisha_spine_clinic_secret";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// Inbound WhatsApp Cloud API webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process Meta WhatsApp Cloud API entries
    if (body.object === "whatsapp_business_account" && body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const msg of change.value.messages) {
              const fromNumber = `+${msg.from}`;
              const text = msg.text?.body || "Media message";
              const contactName = change.value.contacts?.[0]?.profile?.name || "WhatsApp Patient";

              // Find or create patient
              let patient = await prisma.patient.findUnique({
                where: { phone: fromNumber },
              });

              if (!patient) {
                patient = await prisma.patient.create({
                  data: {
                    name: contactName,
                    phone: fromNumber,
                    condition: "General Spine/Joint Enquiry",
                    leadSource: "WhatsApp Direct",
                    stage: "NEW_ENQUIRY",
                  },
                });
              }

              let conversation = await prisma.conversation.findUnique({
                where: { patientId: patient.id },
              });

              if (!conversation) {
                conversation = await prisma.conversation.create({
                  data: { patientId: patient.id },
                });
              }

              const savedMsg = await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  senderType: "PATIENT",
                  text,
                  status: "DELIVERED",
                },
              });

              await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                  lastMessageAt: new Date(),
                  unreadCount: { increment: 1 },
                },
              });

              realtimeHub.broadcast("NEW_MESSAGE", {
                message: savedMsg,
                conversationId: conversation.id,
                patient,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
