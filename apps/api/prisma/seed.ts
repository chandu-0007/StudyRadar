import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding dummy staff records...");

  const staff = [
    {
      employeeId: "TCH2024001",
      name: "Dr. Sharma",
      email: "sharma@college.edu.in",
      department: "CSE",
      designation: "Assistant Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024002",
      name: "Prof. Rao",
      email: "rao@college.edu.in",
      department: "ECE",
      designation: "Associate Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024003",
      name: "Dr. Priya",
      email: "priya@college.edu.in",
      department: "CSE",
      designation: "Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024004",
      name: "Dr. Menon",
      email: "menon@college.edu.in",
      department: "EEE",
      designation: "Assistant Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024005",
      name: "Dr. Kavita",
      email: "kavita@college.edu.in",
      department: "IT",
      designation: "Assistant Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024006",
      name: "Prof. Suresh",
      email: "suresh@college.edu.in",
      department: "MECH",
      designation: "Associate Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024007",
      name: "Dr. Anita",
      email: "anita@college.edu.in",
      department: "CIVIL",
      designation: "Assistant Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024008",
      name: "Prof. Verma",
      email: "verma@college.edu.in",
      department: "CSE",
      designation: "Associate Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024009",
      name: "Dr. Arjun",
      email: "arjun@college.edu.in",
      department: "ECE",
      designation: "Assistant Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2024010",
      name: "Dr. Nisha",
      email: "nisha@college.edu.in",
      department: "IT",
      designation: "Professor",
      college: "ABC Engineering College",
    },
    {
      employeeId: "TCH2345",
      name: "Swapna",
      email: "swapna@anits.edu.in",
      department: "CSE",
      designation: "Assistant Professor",
      college: "ANITS",
    },
  ];

  for (const record of staff) {
    const existing = await prisma.staffRecord.findUnique({
      where: { employeeId: record.employeeId.toUpperCase() },
    });

    if (!existing) {
      await prisma.staffRecord.create({
        data: {
          employeeId: record.employeeId.toUpperCase(),
          name: record.name,
          email: record.email.toLowerCase(),
          department: record.department.toUpperCase(),
          designation: record.designation,
          college: record.college,
        },
      });
    }
  }

  console.log("✅ Staff seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

