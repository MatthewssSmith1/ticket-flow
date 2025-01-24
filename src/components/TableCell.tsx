import { cn } from "@/lib/utils"

const LEFT_ALIGNED = ['subject', 'name']

export function TableCellContent({ columnId, children }: { columnId: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex truncate overflow-ellipsis select-none",
      !LEFT_ALIGNED.includes(columnId) && "justify-center",
    )}>
      {children}
    </div>
  )
} 