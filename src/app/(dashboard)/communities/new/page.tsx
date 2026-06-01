import CreateCommunityForm from "@/components/forms/CreateCommunityForm"
import Link from "next/link"

export default function NewCommunityPage() {
  return (
    <div className="p-8 max-w-md mx-auto text-black">
      <div className="mb-6">
        <Link href="/communities" className="text-sm text-blue-600 hover:underline">← Back to Directory</Link>
        <h1 className="text-2xl font-bold tracking-tight mt-2">Initialize New Community</h1>
        <p className="text-sm text-gray-500">Setup an independent workspace shell</p>
      </div>
      <CreateCommunityForm />
    </div>
  )
}