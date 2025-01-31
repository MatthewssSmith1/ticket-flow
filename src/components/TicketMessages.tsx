import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@ui/card";
import { useTicketMessageStore } from "@/stores/messageStore";
import { LockIcon, UnlockIcon } from "lucide-react";
import supabase, { unwrap } from "@/lib/supabase";
import { useOrgStore } from "@/stores/orgStore";
import { getRouteApi } from "@tanstack/react-router";
import { MessageArea } from "./chat/MessageArea";
import { MessageType } from "@shared/types";
import { ChatInput } from "./chat/ChatInput";
import { useState } from "react";
import { Button } from "@ui/button";

export function TicketMessages() {
  const { ticket } = getRouteApi("/_dashboard/ticket/$id").useLoaderData()
  const { addMessages } = useTicketMessageStore();
  const { authMember, isCustomer } = useOrgStore();
  const [isInternal, setIsInternal] = useState(false);

  // TODO: optimistic updates
  const handleSubmit = async (content: string) => {
    const message_type = isCustomer ? "EXTERNAL" 
      : (isInternal ? "INTERNAL" : "EXTERNAL")

    const rawMessages = [{
      ticket_id: ticket.id,
      content,
      author_id: authMember?.id ?? null,
      message_type: message_type as MessageType,
      embedding: null
    }]

    const messages = await supabase
      .from("messages")
      .insert(rawMessages)
      .select()
      .then(unwrap)

    addMessages(messages);
  };

  const InternalToggleButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setIsInternal(!isInternal)}
          >
            {isInternal ? (
              <LockIcon className="size-4" />
            ) : (
              <UnlockIcon className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isInternal ? "Internal Message" : "External Message"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="flex flex-col h-full min-h-[50vh] max-h-[95vh]">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <MessageArea 
          type="ticket"
          params={{ ticketId: ticket.id }}
        />
      </CardContent>
      <CardFooter>
        <ChatInput
          onSubmit={handleSubmit}
          additionalButtons={!isCustomer ? <InternalToggleButton /> : undefined}
        />
      </CardFooter>
    </Card>
  );
}
