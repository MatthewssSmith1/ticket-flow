import { FormControl } from '@ui/form'
import { useState } from 'react'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Badge } from '@ui/badge'
import { X } from 'lucide-react'

type Props = {
  value: string[] | null
  onChange: (value: string[] | null) => void
  disabled?: boolean
}

export function SelectOptionsBuilder({ value, onChange, disabled }: Props) {
  const [optionInput, setOptionInput] = useState('')

  const handleAddOption = () => {
    if (!optionInput.trim()) return
    const newOptions = [...(value ?? []), optionInput.trim()]
    onChange(newOptions)
    setOptionInput('')
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = value?.filter((_, i) => i !== index)
    onChange(newOptions ?? null)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <FormControl>
          <Input
            placeholder="Type an option and press Enter"
            disabled={disabled}
            value={optionInput}
            onChange={e => setOptionInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && optionInput.trim()) {
                e.preventDefault()
                handleAddOption()
              }
            }}
          />
        </FormControl>
        <Button
          type="button"
          variant="secondary"
          disabled={!optionInput.trim() || disabled}
          onClick={handleAddOption}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value?.map((option, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="pr-1.5 pl-2.5 gap-1 select-none hover:bg-secondary [&:has(:hover)]:bg-secondary/80"
          >
            {option}
            <button
              type="button"
              className="hover:bg-muted rounded-full p-0.5"
              onClick={() => handleDeleteOption(index)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}