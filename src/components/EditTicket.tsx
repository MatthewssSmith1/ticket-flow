import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Status, Priority, Channel } from '@/types/types'
import { DatePickerWithPresets } from './DatePicker'
import { MemberMultiSelect } from './select/MemberMultiSelect'
import { GroupMultiSelect } from './select/GroupMultiSelect'
import supabase, { unwrap } from '@/lib/supabase'
import { TagMultiSelect } from './select/TagMultiSelect'
import { getRouteApi } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { EnumSelect } from './select/EnumSelect'
import { Separator } from './ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type Form = {
  status: Status
  priority: Priority
  channel: Channel
  due_at: Date | null
  tag_ids: number[]
  member_ids: number[]
  group_ids: string[]
  field_values: Record<number, string | null>
}
type FormValue = Form[keyof Form]

export function EditTicket() {
  const { ticket } = getRouteApi('/_dashboard/ticket/$id').useLoaderData()
  const { openOrg, getMemberName, authMember } = useOrgStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<Form>({
    defaultValues: {
      status: ticket.status,
      priority: ticket.priority,
      channel: ticket.channel,
      due_at: ticket.due_at ? new Date(ticket.due_at) : null,
      tag_ids: ticket.tags_tickets.map(tt => tt.tag_id),
      member_ids: ticket.tickets_members.map(tm => tm.member_id),
      group_ids: ticket.tickets_groups.map(tg => tg.group_id),
      field_values: Object.fromEntries(
        ticket.tickets_fields.map(tf => [tf.field_id, tf.value])
      ),
    }
  })
  const setVal = (key: keyof Form, value: FormValue) => form.setValue(key, value, { shouldDirty: true })

  // TODO: move to postgres transaction in supabase function
  const updateTicketMutation = useMutation({
    mutationFn: async (data: Form) => {
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

      // TODO:
      // await supabase.from('tickets_fields')
      //   .delete()
      //   .eq('ticket_id', ticket.id)
      //   .then(unwrap)

      // const fieldEntries = Object.entries(data.field_values)
      // if (fieldEntries.length > 0) {
      //   await supabase.from('tickets_fields')
      //     .insert(fieldEntries.map(([field_id, value]) => ({
      //       ticket_id: ticket.id,
      //       field_id: parseInt(field_id),
      //       value: value
      //     })))
      //     .then(unwrap)
      // }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ['tickets', openOrg?.id] })
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ticket",
      })
    }
  })

  async function onSubmit(data: Form) {
    updateTicketMutation.mutate(data)
  }

  const memberName = getMemberName(ticket.author_id) ?? ticket.name ?? '-'
  const verifiedDate = ticket.verified_at ? new Date(ticket.verified_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

  return (
    <Card className="min-w-[150px] overflow-y-auto">
      <CardHeader>
        <CardTitle>{ticket.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="@container space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2 [&_h2]:select-none">
          <h2 className="text-center">
            Submitted by <span className="font-semibold">{memberName}</span> on <i>{verifiedDate}</i>
          </h2>
          <Textarea
            value={ticket.description}
            disabled
            className="resize-none bg-muted pointer-events-none"
            rows={5}
          />
          <Separator />
          <section>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(0,175px))] gap-4 [&>div]:space-y-2 text-muted-foreground">
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
            </div>
          </section>

          <section className="grid grid-cols-1 @xl:grid-cols-2 @xl:gap-x-4">
            <h2 className="@xl:row-start-1">Due Date</h2>
            <DatePickerWithPresets 
              value={form.watch('due_at')?.toISOString() ?? null} 
              onValueChange={(date) => setVal('due_at', date ? new Date(date) : null)} 
              disabled={'past'}
              className="@xl:row-start-2 my-auto"
            />
            <h2 className="@xl:row-start-1 mt-4 @xl:mt-0">Tags</h2>
            <TagMultiSelect
              value={form.watch('tag_ids')}
              onValueChange={(value) => setVal('tag_ids', value)}
              placeholder="Select tags"
              className="@xl:row-start-2"
            />
          </section>

          <section className="space-y-6">
            <div className="@xl:grid @xl:grid-cols-2 @xl:gap-4 space-y-6 @xl:space-y-0">
              <div className="space-y-2">
                <h2>Assigned Groups</h2>
                <GroupMultiSelect
                  value={form.watch('group_ids')}
                  onValueChange={(value) => setVal('group_ids', value)}
                  placeholder="Assign groups"
                />
              </div>
              <div className="space-y-2">
                <h2>Assigned Individuals</h2>
                <MemberMultiSelect
                  value={form.watch('member_ids')}
                  onValueChange={(value) => setVal('member_ids', value)}
                  filter={m => m.role !== 'CUSTOMER'}
                  placeholder="Assign members"
                />
              </div>
            </div>
          </section>

          <Separator />

          <h1 className="text-xl text-center font-semibold select-none">Custom Fields</h1>
          <section className="space-y-4">
            {openOrg?.fields?.map(field => {
              const fieldValues = form.watch('field_values')
              const value = fieldValues[field.id]
              const setValue = (val: string | null) => 
                setVal('field_values', { ...fieldValues, [field.id]: val })

              return (
                <div key={field.id}>
                  <h2>{field.name}</h2>
                  {field.field_type === 'TEXT' && (
                    <Textarea
                      value={value ?? ''}
                      onChange={e => setValue(e.target.value)}
                      placeholder={field.description ?? undefined}
                      className="resize-none"
                    />
                  )}
                  {field.field_type === 'DATE' && (
                    <DatePickerWithPresets
                      value={value ?? null}
                      onValueChange={(date?: Date) => setValue(date?.toISOString() ?? null)}
                    />
                  )}
                  {field.field_type === 'BOOLEAN' && (
                    <Switch
                      checked={value === 'true'}
                      onCheckedChange={checked => setValue(checked.toString())}
                      aria-label={field.description ?? field.name}
                    />
                  )}
                  {(field.field_type === 'INTEGER' || field.field_type === 'FLOAT') && (
                    <Input
                      type="number"
                      value={value ?? ''}
                      onChange={e => setValue(e.target.value)}
                      placeholder={field.description ?? undefined}
                      step={field.field_type === 'FLOAT' ? 'any' : '1'}
                    />
                  )}
                  {field.field_type === 'SELECT' && (
                    <Select
                      value={value ?? ''}
                      onValueChange={setValue}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={field.description ?? field.name} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {/* TODO: support for MULTI_SELECT */}
                </div>
              )
            })}
          </section>

          <section className="mt-auto flex flex-col items-center pt-6">
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isDirty || updateTicketMutation.isPending}
            >
              {updateTicketMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </section>
        </form>
      </CardContent>
    </Card>
  )
} 