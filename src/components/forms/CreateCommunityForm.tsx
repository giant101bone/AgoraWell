"use client"

import { useActionState } from "react"
import { createCommunityAction } from "@/app/(dashboard)/communities/actions"

export default function CreateCommunityForm() {
  const [state, formAction, isPending] = useActionState(createCommunityAction, null)

  return (
    <form action={formAction} className="flex flex-col gap-4 bg-white p-6 border rounded-xl shadow-sm text-black">
      {state?.serverError && (
        <div className="p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">{state.serverError}</div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-700">Display Name</label>
        <input type="text" name="name" required placeholder="e.g., Wellness Hub" className="px-3 py-1.5 border rounded-lg text-sm" />
        {state?.error?.name && <p className="text-xs text-red-600 mt-0.5">{state.error.name[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-700">URL Slug</label>
        <input type="text" name="slug" required placeholder="e.g., wellness-hub" className="px-3 py-1.5 border rounded-lg text-sm" />
        {state?.error?.slug && <p className="text-xs text-red-600 mt-0.5">{state.error.slug[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-700">Description</label>
        <textarea name="description" placeholder="Describe this workspace cell..." rows={3} className="px-3 py-1.5 border rounded-lg text-sm resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Privacy Visibility</label>
          <select name="visibility" className="px-3 py-1.5 border rounded-lg text-sm bg-white">
            <option value="PUBLIC">Public Access</option>
            <option value="PRIVATE">Private (Hidden)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Tags (Comma Separated)</label>
          <input type="text" name="tags" placeholder="yoga, tech, health" className="px-3 py-1.5 border rounded-lg text-sm" />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition shadow-sm">
        {isPending ? "Configuring Space..." : "Provision Space Deck"}
      </button>
    </form>
  )
}