import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip"
import { TICKET_WITH_REFS_QUERY } from '@/components/table/ticketColumns'
import supabase, { unwrap } from '@/lib/supabase' 
import { formatAssignee } from '@/lib/string'
import { useNavigate } from '@tanstack/react-router' 
import { useOrgStore } from '@/stores/orgStore' 
import { useQuery } from '@tanstack/react-query' 
import { Badge } from '@/components/ui/badge'
import { Pill } from '@/components/Pill' 
import { Tag } from '@shared/types'

export function TicketContent({ ticketId }: { ticketId: string }) {
  const { openOrg, getMemberName, getTag } = useOrgStore()
  const navigate = useNavigate()

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      return (await supabase
        .from('tickets')
        .select(TICKET_WITH_REFS_QUERY)
        .eq('id', ticketId)
        .single()
        .then(unwrap))
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
      <div className="flex items-center flex-wrap gap-1 mb-1 text-muted-foreground">
        <TimestampLine 
          verb="Created"
          name={ticket.author_id ? getMemberName(ticket.author_id) : null} 
          date={new Date(ticket.verified_at ?? ticket.created_at).toLocaleDateString()}
        />
        <BulletPoint />
        <TimestampLine 
          verb="Due"
          name={formatAssignee(ticket, openOrg)} 
          date={ticket.due_at ? new Date(ticket.due_at).toLocaleDateString() : null}
        />
        <BulletPoint />
        { ticket.tags_tickets?.map(({ tag_id }) => <TagBadge key={tag_id} tag={getTag(tag_id)} />)}
      </div>
    </div>
  ) 
}

const BulletPoint = () => <span className="first:hidden last:hidden [&+span]:hidden [&:has(+span:last-child)]:hidden -translate-y-[1px]">•</span>;

function TimestampLine({ verb, name, date }: { verb: string, name: string | null, date: string | null }) {
  if (!name && !date) return null;

  let message = verb;
  if (name) message += ` by ${name}`;
  if (date) message += ` on ${date}`;

  return <p className="text-xs whitespace-nowrap">{message}</p>;
}

function TagBadge({ tag }: { tag: Tag | null }) {
  if (!tag) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="h-[10px] w-6 rounded-full cursor-help hover:shadow hover:brightness-125 transition-all" style={{ backgroundColor: tag.color }} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tag.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}