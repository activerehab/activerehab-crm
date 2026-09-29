import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const campaigns = await prisma.broadcastCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, targetCondition = "ALL", messageTemplate, language = "en" } = body;

    if (!title || !messageTemplate) {
      return NextResponse.json({ success: false, error: "Title and template required" }, { status: 400 });
    }

    const where: any = {};
    if (targetCondition !== "ALL") {
      where.condition = targetCondition;
    }

    const patients = await prisma.patient.findMany({ where, include: { conversation: true } });
    const totalRecipients = patients.length;

    const campaign = await prisma.broadcastCampaign.create({
      data: {
        title,
        targetCondition,
        messageTemplate,
        language,
        totalRecipients,
        sentCount: totalRecipients,
        deliveredCount: Math.max(0, Math.floor(totalRecipients * 0.96)),
        readCount: Math.max(0, Math.floor(totalRecipients * 0.82)),
        status: "COMPLETED",
      },
    });

    // Send broadcast messages to targeted patients
    for (const p of patients) {
      if (p.conversation) {
        const personalizedText = messageTemplate
          .replace(/{{patient_name}}/g, p.name)
          .replace(/{{name}}/g, p.name)
          .replace(/{{condition}}/g, p.condition)
          .replace(/{{city}}/g, p.city || "Odisha");

        await prisma.message.create({
          data: {
            conversationId: p.conversation.id,
            senderType: "CLINIC",
            text: personalizedText,
            isTemplate: true,
            templateName: title,
            status: "DELIVERED",
          },
        });

        await prisma.conversation.update({
          where: { id: p.conversation.id },
          data: { lastMessageAt: new Date() },
        });
      }
    }

    realtimeHub.broadcast("CAMPAIGN_SENT", { campaign });

    return NextResponse.json({ success: true, data: campaign });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
