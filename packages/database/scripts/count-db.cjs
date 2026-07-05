const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const counts = {
    coaches: await prisma.coach.count(),
    students: await prisma.student.count(),
    invites: await prisma.studentInvite.count(),
    codes: await prisma.coachRegistrationCode.count(),
    payments: await prisma.payment.count(),
    notifications: await prisma.notification.count(),
    programs: await prisma.program.count(),
    nutritionPlans: await prisma.nutritionPlan.count(),
    checkIns: await prisma.weeklyCheckIn.count(),
    workoutAttendance: await prisma.workoutAttendance.count(),
    mealEntries: await prisma.mealEntry.count(),
    transformations: await prisma.transformation.count(),
    testimonials: await prisma.testimonial.count(),
  };
  console.log('Counts:', JSON.stringify(counts, null, 2));
  const coaches = await prisma.coach.findMany({ select: { email: true, name: true, subdomain: true } });
  console.log('Coaches:', JSON.stringify(coaches, null, 2));
  const students = await prisma.student.findMany({ select: { email: true, name: true, coach: { select: { email: true } } } });
  console.log('Students:', JSON.stringify(students, null, 2));
  await prisma.$disconnect();
})();
