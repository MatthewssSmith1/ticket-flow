import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarProvider, SidebarRail } from "@ui/sidebar"
import { SendHorizontal, Paperclip } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useOrgStore } from "@/stores/orgStore"
import { Separator } from "@ui/separator"
import { Textarea } from "@ui/textarea"
import { useState } from "react"
import { Ticket } from "@shared/types"
import { Button } from "@ui/button"
import { Pill } from "@/components/Pill"
import supabase from "@/lib/supabase"

type MessageType = {
  role: 'user' | 'assistant'
  type: 'text' | 'ticket'
  content: string | Ticket
}

export function ChatSidebar() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg } = useOrgStore()

  if (!openOrg) return null

  console.log(openOrg.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = { role: 'user' as const, type: 'text' as const, content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInputMessage('')

    try {
      const { data, error } = await supabase.functions.invoke('handle-agent-request', {
        body: { 
          query: inputMessage,
          orgId: openOrg.id
        }
      })
      
      if (error) throw error

      setMessages(prev => [...prev, ...data])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = { role: 'assistant' as const, type: 'text' as const, content: 'Sorry, there was an error processing your request.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "30rem",
          "--sidebar-width-mobile": "30rem",
        } as React.CSSProperties
      }
    >
      <Sidebar className="border-l" side="right">
        <SidebarHeader>
          <h1 className="text-2xl py-2 text-center select-none font-semibold">Auto CRM</h1>
          <Separator />
        </SidebarHeader>

        <SidebarContent className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <Message key={i} message={message} />
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Type a message..."
              className="min-h-[80px] resize-none"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="mt-2 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="self-start"
                type="button"
                disabled
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !inputMessage.trim()}
              >
                <SendHorizontal className="size-4" />
              </Button>
            </div>
          </form>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

function Message({ message }: { message: MessageType }) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        {message.type === 'ticket' ? (
          <TicketContent ticket={message.content as Ticket} />
        ) : (
          <p>{message.content as string}</p>
        )}
      </div>
    </div>
  )
}

function TicketContent({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/ticket/$id', params: { id: ticket.id } })
  }

  return (
    <div 
      className="rounded-lg border p-4 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{ticket.subject}</h3>
        <div className="flex gap-2">
          <Pill text={ticket.priority} />
          <Pill text={ticket.status} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
      <div className="text-xs text-muted-foreground">
        {ticket.name && <span>By: {ticket.name} • </span>}
        <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  )
}