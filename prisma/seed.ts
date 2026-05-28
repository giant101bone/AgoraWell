import {prisma} from "../src/server/db";


async function main() {
  console.log("🌱 Starting database seeding pipeline...");
  //clearing the database in strict reverse order 
  console.log("🧹 Clearing existing database records...");

  await prisma.auditLog.deleteMany({});
  await prisma.sessionBooking.deleteMany({});
  await prisma.wellnessSession.deleteMany({});
  await prisma.communityMember.deleteMany({});

  await prisma.community.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✨ Database cleared. Constructing fresh mock ecosystem...");
  // Create users
  const alice = await prisma.user.create({
    data: {
      name: "Alice Smith",
      email: "alice@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Jones",
      email: "bob@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: "Charlie Brown",
      email: "charlie@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    },
  });

  console.log(`👤 Created 3 core users: ${alice.name}, ${bob.name}, ${charlie.name}`);

  // Step B: Establish the Hub (Community)
  const yogaCommunity = await prisma.community.create({
    data: {
      name: "Morning Yoga Hub",
      slug: "morning-yoga",
    },
  });

  console.log(`🏛️ Created Community: "${yogaCommunity.name}" [slug: ${yogaCommunity.slug}]`);

  // Step C: Map the Relationships & Roles (Memberships)
  await prisma.communityMember.createMany({
    data: [
      { userId: alice.id, communityId: yogaCommunity.id, role: "ADMIN" },
      { userId: bob.id, communityId: yogaCommunity.id, role: "MODERATOR" },
      { userId: charlie.id, communityId: yogaCommunity.id, role: "MEMBER" },
    ],
  });

  console.log("👥 Assigned community roles (Alice: ADMIN, Bob: MODERATOR, Charlie: MEMBER)");

  // Step D: Construct the Events (Wellness Sessions)
  // Session A: Fully available
  await prisma.wellnessSession.create({
    data: {
      communityId: yogaCommunity.id,
      title: "Introduction to Sunrise Vinyasa",
      startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Happens tomorrow
      totalCapacity: 10,
      seatsRemaining: 10,
      status: "OPEN",
    },
  });

  // Session B: Almost full (Charlie will book the 4th slot, leaving 1 remaining)
  const sessionB = await prisma.wellnessSession.create({
    data: {
      communityId: yogaCommunity.id,
      title: "Advanced Breathwork & Pranayama",
      startsAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Happens in 2 days
      totalCapacity: 5,
      seatsRemaining: 1, // Reflecting that 4 seats are taken/allocated
      status: "OPEN",
    },
  });

  // Session C: Sold out completely
  await prisma.wellnessSession.create({
    data: {
      communityId: yogaCommunity.id,
      title: "Deep Sleep Yoga Nidra",
      startsAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // Happens in 3 days
      totalCapacity: 3,
      seatsRemaining: 0,
      status: "FULL",
    },
  });

  console.log("🧘 Generated 3 distinct Wellness Sessions (Available, Almost Full, Sold Out)");

  // Step E: Execute the Transaction (Bookings)
  // Charlie books a seat in Session B
  await prisma.sessionBooking.create({
    data: {
      sessionId: sessionB.id,
      userId: charlie.id,
      status: "ACTIVE",
    },
  });

  console.log(`🎟️ Logged active session booking: Charlie Brown -> ${sessionB.title}`);

  // Step F: Add a Mock Audit Log entry for tracing
  await prisma.auditLog.create({
    data: {
      action: "BOOK_SEAT",
      actorId: charlie.id,
      targetId: sessionB.id,
    },
  });

  console.log("📝 Generated system audit ledger entries.");
  console.log("✅ Seeding operation completed successfully.");
}

main()
  .catch(async (error) => {
    console.error("Seeding pipeline crashed with an unhandeled exception");
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(
    async () => {
    await prisma.$disconnect() ;
  }
  );