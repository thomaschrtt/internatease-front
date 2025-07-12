"use client"

import { useState } from "react"
import { Pencil, Trash2, Accessibility } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

import { ChambreDialog, ChambreFormData } from "./ChambreDialog"
import { Input } from "../ui/input"

interface ChambreManagementProps {
  chambres: Chambre[]
  blocs: Bloc[]
  onAdd: (payload: {
    numero_chambre: number
    capacite: number
    type_special: string | null
    bloc_id: number
  }) => Promise<void>
  onEdit: (id: number, payload: Partial<Chambre>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ChambreManagement({
  chambres,
  blocs,
  onAdd,
  onEdit,
  onDelete,
}: ChambreManagementProps) {
  // -------------------- état « global » --------------------
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedChambre, setSelectedChambre] = useState<Chambre | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<ChambreFormData>({
    numero_chambre: "",
    capacite: "",
    type_special: null,
  })

  // -------------------- handlers ---------------------------
  const resetForm = () =>
    setFormData({ numero_chambre: "", capacite: "", type_special: null })

  /** Création ------------------------------------------------ */
  const handleAdd = async () => {
    if (!formData.numero_chambre || !formData.capacite || !formData.bloc_id)
      return

    setIsLoading(true)
    try {
      await onAdd({
        numero_chambre: formData.numero_chambre as number,
        capacite: formData.capacite as number,
        type_special: formData.type_special,
        bloc_id: formData.bloc_id,
      })
      setIsAddDialogOpen(false)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  /** Édition -------------------------------------------------- */
  const handleEdit = async () => {
    if (!selectedChambre) return

    setIsLoading(true)
    try {
      await onEdit(selectedChambre.id, {
        numero_chambre: formData.numero_chambre as number,
        capacite: formData.capacite as number,
        type_special: formData.type_special,
      })
      setIsEditDialogOpen(false)
      setSelectedChambre(null)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  /** Suppression --------------------------------------------- */
  const handleDelete = async () => {
    if (!selectedChambre) return

    setIsLoading(true)
    try {
      await onDelete(selectedChambre.id)
      setIsDeleteDialogOpen(false)
      setSelectedChambre(null)
    } finally {
      setIsLoading(false)
    }
  }
    
  const [search, setSearch] = useState("")

  // ==========================================================
  return (
    <div className="space-y-4">
      {/* ---------- Titre + bouton d’ajout -------------------- */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestion des chambres</h3>

        {/* zone recherche + bouton “Ajouter” dans la même ligne */}
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />

          <Button
            onClick={() => {
              resetForm()
              setIsAddDialogOpen(true)
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter une chambre
          </Button>
        </div>
      </div>

      {/* ------------------ Tableau --------------------------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Bloc</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Type spécial</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chambres
            .filter((c) =>
              [
                c.numero_chambre?.toString(),
                c.bloc?.nom_bloc,
                c.bloc?.etage?.numero_etage?.toString(),
                c.type_special ?? "standard",
              ]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((chambre) => (
            <TableRow key={chambre.id}>
              <TableCell>{chambre.numero_chambre}</TableCell>
              <TableCell>{chambre.bloc.nom_bloc}</TableCell>
              <TableCell>Étage {chambre.bloc.etage.numero_etage}</TableCell>
              <TableCell>{chambre.capacite}</TableCell>
              <TableCell>
                {chambre.type_special ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Accessibility className="h-3 w-3" />
                    {chambre.type_special}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Standard</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {/* Bouton éditer */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedChambre(chambre)
                    setFormData({
                      numero_chambre: chambre.numero_chambre,
                      capacite: chambre.capacite,
                      type_special: chambre.type_special,
                    })
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {/* Bouton supprimer */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedChambre(chambre)
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

      {/* ------------------ Dialog CREATE --------------------- */}
      <ChambreDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          resetForm()
        }}
        isLoading={isLoading}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleAdd}
        blocs={blocs}
      />

      {/* ------------------ Dialog EDIT ----------------------- */}
      <ChambreDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedChambre(null)
          resetForm()
        }}
        isEdit
        isLoading={isLoading}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleEdit}
        blocs={blocs}      /* non utilisé mais requis par l’API */
      />

      {/* ---------------- Dialog DELETE ----------------------- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette chambre ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible : la chambre sera définitivement
              supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedChambre(null)
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
