import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarProvider, SidebarRail } from "@ui/sidebar";
import { SendHorizontal, Paperclip } from "lucide-react";
import { Separator } from "@ui/separator";
import { Textarea } from "@ui/textarea";
import { Button } from "@ui/button";

export function ChatSidebar() {
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

        <SidebarContent className="flex-1">
          {/* Chat messages will go here */}
        </SidebarContent>

        <SidebarFooter className="p-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <Textarea
              placeholder="Type a message..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="icon" className="self-start">
                <Paperclip className="size-4" />
              </Button>
              <Button type="submit" size="icon" className="self-end" variant="ghost">
                <SendHorizontal className="size-4" />
              </Button>
            </div>
          </form>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
