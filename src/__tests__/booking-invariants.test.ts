import { prisma } from "../lib/prisma"
import { bookSeatAction } from "../server/actions/bookingActions"

async function runInvariantsValidationTest() {
  console.log("🚀 Starting Booking Engine Concurrency Validation Test...")

  // 1. Setup a controlled session with exactly 1 available seat
  const testSession = await prisma.wellnessSession.create({
    data: {
      title: "Concurrent Race Invariant Test",
      communityId: "well1", 
      totalCapacity: 1,
      seatsRemaining: 1,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 600000),
      createdByUserId: "test-user-id"
    }
  })

  console.log(`📝 Generated test node entry with capacity setup: ${testSession.id}`)

  // 2. Simulate two concurrent booking requests for the same seat
  const results = await Promise.all([
    bookSeatAction(testSession.id),
    bookSeatAction(testSession.id)
  ])

  const successCount = results.filter(r => r.success).length
  const failureCount = results.filter(r => !r.success).length

  console.log(`📊 Execution matrix complete. Success: ${successCount}, Failures: ${failureCount}`)

  // 3. Confirm that our system invariants held steady
  const finalState = await prisma.wellnessSession.findUnique({
    where: { id: testSession.id }
  })

  // Clean up our test data from the database
  await prisma.wellnessSession.delete({ where: { id: testSession.id } })

  if (successCount === 1 && finalState!.seatsRemaining >= 0) {
    console.log("✅ CRITICAL TEST PASSED: Race conditions blocked successfully. Seat count remained non-negative.")
    process.exit(0)
  } else {
    console.log("❌ CRITICAL TEST FAILED: Overbooking occurred or data was corrupted.")
    process.exit(1)
  }
}

// Run the script if called directly
if (require.main === module) {
  runInvariantsValidationTest()
}