interface NotificationItem {
  id: string
  message: string
  createdAt: Date
  readAt: Date | null
}

export function RecentNotifications({ items }: { items: NotificationItem[] }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
      <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
        🔔 Latest System Alerts
      </h3>
      
      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400 bg-slate-50/50 border border-dashed rounded-lg">
          No new notifications found.
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg border border-gray-100 bg-slate-50/40 text-xs transition hover:bg-slate-50 flex gap-2 items-start"
            >
              {!item.readAt && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-gray-700 leading-normal">{item.message}</p>
                <span className="text-[10px] text-gray-400 block mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}