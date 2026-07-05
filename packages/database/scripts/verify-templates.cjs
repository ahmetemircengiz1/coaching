const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const globalExercises = await prisma.exercise.count({ where: { coachId: null } });
  const customExercises = await prisma.exercise.count({ where: { coachId: { not: null } } });
  const packages = await prisma.saasPackage.findMany({ select: { tier: true, name: true } });
  console.log('Global egzersiz (koçsuz, korunur):', globalExercises);
  console.log('Custom egzersiz (koça ait, silindi):', customExercises);
  console.log('SaasPackage:', packages);
  await prisma.$disconnect();
})();
