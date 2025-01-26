import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState, useEffect } from 'react'
import supabase, { unwrap } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogState } from './EditTags'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be less than 20 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
})
type TagFormValues = z.infer<typeof tagSchema>

const DEFAULT_COLOR = '#ffffff'

interface Props {
  open: boolean
  state: DialogState
  onOpenChange: (open: boolean) => void
}

export function TagDialog({ open, state, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  const mode = state === 'create' ? 'create' : 'edit'
  const tag = state === 'create' ? null : state

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name ?? '',
      color: tag?.color ?? DEFAULT_COLOR
    }
  })

  useEffect(() => {
    if (state === 'create') form.reset({ name: '', color: DEFAULT_COLOR })
    else if (state) form.reset({ name: state.name, color: state.color })
  }, [state, form])

  const onSubmit = async (data: TagFormValues) => {
    if (!openOrg) return

    setIsLoading(true)
    try {
      if (mode === 'create') {
        await supabase.from('tags')
          .insert({ ...data, org_id: openOrg.id })
          .then(unwrap)
        toast({ title: "Success", description: "Tag created successfully" })
      } else if (tag) {
        await supabase.from('tags')
          .update(data)
          .eq('id', tag.id)
          .then(unwrap)
        toast({ title: "Success", description: "Tag updated successfully" })
      }

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} tag`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!openOrg || !tag) return

    setIsLoading(true)
    try {
      await supabase.from('tags')
        .delete()
        .eq('id', tag.id)
        .then(unwrap)

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      toast({ title: "Success", description: "Tag deleted successfully" })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tag",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Tag' : 'Edit Tag'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new tag to organize your tickets' : 'Modify or delete this tag'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tag name" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" className="p-1" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-center gap-2 sm:justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              {mode === 'edit' && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              )}
              <Button type="submit" disabled={!form.formState.isValid || isLoading}>
                {isLoading 
                  ? (mode === 'create' ? "Creating..." : "Saving...") 
                  : (mode === 'create' ? "Create" : "Save Changes")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 