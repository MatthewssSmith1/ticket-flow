import { useTicketMessageStore, useAgentMessageStore, Variant, LoadParams } from '@/stores/messageStore';
import { MessageView } from './Message';
import { ScrollArea } from '@ui/scroll-area';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Props = {
  type: Variant;
  params: LoadParams;
  className?: string;
};

export function MessageArea({ type, params, className }: Props) {
  const store = type === 'ticket' ? useTicketMessageStore : useAgentMessageStore;
  const { loadMessages, messages, removeMessage, isLoading } = store();

  useEffect(() => {
    loadMessages(params);
  }, [params.ticketId, params.authorId]);

  return (
    <div className="relative h-full">
      <ScrollArea className={cn('h-full', className)}>
        {messages.map((message) => (
          <MessageView 
            key={message.id} 
            message={message} 
            onDelete={removeMessage}
          />
        ))}
      </ScrollArea>
      {isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}