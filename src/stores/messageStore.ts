import supabase, { unwrap } from '@/lib/supabase' 
import { Message } from '@shared/types' 
import { create } from 'zustand' 

export type Variant = 'ticket' | 'agent' 
export type LoadParams = 
  | { ticketId: string;  authorId?: never;  }
  | { ticketId?: never;  authorId: number;  } 

interface MessagesState {
  messages: Message[] 
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  loadMessages: (params: LoadParams) => Promise<void> 
  addMessages: (messages: Message[]) => Promise<void> 
  removeMessage: (id: number) => Promise<void> 
  clearMessages: () => Promise<void>
}

export const createMessageStore = (type: Variant) => create<MessagesState>()((set, get) => ({
  messages: [],
  isLoading: false,

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  loadMessages: async (params: LoadParams) => {
    set({ isLoading: true })
    let query = supabase.from('messages').select('*') 

    if (type === 'ticket' && params.ticketId) {
      query = query
        .in('message_type', ['EXTERNAL', 'INTERNAL'])
        .eq('ticket_id', params.ticketId) 
    } else if (type === 'agent' && params.authorId) {
      query = query
        .in('message_type', ['AGENT', 'USER'])
        .eq('author_id', params.authorId) 
    }

    try {
      set({ 
        messages: await query.order('id', { ascending: true }).then(unwrap),
        isLoading: false 
      }) 
    } catch (error) {
      console.error('Failed to load messages', error) 
      set({ isLoading: false })
    }
  },
  addMessages: async (messages) => {
    if (!messages) return 
    set({ isLoading: true })
    const ticketIds = [...new Set(messages
      .map(m => m.ticket_id)
      .filter((id): id is string => id !== null)
    )] 
    
    if (ticketIds.length > 0) {
      await supabase.functions.invoke('batch-embeddings', {
        body: { ticketIds }
      }) 
    }
      
    set((state) => ({ 
      messages: [...state.messages, ...messages],
      isLoading: false
    })) 
  },
  removeMessage: async (id: number) => {
    set({ isLoading: true })
    await supabase.from('messages').delete().eq('id', id) 
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
      isLoading: false
    })) 
  },
  clearMessages: async () => {
    const { messages } = get() 
    
    if (type === 'ticket' || messages.length === 0) return 

    set({ isLoading: true })
    const authorId = messages[0]?.author_id 
    if (!authorId) return 

    const { error } = await supabase.from('messages')
      .delete()
      .in('message_type', ['AGENT', 'USER'])
      .eq('author_id', authorId) 
    
    if (error) {
      console.error('Failed to clear messages', error) 
      set({ isLoading: false })
      return 
    }
    
    set({ messages: [], isLoading: false }) 
  },
})) 

export const useTicketMessageStore = createMessageStore('ticket') 
export const useAgentMessageStore = createMessageStore('agent') 