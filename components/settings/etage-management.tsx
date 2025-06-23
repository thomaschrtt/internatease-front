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
import { Badge } from "@/components/ui/badge"
import { PlusIcon } from "@radix-ui/react-icons"
import { EtageDialog } from "./EtageDialog"

interface EtageManagementProps {
  etages: Etage[]
  onAdd: (etage: Omit<Etage, "id" | "blocs">) => Promise<void>
  onEdit: (id: number, etage: Partial<Etage>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function EtageManagement({ etages, onAdd, onEdit, onDelete }: EtageManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEtage, setSelectedEtage] = useState<Etage | null>(null)
  const [formData, setFormData] = useState<Partial<Etage>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = async () => {
    if (!formData.numero_etage) return

    setIsLoading(true)
    try {
      await onAdd({
        numero_etage: formData.numero_etage,
        genre: formData.genre || null,
      })
      setIsAddDialogOpen(false)
      setFormData({})
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedEtage) return

    setIsLoading(true)
    try {
      await onEdit(selectedEtage.id, formData)
      setIsEditDialogOpen(false)
      setSelectedEtage(null)
      setFormData({})
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEtage) return

    setIsLoading(true)
    try {
      await onDelete(selectedEtage.id)
      setIsDeleteDialogOpen(false)
      setSelectedEtage(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestion des étages</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un étage
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro d'étage</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Nombre de blocs</TableHead>
            <TableHead>Nombre de chambres</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {etages.map((etage) => (
            <TableRow key={etage.id}>
              <TableCell>Étage {etage.numero_etage}</TableCell>
              <TableCell>
                {etage.genre ? (
                  <Badge variant="secondary">{etage.genre}</Badge>
                ) : (
                  <span className="text-muted-foreground">Non spécifié</span>
                )}
              </TableCell>
              <TableCell>{etage.blocs.length}</TableCell>
              <TableCell>{etage.blocs.reduce((total, bloc) => total + bloc.chambres.length, 0)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedEtage(etage)
                    setFormData({
                      numero_etage: etage.numero_etage,
                      genre: etage.genre,
                    })
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedEtage(etage)
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

      <EtageDialog
        isOpen={isAddDialogOpen}
        onClose={() => { setIsAddDialogOpen(false); setFormData({}) }}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleAdd}
        isLoading={isLoading}
      />

      <EtageDialog
        isOpen={isEditDialogOpen}
        onClose={() => { setIsEditDialogOpen(false); setFormData({}) }}
        formData={formData}
        onChange={setFormData}
        onConfirm={handleEdit}
        isLoading={isLoading}
        isEdit
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet étage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L'étage et tous ses blocs et chambres seront définitivement
              supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedEtage(null)
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
