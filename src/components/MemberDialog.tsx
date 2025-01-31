import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'
import { useState, useEffect } from 'react'
import { useOrgStore } from '@/stores/orgStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { EnumSelect } from './select/EnumSelect'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Member } from '@shared/types'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import supabase from '@/lib/supabase'
import { z } from 'zod'

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['OWNER', 'ADMIN', 'AGENT', 'CUSTOMER']).default('AGENT')
})

type MemberFormValues = z.infer<typeof memberSchema>

interface Props {
  open: boolean
  state: Member | 'create' | null
  onOpenChange: (open: boolean) => void
}

export function MemberDialog({ open, state, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  const mode = state === 'create' ? 'create' : 'edit'
  const member = state === 'create' ? null : state

  const email = member ? member.name.toLowerCase().split(' ').join('.') + '@example.com' : ''

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name ?? '',
      role: member?.role ?? 'AGENT',
      email,
    }
  })

  useEffect(() => {
    if (state === 'create') {
      form.reset({ name: '', email: '', role: 'AGENT' })
    } else if (state) {
      form.reset({ 
        name: state.name,
        role: state.role,
        email,
      })
    }
  }, [state, form])

  const onSubmit = async (data: MemberFormValues) => {
    if (!openOrg) return

    if (mode === 'create' && !data.email) {
      form.setError('email', { message: 'Email is required when creating a new member' })
      return
    }

    console.log(data)

    setIsLoading(true)
    try {
      if (mode === 'create') {
        // Implementation for creating a new member will go here
        console.log(data)
      } else if (member) {
        const { error } = await supabase
          .from('members')
          .update({ role: data.role })
          .eq('id', member.id)
          .eq('org_id', openOrg.id)

        if (error) throw error

        toast({ 
          title: "Success", 
          description: "Member role updated successfully"
        })
        onOpenChange(false)
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to process member", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
      setOpenOrg(openOrg, authMember?.user_id ?? undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Invite Member' : 'Edit Member'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Invite a new member to your organization.' 
              : 'Update member information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <section className="grid grid-cols-2 gap-6 mt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={mode !== 'create' || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="john.doe@example.com" disabled={mode !== 'create' || isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <EnumSelect
                      enumKey="role"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                      filter={role => role !== "OWNER"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section className="flex justify-center mt-3">
              <Button type="submit" disabled={isLoading || 
                  (mode === 'create' && !form.formState.isValid) ||
                  (mode === 'edit' && !form.formState.isDirty)}>
                {mode === 'create' ? 'Invite Member' : 'Update Member'}
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
