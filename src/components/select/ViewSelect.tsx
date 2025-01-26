import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useViewStore } from '@/stores/viewStore'
import { useState } from 'react'

export function ViewSelect() {
  const { views, selectedView, setSelectedView } = useViewStore()
  const [value, setValue] = useState(selectedView?.id ?? '1')

  const handleValueChange = (viewId: string) => {
    setValue(viewId)
    setSelectedView(viewId)
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {views.find(view => view.id === value)?.name ?? 'Select view'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {views.map(view => (
          <SelectItem key={view.id} value={view.id}>
            {view.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 