import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Status, Priority, Channel } from '@/types/types'
import { DatePickerWithPresets } from './DatePicker'
import { MemberMultiSelect } from './MemberMultiSelect'
import { GroupMultiSelect } from './GroupMultiSelect'
import supabase, { unwrap } from '@/lib/supabase'
import { TagMultiSelect } from './TagMultiSelect'
import { getRouteApi } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { EnumSelect } from './EnumSelect'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

type FormValues = {
  status: Status
  priority: Priority
  channel: Channel
  due_at: Date | null
  tag_ids: number[]
  member_ids: number[]
  group_ids: string[]
}

export function EditTicket() {
  const { ticket } = getRouteApi('/_dashboard/ticket/$id').useLoaderData()
  const { getMemberName, authMember } = useOrgStore()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    defaultValues: {
      status: ticket.status,
      priority: ticket.priority,
      channel: ticket.channel,
      due_at: ticket.due_at ? new Date(ticket.due_at) : null,
      tag_ids: ticket.tags_tickets.map(tt => tt.tag_id),
      member_ids: ticket.tickets_members.map(tm => tm.member_id),
      group_ids: ticket.tickets_groups.map(tg => tg.group_id),
    }
  })
  const setVal = (key: keyof FormValues, value: any) => form.setValue(key, value, { shouldDirty: true })

  const [isSubmitting, setIsSubmitting] = useState(false)
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await supabase.from('tickets')
        .update({
          status: data.status,
          priority: data.priority,
          channel: data.channel,
          due_at: data.due_at?.toISOString() ?? null,
        })
        .eq('id', ticket.id)
        .then(unwrap)

      await supabase.from('tags_tickets')
        .delete()
        .eq('ticket_id', ticket.id)
        .then(unwrap)

      if (data.tag_ids.length > 0) {
        await supabase.from('tags_tickets')
          .insert(data.tag_ids.map(tag_id => ({ 
            ticket_id: ticket.id, 
            tag_id 
          })))
          .then(unwrap)
      }

      await supabase.from('tickets_members')
        .delete()
        .eq('ticket_id', ticket.id)
        .then(unwrap)

      if (data.member_ids.length > 0) {
        await supabase.from('tickets_members')
          .insert(data.member_ids.map(member_id => ({
            ticket_id: ticket.id,
            member_id,
            assigned_by: authMember?.id
          })))
          .then(unwrap)
      }

      await supabase.from('tickets_groups')
        .delete()
        .eq('ticket_id', ticket.id)
        .then(unwrap)

      if (data.group_ids.length > 0) {
        await supabase.from('tickets_groups')
          .insert(data.group_ids.map(group_id => ({
            ticket_id: ticket.id,
            group_id,
            assigned_by: authMember?.id
          })))
          .then(unwrap)
      }

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ticket",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const memberName = getMemberName(ticket.author_id) ?? ticket.name ?? '-'
  const verifiedDate = ticket.verified_at ? new Date(ticket.verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

  return (
    <Card className="min-w-[150px]">
      <CardHeader>
        <CardTitle>{ticket.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2 [&_h2]:select-none">
          <h2 className="text-center">
            Submitted by <span className="font-semibold">{memberName}</span> on <i>{verifiedDate}</i>
          </h2>
          <Textarea
            value={ticket.description}
            disabled
            className="resize-none bg-muted cursor-default"
            rows={5}
          />
          <Separator />
          <section className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-4 [&>div]:space-y-2 text-muted-foreground">
            <div>
              <h2>Status</h2>
              <EnumSelect 
                enumKey="status" 
                value={form.watch('status')} 
                onValueChange={(value) => setVal('status', value as Status)} 
              />
            </div>
            <div>
              <h2>Priority</h2>
              <EnumSelect 
                enumKey="priority" 
                value={form.watch('priority')} 
                onValueChange={(value) => setVal('priority', value as Priority)} 
              />
            </div>
            <div>
              <h2>Channel</h2>
              <EnumSelect 
                enumKey="channel" 
                value={form.watch('channel')} 
                onValueChange={(value) => setVal('channel', value as Channel)} 
              />
            </div>
            <div>
              <h2>Tags</h2>
              <TagMultiSelect
                value={form.watch('tag_ids')}
                onValueChange={(value) => setVal('tag_ids', value)}
                placeholder="Select tags"
              />
            </div>
          </section>
          <section className="space-y-6">
            <div>
              <h2>Due Date</h2>
              <DatePickerWithPresets 
                value={form.watch('due_at')?.toISOString() ?? null} 
                onValueChange={(date) => setVal('due_at', date ? new Date(date) : null)} 
                disabled={'past'} 
              />
            </div>
            <div>
              <h2>Assigned Groups</h2>
              <GroupMultiSelect
                value={form.watch('group_ids')}
                onValueChange={(value) => setVal('group_ids', value)}
                placeholder="Assign groups"
              />
            </div>
            <div>
              <h2>Assigned Individuals</h2>
              <MemberMultiSelect
                value={form.watch('member_ids')}
                onValueChange={(value) => setVal('member_ids', value)}
                filter={m => m.role !== 'CUSTOMER'}
                placeholder="Assign members"
              />
            </div>
          </section>
          <section className="mt-auto flex flex-col items-center">
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isDirty || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </section>
        </form>
      </CardContent>
    </Card>
  )
} 