import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarProvider, SidebarRail } from "@ui/sidebar"
import { SendHorizontal, Paperclip } from "lucide-react"
import { Separator } from "@ui/separator"
import { Textarea } from "@ui/textarea"
import { useState } from "react"
import { Button } from "@ui/button"
import supabase from "@/lib/supabase"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInputMessage('')

    try {
      const { data, error } = await supabase.functions.invoke('handle-agent-request', {
        body: { query: inputMessage }
      })
      
      if (error) throw error

      const assistantMessage = { role: 'assistant' as const, content: data }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, there was an error processing your request.' }
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
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-8' 
                  : 'bg-muted mr-8'
              }`}
            >
              {message.content}
            </div>
          ))}
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
