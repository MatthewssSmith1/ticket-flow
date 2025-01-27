import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { Filter, Plus, Columns } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { TicketTable } from '@/components/table/TicketTable'
import { useOrgStore } from '@/stores/orgStore'
import { MultiSelect } from '@ui/multi-select'
import { ViewSelect } from '@/components/select/ViewSelect'
import { COLUMN_IDS } from '@/lib/filter'
import { useState } from 'react'
import { Button } from '@ui/button'

export const Route = createFileRoute('/_dashboard/tickets')({
  component: TicketsPage
})

function TicketsPage() {
  const { openOrg } = useOrgStore()
  const customColumns = openOrg?.fields?.map(field => field.name) || []
  const initColumns = [...COLUMN_IDS, ...customColumns]
  const [columns, setColumns] = useState(initColumns)

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
          <ColumnMultiSelect options={initColumns} value={columns} onValueChange={setColumns} />
        </div>
      </section>
      <section className="min-w-0 overflow-auto">
        <TicketTable hiddenColumns={columns} />
      </section>
    </main>
  )
}

type ColumnMultiSelectProps = {
  options: string[]
  value: string[]
  onValueChange: (value: string[]) => void
}

function ColumnMultiSelect({value, onValueChange, options}: ColumnMultiSelectProps) {
  const columnOptions = options.map(id => ({
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