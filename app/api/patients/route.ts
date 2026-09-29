import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/eventEmitter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");
    const doctor = searchParams.get("doctor");

    const where: any = {};
    if (stage && stage !== "ALL") where.stage = stage;
    if (condition && condition !== "ALL") where.condition = condition;
    if (doctor && doctor !== "ALL") where.assignedDoctor = doctor;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { city: { contains: search } },
        { condition: { contains: search } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        appointments: {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: patients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      city = "Bhubaneswar",
      condition,
      painScore = 7,
      leadSource = "Manual Entry",
      stage = "NEW_ENQUIRY",
      assignedDoctor = "Dr. Ashok P. Kota (Master of Chiropractic)",
      packageName,
      packagePrice = 0,
      sessionsTotal = 0,
      notes,
      tags,
      sendWelcomeWhatsApp = true,
    } = body;

    if (!name || !phone || !condition) {
      return NextResponse.json(
        { success: false, error: "Name, Phone and Condition are required" },
        { status: 400 }
      );
    }

    // Format phone
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;

    const patient = await prisma.patient.create({
      data: {
        name,
        phone: formattedPhone,
        email,
        city,
        condition,
        painScore: Number(painScore),
        leadSource,
        stage,
        assignedDoctor,
        packageName,
        packagePrice: Number(packagePrice),
        sessionsTotal: Number(sessionsTotal),
        sessionsDone: 0,
        notes,
        tags,
      },
    });

    // Create Conversation
    const conversation = await prisma.conversation.create({
      data: {
        patientId: patient.id,
        unreadCount: 0,
      },
    });

    // Send instant welcome message if requested
    if (sendWelcomeWhatsApp) {
      const welcomeText = `Namaskar ${name} 🙏 Welcome to ActiveRehab Chiropractic & Osteopathy Centre! We have received your inquiry regarding *${condition}*. Our team will assist you with assessment booking and non-surgical recovery options.`;
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: "BOT",
          text: welcomeText,
        },
      });
    }

    realtimeHub.broadcast("PATIENT_CREATED", { patient, conversation });

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
