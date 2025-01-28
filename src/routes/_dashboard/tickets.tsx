import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@ui/tooltip"
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
    <main className="grid @3xl:grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr] @3xl:grid-rows-[auto_1fr] h-full">
      <section className="flex items-center gap-3">
        <Filter className="text-muted-foreground mr-1 flex-shrink-0 size-[22px]" />
        <ViewSelect />
        <TooltipProvider>
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
        </TooltipProvider>
      </section>
      <section className="flex items-center gap-3 mr-auto @3xl:mr-0 @3xl:ml-auto">
        <Columns className="text-muted-foreground" />
        <ColumnMultiSelect 
          options={allColumns} 
          defaultValue={visibleColumns} 
          onValueChange={setVisibleColumns} 
        />
      </section>
      <section className="col-span-full min-w-0 overflow-auto shadow rounded-md border [&>*]:border-0">
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

  // TODO: store selected columns in cookies
  return (
    <MultiSelect
      options={columnOptions}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      placeholder="Select columns"
    />
  )
}