import { useState } from 'react'
import type { User, CreateUserPayload } from '../services/apiService'
import { useDeleteUser, useUpdateUser } from '../hooks/useUsers'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type UserManageDialogProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManageDialog({
  user,
  open,
  onOpenChange,
}: UserManageDialogProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<CreateUserPayload>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    city: '',
    postalCode: '',
  })

  const deleteMutation = useDeleteUser()
  const updateMutation = useUpdateUser()

  function startEditing() {
    const u = user!
    setForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      birthDate: u.birthDate,
      city: u.city,
      postalCode: u.postalCode,
    })
    setEditing(true)
  }

  function handleSave() {
    updateMutation.mutate(
      { id: user!.id, payload: form },
      {
        onSuccess: () => {
          toast.success('Utilisateur mis à jour')
          setEditing(false)
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Erreur lors de la mise à jour')
        },
      },
    )
  }

  function handleDelete() {
    if (!confirm(`Supprimer ${user!.firstName} ${user!.lastName} ?`)) return
    deleteMutation.mutate(user!.id, {
      onSuccess: () => {
        toast.success('Utilisateur supprimé')
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Erreur lors de la suppression')
      },
    })
  }

  function handleCancel() {
    setEditing(false)
  }

  function updateField(field: keyof CreateUserPayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Modifier' : 'Détails de'} {user.firstName}{' '}
            {user.lastName}
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-4 pt-6">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        updateField('firstName', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) =>
                        updateField('lastName', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) =>
                      updateField('birthDate', e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) =>
                        updateField('postalCode', e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Prénom</span>
                  <span className="font-medium">{user.firstName}</span>
                  <span className="text-muted-foreground">Nom</span>
                  <span className="font-medium">{user.lastName}</span>
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium truncate">{user.email}</span>
                  <span className="text-muted-foreground">
                    Date de naissance
                  </span>
                  <span className="font-medium">{user.birthDate}</span>
                  <span className="text-muted-foreground">Ville</span>
                  <span className="font-medium">{user.city}</span>
                  <span className="text-muted-foreground">Code postal</span>
                  <span className="font-medium">{user.postalCode}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="gap-2 sm:gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                Sauvegarder
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Supprimer
              </Button>
              <Button onClick={startEditing}>
                <Pencil className="mr-1 h-4 w-4" />
                Éditer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
