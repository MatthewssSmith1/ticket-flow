import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { UserIcon, LockIcon, Trash2Icon } from 'lucide-react';
import { Message, Ticket } from '@/types/types';
import { useMessageStore } from '@/stores/messageStore';
import { MessageInput } from './MessageInput';
import { useOrgStore } from '@/stores/orgStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function TicketMessages({ ticket }: { ticket: Ticket }) {
  const { messages, loadMessages } = useMessageStore();

  useEffect(() => {
    loadMessages(ticket.id);
  }, [ticket.id]);

  return (
    <Card className="flex flex-col h-full min-h-[50vh] max-h-[95vh]">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4 space-y-1">
          {messages.map((message) => <MessageView key={message.id} message={message} />)}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <MessageInput ticketId={ticket.id} />
      </CardFooter>
    </Card>
  );
}

function MessageView({ message }: { message: Message }) {
  const { removeMessage } = useMessageStore();
  const { members, authMember } = useOrgStore();

  const isAuthor = message.author_id === authMember?.id;

  const time = new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const name = isAuthor ? 'You' : members?.find(m => m.id === message.author_id)?.name;

  const handleDelete = async () => {
    await removeMessage(message.id);
  };

  return (
    <div className="group relative flex items-center gap-3 px-2 py-1 hover:bg-muted rounded-sm transition-colors">
      <div className="mx-2">
        <UserIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{name ?? ''}</span>
          <span className="text-xs mt-[1px] text-muted-foreground select-none whitespace-nowrap">{time}</span>
          {message.is_internal && <LockIcon className="size-3 text-muted-foreground" />}
        </div>
        <p className="text-sm text-foreground">{message.content}</p>
      </div>
      {isAuthor && (
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
        >
          <Trash2Icon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
