import { Ticket } from '@/types/types'
import { create } from 'zustand'

export interface ViewFilter {
  id: keyof Ticket
  value: string | boolean
}

export interface View {
  id: string
  name: string
  filters: ViewFilter[]
}

const VIEWS: View[] = [
  {
    id: '1',
    name: 'All tickets',
    filters: [],
  },
  {
    id: '2',
    name: 'New',
    filters: [
      { id: 'status', value: 'NEW' }
    ]
  },
  {
    id: '3',
    name: 'Open',
    filters: [
      { id: 'status', value: 'OPEN' }
    ]
  },
  {
    id: '4',
    name: 'Pending',
    filters: [
      { id: 'status', value: 'PENDING' }
    ]
  },
  {
    id: '5',
    name: 'On Hold',
    filters: [
      { id: 'status', value: 'ON_HOLD' }
    ]
  },
  {
    id: '6',
    name: 'Solved',
    filters: [
      { id: 'status', value: 'SOLVED' }
    ]
  },
  {
    id: '7',
    name: 'Reopened',
    filters: [
      { id: 'status', value: 'REOPENED' }
    ]
  },
  {
    id: '8',
    name: 'Closed',
    filters: [
      { id: 'status', value: 'CLOSED' }
    ]
  }
]

interface State {
  views: View[]
  selectedView: View | null
  setSelectedView: (id: string) => void
}

export const useViewStore = create<State>((set) => ({
  views: VIEWS,
  selectedView: VIEWS[0],
  setSelectedView: (id: string) => 
    set((state) => ({
      selectedView: state.views.find(view => view.id === id) ?? null
    }))
}))
