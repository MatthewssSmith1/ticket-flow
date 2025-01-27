import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { Filter, Plus, Columns } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { TicketTable } from '@/components/table/TicketTable'
import { useOrgStore } from '@/stores/orgStore'
import { MultiSelect } from '@ui/multi-select'
import { ViewSelect } from '@/components/select/ViewSelect'
import { COLUMN_IDS } from '@/components/table/ticketColumns'
import { useState } from 'react'
import { Button } from '@ui/button'

export const Route = createFileRoute('/_dashboard/tickets')({
  component: TicketsPage
})

function TicketsPage() {
  const { openOrg } = useOrgStore()
  const customColumns = openOrg?.fields?.map(field => field.name) || []
  const allColumns = [...COLUMN_IDS, ...customColumns]
  const [visibleColumns, setVisibleColumns] = useState(allColumns)

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
          <ColumnMultiSelect 
            options={allColumns} 
            defaultValue={visibleColumns} 
            onValueChange={setVisibleColumns} 
          />
        </div>
      </section>
      <section className="min-w-0 overflow-auto">
        <TicketTable visibleColumns={visibleColumns.length > 0 ? visibleColumns : ["subject"]} />
      </section>
    </main>
  )
}

type ColumnMultiSelectProps = {
  options: string[]
  defaultValue: string[]
  onValueChange: (value: string[]) => void
}

function ColumnMultiSelect({onValueChange, options, defaultValue }: ColumnMultiSelectProps) {
  const columnOptions = options.map(id => ({
    label: id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: id
  })) 

  return (
    <MultiSelect
      options={columnOptions}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      placeholder="Select columns"
    />
  )
}