import { UserIcon, LockIcon, Trash2Icon } from 'lucide-react' 
import { TicketContent } from './TicketContent'
import { useOrgStore } from '@/stores/orgStore' 
import { Message } from '@shared/types' 
import { Button } from '@ui/button' 
import { cn } from '@/lib/utils'

export function MessageView({ message, onDelete }: {
  message: Message 
  onDelete?: (id: number) => Promise<void> 
}) {
  const { getMemberName, authMember } = useOrgStore() 
  const isAuthor = message.author_id === authMember?.id 
  const isTicketRef = message.content === null 
  const time = new Date(message.created_at).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit' 
  }) 

  const handleDelete = async () => {
    if (onDelete) await onDelete(message.id) 
  } 

  return (
    <div className={cn(
      'group/message relative flex items-center gap-3 px-3 py-2 mb-3 rounded transition-colors',
      ['AGENT', 'USER'].includes(message.message_type) ? 'max-w-[80%]' : 'w-full',
      message.message_type === 'AGENT' ? 'mr-auto' : 'ml-auto',
      'bg-muted/50 hover:bg-muted',
    )}>
      {['INTERNAL', 'EXTERNAL'].includes(message.message_type) && (
        <div className="mx-2">
          <UserIcon className="size-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1">
        { !isTicketRef && <div className="flex items-center gap-2 mb-[3px]">
          <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            {message.message_type === 'AGENT' ? 'Agent' : getMemberName(message.author_id) ?? ''}
          </span>
          <span className="text-xs mt-[1px] text-muted-foreground select-none whitespace-nowrap">
            {time}
          </span>
          {message.message_type === 'INTERNAL' && <LockIcon className="size-3 text-muted-foreground" />}
        </div>}
        {(isTicketRef && message.ticket_id) ? (
          <TicketContent ticketId={message.ticket_id} />
        ) : (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        )}
      </div>

      {isAuthor && onDelete && (
        <div className={cn(
          "absolute opacity-0 group-hover/message:opacity-100 transition-opacity",
          isTicketRef ? "top-0 -right-1 translate-x-full" : "top-1 right-1"
        )}>
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
  ) 
}
