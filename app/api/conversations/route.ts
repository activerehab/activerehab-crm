import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "ALL", "UNREAD", "ACTIVE"

    const where: any = {};
    if (filter === "UNREAD") where.unreadCount = { gt: 0 };
    if (filter === "ACTIVE") where.status = "OPEN";

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        patient: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
