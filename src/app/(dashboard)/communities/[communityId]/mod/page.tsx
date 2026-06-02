import { listReportsAction, resolveReportAction } from "@/server/actions/moderationActions"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{ communityId: string }>
}

export default async function ModerationQueuePage({ params }: Props) {
  const { communityId } = await params

  const community = await prisma.community.findFirst({
    where: { 
      slug: communityId 
    }
  })

  if (!community) return notFound()

  const reports = await listReportsAction(community.id)

  async function handleResolve(formData: FormData) {
    "use server"
    const reportId = String(formData.get("reportId"))
    const realCommunityId = String(formData.get("realCommunityId"))
    const action = String(formData.get("action")) as any
    await resolveReportAction(reportId, realCommunityId, action, "Processed via Mod Queue Console")
    revalidatePath(`/communities/${communityId}/mod`)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold tracking-tight">Community Management Queue</h1>
      <p className="text-sm text-gray-500 mb-6">Process reported infractions and maintain system integrity.</p>

      {reports.length === 0 ? (
        <p className="p-8 text-center border border-dashed rounded-xl text-gray-400 text-sm">
          Clean ledger! No active reports are currently flagged for review.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-5 border rounded-xl bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-amber-100 text-amber-800">
                  {report.reason}
                </span>
                <p className="text-sm font-semibold mt-2 text-gray-900">Target Session ID: {report.entityId}</p>
                {report.message && <p className="text-xs text-gray-600 mt-1 italic">"{report.message}"</p>}
                <p className="text-[11px] text-gray-400 mt-2">Filed by: {report.reporter.name} ({report.reporter.email})</p>
              </div>

              <form action={handleResolve} className="flex flex-col sm:flex-row gap-2 items-center self-center">
                <input type="hidden" name="reportId" value={report.id} />
                <input type="hidden" name="realCommunityId" value={community.id} />
                <select name="action" className="p-1.5 border text-xs rounded bg-slate-50">
                  <option value="CANCEL_SESSION">Cancel Target Session</option>
                  <option value="REJECT_REPORT">Dismiss Report</option>
                </select>
                <button type="submit" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-sm">
                  Apply Action
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}