import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Checking database seed status...");

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0 && process.env.FORCE_SEED !== "true") {
    console.log("✅ Database already contains data. Skipping re-seed.");
    return;
  }

  console.log("🌱 Seeding database with initial data...");

  // Clean existing data
  await prisma.complaintHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.appConfig.deleteMany();
  await prisma.user.deleteMany();

  // Create App Config
  await prisma.appConfig.create({
    data: {
      key: "overdue_threshold_days",
      value: "3",
    },
  });

  // Password hashes
  const adminPassword = await bcrypt.hash("admin123", 10);
  const residentPassword = await bcrypt.hash("resident123", 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@greenview.com",
      passwordHash: adminPassword,
      name: "Chief Admin Rajesh",
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });

  // 2. Create Residents
  const resident1 = await prisma.user.create({
    data: {
      email: "resident@greenview.com",
      passwordHash: residentPassword,
      name: "Ananya Sharma",
      role: "RESIDENT",
      flatNumber: "402",
      towerBlock: "Tower B",
      phone: "+91 98123 45678",
    },
  });

  const resident2 = await prisma.user.create({
    data: {
      email: "vikram@greenview.com",
      passwordHash: residentPassword,
      name: "Vikram Malhotra",
      role: "RESIDENT",
      flatNumber: "105",
      towerBlock: "Tower A",
      phone: "+91 98987 65432",
    },
  });

  // 3. Create Community Notices
  await prisma.notice.create({
    data: {
      title: "🚰 Scheduled Overhead Water Tank Cleaning",
      content:
        "Please note that the main overhead water tank will undergo annual chemical disinfection this Sunday, 10:00 AM to 3:00 PM. Water supply will remain paused during these hours. Please store sufficient water in advance.",
      isImportant: true,
      authorId: admin.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.notice.create({
    data: {
      title: "🏋️ Clubhouse Gym Equipment Upgrade",
      content:
        "New treadmills and free-weight benches have been installed in the clubhouse gymnasium. Residents are requested to adhere to the gym safety guidelines and sign the logbook at entry.",
      isImportant: false,
      authorId: admin.id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // 4. Create Sample Complaints

  // Complaint 1: OVERDUE (Created 4 days ago)
  const overdueComplaint = await prisma.complaint.create({
    data: {
      title: "Main Water Meter Valve Leaking in Basement",
      category: "PLUMBING",
      description:
        "There is continuous water dripping from the sub-meter valve near parking slot B-14. Water is accumulating near electrical cables.",
      status: "OPEN",
      priority: "HIGH",
      residentId: resident1.id,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: overdueComplaint.id,
      status: "OPEN",
      priority: "HIGH",
      note: "Complaint raised with high priority by resident due to water pooling near cables.",
      actorId: resident1.id,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  // Complaint 2: IN PROGRESS (Created 2 days ago)
  const inProgressComplaint = await prisma.complaint.create({
    data: {
      title: "Tower B Passenger Lift Display Flickering",
      category: "LIFT",
      description:
        "The 7-segment floor indicator inside Lift #2 flickers intermittently and floor 4 button doesn't light up.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      residentId: resident1.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: inProgressComplaint.id,
      status: "OPEN",
      priority: "LOW",
      note: "Complaint filed by resident.",
      actorId: resident1.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: inProgressComplaint.id,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      note: "Otis Lift maintenance technician contacted. Service engineer scheduled for visit tomorrow morning.",
      actorId: admin.id,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Complaint 3: RESOLVED (Created 3 days ago, resolved yesterday)
  const resolvedComplaint = await prisma.complaint.create({
    data: {
      title: "Corridor Light Fixture Replacement on 1st Floor",
      category: "ELECTRICAL",
      description:
        "Tube light outside Flat 105 went dark yesterday evening.",
      status: "RESOLVED",
      priority: "LOW",
      residentId: resident2.id,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: resolvedComplaint.id,
      status: "OPEN",
      priority: "LOW",
      note: "Ticket raised.",
      actorId: resident2.id,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: resolvedComplaint.id,
      status: "RESOLVED",
      priority: "LOW",
      note: "Replaced faulty LED tube with 18W Philips LED batten. Tested and confirmed operational.",
      actorId: admin.id,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("   Admin: admin@greenview.com / admin123");
  console.log("   Resident: resident@greenview.com / resident123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
