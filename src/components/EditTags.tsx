import { Card, CardHeader, CardTitle, CardContent } from '@ui/card'
import { useOrgStore } from '@/stores/orgStore'
import { TagDialog } from './TagDialog'
import { useState } from 'react'
import { Button } from '@ui/button'
import { Plus } from 'lucide-react'
import { Tag } from '@/types/types'

export type DialogState = null | 'create' | Tag

export function EditTags() {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { openOrg } = useOrgStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(125px,1fr))] grid-rows-[repeat(auto-fill,36px)] gap-3">
        {openOrg?.tags?.map(tag => (
          <TagButton 
            key={tag.id} 
            tag={tag} 
            onClick={() => {
              setDialogState(tag)
              setIsOpen(true)
            }} 
          />
        ))}
        <Button 
          className="justify-center cursor-pointer hover:bg-primary/80"
          onClick={() => {
            setDialogState('create')
            setIsOpen(true)
          }}
        >
          <Plus className="size-3" />
        </Button>
        <TagDialog
          open={isOpen}
          state={dialogState}
          onOpenChange={setIsOpen}
        />
      </CardContent>
    </Card>
  )
}

function TagButton({ tag, onClick }: { tag: Tag; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      style={{ backgroundColor: tag.color }}
      className="flex items-center justify-center h-9 px-2 select-none hover:opacity-90"
      onClick={onClick}
    >
      <span className="text-base text-black truncate min-w-0">{tag.name}</span>
    </Button>
  )
}