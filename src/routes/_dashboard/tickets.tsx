import { COLUMN_IDS, CUSTOMER_COLUMN_IDS } from '@/components/table/ticketColumns'
import { useState, useEffect } from 'react'
import { Filter, Columns } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { TicketTable } from '@/components/table/TicketTable'
import { useOrgStore } from '@/stores/orgStore'
import { MultiSelect } from '@ui/multi-select'
import { ViewSelect } from '@/components/select/ViewSelect'

export const Route = createFileRoute('/_dashboard/tickets')({
  component: TicketsPage
})

function TicketsPage() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const { openOrg, isCustomer } = useOrgStore()

  const customColumns = openOrg?.fields?.map(field => field.name) || []
  const allColumns = isCustomer
    ? CUSTOMER_COLUMN_IDS 
    : [...COLUMN_IDS, ...customColumns]

  useEffect(() => {
    if (!openOrg || visibleColumns.length > 0) return

    setVisibleColumns(allColumns)
  }, [openOrg, allColumns, visibleColumns])

  if (visibleColumns.length === 0) return null

  return (
    <main className="grid @3xl:grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr] @3xl:grid-rows-[auto_1fr] h-full">
      <section className="flex items-center gap-3">
        <Filter className="text-muted-foreground mr-1 flex-shrink-0 size-[22px]" />
        <ViewSelect />
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled>
                <Plus aria-label="Create new filter" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
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

  return (
    <MultiSelect
      options={columnOptions}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      placeholder="Select columns"
    />
  )
}