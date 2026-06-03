"use client"

import { useTransition, useState } from "react"
import { MoodScore } from "@prisma/client"
import { upsertMoodEntryAction } from "@/app/(dashboard)/mood/actions"

const MOOD_OPTIONS = [
  { score: MoodScore.GREAT, emoji: "😄", label: "Great", styles: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500" },
  { score: MoodScore.GOOD, emoji: "🙂", label: "Good", styles: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500" },
  { score: MoodScore.OK, emoji: "😐", label: "OK", styles: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500" },
  { score: MoodScore.BAD, emoji: "😢", label: "Bad", styles: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500" },
]

interface MoodWidgetProps {
  todayMood?: MoodScore
  lastSevenDays: { createdAt: Date; score: MoodScore }[]
}

export function MoodWidget({ todayMood, lastSevenDays }: MoodWidgetProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedMood, setSelectedMood] = useState<MoodScore | undefined>(todayMood)

  const handleSelect = (score: MoodScore) => {
    setSelectedMood(score)
    startTransition(async () => {
      await upsertMoodEntryAction(score)
    })
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between h-full space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Daily State Log</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">How are you processing today?</p>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {MOOD_OPTIONS.map((item) => {
            const isMatch = selectedMood === item.score
            return (
              <button
                key={item.score}
                disabled={isPending}
                onClick={() => handleSelect(item.score)}
                className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                  isMatch 
                    ? `${item.styles} ring-2 ring-offset-1 font-semibold scale-102` 
                    : "border-gray-100 hover:bg-slate-50 text-gray-600"
                }`}
              >
                <span className="text-xl mb-1">{item.emoji}</span>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          7-Day Activity Sparkline
        </h4>
        <div className="flex items-end justify-between h-12 bg-slate-50/50 border border-gray-100 rounded-lg p-2">
          {Array.from({ length: 7 }).map((_, idx) => {
            const trackDate = new Date()
            trackDate.setDate(trackDate.getDate() - (6 - idx))
            
            const dayRecord = lastSevenDays.find(
              (entry) => new Date(entry.createdAt).toDateString() === trackDate.toDateString()
            )

            let height = "h-1 bg-gray-200"
            if (dayRecord?.score === MoodScore.BAD) height = "h-3 bg-rose-400"
            if (dayRecord?.score === MoodScore.OK) height = "h-6 bg-amber-400"
            if (dayRecord?.score === MoodScore.GOOD) height = "h-8 bg-blue-400"
            if (dayRecord?.score === MoodScore.GREAT) height = "h-10 bg-emerald-400"

            return (
              <div key={idx} className="flex flex-col items-center flex-1 group relative">
                <div className={`w-2 rounded-t transition-all duration-300 ${height}`} />
                <span className="text-[9px] font-medium text-gray-400 mt-1 uppercase">
                  {trackDate.toLocaleDateString("en", { weekday: "narrow" })}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}