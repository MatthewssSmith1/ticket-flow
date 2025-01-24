import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnumKey, EnumInstance } from '@/types/types'
import { useState } from 'react';
import { Pill } from './Pill'

const ENUM_OPTIONS: Record<EnumKey, EnumInstance[]> = {
  status: ['NEW', 'OPEN', 'PENDING', 'ON_HOLD', 'SOLVED', 'REOPENED', 'CLOSED'],
  priority: ['URGENT', 'HIGH', 'NORMAL', 'LOW'],
  channel: ['EMAIL', 'WEB', 'CHAT', 'API'],
  role: ['OWNER', 'ADMIN', 'AGENT', 'CUSTOMER'],
} as const

type Props = {
  enumKey: EnumKey
  value: EnumInstance
  onValueChange: (value: EnumInstance) => void
  disabled?: boolean
}

export function EnumSelect({ 
  enumKey,
  value, 
  onValueChange,
  disabled = false
}: Props) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (val: EnumInstance) => {
    setCurrentValue(val);
    onValueChange(val);
  };

  const options = ENUM_OPTIONS[enumKey]
  const placeholder = `Select ${enumKey}...`

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className="max-w-[125px]">
        <SelectValue>
          {currentValue ? <Pill text={currentValue} /> : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            <Pill text={option} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 