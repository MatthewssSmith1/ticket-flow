import { useTicketMessageStore, useAgentMessageStore, Variant, LoadParams } from '@/stores/messageStore';
import { MessageView } from './Message';
import { ScrollArea } from '@ui/scroll-area';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  type: Variant;
  params: LoadParams;
  className?: string;
};

export function MessageArea({ type, params, className }: Props) {
  const store = type === 'ticket' ? useTicketMessageStore : useAgentMessageStore;
  const { loadMessages, messages, removeMessage } = store();

  useEffect(() => {
    loadMessages(params);
  }, [params.ticketId, params.authorId]);

  return (
    <ScrollArea className={cn('h-full', className)}>
      {messages.map((message) => (
        <MessageView 
          key={message.id} 
          message={message} 
          onDelete={removeMessage}
        />
      ))}
    </ScrollArea>
  );
}