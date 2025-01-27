import { useMemo, useState } from 'react'
import { Tag as TagType } from '@/types/types'
import { MultiSelect } from '@ui/multi-select'
import { useOrgStore } from '@/stores/orgStore'

type Props = {
  value: number[]
  onValueChange: (tagIds: number[]) => void
  filter?: (tag: TagType) => boolean
  placeholder?: string
  className?: string
}

export function TagMultiSelect({ value, onValueChange, filter, placeholder, className }: Props) {
  const { openOrg } = useOrgStore()
  const [selectedIds, setSelectedIds] = useState<string[]>(
    value.map(id => id.toString())
  )

  const tags = useMemo(() =>
    openOrg?.tags?.filter(filter ?? (() => true)) ?? [],
  [openOrg, filter])

  const options = useMemo(() => 
    tags.map(tag => ({
      label: tag.name,
      value: tag.id.toString(),
      icon: () => <div style={{ backgroundColor: tag.color }} className="size-3 mt-[1px] mr-0.5 rounded-full" />
    })),
  [tags])

  const handleValueChange = (values: string[]) => {
    setSelectedIds(values)
    onValueChange(values.map(v => parseInt(v)))
  }

  return (
    <MultiSelect
      className={className}
      options={options}
      onValueChange={handleValueChange}
      defaultValue={selectedIds}
      placeholder={placeholder ?? "Select tags"}
    />
  )
}
