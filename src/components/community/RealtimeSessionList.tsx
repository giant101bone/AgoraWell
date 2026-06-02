"use client"

import { useEffect, useState } from "react"
import PusherClient from "pusher-js"
import BookingActionButton from "./BookingActionButton"
import { createReportAction } from "@/server/actions/moderationActions"

interface SessionItem {
  id: string
  title: string
  description: string | null
  startsAt: Date
  seatsRemaining: number
  totalCapacity: number
  status: string
  bookings: { userId: string }[]
}

interface Props {
  initialSessions: SessionItem[]
  communityId: string
  currentUserId: string
}

export default function RealtimeSessionList({ initialSessions, communityId, currentUserId }: Props) {
  const [sessions, setSessions] = useState(initialSessions)
  const [reportingSessionId, setReportingSessionId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState<"SPAM" | "ABUSE" | "MISINFO" | "OTHER">("SPAM")
  const [reportMsg, setReportMsg] = useState("")

  useEffect(() => {
    // Subscribe to the community real-time update channel
    const pusher = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    )

    const channelName = `community-${communityId}`
    const channel = pusher.subscribe(channelName)

    // Bind listener to inventory updates (Updates seat counts AND cancellation statuses live!)
    channel.bind("availability-changed", (data: { sessionId: string; seatsRemaining: number; status: string }) => {
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === data.sessionId
            ? { ...session, seatsRemaining: data.seatsRemaining, status: data.status }
            : session
        )
      )
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
      pusher.disconnect()
    }
  }, [communityId])

  useEffect(() => {
    setSessions(initialSessions)
  }, [initialSessions])

  const handleSendReport = async (sessionId: string) => {
    const res = await createReportAction(communityId, sessionId, reportReason, reportMsg)
    if (res.success) {
      alert("Report logged securely inside the moderation workflow matrix.")
      setReportingSessionId(null)
      setReportMsg("")
    } else {
      alert(res.error || "Failed to submit report.")
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {sessions.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 border border-dashed rounded-xl text-center">
          No active wellness slots are allocated inside this community registry yet.
        </p>
      ) : (
        sessions.map((session) => {
          const userHasBooked = session.bookings.some((b) => b.userId === currentUserId)
          const isFull = session.seatsRemaining === 0
          const isCancelled = session.status === "CANCELLED"

          return (
            /* Outer Wrapper: Changes style parameters dynamically based on cancellation states */
            <div 
              key={session.id} 
              className={`p-4 border rounded-xl bg-slate-50 flex flex-col gap-4 transition-all ${
                isCancelled ? "opacity-60 bg-gray-100 border-gray-200 select-none animate-fade-in" : ""
              }`}
            >
              {/* 1. MAIN ROW: Splits Info (Left) and Buttons (Right) cleanly on desktop */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* --- Left Side Info --- */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}>
                      {session.title}
                    </h4>

                    {isCancelled ? (
                      <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Cancelled by Administrator
                      </span>
                    ) : userHasBooked && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide animate-pulse">
                        Your Slot Confirmed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    🗓️ {new Date(session.startsAt).toLocaleString()}
                  </p>
                  {session.description && (
                    <p className={`text-xs mt-1 italic ${isCancelled ? "text-gray-400" : "text-gray-600"}`}>
                      {session.description}
                    </p>
                  )}
                </div>

                {/* --- Right Side Action Panel --- */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  {!isCancelled ? (
                    <>
                      <span className={`px-2 py-1 text-[11px] font-bold rounded bg-white border transition-colors duration-300 ${
                        isFull ? "text-red-600 border-red-100 bg-red-50" : "text-gray-700"
                      }`}>
                        👥 {session.seatsRemaining} / {session.totalCapacity} Seats Left
                      </span>
                  
                      <BookingActionButton 
                        sessionId={session.id} 
                        hasBooked={userHasBooked} 
                        isFull={isFull} 
                      />

                      <button 
                        onClick={() => setReportingSessionId(session.id)}
                        className="text-xs text-red-500 hover:underline px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition"
                      >
                        ⚠️ Report
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 italic bg-gray-200/50 px-2 py-1 rounded">
                      Archived
                    </span>
                  )}
                </div>

              </div>

              {/* 2. DRAWER ROW: Protected with !isCancelled conditional safety guard */}
              {reportingSessionId === session.id && !isCancelled && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-2 w-full text-black">
                  <span className="text-xs font-bold text-red-900">Flag Resource Violation</span>
                  <select 
                    value={reportReason} 
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="text-xs bg-white border p-1 rounded outline-none"
                  >
                    <option value="SPAM">Spam</option>
                    <option value="ABUSE">Abuse</option>
                    <option value="MISINFO">Misinformation</option>
                    <option value="OTHER">Other Rules Infraction</option>
                  </select>
                  <textarea 
                    placeholder="Contextual notes..." 
                    value={reportMsg} 
                    onChange={(e) => setReportMsg(e.target.value)}
                    className="text-xs p-2 border rounded bg-white resize-none h-16 outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setReportingSessionId(null)} className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
                      Cancel
                    </button>
                    <button onClick={() => handleSendReport(session.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      Submit
                    </button>
                  </div>
                </div>
              )}

            </div>
          )
        })
      )}
    </div>
  )
}