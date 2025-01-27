import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select'
import { SelectOptionsBuilder } from '@/components/SelectOptionsBuilder'
import { useState, useEffect } from 'react'
import supabase, { unwrap } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogState } from './EditFields'
import { FieldType } from '@/types/types'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Switch } from '@ui/switch'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { z } from 'zod'

const FIELD_TYPES: FieldType[] = ['TEXT', 'INTEGER', 'FLOAT', 'DATE', 'BOOLEAN', 'SELECT', 'MULTI_SELECT']

const fieldSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').nullable(),
  field_type: z.string().refine(type => FIELD_TYPES.includes(type as FieldType), {
    message: 'Invalid field type'
  }),
  is_required: z.boolean(),
  options: z.string().array().nullable()
})

type FieldFormValues = z.infer<typeof fieldSchema>

interface Props {
  open: boolean
  state: DialogState
  onOpenChange: (open: boolean) => void
}

export function FieldDialog({ open, state, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { openOrg, setOpenOrg, authMember } = useOrgStore()
  const { toast } = useToast()

  const mode = state === 'create' ? 'create' : 'edit'
  const field = state === 'create' ? null : state

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: field?.name ?? '',
      description: field?.description ?? null,
      field_type: (field?.field_type ?? 'TEXT') as FieldType,
      is_required: field?.is_required ?? false,
      options: Array.isArray(field?.options) ? field.options : null
    }
  })

  const selectedFieldType = form.watch('field_type')
  const isSelectType = ['SELECT', 'MULTI_SELECT'].includes(selectedFieldType);

  useEffect(() => {
    if (state === 'create') {
      form.reset({
        name: '',
        description: null,
        field_type: 'TEXT',
        is_required: false,
        options: null
      })
    } else if (state) {
      const fieldType = FIELD_TYPES.includes(state.field_type as FieldType) 
        ? (state.field_type as FieldType) : 'TEXT'

      form.reset({
        name: state.name,
        description: state.description ?? null,
        field_type: fieldType,
        is_required: state.is_required,
        options: Array.isArray(state.options) ? state.options : null
      })
    }
  }, [state, form])

  useEffect(() => {
    if (!isSelectType) {
      form.setValue('options', null)
    }
  }, [isSelectType, form])

  const onSubmit = async (data: FieldFormValues) => {
    if (!openOrg) return

    setIsLoading(true)
    try {
      if (mode === 'create') {
        await supabase.from('fields')
          .insert({ ...data, field_type: data.field_type as FieldType, org_id: openOrg.id })
          .then(unwrap)
        toast({ title: "Success", description: "Field created successfully" })
      } else if (field) {
        // TODO: changing the type of a field should remove all of its instances (to avoid invalid values)
        await supabase.from('fields')
          .update({ ...data, field_type: data.field_type as FieldType })
          .eq('id', field.id)
          .then(unwrap)
        toast({ title: "Success", description: "Field updated successfully" })
      }

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} field`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!openOrg || !field) return

    setIsLoading(true)
    try {
      await supabase.from('fields')
        .delete()
        .eq('id', field.id)
        .then(unwrap)

      await setOpenOrg(openOrg, authMember?.user_id ?? undefined)
      toast({ title: "Success", description: "Field deleted successfully" })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete field",
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
          <DialogTitle>{mode === 'create' ? 'Create New Field' : 'Edit Field'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new custom field to your tickets' : 'Modify or delete this custom field'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter field name" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter field description (optional)" 
                      disabled={isLoading} 
                      value={field.value ?? ''} 
                      onChange={e => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-[2fr_1fr] gap-y-4 gap-x-8">
              <FormLabel htmlFor={form.register('field_type').name}>Type</FormLabel>
              <FormLabel htmlFor={form.register('is_required').name}>Required</FormLabel>
              
              <Select
                disabled={isLoading}
                onValueChange={field => form.setValue('field_type', field, { shouldDirty: true })}
                value={form.watch('field_type')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FIELD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0) + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormControl>
                <Switch
                  className="my-auto"
                  disabled={isLoading}
                  checked={form.watch('is_required')}
                  onCheckedChange={checked => form.setValue('is_required', checked, { shouldDirty: true })}
                />
              </FormControl>
            </div>

            {isSelectType && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <SelectOptionsBuilder value={field.value} onChange={field.onChange} disabled={isLoading} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              )}
              <Button type="submit" disabled={!form.formState.isValid || !form.formState.isDirty || isLoading}>
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