import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createTicketSchema } from '@shared/validation'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import supabase from '@/lib/supabase'
import { z } from 'zod'

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
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: TicketForm) => {
      // TODO: store org_id in the route context
      const body = { 
        ...formData,
        org_id: '7e7a9db6-d2bc-44a4-95b1-21df9400b7a7'
      }

      const { data, error } = await supabase.functions.invoke('send-ticket-invite', { body })
      if (error) throw error

      return data
    },
    onSuccess: (data) => {
      if (data.status === 'AUTHENTICATED') {
        navigate({ to: '/home' })
      } else {
        toast({
          title: 'Check your email',
          description: 'We\'ve sent you a link to verify your ticket and create your account.',
        })
      }
    },
    onError: (error: any) => {
      console.log('error', error)
      if (error.message?.includes('NEEDS_AUTH')) {
        navigate({ 
          to: '/login',
          search: { 
            redirect: '/ticket',
            email: form.getValues('email')
          }
        })
        return
      }

      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
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
