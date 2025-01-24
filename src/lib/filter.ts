import { Channel, FieldType, Priority, Status, Ticket } from "@/types/types"
import { Row, RowData } from "@tanstack/react-table"

// TODO: consider composable/nested filters (AND/OR/NOT operators)
export type Operator =
  | 'EQ' | 'NOT_EQ' 
  | 'IN' | 'NOT_IN' 
  | 'CONTAINS' | 'NOT_CONTAINS' 
  | 'LT' | 'LTE' | 'GT' | 'GTE' 

export type Filter = {
  type: FieldType
  field: keyof Ticket
  operator: Operator
  value: string
}

export const statusEq = (value: Status): Filter => ({ type: 'TEXT', field: 'status', operator: 'EQ', value })
export const channelEq = (value: Channel): Filter => ({ type: 'TEXT', field: 'channel', operator: 'EQ', value })
export const priorityEq = (value: Priority): Filter => ({ type: 'TEXT', field: 'priority', operator: 'EQ', value })

export function ticketFilter<T extends RowData>(row: Row<T>, columnId: string, filterValue: any, addMeta: (meta: any) => void): boolean {
  if (filterValue.length === 0) return true

  const applicableFilters = filterValue.filter((f: Filter) => f.field === columnId)
  if (applicableFilters.length === 0) return false

  const rowVal = row.getValue(columnId)

  // TODO: rows currently pass if any of the filters are true
  return applicableFilters.every((f: Filter) => {
    switch (f.operator) {
      case 'EQ':
        return eqOp(rowVal, f)
      case 'NOT_EQ':
        return !eqOp(rowVal, f)
      case 'CONTAINS':
        return containsOp(rowVal, f)
      case 'NOT_CONTAINS':
        return !containsOp(rowVal, f)
      case 'IN':
        return inOp(rowVal, f)
      case 'LT':
        return cmpOp(rowVal, f, (a, b) => a < b)
      case 'LTE':
        return cmpOp(rowVal, f, (a, b) => a <= b)
      case 'GT':
        return cmpOp(rowVal, f, (a, b) => a > b)
      case 'GTE':
        return cmpOp(rowVal, f, (a, b) => a >= b)
      default:
        return false
    }
  })
}

// TODO: fully implement operators and add type checking (only EQ is used for now)
function eqOp(rowVal: any, filter: Filter) {
  return rowVal === filter.value
}

function containsOp(rowVal: any, filter: Filter) {
  return rowVal.toLowerCase().includes(filter.value.toLowerCase())
}

function inOp(rowVal: any, filter: Filter) {
  if (!Array.isArray(filter.value)) return false
  return filter.value.includes(rowVal)
}

function cmpOp(rowVal: any, filter: Filter, compareFn: (a: any, b: any) => boolean) {
  const filterVal = Number(filter.value)
  if (isNaN(filterVal)) return false
  return compareFn(rowVal, filterVal)
}
