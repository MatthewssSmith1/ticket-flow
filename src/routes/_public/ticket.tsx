import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'

const ticketSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  description: z.string().min(10, 'Please provide more details'),
})

type TicketForm = z.infer<typeof ticketSchema>

export const Route = createFileRoute('/_public/ticket')({
  component: TicketForm,
})

function TicketForm() {
  const navigate = useNavigate()
  const form = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john@doe.com',
      subject: 'Sign in issue',
      description: 'I cannot sign in to my account.',
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: TicketForm) => {
      // TODO: store org_id in route context
      // consider moving insertion to the end function
      const result = await supabase.from('tickets').insert(
        { ...formData, org_id: '7e7a9db6-d2bc-44a4-95b1-21df9400b7a7' }
      ).select()

      if (result.error) throw result.error

      const { data: inviteData, error: inviteError } = await supabase.functions.invoke(
        'send-ticket-invite',
        { body: { email: formData.email } }
      )

      if (inviteError) throw inviteError

      return inviteData
    },
    onSuccess: async () => {
      navigate({ to: '/' })
    },
  })

  const onSubmit = (data: TicketForm) => mutation.mutate(data)

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Submit a Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
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
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of your issue" {...field} />
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
                    <Textarea 
                      placeholder="Please describe your issue in detail"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Ticket'}
            </Button>

            {mutation.isError && (
              <p className="text-red-500 text-center">
                {mutation.error.message || 'Something went wrong. Please try again.'}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
