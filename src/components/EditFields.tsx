import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useOrgStore } from '@/stores/orgStore'
import { FieldDialog } from './FieldDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

export type DialogState = null | 'create' | Field

export function EditFields() {
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { openOrg } = useOrgStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Fields</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {openOrg?.fields?.map(field => (
          <FieldItem 
            key={field.id} 
            field={field} 
            onClick={() => {
              setDialogState(field)
              setIsOpen(true)
            }} 
          />
        ))}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setDialogState('create')
            setIsOpen(true)
          }}
        >
          <Plus className="size-4 mr-2" />
          Add Field
        </Button>
        <FieldDialog
          open={isOpen}
          state={dialogState}
          onOpenChange={setIsOpen}
        />
      </CardContent>
    </Card>
  )
}

function FieldItem({ field, onClick }: { field: Field; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 p-3 text-left rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="font-medium">{field.name}</h3>
        <Badge variant="outline">{field.field_type}</Badge>
        {field.is_required && (
          <Badge variant="secondary" className="pointer-events-none">
            Required
          </Badge>
        )}
      </div>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {['SELECT', 'MULTI_SELECT'].includes(field.field_type) && field.options && (
        <p className="text-sm text-muted-foreground">
          Options: {field.options.join(', ')}
        </p>
      )}
    </button>
  )
}
