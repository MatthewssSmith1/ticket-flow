import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarProvider, SidebarRail } from "@ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip"
import { useAgentMessageStore } from "@/stores/messageStore"
import { MessageArea } from "@/components/chat/MessageArea"
import { useOrgStore } from "@/stores/orgStore"
import { queryClient } from "@/main"
import { ChatInput } from "@/components/chat/ChatInput"
import { Separator } from "@ui/separator"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@ui/button"
import supabase from "@/lib/supabase"

export function ChatSidebar() {
  const { addMessages, clearMessages, setIsLoading } = useAgentMessageStore()
  const { openOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  if (!openOrg || !authMember) return null

  const handleSubmit = async (message: string) => {
    setIsLoading(true)
    addMessages([{
      id: -1,
      message_type: "USER" as const,
      content: message,
      author_id: authMember.id,
      created_at: new Date().toISOString(),
      embedding: null,
      ticket_id: null
    }])

    try {
      const { data, error } = await supabase.functions.invoke('handle-agent-request', {
        body: { 
          query: message,
          orgId: openOrg.id,
          authorId: authMember.id
        }
      })

      console.log(data.staleTicketIds)
      queryClient.invalidateQueries({ queryKey: ['tickets', openOrg.id] })
      data.staleTicketIds.forEach((ticketId: string) => {
        queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      })

      if (error) throw error
      addMessages(data.messages)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again."
      })
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
          <div className="flex items-center justify-between px-4">
            <h1 className="text-2xl py-2 select-none font-semibold">Auto CRM</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={clearMessages}
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator />
        </SidebarHeader>

        <SidebarContent className="flex flex-col">
          <MessageArea 
            type="agent"
            params={{ authorId: authMember.id }}
            className="flex-1 px-4"
          />
        </SidebarContent>

        <SidebarFooter className="p-4">
          <ChatInput onSubmit={handleSubmit} buttonPosition="bottom" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}