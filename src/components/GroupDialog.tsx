import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'
import { useState, useEffect } from 'react'
import { MemberMultiSelect } from './select/MemberMultiSelect'
import { GroupWithMembers } from '@shared/types'
import supabase, { unwrap } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { z } from 'zod'

const groupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  member_ids: z.array(z.number())
})

type GroupFormValues = z.infer<typeof groupSchema>

interface Props {
  open: boolean
  state: GroupWithMembers | 'create' | null
  onOpenChange: (open: boolean) => void
}

export function GroupDialog({ open, state, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  const mode = state === 'create' ? 'create' : 'edit'
  const group = state === 'create' ? null : state

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name ?? '',
      description: group?.description ?? '',
      member_ids: group?.member_ids ?? []
    }
  })

  useEffect(() => {
    if (state === 'create') {
      form.reset({ name: '', description: '', member_ids: [] })
    } else if (state) {
      form.reset({ 
        name: state.name, 
        description: state.description ?? '', 
        member_ids: state.member_ids ?? []
      })
    }
  }, [state, form])

  const onSubmit = async (data: GroupFormValues) => {
    if (!openOrg) return

    setIsLoading(true)
    try {
      if (mode === 'create') {
        const newGroup = await supabase.from('groups')
          .insert({ 
            name: data.name, 
            description: data.description, 
            org_id: openOrg.id 
          })
          .select('id')
          .single()
          .then(unwrap);

        if (data.member_ids.length > 0) {
          await supabase.from('groups_members')
            .insert(data.member_ids.map(memberId => ({
              group_id: newGroup.id,
              member_id: memberId
            })))
            .then(unwrap)
        }

        toast({ title: "Success", description: "Group created successfully" })
      } else if (group) {
        await supabase.from('groups')
          .update({ 
            name: data.name, 
            description: data.description 
          })
          .eq('id', group.id)
          .then(unwrap)

        const currentMembers = group.member_ids ?? []
        const newMembers = data.member_ids

        const membersToRemove = [...currentMembers].filter(id => !newMembers.includes(id))
        const membersToAdd = [...newMembers].filter(id => !currentMembers.includes(id))

        if (membersToRemove.length > 0) {
          await supabase.from('groups_members')
            .delete()
            .eq('group_id', group.id)
            .in('member_id', membersToRemove)
            .then(unwrap)
        }

        if (membersToAdd.length > 0) {
          await supabase.from('groups_members')
            .insert(membersToAdd.map(memberId => ({
              group_id: group.id,
              member_id: memberId
            })))
            .then(unwrap)
        }

        toast({ title: "Success", description: "Group updated successfully" })
      }

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} group`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!openOrg || !group) return

    setIsLoading(true)
    try {
      await supabase.from('groups')
        .delete()
        .eq('id', group.id)
        .then(unwrap)

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      toast({ title: "Success", description: "Group deleted successfully" })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete group",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create' : `Edit ${group?.name}`} Group</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a new group to organize members.' 
              : 'Edit group details and members.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <MemberMultiSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      filter={(member) => member.role !== 'CUSTOMER'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="w-full flex flex-row items-center justify-center gap-3 mt-4">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={
                  isLoading || 
                  (mode === 'create' && !form.formState.isValid) ||
                  (mode === 'edit' && !form.formState.isDirty)
                }
              >
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
