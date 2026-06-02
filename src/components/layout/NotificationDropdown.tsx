"use client"

import { useState } from "react"

interface NotificationItem {
  id: string
  message: string
  createdAt: Date
}

export default function NotificationDropdown({ initialNotifications }: { initialNotifications: NotificationItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState<NotificationItem[]>(initialNotifications)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none bg-gray-100 rounded-full"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden text-black">
          <div className="p-3 border-b font-bold text-sm bg-gray-50 flex justify-between">
            <span>In-App Alerts</span>
            <span className="text-xs text-gray-400 font-normal">Live Sync</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-xs text-gray-400 text-center">No recent alerts recorded.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3 border-b hover:bg-slate-50 transition text-xs text-gray-700">
                  <p>{n.message}</p>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}