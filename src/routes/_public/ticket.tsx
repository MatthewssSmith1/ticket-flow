import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTicketSchema, PRIORITIES } from '@shared/validation'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import supabase, { unwrap } from '@/lib/supabase'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from '@/components/ui/select'

const ticketSchema = createTicketSchema(z)
type TicketForm = z.infer<typeof ticketSchema>

export const Route = createFileRoute('/_public/ticket')({
  component: TicketForm,
})

function TicketForm() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: user ? '' : 'John Doe',
      email: user?.email ?? 'john@example.com',
      subject: 'Sign in issue',
      description: 'I cannot sign in to my account.',
      priority: 'NORMAL',
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: TicketForm) => {
      // TODO: require org_id in the query params
      const body = { 
        ...formData,
        org_id: '7e7a9db6-d2bc-44a4-95b1-21df9400b7a7'
      }

      return await supabase.functions
        .invoke('send-ticket-invite', { body })
        .then(unwrap)
    },
    onSuccess: ({ shouldRedirect }) => {
      if (shouldRedirect) return navigate({ to: '/home' })

      form.reset()

      toast({
        title: 'Check your email',
        description: 'We\'ve sent you a link to verify your ticket and create your account.',
      })
    },
    onError: ({ message}) => {
      if (message?.includes('Please login')) 
        return navigate({ to: '/login' })

      toast({
        title: 'Error',
        description: message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    }
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

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0) + priority.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
