import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const responses = await prisma.cannedResponse.findMany({
      orderBy: { shortcut: "asc" },
    });
    return NextResponse.json({ success: true, data: responses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
