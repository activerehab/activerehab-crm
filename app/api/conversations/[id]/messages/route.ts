import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    const messages = await prisma.message.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: "asc" },
    });

    // Reset unread count
    await prisma.conversation.update({
      where: { id: params.id },
      data: { unreadCount: 0 },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    const body = await req.json();
    const { text, senderType = "CLINIC", mediaUrl, mediaType, isTemplate, templateName } = body;

    if (!text && !mediaUrl) {
      return NextResponse.json({ success: false, error: "Text or media is required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: { patient: true },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderType,
        text: text || "",
        mediaUrl,
        mediaType,
        isTemplate: Boolean(isTemplate),
        templateName,
        status: "DELIVERED",
      },
    });

    await prisma.conversation.update({
      where: { id: params.id },
      data: {
        lastMessageAt: new Date(),
        unreadCount: senderType === "PATIENT" ? { increment: 1 } : 0,
      },
    });

    realtimeHub.broadcast("NEW_MESSAGE", { message, conversationId: params.id, patient: conversation.patient });

    // Auto-responder logic if message came from patient
    if (senderType === "PATIENT" && text) {
      const lowerText = text.toLowerCase();
      const rules = await prisma.automationRule.findMany({
        where: { isActive: true },
      });

      for (const rule of rules) {
        const keywords = rule.triggerKeyword.split(",").map((k) => k.trim().toLowerCase());
        const isMatched = keywords.some((kw) => {
          if (rule.matchType === "EXACT") return lowerText === kw;
          if (rule.matchType === "STARTS_WITH") return lowerText.startsWith(kw);
          return lowerText.includes(kw);
        });

        if (isMatched) {
          setTimeout(async () => {
            try {
              const botMsg = await prisma.message.create({
                data: {
                  conversationId: params.id,
                  senderType: "BOT",
                  text: rule.responseText,
                  mediaUrl: rule.mediaUrl,
                  mediaType: rule.mediaType,
                  status: "DELIVERED",
                },
              });
              await prisma.conversation.update({
                where: { id: params.id },
                data: { lastMessageAt: new Date() },
              });
              realtimeHub.broadcast("NEW_MESSAGE", { message: botMsg, conversationId: params.id, patient: conversation.patient });
            } catch (err) {
              console.error("Bot auto-reply error:", err);
            }
          }, 800);
          break;
        }
      }
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
