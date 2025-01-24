import { Filter, statusEq, priorityEq, channelEq } from '@/lib/filter'
import { create } from 'zustand'

export interface View {
  id: string
  name: string
  filters: Filter[]
}

const VIEWS: View[] = [
  { id: '1', name: 'All tickets', filters: [] },
  // Status
  { id: '2', name: 'New', filters: [statusEq('NEW')] },
  { id: '3', name: 'Open', filters: [statusEq('OPEN')] },
  { id: '4', name: 'Closed', filters: [statusEq('CLOSED')] },
  { id: '5', name: 'Solved', filters: [statusEq('SOLVED')] },
  { id: '6', name: 'Pending', filters: [statusEq('PENDING')] },
  { id: '7', name: 'On Hold', filters: [statusEq('ON_HOLD')] },
  { id: '8', name: 'Reopened', filters: [statusEq('REOPENED')] },
  // Priority
  { id: '9', name: 'Urgent', filters: [priorityEq('URGENT')] },
  { id: '10', name: 'High', filters: [priorityEq('HIGH')] },
  { id: '11', name: 'Medium', filters: [priorityEq('NORMAL')] },
  { id: '12', name: 'Low', filters: [priorityEq('LOW')] },
  // Channel
  { id: '13', name: 'Web', filters: [channelEq('WEB')] },
  { id: '14', name: 'Email', filters: [channelEq('EMAIL')] },
  { id: '15', name: 'Chat', filters: [channelEq('CHAT')] },
  { id: '16', name: 'API', filters: [channelEq('API')] },
  // Other
  { id: '17', name: 'New or Normal', filters: [statusEq('NEW'), priorityEq('NORMAL')] },
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
