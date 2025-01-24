import { ChevronDown, ChevronUp } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import { Button } from './ui/button'

export function SortableHeader({ column, label }: { column: Column<any, unknown>, label: string }) {
  const sortDirection = column.getIsSorted()

  const toggleSorting = () => {
    if (!sortDirection) column.toggleSorting(false)
    else if (sortDirection === 'asc') column.toggleSorting(true)
    else column.clearSorting()
  }

  return (
    <Button onClick={toggleSorting} variant="ghost" className="w-full justify-center py-1.5 px-3">
      <span className="ml-5">{label}</span>
      <SortIcon order={sortDirection} />
    </Button>
  )
} 

function SortIcon({ order }: { order: false | 'asc' | 'desc' }) {
  if (order === 'asc') return <ChevronDown className="ml-1 size-4" />
  if (order === 'desc') return <ChevronUp className="ml-1 size-4" />
  return <div className="ml-1 size-4 opacity-0" />
}