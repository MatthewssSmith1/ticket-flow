import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import supabase, { unwrap } from '@/lib/supabase'
import { Tag as TagType } from '@/types/types'
import { Trash2, Plus } from 'lucide-react'
import { useOrgStore } from '@/stores/orgStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'

export function EditTags() {
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteTag = async (tag: TagType) => {
    if (!openOrg) return

    setIsDeleting(true)
    try {
      await supabase.from('tags')
        .delete()
        .eq('id', tag.id)
        .then(unwrap)

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      toast({ title: "Success", description: "Tag deleted successfully" })
      setTagToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tag",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(125px,1fr))] grid-rows-[repeat(auto-fill,36px)] gap-3">
        {openOrg?.tags?.map(tag => (
          <Tag 
            key={tag.id} 
            tag={tag} 
            onDeleteClick={() => setTagToDelete(tag)} 
          />
        ))}
        <Button 
          className="justify-center cursor-pointer hover:bg-primary/80"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="size-3" />
        </Button>
        <CreateTagDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
        <Dialog open={tagToDelete !== null} onOpenChange={() => setTagToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tag</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the tag "{tagToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTagToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => tagToDelete && handleDeleteTag(tagToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function Tag({ tag, onDeleteClick }: { tag: TagType; onDeleteClick: () => void }) {
  return (
    <div
      style={{ backgroundColor: tag.color }}
      className="group flex items-center justify-between gap-0.5 h-9 px-2 select-none cursor-default rounded-md"
    >
      <div className="size-3" />
      <span className="text-base text-black truncate min-w-0">{tag.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-4 p-0 opacity-0 hover:bg-transparent text-black hover:text-white group-hover:opacity-100 transition-all"
        onClick={(e) => {
          e.stopPropagation()
          onDeleteClick()
        }}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

interface CreateTagFormValues {
  name: string
  color: string
}

function CreateTagDialog({ isOpen, onOpenChange }: {isOpen: boolean, onOpenChange: (open: boolean) => void}) {
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  const form = useForm<CreateTagFormValues>({
    defaultValues: {
      name: '',
      color: '#ffffff'
    },
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, 'Name is required').max(20, 'Name must be less than 20 characters'),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
      })
    )
  })

  const onSubmit = async (data: CreateTagFormValues) => {
    if (!openOrg) return

    setIsLoading(true)
    try {
      await supabase.from('tags')
        .insert({ ...data, org_id: openOrg.id })
        .then(unwrap)

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      toast({ title: "Success", description: "Tag created successfully" })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tag",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to organize your tickets
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter tag name"
                disabled={isLoading}
              />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                className="p-1"
                {...form.register('color')}
                disabled={isLoading}
              />
              {form.formState.errors.color && <p className="text-sm text-destructive">{form.formState.errors.color.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 