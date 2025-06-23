"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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

import { BlocDialog, BlocFormData } from "./BlocDialog"

interface BlocManagementProps {
  blocs: Bloc[]
  etages: Etage[]
  onAdd: (payload: { nom_bloc: string; etage_id: number }) => Promise<void>
  onEdit: (id: number, payload: Partial<Bloc>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function BlocManagement({
  blocs,
  etages,
  onAdd,
  onEdit,
  onDelete,
}: BlocManagementProps) {
  // ---- états --------------------------------------------------------------
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBloc, setSelectedBloc] = useState<Bloc | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<BlocFormData>({ nom_bloc: "" })
  const resetForm = () => setFormData({ nom_bloc: "" })

  // ---- handlers -----------------------------------------------------------
  const handleAdd = async () => {
    if (!formData.nom_bloc || !formData.etage_id) return
    setIsLoading(true)
    try {
      await onAdd({ nom_bloc: formData.nom_bloc, etage_id: formData.etage_id })
      setIsAddDialogOpen(false)
      resetForm()
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
      resetForm()
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

  // ---- rendu --------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Barre d’en-tête ----------------------------------------------------- */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestion des blocs</h3>
        <Button
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un bloc
        </Button>
      </div>

      {/* Tableau ------------------------------------------------------------ */}
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
                {/* Éditer */}
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
                {/* Supprimer */}
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

      {/* Dialog ajout ------------------------------------------------------- */}
      <BlocDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          resetForm()
        }}
        isLoading={isLoading}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleAdd}
        etages={etages}
      />

      {/* Dialog édition ----------------------------------------------------- */}
      <BlocDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedBloc(null)
          resetForm()
        }}
        isEdit
        isLoading={isLoading}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleEdit}
        etages={etages}   /* inutilisé en édition mais requis par l’API */
      />

      {/* Dialog suppression ------------------------------------------------- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ce bloc&nbsp;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible&nbsp;: le bloc et toutes ses
              chambres seront définitivement supprimés.
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
              {isLoading ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
