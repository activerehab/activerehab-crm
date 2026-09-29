import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rules = await prisma.automationRule.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, triggerKeyword, matchType = "CONTAINS", responseText, language = "en" } = body;

    const rule = await prisma.automationRule.create({
      data: {
        name,
        triggerKeyword,
        matchType,
        responseText,
        language,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
