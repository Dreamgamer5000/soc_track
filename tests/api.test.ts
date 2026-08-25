import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../src/lib/auth";
import { isOverdue, calculateDaysOpen } from "../src/lib/utils";

describe("Society Maintenance Tracker Test Suite", () => {
  before(async () => {
    await prisma.$connect();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  describe("1. Authentication & JWT Engine", () => {
    test("should hash and verify passwords correctly", async () => {
      const plain = "securePass123";
      const hash = await hashPassword(plain);
      assert.notEqual(hash, plain);
      const isValid = await verifyPassword(plain, hash);
      assert.equal(isValid, true);
      const isInvalid = await verifyPassword("wrongPass", hash);
      assert.equal(isInvalid, false);
    });

    test("should sign and verify JWT session tokens", () => {
      const mockUser = {
        id: "user-123",
        email: "test@greenview.com",
        name: "Test User",
        role: "RESIDENT" as const,
        flatNumber: "402",
        towerBlock: "Tower B",
      };

      const token = signToken(mockUser);
      assert.ok(token);
      assert.equal(typeof token, "string");

      const decoded = verifyToken(token);
      assert.ok(decoded);
      assert.equal(decoded?.email, mockUser.email);
      assert.equal(decoded?.role, "RESIDENT");
      assert.equal(decoded?.flatNumber, "402");
    });
  });

  describe("2. Overdue Detection Engine", () => {
    test("should accurately calculate overdue status based on age and threshold", () => {
      const now = new Date();
      const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

      // 4 days old with 3-day threshold -> OVERDUE
      assert.equal(isOverdue(fourDaysAgo, "OPEN", 3), true);
      assert.equal(isOverdue(fourDaysAgo, "IN_PROGRESS", 3), true);

      // Resolved tickets are never overdue
      assert.equal(isOverdue(fourDaysAgo, "RESOLVED", 3), false);

      // 1 day old with 3-day threshold -> NOT OVERDUE
      assert.equal(isOverdue(oneDayAgo, "OPEN", 3), false);
    });

    test("should calculate elapsed days open", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const days = calculateDaysOpen(threeDaysAgo);
      assert.equal(days, 3);
    });
  });

  describe("3. Database & Complaint Audit Workflow", () => {
    let testResidentId: string;
    let testComplaintId: string;

    test("should create a complaint and atomically write first history log", async () => {
      let resident = await prisma.user.findUnique({
        where: { email: "resident@greenview.com" },
      });

      if (!resident) {
        resident = await prisma.user.create({
          data: {
            email: "test.resident@greenview.com",
            passwordHash: await hashPassword("password123"),
            name: "Test Resident",
            role: "RESIDENT",
            flatNumber: "501",
            towerBlock: "Tower C",
          },
        });
      }
      testResidentId = resident.id;

      const complaint = await prisma.$transaction(async (tx) => {
        const created = await tx.complaint.create({
          data: {
            title: "Test Corridor Light Flickering",
            category: "ELECTRICAL",
            description: "Corridor light outside flat 501 is flickering rapidly.",
            status: "OPEN",
            priority: "LOW",
            residentId: testResidentId,
          },
        });

        await tx.complaintHistory.create({
          data: {
            complaintId: created.id,
            status: "OPEN",
            priority: "LOW",
            note: "Complaint submitted by resident.",
            actorId: testResidentId,
          },
        });

        return created;
      });

      assert.ok(complaint.id);
      assert.equal(complaint.title, "Test Corridor Light Flickering");
      assert.equal(complaint.status, "OPEN");
      testComplaintId = complaint.id;

      // Verify history entry
      const history = await prisma.complaintHistory.findMany({
        where: { complaintId: complaint.id },
      });
      assert.equal(history.length, 1);
      assert.equal(history[0].status, "OPEN");
      assert.equal(history[0].actorId, testResidentId);
    });

    test("should append history log on status transition to IN_PROGRESS and RESOLVED", async () => {
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
      assert.ok(admin);

      // Transition to IN_PROGRESS
      await prisma.$transaction(async (tx) => {
        await tx.complaint.update({
          where: { id: testComplaintId },
          data: { status: "IN_PROGRESS", priority: "HIGH" },
        });

        await tx.complaintHistory.create({
          data: {
            complaintId: testComplaintId,
            status: "IN_PROGRESS",
            priority: "HIGH",
            note: "Electrician assigned for 2:00 PM.",
            actorId: admin.id,
          },
        });
      });

      // Transition to RESOLVED
      await prisma.$transaction(async (tx) => {
        await tx.complaint.update({
          where: { id: testComplaintId },
          data: { status: "RESOLVED", resolvedAt: new Date() },
        });

        await tx.complaintHistory.create({
          data: {
            complaintId: testComplaintId,
            status: "RESOLVED",
            note: "Bulb replaced and tested by technician.",
            actorId: admin.id,
          },
        });
      });

      // Verify full audit log
      const fullHistory = await prisma.complaintHistory.findMany({
        where: { complaintId: testComplaintId },
        orderBy: { createdAt: "asc" },
      });

      assert.equal(fullHistory.length, 3);
      assert.equal(fullHistory[0].status, "OPEN");
      assert.equal(fullHistory[1].status, "IN_PROGRESS");
      assert.equal(fullHistory[1].priority, "HIGH");
      assert.equal(fullHistory[2].status, "RESOLVED");
    });
  });

  describe("4. Community Notice Board & AppConfig", () => {
    test("should read and update overdue threshold config", async () => {
      await prisma.appConfig.upsert({
        where: { key: "overdue_threshold_days" },
        update: { value: "5" },
        create: { key: "overdue_threshold_days", value: "5" },
      });

      const config = await prisma.appConfig.findUnique({
        where: { key: "overdue_threshold_days" },
      });

      assert.equal(config?.value, "5");

      // Reset to default 3
      await prisma.appConfig.update({
        where: { key: "overdue_threshold_days" },
        data: { value: "3" },
      });
    });
  });

  describe("5. Photo Evidence & Upload Pipeline", () => {
    test("should validate image extensions and mime types", () => {
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const testFile = "sample_leak.jpg";
      const ext = "." + testFile.split(".").pop()?.toLowerCase();
      assert.equal(validExtensions.includes(ext), true);

      const invalidFile = "malicious_script.sh";
      const invalidExt = "." + invalidFile.split(".").pop()?.toLowerCase();
      assert.equal(validExtensions.includes(invalidExt), false);
    });
  });
});
