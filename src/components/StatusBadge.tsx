import { Badge } from '@/components/ui/badge'
import { Status } from '@/types/types'
import { cn } from '@/lib/utils'

const colors: Record<Status, string> = {
  NEW: 'bg-amber-500 text-black hover:bg-amber-600',
  OPEN: 'bg-red-500 text-white hover:bg-red-600',
  PENDING: 'bg-blue-500 text-white hover:bg-blue-600',
  ON_HOLD: 'bg-yellow-500 text-black hover:bg-yellow-600',
  SOLVED: 'bg-emerald-500 text-white hover:bg-emerald-600',
  REOPENED: 'bg-purple-500 text-white hover:bg-purple-600',
  CLOSED: 'bg-green-500 text-white hover:bg-green-600',
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={cn(colors[status], 'rounded-full font-semibold')}>
      {status.toLowerCase()}
    </Badge>
  )
}
