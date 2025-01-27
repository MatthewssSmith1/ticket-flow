import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { Filter, Plus, Columns } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { TicketTable } from '@/components/table/TicketTable'
import { MultiSelect } from '@ui/multi-select'
import { ViewSelect } from '@/components/select/ViewSelect'
import { COLUMN_IDS } from '@/lib/filter'
import { useState } from 'react'
import { Button } from '@ui/button'

export const Route = createFileRoute('/_dashboard/tickets')({
  component: TicketsPage
})

function TicketsPage() {
  const [columns, setColumns] = useState(COLUMN_IDS)

  return (
    <main className="grid grid-rows-[auto_1fr]">
      <section className="flex items-center gap-3 [&_svg]:size-5">
        <Filter className="text-muted-foreground mr-1" />
        <ViewSelect />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => console.log('new filter')}>
              <Plus aria-label="Create new filter" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new filter</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-2 ml-auto">
          <Columns className="text-muted-foreground" />
          <ColumnMultiSelect value={columns} onValueChange={setColumns} />
        </div>
      </section>
      <section className="min-w-0 overflow-auto">
        <TicketTable hiddenColumns={columns} />
      </section>
    </main>
  )
}

function ColumnMultiSelect({value, onValueChange}: {value: string[], onValueChange: (value: string[]) => void}) {
  const columnOptions = COLUMN_IDS.map(id => ({
    label: id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: id
  }))

  return (
    <MultiSelect
      options={columnOptions}
      defaultValue={value}
      onValueChange={onValueChange}
      placeholder="Select columns"
    />
  )
}