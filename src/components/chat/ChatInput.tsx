import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip"
import { SendIcon } from 'lucide-react';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export interface Props {
  /** Position of action buttons relative to textarea */
  buttonPosition?: 'right' | 'bottom';
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Additional class names for the container */
  className?: string;
  /** Additional buttons to render alongside the send button */
  additionalButtons?: React.ReactNode;
  /** Callback when message is submitted */
  onSubmit: (message: string) => void;
}

export function ChatInput({
  buttonPosition = 'right',
  disabled = false,
  placeholder = 'Type a message...',
  className,
  additionalButtons,
  onSubmit
}: Props) {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const buttonGroup = (
    <div className={cn(
      'flex gap-2 items-center',
      buttonPosition === 'right' ? 'self-end flex-col' : 'w-full justify-end'
    )}>
      {additionalButtons}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon"
              disabled={disabled || !message.trim()}
            >
              <SendIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        'w-full flex',
        buttonPosition === 'right' ? 'gap-3' : 'flex-col gap-2',
        className
      )}
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'resize-none min-h-[80px]',
          buttonPosition === 'right' ? 'flex-1' : 'w-full'
        )}
        rows={3}
      />
      {buttonGroup}
    </form>
  );
}