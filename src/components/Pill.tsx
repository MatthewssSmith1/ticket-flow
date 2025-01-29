import { Status, Priority, Channel, Role } from '@shared/types'
import { Badge } from '@ui/badge'
import { cn } from '@/lib/utils'

const colors: Record<Status | Priority | Channel | Role, string> = {
  // Status
  NEW: 'bg-stone-500 text-white',
  OPEN: 'bg-teal-500 text-white',
  PENDING: 'bg-blue-500 text-white',
  ON_HOLD: 'bg-pink-500 text-white',
  SOLVED: 'bg-lime-500 text-white',
  REOPENED: 'bg-purple-500 text-white',
  CLOSED: 'bg-emerald-600 text-white',
  // Priority
  URGENT: 'bg-red-700 text-white',
  HIGH: 'bg-orange-700 text-white',
  NORMAL: 'bg-yellow-700 text-white',
  LOW: 'bg-stone-700 text-white',
  // Channel
  EMAIL: 'bg-red-200 text-black',
  WEB: 'bg-blue-200 text-black',
  CHAT: 'bg-green-200 text-black',
  API: 'bg-purple-200 text-black',
  // Role 
  OWNER: 'bg-green-500 text-white',
  ADMIN: 'bg-blue-500 text-white',
  AGENT: 'bg-yellow-500 text-black',
  CUSTOMER: 'bg-gray-500 text-white',
}

export function Pill({ text }: { text: Status | Priority | Channel | Role }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        colors[text],
        'rounded-full font-semibold select-none pb-[3px] border-none whitespace-nowrap overflow-hidden text-ellipsis'
      )}
    >
      {text.toLowerCase().replace('_', ' ')}
    </Badge>
  )
}
