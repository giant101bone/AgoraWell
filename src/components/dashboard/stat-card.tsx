interface StatCardsProps {
  upcomingSessionsCount: number
  communitiesCount: number
}

export function StatCards({ upcomingSessionsCount, communitiesCount }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
          📅
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Sessions (7 Days)</p>
          <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{upcomingSessionsCount}</h4>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
          🏢
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Joined Communities</p>
          <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{communitiesCount}</h4>
        </div>
      </div>
    </div>
  )
}