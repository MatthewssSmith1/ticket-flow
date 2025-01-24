import { Status, Priority, Channel, Role } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const colors: Record<Status | Priority | Channel | Role, string> = {
  // Status
  NEW: 'bg-stone-400 text-black',
  OPEN: 'bg-amber-500 text-black',
  PENDING: 'bg-blue-500 text-white',
  ON_HOLD: 'bg-yellow-500 text-black',
  SOLVED: 'bg-lime-500 text-white',
  REOPENED: 'bg-purple-500 text-white',
  CLOSED: 'bg-emerald-700 text-white',
  // Priority
  URGENT: 'bg-red-500 text-black',
  HIGH: 'bg-orange-500 text-white',
  NORMAL: 'bg-stone-400 text-black',
  LOW: 'bg-slate-400 text-black',
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
    <Badge variant="outline" className={cn(colors[text], 'rounded-full font-semibold select-none pb-[3px]')}>
      {text.toLowerCase().replace('_', ' ')}
    </Badge>
  )
}
