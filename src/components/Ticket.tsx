import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { EnumInstance, EnumKey, Ticket } from '@/types/types';
import { DatePickerWithPresets } from './DatePicker';
import supabase, { unwrap } from '@/lib/supabase';
import { useOrgStore } from '@/stores/orgStore';
import { EnumSelect } from './EnumSelect';
import { useQuery } from '@tanstack/react-query';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';

const getTicket = (id: string) => ({
  queryKey: ['ticket', id],
  queryFn: async () => (
    await supabase.from('tickets')
      .select('*')
      .eq('id', id)
      .single()
      .then(unwrap)
  )
});

export function TicketView({ id }: { id: string }) {
  const { data: ticket, error, isLoading } = useQuery(getTicket(id));
  const { members } = useOrgStore();

  if (isLoading || !ticket) return <div>Loading...</div>;
  if (error) return <div>Error loading ticket</div>;

  return (
    <main className="grid lg:grid-cols-[2fr_3fr] gap-6">
      <Card className="min-w-[150px]">
        <CardHeader>
          <CardTitle>{ticket.subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <Fields ticket={ticket} memberName={members?.find(m => m.id === ticket.author_id)?.name ?? ticket.name ?? '-'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Messages />
        </CardContent>
      </Card>
    </main>
  );
} 

interface FieldsProps {
  ticket: Ticket;
  memberName: string;
}

function Fields({ ticket, memberName }: FieldsProps) {
  const { status, priority, channel, verified_at, due_at, tags, description } = ticket;

  function setEnum(field: EnumKey, value: EnumInstance) {
    supabase.from('tickets')
      .update({ [field]: value })
      .eq('id', ticket.id)
      .then(unwrap)
      .then(() => console.log('Ticket updated'));
  }

  function setDueDate(value?: Date) {
    supabase.from('tickets')
      .update({ due_at: value ? value.toISOString() : null })
      .eq('id', ticket.id)
      .then(unwrap)
      .then(() => console.log('Ticket updated'));
  }
  
  return (
    <div className="space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2">
      <div>
        <h2 className="text-center">Submitted by <span className="font-semibold">{memberName}</span> on <i>{verified_at ? new Date(verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</i></h2>
      </div>
      <Separator />
      <div className="grid lg:grid-cols-2 gap-4 [&>div]:space-y-2 text-muted-foreground">
        <div>
          <h2>Status</h2>
          <EnumSelect enumKey="status" value={status} onValueChange={(value) => setEnum('status', value)} />
        </div>
        <div>
          <h2>Priority</h2>
          <EnumSelect enumKey="priority" value={priority} onValueChange={(value) => setEnum('priority', value)} />
        </div>
        <div>
          <h2>Channel</h2>
          <EnumSelect enumKey="channel" value={channel} onValueChange={(value) => setEnum('channel', value)} />
        </div>
        <div>
          <h2>Tags</h2>
          <p>{tags?.length ? tags.join(', ') : '-'}</p>
        </div>
      </div>
      <div>
        <h2>Due Date</h2>
        <DatePickerWithPresets value={due_at} onValueChange={setDueDate} disabled={'past'} />
      </div>
      
      <Separator />
      <div className="space-y-2">
        <h2>Description</h2>
        <Textarea 
          value={description} 
          disabled 
          className="resize-none bg-muted cursor-default" 
          rows={5}
        />
      </div>
    </div>
  );
}

function Messages() {
  return (
    <Textarea  />
  )
}