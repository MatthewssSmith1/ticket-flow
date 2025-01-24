import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { EnumInstance, EnumKey, Ticket } from '@/types/types';
import { DatePickerWithPresets } from './DatePicker';
import supabase, { unwrap } from '@/lib/supabase';
import { useOrgStore } from '@/stores/orgStore';
import { EnumSelect } from './EnumSelect';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

export function EditTicket({ ticket }: { ticket: Ticket }) {
  const { members } = useOrgStore();

  function setEnum(field: EnumKey, value: EnumInstance) {
    supabase.from('tickets')
      .update({ [field]: value })
      .eq('id', ticket.id)
      .then(unwrap)
  }

  function setDueDate(value?: Date) {
    supabase.from('tickets')
      .update({ due_at: value ? value.toISOString() : null })
      .eq('id', ticket.id)
      .then(unwrap)
  }

  const memberName = members?.find(m => m.id === ticket.author_id)?.name ?? ticket.name ?? '-';
  const verifiedDate = ticket.verified_at ? new Date(ticket.verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  
  return (
    <Card className="min-w-[150px]">
      <CardHeader>
        <CardTitle>{ticket.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2 [&_h2]:select-none">
          <div>
            <h2 className="text-center">
              Submitted by <span className="font-semibold">{memberName}</span> on <i>{verifiedDate}</i>
            </h2>
          </div>
          <Separator />
          <div className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-4 [&>div]:space-y-2 text-muted-foreground">
            <div>
              <h2>Status</h2>
              <EnumSelect enumKey="status" value={ticket.status} onValueChange={(value) => setEnum('status', value)} />
            </div>
            <div>
              <h2>Priority</h2>
              <EnumSelect enumKey="priority" value={ticket.priority} onValueChange={(value) => setEnum('priority', value)} />
            </div>
            <div>
              <h2>Channel</h2>
              <EnumSelect enumKey="channel" value={ticket.channel} onValueChange={(value) => setEnum('channel', value)} />
            </div>
            <div>
              <h2>Tags</h2>
              <p className="select-none">{ticket.tags?.length ? ticket.tags.join(', ') : '-'}</p>
            </div>
          </div>
          <div>
            <h2>Due Date</h2>
            <DatePickerWithPresets value={ticket.due_at} onValueChange={setDueDate} disabled={'past'} />
          </div>
          
          <Separator />
          <div className="space-y-2">
            <h2>Description</h2>
            <Textarea 
              value={ticket.description} 
              disabled 
              className="resize-none bg-muted cursor-default" 
              rows={5}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 