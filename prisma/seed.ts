import "dotenv/config" // Enforces loading your local .env configurations
import { 
  PrismaClient, 
  CommunityRole, 
  SessionStatus, 
  BookingStatus, 
  VisibilityStatus, 
  AuditAction, 
  AuditEntity, 
  ReportReason, 
  ReportStatus, 
  ModActionType, 
  MoodScore 
} from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Date helper utilities
const hoursAhead = (offset: number) => new Date(Date.now() + offset * 60 * 60 * 1000)
const daysAgo = (offset: number) => new Date(Date.now() - offset * 24 * 60 * 60 * 1000)

async function main() {
  console.log("🚀 Initializing complete ecosystem database seed sequence...")

  // ==========================================
  // 1. CLEAR EXISTING DATA (Reverse Relational Order)
  // ==========================================
  console.log("🧹 Clearing legacy records from database tables...")
  await prisma.moodEntry.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.postComment.deleteMany()
  await prisma.communityPost.deleteMany()
  await prisma.moderationAction.deleteMany()
  await prisma.report.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.sessionBooking.deleteMany()
  await prisma.wellnessSession.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // ==========================================
  // 2. GENERATE USER DIRECTORY
  // ==========================================
  console.log("👥 Fabricating multi-tier user profiles...")
  
  const adminUser = await prisma.user.create({
    data: {
      name: "Alex Mercer",
      email: "alex.admin@wellness.test",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
  })

  const modUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.mod@wellness.test",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  })

  const member1 = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane.doe@wellness.test",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  })

  const member2 = await prisma.user.create({
    data: {
      name: "Michael Chang",
      email: "michael.c@wellness.test",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
  })

  const member3 = await prisma.user.create({
    data: {
      name: "Emma Watson",
      email: "emma.w@wellness.test",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    },
  })

  // ==========================================
  // 3. GENERATE COMMUNITIES & MEMBERSHIPS
  // ==========================================
  console.log("🏢 Structuring community workspaces and access roles...")

  const loungeComm = await prisma.community.create({
    data: {
      id: "well1",
      name: "The Wellness Lounge",
      slug: "wellness-lounge",
      description: "A sanctuary for holistic group fitness, custom somatic recovery loops, and open yoga practices.",
      tags: ["Yoga", "Somatic", "Fitness"],
      createdById: adminUser.id,
      visibility: VisibilityStatus.PUBLIC,
    },
  })

  const mindComm = await prisma.community.create({
    data: {
      id: "mind2",
      name: "Mindfulness Collective",
      slug: "mindfulness-collective",
      description: "Advanced neurological bio-hacking frameworks, collective transcendental meditation, and clinical sleep therapy forums.",
      tags: ["Meditation", "Neuro", "Therapy"],
      createdById: adminUser.id,
      visibility: VisibilityStatus.PUBLIC,
    },
  })

  const secretComm = await prisma.community.create({
    data: {
      id: "secret3",
      name: "VIP Bio-Hacking Elite",
      slug: "vip-bio-hacking",
      description: "Private discussions regarding high-tier athletic routines, experimental sleep patterns, and restricted metabolic diets.",
      tags: ["Elite", "Biohacking", "Experimental"],
      createdById: modUser.id,
      visibility: VisibilityStatus.PRIVATE,
    },
  })

  // Set up memberships
  await prisma.communityMember.createMany({
    data: [
      // Lounge Memberships
      { userId: adminUser.id, communityId: loungeComm.id, role: CommunityRole.ADMIN },
      { userId: modUser.id, communityId: loungeComm.id, role: CommunityRole.MODERATOR },
      { userId: member1.id, communityId: loungeComm.id, role: CommunityRole.MEMBER },
      { userId: member2.id, communityId: loungeComm.id, role: CommunityRole.MEMBER },
      { userId: member3.id, communityId: loungeComm.id, role: CommunityRole.MEMBER },
      
      // Mindfulness Memberships
      { userId: adminUser.id, communityId: mindComm.id, role: CommunityRole.ADMIN },
      { userId: modUser.id, communityId: mindComm.id, role: CommunityRole.MODERATOR },
      { userId: member1.id, communityId: mindComm.id, role: CommunityRole.MEMBER },
      { userId: member2.id, communityId: mindComm.id, role: CommunityRole.MEMBER },

      // VIP Elite Memberships
      { userId: modUser.id, communityId: secretComm.id, role: CommunityRole.ADMIN },
      { userId: adminUser.id, communityId: secretComm.id, role: CommunityRole.MEMBER },
      { userId: member3.id, communityId: secretComm.id, role: CommunityRole.MEMBER },
    ],
  })

  // ==========================================
  // 4. GENERATE WELLNESS SESSIONS & BOOKINGS
  // ==========================================
  console.log("📅 Scheduling active wellness sessions and reservation queues...")

  const sessionOpen = await prisma.wellnessSession.create({
    data: {
      title: "Vinyasa Flow & Dynamic Core Realignment",
      description: "An open structural mobility series targeting postural restoration and breath mechanics.",
      startsAt: hoursAhead(24),
      endsAt: hoursAhead(25),
      totalCapacity: 15,
      seatsRemaining: 13, 
      status: SessionStatus.OPEN,
      communityId: loungeComm.id,
      createdByUserId: adminUser.id,
    },
  })

  const sessionFull = await prisma.wellnessSession.create({
    data: {
      title: "[VIP] Clinical Deep Sleep Nidra Soundscape",
      description: "High-intensity neurological down-regulation session. STRICTLY CLOSED ACCESS.",
      startsAt: hoursAhead(48),
      endsAt: hoursAhead(49),
      totalCapacity: 3,
      seatsRemaining: 0,
      status: SessionStatus.FULL,
      communityId: mindComm.id,
      createdByUserId: modUser.id,
    },
  })

  const sessionCancelled = await prisma.wellnessSession.create({
    data: {
      title: "Advanced Fasting Protocols Masterclass",
      description: "A comprehensive breakdown of multi-day water fasting and cellular autophagy cycles.",
      startsAt: hoursAhead(12),
      endsAt: hoursAhead(14),
      totalCapacity: 30,
      seatsRemaining: 30,
      status: SessionStatus.CANCELLED,
      communityId: secretComm.id,
      createdByUserId: modUser.id,
    },
  })

  // Bookings configuration
  await prisma.sessionBooking.createMany({
    data: [
      // Open Session Bookings
      { userId: member1.id, sessionId: sessionOpen.id, status: BookingStatus.CONFIRMED },
      { userId: member2.id, sessionId: sessionOpen.id, status: BookingStatus.CONFIRMED },
      
      // Full Session Bookings (Fills all 3 capacities)
      { userId: adminUser.id, sessionId: sessionFull.id, status: BookingStatus.CONFIRMED },
      { userId: member1.id, sessionId: sessionFull.id, status: BookingStatus.CONFIRMED },
      { userId: member2.id, sessionId: sessionFull.id, status: BookingStatus.CONFIRMED },
    ],
  })

  // ==========================================
  // 5. GENERATE SOCIAL DATA (POSTS, COMMENTS, LIKES)
  // ==========================================
  console.log("✍️ Simulating active community feeds, commentary, and interactions...")

  const post1 = await prisma.communityPost.create({
    data: {
      communityId: loungeComm.id,
      authorId: member1.id,
      content: "Just completed the morning mobility routine! My lower back tightness is completely cleared up. Highly recommend using dynamic blocks for the deep transitions.",
    },
  })

  const post2 = await prisma.communityPost.create({
    data: {
      communityId: mindComm.id,
      authorId: member2.id,
      content: "Are there any research whitepapers available on the specific neuro-feedback channels targeted during the Nidra audio soundscapes? Trying to optimize my clinical sleep routines.",
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop",
    },
  })

  // Comments
  await prisma.postComment.createMany({
    data: [
      {
        postId: post1.id,
        authorId: member2.id,
        content: "Agreed! Combining them with structural breathwork completely changes the recovery pace.",
      },
      {
        postId: post1.id,
        authorId: adminUser.id,
        content: "Awesome insight, Jane. Next Tuesday I'll be adding custom spinal decompressed progressions into the group circuit!",
      },
      {
        postId: post2.id,
        authorId: modUser.id,
        content: "I can link the clinical dataset from our neurological lab parameters tonight, Michael.",
      },
    ],
  })

  // Likes (Enforcing safety parameters via unique combinations)
  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, userId: member2.id },
      { postId: post1.id, userId: adminUser.id },
      { postId: post2.id, userId: member1.id },
      { postId: post2.id, userId: modUser.id },
    ],
  })

  // ==========================================
  // 6. GENERATE USER MOOD METRICS
  // ==========================================
  console.log("📊 Charting multi-day historical user mood timelines...")

  await prisma.moodEntry.createMany({
    data: [
      // Member 1 History
      { userId: member1.id, score: MoodScore.GREAT, note: "Slept perfectly after the Soundscape trial.", createdAt: daysAgo(0) },
      { userId: member1.id, score: MoodScore.GOOD, note: "Post-yoga energy flow is carrying my workday.", createdAt: daysAgo(1) },
      { userId: member1.id, score: MoodScore.OK, note: "Slightly unmotivated, body feels a bit sluggish.", createdAt: daysAgo(2) },
      
      // Member 2 History
      { userId: member2.id, score: MoodScore.GOOD, note: "Focus is locked in. Diet routines are settling smoothly.", createdAt: daysAgo(0) },
      { userId: member2.id, score: MoodScore.BAD, note: "Severe insomnia episode. High cognitive stress load.", createdAt: daysAgo(1) },
    ],
  })

  // ==========================================
  // 7. COMPLIANCE AUDITING & MODERATION PIPELINES
  // ==========================================
  console.log("🚨 Appending regulatory compliance logs and report queues...")

  // Generate an actionable report flag
  const complianceReport = await prisma.report.create({
    data: {
      reporterUserId: member3.id,
      communityId: loungeComm.id,
      entityType: "POST",
      entityId: post1.id,
      reason: ReportReason.SPAM,
      message: "External automated product referral link suspected in user profile changes.",
      status: ReportStatus.UNDER_REVIEW,
    },
  })

  // File corresponding moderation actions
  await prisma.moderationAction.create({
    data: {
      reportId: complianceReport.id,
      moderatorUserId: modUser.id,
      actionType: ModActionType.REJECT_REPORT,
      notes: "False positive flag. Profile verified clean after structural account audits.",
    },
  })

  // System Core Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: AuditAction.SESSION_CREATED,
        entityType: AuditEntity.SESSION,
        actorId: adminUser.id,
        entityId: sessionOpen.id,
        metadata: { info: "Initial session launch sequence verified." },
      },
      {
        action: AuditAction.BOOKING_CREATED,
        entityType: AuditEntity.BOOKING,
        actorId: member1.id,
        entityId: sessionOpen.id,
        metadata: { channel: "Web-App Gateway Platform" },
      },
    ],
  })

  // Live App Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: member1.id,
        type: "BOOKING_CONFIRMED",
        message: "Your reservation for 'Vinyasa Flow & Dynamic Core Realignment' is secure. See you tomorrow!",
      },
      {
        userId: member3.id,
        type: "SESSION_CANCELLED",
        message: "Notice: 'Advanced Fasting Protocols Masterclass' has been cancelled by the administrative supervisor.",
      },
    ],
  })

  console.log("\n--- ✨ ECOSYSTEM SEED SUCCESSFUL ---")
  console.log(`🔹 Created Users      : 5 records`)
  console.log(`🔹 Created Communities: 3 records (2 Public, 1 VIP Private)`)
  console.log(`🔹 Wellness Sessions  : 3 records (Open, Full, Cancelled)`)
  console.log(`🔹 Social Media Feeds : 2 Posts, 3 Comments, 4 Likes compiled`)
  console.log(`🔹 Health Analytics   : 5 Diagnostic Mood Trackings online`)
  console.log("---------------------------------------")
}

main()
  .catch((e) => {
    console.error("❌ Critical script structural failure during compiler process:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })