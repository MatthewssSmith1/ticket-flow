import { TICKET_WITH_REFS_QUERY, TicketWithRefs } from '@/components/table/ticketColumns'
import { UserIcon, LockIcon, Trash2Icon } from 'lucide-react' 
import { formatAssignee } from '@/lib/string'
import { useNavigate } from '@tanstack/react-router' 
import { useOrgStore } from '@/stores/orgStore' 
import { useQuery } from '@tanstack/react-query' 
import { Message } from '@shared/types' 
import { Button } from '@ui/button' 
import supabase from '@/lib/supabase' 
import { Pill } from '@/components/Pill' 
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
      'group/message relative flex items-center gap-3 px-3 py-2 mb-3 rounded-lg transition-colors',
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
        <Content message={message} />
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

function Content({ message }: { message: Message }) {
  if (message.content) {
    return <p className="text-sm text-foreground">{message.content}</p> 
  }

  if (!message.ticket_id || message.message_type !== 'AGENT') return null 

  return <TicketContent ticketId={message.ticket_id} /> 
}

function TicketContent({ ticketId }: { ticketId: string }) {
  const { openOrg, getMemberName } = useOrgStore() 
  const navigate = useNavigate() 

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(TICKET_WITH_REFS_QUERY)
        .eq('id', ticketId)
        .single() 
      
      if (error) throw error 
      return data as TicketWithRefs 
    }
  }) 

  if (isLoading) return <div className="animate-pulse bg-muted h-24 rounded-lg" /> 
  if (!ticket) return null 

  const handleClick = () => {
    navigate({ to: '/ticket/$id', params: { id: ticket.id } }) 
  } 

  return (
    <div 
      className="rounded-lg px-2 py-1 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="font-medium">{ticket.subject}</h2>
        <div className="flex gap-2 pt-0.5">
          <Pill text={ticket.priority} />
          <Pill text={ticket.status} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2 line-clamp-4">{ticket.description}</p>
      <TimestampLine 
        verb="Created"
        name={ticket.author_id ? getMemberName(ticket.author_id) : null} 
        date={new Date(ticket.verified_at ?? ticket.created_at).toLocaleDateString()}
      />
      <TimestampLine 
        verb="Due"
        name={formatAssignee(ticket, openOrg)} 
        date={ticket.due_at ? new Date(ticket.due_at).toLocaleDateString() : null}
      />
    </div>
  ) 
}

function TimestampLine({ verb, name, date }: { verb: string, name: string | null, date: string | null }) {
  if (!name && !date) return null;

  let message = verb;
  if (name) {
    message += ` by ${name}`;
  }
  if (date) {
    message += ` on ${date}`;
  }

  return (
    <h3 className="text-xs text-muted-foreground mt-1">
      {message}
    </h3>
  );
}
