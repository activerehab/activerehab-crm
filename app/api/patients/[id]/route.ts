import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
        appointments: {
          orderBy: { date: "desc" },
        },
        sessions: {
          orderBy: { sessionNumber: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    const body = await req.json();
    const updatedPatient = await prisma.patient.update({
      where: { id: params.id },
      data: body,
      include: {
        conversation: true,
      },
    });

    realtimeHub.broadcast("PATIENT_UPDATED", { patient: updatedPatient });

    return NextResponse.json({ success: true, data: updatedPatient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    await prisma.patient.delete({
      where: { id: params.id },
    });

    realtimeHub.broadcast("PATIENT_DELETED", { id: params.id });

    return NextResponse.json({ success: true, message: "Patient deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
