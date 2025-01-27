import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@ui/tooltip"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export const InfoHint = ({ text, className }: { text: string, className?: string }) => {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className={cn("size-4 cursor-help", className)} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  );
};