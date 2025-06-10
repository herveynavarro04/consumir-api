import type React from "react"
interface StatBarProps {
  name: string
  value: number
  icon: React.ReactNode
}

export default function StatBar({ name, value, icon }: StatBarProps) {
  const percentage = Math.min((value / 150) * 100, 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium capitalize flex items-center gap-2">
          {icon}
          {name.replace("-", " ")}
        </span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
