import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalPatients = await prisma.patient.count();
    const newEnquiries = await prisma.patient.count({ where: { stage: "NEW_ENQUIRY" } });
    const assessmentBooked = await prisma.patient.count({ where: { stage: "ASSESSMENT_BOOKED" } });
    const activeTreatments = await prisma.patient.count({ where: { stage: "ACTIVE_TREATMENT" } });
    const completedRecoveries = await prisma.patient.count({ where: { stage: "COMPLETED_RECOVERY" } });
    
    // Revenue calculations
    const patientsWithPackages = await prisma.patient.findMany({
      where: { packagePrice: { gt: 0 } },
      select: { packagePrice: true },
    });
    const totalRevenue = patientsWithPackages.reduce((acc, p) => acc + (p.packagePrice || 0), 0);

    // Condition distribution
    const allPatients = await prisma.patient.findMany({
      select: { condition: true, leadSource: true },
    });

    const conditionCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    allPatients.forEach((p) => {
      conditionCounts[p.condition] = (conditionCounts[p.condition] || 0) + 1;
      sourceCounts[p.leadSource] = (sourceCounts[p.leadSource] || 0) + 1;
    });

    const upcomingAppointments = await prisma.appointment.findMany({
      where: { status: "SCHEDULED" },
      include: { patient: true },
      orderBy: { date: "asc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPatients,
        newEnquiries,
        assessmentBooked,
        activeTreatments,
        completedRecoveries,
        totalRevenue,
        conversionRate: totalPatients > 0 ? Math.round(((activeTreatments + completedRecoveries) / totalPatients) * 100) : 0,
        conditionCounts,
        sourceCounts,
        upcomingAppointments,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
