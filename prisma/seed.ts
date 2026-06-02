import "dotenv/config" // Enforces loading your local .env configurations
import { 
  PrismaClient, 
  ReportStatus, 
  ReportReason, 
  AuditAction, 
  AuditEntity,
  CommunityRole,
  SessionStatus
} from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log(" Initializing target narrative database seed sequence...")

  // 1. CLEAR EXISTING DATA (Reverse relational order to prevent foreign key locks)
  await prisma.moderationAction.deleteMany()
  await prisma.report.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.sessionBooking.deleteMany() // Matches your model SessionBooking
  await prisma.wellnessSession.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.user.deleteMany()

  // ==========================================
  // 2. GENERATE USERS
  // ==========================================
  const superMod = await prisma.user.create({
    data: {
      name: "Alex Mercer (Admin)",
      email: "mod@wellness.test",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
    },
  })

  const standardUser = await prisma.user.create({
    data: {
      name: "Jane Doe (Member)",
      email: "member@wellness.test",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=jane",
    },
  })

  console.log(`👥 Created Users: ${superMod.email} (Staff) & ${standardUser.email} (Member)`)

  // ==========================================
  // 3. GENERATE COMMUNITIES
  // ==========================================
  const loungeComm = await prisma.community.create({
    data: {
      id: "well1", // Explicit string matches for easy URL testing (/communities/well1)
      name: "The Wellness Lounge",
      slug: "well1",
      description: "A sanctuary for holistic group fitness, custom somatic recovery loops, and open yoga practices.",
      tags: ["Yoga", "Somatic", "Fitness"],
      createdById: superMod.id,
      visibility: "PUBLIC",
    },
  })

  const mindComm = await prisma.community.create({
    data: {
      id: "mind2",
      name: "Mindfulness Collective",
      slug: "mind2",
      description: "Advanced neurological bio-hacking frameworks, collective transcendental meditation, and clinical sleep therapy forums.",
      tags: ["Meditation", "Neuro", "Therapy"],
      createdById: superMod.id,
      visibility: "PUBLIC",
    },
  })

  // Assign internal community workspace directory memberships
  await prisma.communityMember.createMany({
    data: [
      { userId: superMod.id, communityId: loungeComm.id, role: CommunityRole.ADMIN },
      { userId: standardUser.id, communityId: loungeComm.id, role: CommunityRole.MEMBER },
      { userId: superMod.id, communityId: mindComm.id, role: CommunityRole.MODERATOR },
      { userId: standardUser.id, communityId: mindComm.id, role: CommunityRole.MEMBER },
    ],
  })

  console.log("🏢 Seeded Communities: 'well1' & 'mind2' with configured access directories.")

  // ==========================================
  // 4. GENERATE SESSIONS
  // ==========================================
  const inlineHour = (offset: number) => new Date(Date.now() + offset * 60 * 60 * 1000)

  const sessionOpenA = await prisma.wellnessSession.create({
    data: {
      title: "Vinyasa Flow & Dynamic Core Realignment",
      description: "An open structural mobility series targeting postural restoration and breath mechanics.",
      startsAt: inlineHour(24), // Tomorrow
      endsAt: inlineHour(25),
      totalCapacity: 10,
      seatsRemaining: 9, // 1 seat will be booked below
      status: SessionStatus.OPEN,
      communityId: loungeComm.id,
      createdByUserId: superMod.id,
    },
  })

  const sessionFullA = await prisma.wellnessSession.create({
    data: {
      title: "[VIP] Clinical Deep Sleep Nidra Soundscape",
      description: "High-intensity neurological down-regulation session. STRICTLY CLOSED ACCESS.",
      startsAt: inlineHour(48),
      endsAt: inlineHour(49),
      totalCapacity: 2,
      seatsRemaining: 0, // Enforced system structural ceiling cap limit
      status: SessionStatus.FULL,
      communityId: loungeComm.id,
      createdByUserId: superMod.id,
    },
  })

  const sessionImminentA = await prisma.wellnessSession.create({
    data: {
      title: "Emergency Flash Somatic Breathwork Core",
      description: "Rapid cortisol reset drill launching immediately. Have blocks and floor space cleared.",
      startsAt: inlineHour(0.2), // Starts in 12 minutes
      endsAt: inlineHour(1.2),
      totalCapacity: 15,
      seatsRemaining: 15,
      status: SessionStatus.OPEN,
      communityId: loungeComm.id,
      createdByUserId: superMod.id,
    },
  })

  // ==========================================
  // 5. GENERATE BOOKINGS
  // ==========================================
  
  // standardUser books the open session
  await prisma.sessionBooking.create({
    data: { userId: standardUser.id, sessionId: sessionOpenA.id },
  })

  // Fill up the locked session completely
  await prisma.sessionBooking.createMany({
    data: [
      { userId: superMod.id, sessionId: sessionFullA.id },
      { userId: standardUser.id, sessionId: sessionFullA.id },
    ],
  })

  console.log("🎟️ Seeded transactional records and secured structural seat capacities.")

  // ==========================================
  // 6. GENERATE REPORTS, NOTIFICATIONS & AUDIT LOGS
  // ==========================================
  
  // 6a. Generate a compliance report
  const reportedSpamItem = await prisma.report.create({
    data: {
      reporterUserId: standardUser.id,
      communityId: loungeComm.id,
      entityType: "SESSION", // Maps to your schema's string requirement
      entityId: sessionFullA.id,
      reason: ReportReason.SPAM,
      message: "External crypto-marketing vectors detected in the subtext parameters of this description card layout.",
      status: ReportStatus.OPEN,
    },
  })

  // 6b. Generate matching audit logs using your exact Enums
  await prisma.auditLog.create({
    data: {
      action: AuditAction.SESSION_CREATED, 
      entityType: AuditEntity.SESSION,
      actorId: superMod.id,
      entityId: sessionFullA.id,
      metadata: { context: "Session was created by Admin prior to report generation." },
    },
  })

  // 6c. Generate a notification to make the UI look alive
  await prisma.notification.create({
    data: {
      userId: standardUser.id,
      type: "BOOKING_CONFIRMED",
      message: "Your seat for Vinyasa Flow & Dynamic Core Realignment is confirmed!",
    }
  })

  console.log("🚨 Active moderation queues populated.")
  console.log("🔔 User notifications dispatched.")
  console.log("🏁 Database state compilation complete. Review packages ready for pipeline integration.")
}

main()
  .catch((e) => {
    console.error("❌ Critical script error during compilation cycle:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })