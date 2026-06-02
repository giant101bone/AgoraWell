"use client"

import { useEffect, useState } from "react"
import PusherClient from "pusher-js"
import BookingActionButton from "./BookingActionButton"

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

    // Bind listener to inventory updates
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

          return (
            <div key={session.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">{session.title}</h4>
                  {userHasBooked && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide animate-pulse">
                      Your Slot Confirmed
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  🗓️ {new Date(session.startsAt).toLocaleString()}
                </p>
                {session.description && (
                  <p className="text-xs text-gray-600 mt-1 italic">{session.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4 self-end sm:self-center">
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
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}