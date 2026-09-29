import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, doctorName, date, timeSlot, type, notes } = body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorName: doctorName || "Dr. Ashok P. Kota (Master of Chiropractic)",
        date,
        timeSlot,
        type: type || "Initial Spine & Posture Assessment",
        notes,
      },
      include: { patient: true },
    });

    // Update patient stage to ASSESSMENT_BOOKED if they were in NEW_ENQUIRY
    await prisma.patient.update({
      where: { id: patientId },
      data: { stage: "ASSESSMENT_BOOKED" },
    });

    // Send confirmation WhatsApp message
    const conv = await prisma.conversation.findUnique({ where: { patientId } });
    if (conv) {
      const confirmMsg = `? *Appointment Confirmed!*\n\nNamaskar ${appointment.patient.name} 🙏 Your appointment with *${appointment.doctorName}* has been scheduled for:\n\n Date: ${date}\n? Time: ${timeSlot}\n Type: ${appointment.type}\n Location: Plot 420, Saheed Nagar, Bhubaneswar.\n\n_Please arrive 10 minutes prior for registration. Loose clothing recommended._`;
      
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderType: "CLINIC",
          text: confirmMsg,
          status: "DELIVERED",
        },
      });

      await prisma.conversation.update({
        where: { id: conv.id },
        data: { lastMessageAt: new Date() },
      });
    }

    realtimeHub.broadcast("APPOINTMENT_SCHEDULED", { appointment });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
