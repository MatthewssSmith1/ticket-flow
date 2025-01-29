import supabase, { unwrap } from '@/lib/supabase' 
import { Message } from '@shared/types' 
import { create } from 'zustand' 

export type Variant = 'ticket' | 'agent' 
export type LoadParams = 
  | { ticketId: string;  authorId?: never;  }
  | { ticketId?: never;  authorId: number;  } 

interface MessagesState {
  messages: Message[] 
  loadMessages: (params: LoadParams) => Promise<void> 
  addMessages: (messages: Message[]) => Promise<void> 
  removeMessage: (id: number) => Promise<void> 
  clearMessages: () => Promise<void> 
}

export const createMessageStore = (type: Variant) => create<MessagesState>()((set, get) => ({
  messages: [],
  loadMessages: async (params: LoadParams) => {
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
        messages: await query.order('created_at', { ascending: true }).then(unwrap)
      }) 
    } catch (error) {
      console.error('Failed to load messages', error) 
    }
  },
  addMessages: async (messages) => {
    if (!messages) return 

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
      messages: [...state.messages, ...messages] 
    })) 
  },
  removeMessage: async (id: number) => {
    await supabase.from('messages').delete().eq('id', id) 
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })) 
  },
  clearMessages: async () => {
    const { messages } = get() 
    
    if (type === 'ticket' || messages.length === 0) return 

    const authorId = messages[0]?.author_id 
    if (!authorId) return 

    const { error } = await supabase.from('messages')
      .delete()
      .in('message_type', ['AGENT', 'USER'])
      .eq('author_id', authorId) 
    
    if (error) {
      console.error('Failed to clear messages', error) 
      return 
    }
    
    set({ messages: [] }) 
  },
})) 

export const useTicketMessageStore = createMessageStore('ticket') 
export const useAgentMessageStore = createMessageStore('agent') 