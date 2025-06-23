"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PlusIcon } from "@radix-ui/react-icons"

interface BlocManagementProps {
  blocs: Bloc[]
  etages: Etage[]
  onAdd: (bloc: { nom_bloc: string; etage_id: number }) => Promise<void>
  onEdit: (id: number, bloc: Partial<Bloc>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function BlocManagement({ blocs, etages, onAdd, onEdit, onDelete }: BlocManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBloc, setSelectedBloc] = useState<Bloc | null>(null)
  const [formData, setFormData] = useState<{ nom_bloc: string; etage_id?: number }>({ nom_bloc: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = async () => {
    if (!formData.nom_bloc || !formData.etage_id) return

    setIsLoading(true)
    try {
      await onAdd({
        nom_bloc: formData.nom_bloc,
        etage_id: formData.etage_id,
      })
      setIsAddDialogOpen(false)
      setFormData({ nom_bloc: "" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedBloc) return

    setIsLoading(true)
    try {
      await onEdit(selectedBloc.id, { nom_bloc: formData.nom_bloc })
      setIsEditDialogOpen(false)
      setSelectedBloc(null)
      setFormData({ nom_bloc: "" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedBloc) return

    setIsLoading(true)
    try {
      await onDelete(selectedBloc.id)
      setIsDeleteDialogOpen(false)
      setSelectedBloc(null)
    } finally {
      setIsLoading(false)
    }
  }

  const BlocDialog = ({ isOpen, onClose, isEdit = false }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le bloc" : "Ajouter un bloc"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations du bloc ci-dessous." : "Remplissez les informations du nouveau bloc."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nom_bloc">Nom du bloc</Label>
            <Input
              id="nom_bloc"
              value={formData.nom_bloc}
              onChange={(e) => setFormData({ ...formData, nom_bloc: e.target.value })}
              placeholder="Ex: A, B, C..."
            />
          </div>
          {!isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="etage">Étage</Label>
              <Select
                value={formData.etage_id?.toString()}
                onValueChange={(value) => setFormData({ ...formData, etage_id: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étage" />
                </SelectTrigger>
                <SelectContent>
                  {etages.map((etage) => (
                    <SelectItem key={etage.id} value={etage.id.toString()}>
                      Étage {etage.numero_etage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={isEdit ? handleEdit : handleAdd} disabled={isLoading}>
            {isLoading ? "Chargement..." : isEdit ? "Modifier" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestion des blocs</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un bloc
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du bloc</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Nombre de chambres</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocs.map((bloc) => (
            <TableRow key={bloc.id}>
              <TableCell>{bloc.nom_bloc}</TableCell>
              <TableCell>Étage {bloc.etage.numero_etage}</TableCell>
              <TableCell>{bloc.chambres.length}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedBloc(bloc)
                    setFormData({ nom_bloc: bloc.nom_bloc })
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedBloc(bloc)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BlocDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          setFormData({ nom_bloc: "" })
        }}
      />

      <BlocDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedBloc(null)
          setFormData({ nom_bloc: "" })
        }}
        isEdit
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce bloc ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le bloc et toutes ses chambres seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedBloc(null)
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
