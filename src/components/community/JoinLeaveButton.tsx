"use client"

import { useTransition } from "react"
import { joinCommunityAction, leaveCommunityAction } from "@/app/(dashboard)/communities/actions"

interface JoinLeaveButtonProps {
  communityId: string
  isMember: boolean
}

export default function JoinLeaveButton({ communityId, isMember }: JoinLeaveButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleAction = () => {
    startTransition(async () => {
      try {
        if (isMember) {
          await leaveCommunityAction(communityId)
        } else {
          await joinCommunityAction(communityId)
        }
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  return (
    <button
      onClick={handleAction}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
        isMember 
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {isPending ? "Processing..." : isMember ? "Leave Space" : "Join Workspace"}
    </button>
  )
}