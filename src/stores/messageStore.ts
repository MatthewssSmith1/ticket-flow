import supabase, { unwrap } from '@/lib/supabase';
import { Message } from '@shared/types';
import { create } from 'zustand';

interface MessagesState {
  messages: Message[];
  loadMessages: (ticketId: string) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'created_at'>) => Promise<void>;
  removeMessage: (id: number) => Promise<void>;
}

export const useMessageStore = create<MessagesState>()((set) => ({
  messages: [],
  loadMessages: async (ticketId: string) => {
    const messages = await supabase.from('messages').select('*').eq('ticket_id', ticketId).then(unwrap);
    set({ messages });
  },
  addMessage: async (message) => {
    const { data } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (data) set((state) => ({ 
      messages: [...state.messages, data] 
    }));
  },
  removeMessage: async (id: number) => {
    await supabase.from('messages').delete().eq('id', id);
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    }));
  },
}));