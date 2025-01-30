import { useTicketMessageStore, useAgentMessageStore, Variant, LoadParams } from '@/stores/messageStore';
import { useEffect, useRef } from 'react';
import { MessageView } from './Message';
import { ScrollArea } from '@ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  type: Variant;
  params: LoadParams;
  className?: string;
};

export function MessageArea({ type, params, className }: Props) {
  const store = type === 'ticket' ? useTicketMessageStore : useAgentMessageStore;
  const { loadMessages, messages, removeMessage, isLoading } = store();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages(params);
  }, [params.ticketId, params.authorId]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');

    if (viewport instanceof HTMLElement) viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  return (
    <div className="relative h-full">
      <ScrollArea ref={scrollAreaRef} className={cn('h-full', className)}>
        {messages.map((message) => (
          <MessageView 
            key={message.id} 
            message={message} 
            onDelete={removeMessage}
          />
        ))}
        {isLoading && messages.length > 0 && (
          <div className="w-[80%] h-12 mr-auto rounded-lg bg-muted/50 animate-pulse mb-4" />
        )}
      </ScrollArea>
      {isLoading && messages.length === 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}