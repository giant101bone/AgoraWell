import { requireUserId } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"

export default async function MoodHistoryPage() {
  const userId = await requireUserId()

  const logs = await prisma.moodEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  const emojiMap: Record<string, string> = {
    GREAT: "😄",
    GOOD: "🙂",
    OK: "😐",
    BAD: "😢",
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight sm:text-2xl">Reflection History</h1>
        <p className="text-xs text-gray-400 mt-0.5">Historical verification trail of daily logged state entries.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No logged entry documents detected. Record an status snapshot from your workspace panel.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition">
                <div className="text-2xl bg-slate-50 w-11 h-11 rounded-lg border flex items-center justify-center">
                  {emojiMap[log.score] || "🎯"}
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-900 bg-slate-100 px-2 py-0.5 rounded tracking-wide">
                      {log.score}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1.5 italic">
                    {log.note ? `"${log.note}"` : "No descriptive annotation attached to this day's index."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}