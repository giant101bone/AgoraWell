"use client"

import { useState } from "react"
import { deleteSessionAction } from "@/app/(dashboard)/communities/[communityId]/sessions/actions"

interface DeleteSessionButtonProps {
  sessionId: string
  slug: string
  sessionTitle: string
}

export default function DeleteSessionButton({ sessionId, slug, sessionTitle }: DeleteSessionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const note = prompt(`Are you sure you want to permanently delete "${sessionTitle}"? This action cannot be undone.\n\nEnter a deletion reason note below:`)
    
    if (note === null) return // User hit cancel
    
    setIsDeleting(true)
    const result = await deleteSessionAction({
      sessionId,
      slug,
      note: note.trim() || "Purged via Administrator panel."
    })
    setIsDeleting(false)

    if (result && result.serverError) {
      alert(result.serverError)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition disabled:opacity-50"
    >
      {isDeleting ? "Purging..." : "Purge Session"}
    </button>
  )
}