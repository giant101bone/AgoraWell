"use client"

import { useActionState, use } from "react"
import { createSessionAction } from "../actions"
import Link from "next/link"

interface PageProps {
  params: Promise<{ communityId: string }> 
}

export default function NewSessionPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = use(params)
  const createActionWithId = createSessionAction.bind(null, communityId)
  const [state, formAction, isPending] = useActionState(createActionWithId, null)

  return (
    <div className="p-8 max-w-lg mx-auto text-black">
      <Link href={`/communities/${communityId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Community Deck
      </Link>
      <h1 className="text-2xl font-bold mb-6">Provision Wellness Session</h1>

      <form action={formAction} className="flex flex-col gap-4 bg-white p-6 border rounded-xl shadow-sm">
        {state?.serverError && (
          <div className="p-3 text-sm bg-red-50 text-red-700 border rounded-lg">{state.serverError}</div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Session Title</label>
          <input type="text" name="title" required className="px-3 py-2 border rounded-lg text-sm" />
          {state?.error?.title && <p className="text-xs text-red-600">{state.error.title[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700">
            Session Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            placeholder="What will this wellness session cover? Who is it for?"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          ></textarea>
          {/* If your state returns errors, you can display them here */}
          {state?.error?.description && (
            <p className="text-xs text-red-600">{state.error.description[0]}</p>
          )}
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Start Time</label>
            <input type="datetime-local" name="startsAt" required className="px-3 py-2 border rounded-lg text-sm" />
            {state?.error?.startsAt && <p className="text-xs text-red-600">{state.error.startsAt[0]}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">End Time</label>
            <input type="datetime-local" name="endsAt" required className="px-3 py-2 border rounded-lg text-sm" />
            {state?.error?.endsAt && <p className="text-xs text-red-600">{state.error.endsAt[0]}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Total Capacity (Seats)</label>
          <input type="number" name="totalCapacity" min="1" max="200" required defaultValue="20" className="px-3 py-2 border rounded-lg text-sm" />
          {state?.error?.totalCapacity && <p className="text-xs text-red-600">{state.error.totalCapacity[0]}</p>}
        </div>

        <button type="submit" disabled={isPending} className="mt-4 py-2 bg-slate-900 text-white rounded-lg font-medium">
          {isPending ? "Allocating Inventory..." : "Publish Session"}
        </button>
      </form>
    </div>
  )
}