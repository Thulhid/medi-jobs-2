import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const roles = [
    { name: 'Super Admin', metaCode: 'SUPER_ADMIN' },
    { name: 'Admin', metaCode: 'ADMIN' },
    { name: 'Lead Recruiter', metaCode: 'LEAD_RECRUITER' },
    { name: 'Recruiter', metaCode: 'RECRUITER' },
  ];

  for (const r of roles) {
    const existing = await prisma.userRole.findFirst({ where: { metaCode: r.metaCode } });
    if (existing) {
      await prisma.userRole.update({ where: { id: existing.id }, data: { name: r.name } });
    } else {
      await prisma.userRole.create({ data: r });
    }
  }


  const statuses = [
    { name: 'Pending Approval', metaCode: 'PENDING_APPROVAL' },
    { name: 'Approved', metaCode: 'APPROVED' },
    { name: 'Rejected', metaCode: 'REJECTED' },
    { name: 'Closed', metaCode: 'CLOSED' },
  ];

  for (const status of statuses) {
    const existing = await prisma.status.findFirst({ where: { metaCode: status.metaCode } });
    if (!existing) {
      await prisma.status.create({ data: status });
    } else {
      await prisma.status.update({ 
        where: { id: existing.id }, 
        data: { name: status.name } 
      });
    }
  }

  // Create employment types
  const employmentTypes = [
    { name: 'Permanent', metaCode: 'PERMANENT' },
    { name: 'Contract', metaCode: 'CONTRACT' },
  ];

  for (const empType of employmentTypes) {
    const existing = await prisma.employmentType.findFirst({ where: { metaCode: empType.metaCode } });
    if (!existing) {
      await prisma.employmentType.create({ data: empType });
    } else {
      await prisma.employmentType.update({ 
        where: { id: existing.id }, 
        data: { name: empType.name } 
      });
    }
  }


  const vacancyOptions = [
    { name: 'Full Time', metaCode: 'FULL_TIME' },
    { name: 'Locum', metaCode: 'LOCUM' },
  ];

  for (const vacOption of vacancyOptions) {
    const existing = await prisma.vacancyOptions.findFirst({ where: { metaCode: vacOption.metaCode } });
    if (!existing) {
      await prisma.vacancyOptions.create({ data: vacOption });
    } else {
      await prisma.vacancyOptions.update({ 
        where: { id: existing.id }, 
        data: { name: vacOption.name } 
      });
    }
  }

  // Create recruiter types
  const recruiterTypes = [
    { name: 'Lead Recruiter', metaCode: 'LEAD_RECRUITER' },
    { name: 'Recruiter', metaCode: 'RECRUITER' },
    { name: 'HR Manager', metaCode: 'HR_MANAGER' },
  ];

  for (const recType of recruiterTypes) {
    const existing = await prisma.recruiterType.findFirst({ where: { metaCode: recType.metaCode } });
    if (!existing) {
      await prisma.recruiterType.create({ data: recType });
    } else {
      await prisma.recruiterType.update({ 
        where: { id: existing.id }, 
        data: { name: recType.name } 
      });
    }
  }

  // Create work place types
  const workPlaceTypes = [
    { name: 'On-site', metaCode: 'ON_SITE' },
    { name: 'Remote', metaCode: 'REMOTE' },
    { name: 'Hybrid', metaCode: 'HYBRID' },
  ];

  for (const wpType of workPlaceTypes) {
    const existing = await prisma.workPlaceType.findFirst({ where: { metaCode: wpType.metaCode } });
    if (!existing) {
      await prisma.workPlaceType.create({ data: wpType });
    } else {
      await prisma.workPlaceType.update({ 
        where: { id: existing.id }, 
        data: { name: wpType.name } 
      });
    }
  }

  // Create corporate titles
  const corporateTitles = [
    { name: 'Doctor', metaCode: 'DOCTOR' },
    { name: 'Nurse', metaCode: 'NURSE' },
    { name: 'Specialist', metaCode: 'SPECIALIST' },
    { name: 'Consultant', metaCode: 'CONSULTANT' },
    { name: 'Technician', metaCode: 'TECHNICIAN' },
    { name: 'Administrator', metaCode: 'ADMINISTRATOR' },
  ];

  for (const title of corporateTitles) {
    const existing = await prisma.corporateTitle.findFirst({ where: { metaCode: title.metaCode } });
    if (!existing) {
      await prisma.corporateTitle.create({ data: title });
    } else {
      await prisma.corporateTitle.update({ 
        where: { id: existing.id }, 
        data: { name: title.name } 
      });
    }
  }

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

