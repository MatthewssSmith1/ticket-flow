import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { EnumInstance, EnumKey } from '@/types/types';
import { DatePickerWithPresets } from './DatePicker';
import { MemberMultiSelect } from './MemberMultiSelect';
import { GroupMultiSelect } from './GroupMultiSelect';
import { TagMultiSelect } from './TagMultiSelect';
import supabase, { unwrap } from '@/lib/supabase';
import { useOrgStore } from '@/stores/orgStore';
import { getRouteApi } from '@tanstack/react-router';
import { EnumSelect } from './EnumSelect';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

export function EditTicket() {
  const { ticket } = getRouteApi('/_dashboard/ticket/$id').useLoaderData()
  const { getMemberName, authMember } = useOrgStore();

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

  function assignMembers(memberIds: number[]) {
    supabase.from('tickets_members')
      .delete()
      .eq('ticket_id', ticket.id)
      .then(unwrap)

    if (memberIds.length === 0) return;

    const assignments = memberIds.map(member_id => ({
      ticket_id: ticket.id,
      member_id,
      assigned_by: authMember?.id
    }));

    supabase.from('tickets_members')
      .insert(assignments)
      .then(unwrap)
  }

  function assignGroups(groupIds: string[]) {
    supabase.from('tickets_groups')
      .delete()
      .eq('ticket_id', ticket.id)
      .then(unwrap)

    if (groupIds.length === 0) return;

    const assignments = groupIds.map(group_id => ({
      ticket_id: ticket.id,
      group_id: group_id.toString(),
      assigned_by: authMember?.id
    }));

    supabase.from('tickets_groups')
      .insert(assignments)
      .then(unwrap)
  }

  function setTags(tagIds: number[]) {
    supabase.from('tags_tickets')
      .delete()
      .eq('ticket_id', ticket.id)
      .then(unwrap)

    if (tagIds.length === 0) return;

    supabase.from('tags_tickets')
      .insert(tagIds.map(tag_id => ({ ticket_id: ticket.id, tag_id })))
      .then(unwrap)
  }

  const memberIds = ticket.tickets_members.map(tm => tm.member_id);
  const groupIds = ticket.tickets_groups.map(tg => tg.group_id);
  const memberName = getMemberName(ticket.author_id) ?? ticket.name ?? '-';
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
          <section className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-4 [&>div]:space-y-2 text-muted-foreground">
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
              <TagMultiSelect 
                value={ticket.tags_tickets.map(tt => tt.tag_id)}
                onValueChange={setTags}
                placeholder="Select tags"
              />
            </div>
          </section>
          <div>
            <h2>Due Date</h2>
            <DatePickerWithPresets value={ticket.due_at} onValueChange={setDueDate} disabled={'past'} />
          </div>
          <section className="space-y-6">
            <div>
              <h2>Assigned Individuals</h2>
              <MemberMultiSelect 
                value={memberIds}
                onValueChange={assignMembers}
                filter={m => m.role !== 'CUSTOMER'}
                placeholder="Assign members"
              />
            </div>
            <div>
              <h2>Assigned Groups</h2>
              <GroupMultiSelect 
                value={groupIds}
                onValueChange={assignGroups}
                placeholder="Assign groups"
              />
            </div>
          </section>

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