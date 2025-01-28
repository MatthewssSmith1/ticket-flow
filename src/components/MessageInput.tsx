import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip"
import { SendIcon, LockIcon, UnlockIcon } from 'lucide-react';
// import { useMessageStore } from '@/stores/messageStore';
// import { getRouteApi } from "@tanstack/react-router";
// import { useOrgStore } from '@/stores/orgStore';
import { Textarea } from '@ui/textarea';
import { useForm } from 'react-hook-form';
import { Button } from '@ui/button';

interface MessageForm {
  content: string;
  isInternal: boolean;
}

// TODO: rework messages and consider using a single table for chat sidebar messages and those associated with a ticket 
export function MessageInput() {
  // const { ticket } = getRouteApi('/_dashboard/ticket/$id').useLoaderData()
  const form = useForm<MessageForm>({
    defaultValues: {
      content: '',
      isInternal: false
    }
  });
  // const { addMessage } = useMessageStore();
  // const { authMember } = useOrgStore();

  const handleSubmit = (data: MessageForm) => {
    // addMessage({
    //   ticket_id: ticket.id,
    //   content: data.content,
    //   is_internal: data.isInternal,
    //   author_id: authMember?.id ?? null,
    // });
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)(e);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full grid grid-cols-[1fr_auto] gap-3">
      <Textarea rows={3} 
        className="resize-none row-span-2 bg-muted shadow"
        placeholder="Type your message here..."
        onKeyDown={handleKeyDown}
        {...form.register('content', { required: true })}
      />
      <InternalToggleButton 
        isInternal={form.watch('isInternal')} 
        onToggle={() => form.setValue('isInternal', !form.watch('isInternal'))} 
      />
      <SendMessageButton />
    </form>
  );
}

function InternalToggleButton({ isInternal, onToggle }: { isInternal: boolean, onToggle: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon" onClick={onToggle}>
            {isInternal ? <LockIcon className="size-4" /> : <UnlockIcon className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isInternal ? "Internal message (staff only)" : "External message (visible to customer)"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SendMessageButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="submit" variant="ghost" size="icon">
            <SendIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
