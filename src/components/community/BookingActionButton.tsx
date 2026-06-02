"use client"

import { useState, useTransition } from "react"
import { bookSeatAction, cancelBookingAction } from "@/server/actions/bookingActions"

interface BookingActionProps {
  sessionId: string
  hasBooked: boolean
  isFull: boolean
}

export default function BookingActionButton({ sessionId, hasBooked, isFull }: BookingActionProps) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleAction = () => {
  setErrorMessage(null)
  startTransition(async () => {
    // TypeScript now knows 'res' can contain an optional 'error' property string
    const res = (hasBooked 
      ? await cancelBookingAction(sessionId) 
      : await bookSeatAction(sessionId)) as { success: boolean; error?: string }

    if (!res.success) {
      // Safe string evaluation check
      const rawError = res.error ?? "Operation failed"
      const clearMsg = rawError.replace(/^[0-9]{3}:\s*/, "")
      setErrorMessage(clearMsg)
    }
  })
}

  if (hasBooked) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleAction}
          disabled={isPending}
          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {isPending ? "Cancelling..." : "Cancel Reservation"}
        </button>
        {errorMessage && <p className="text-[10px] text-red-600 font-medium max-w-[160px] text-right">{errorMessage}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleAction}
        disabled={isPending || isFull}
        className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-sm transition text-white ${
          isFull 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        }`}
      >
        {isPending ? "Securing Slot..." : isFull ? "Fully Booked" : "Book Seat"}
      </button>
      {errorMessage && <p className="text-[10px] text-red-600 font-medium max-w-[160px] text-right">{errorMessage}</p>}
    </div>
  )
}