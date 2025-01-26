import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@ui/calendar"
import { useState } from "react"
import { Button } from "@ui/button"
import { cn } from "@/lib/utils"

type Props = {
  value: string | null
  onValueChange: (date?: Date) => void
  disabled?: 'past' | ((date: Date) => boolean)
}

export function DatePickerWithPresets({ value, onValueChange, disabled }: Props) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)

  function handleChange(day: Date | undefined) {
    setDate(day);
    onValueChange(day);
  }

  if (disabled === 'past') disabled = (date: Date) => date < new Date()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) => handleChange(addDays(new Date(), parseInt(value)))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={handleChange} 
            disabled={disabled} 
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
