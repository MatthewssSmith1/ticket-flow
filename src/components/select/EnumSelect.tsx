import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select'
import { Status, Priority, Channel, Role } from '@shared/types'
import { useState } from 'react';
import { Pill } from '@/components/Pill'

export type EnumKey = 'status' | 'priority' | 'channel' | 'role'
export type EnumInstance = Status | Priority | Channel | Role

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
  filter?: (value: EnumInstance) => boolean
}

export function EnumSelect({ 
  enumKey,
  value, 
  onValueChange,
  disabled = false,
  filter,
}: Props) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (val: EnumInstance) => {
    setCurrentValue(val);
    onValueChange(val);
  };

  const options = filter 
    ? ENUM_OPTIONS[enumKey].filter(filter) 
    : ENUM_OPTIONS[enumKey]

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className="min-w-[120px] md:max-w-[150px]">
        <SelectValue>
          {currentValue ? <Pill text={currentValue} /> : `Select ${enumKey}...`}
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