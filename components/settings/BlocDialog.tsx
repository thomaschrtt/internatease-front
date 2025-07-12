"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Etage } from "@/types"   // ajustez le chemin à vos types

// ---------- types -----------------------------------------------------------
export type BlocFormData = { nom_bloc: string; etage_id?: number }

interface BlocDialogProps {
  isOpen: boolean
  onClose: () => void
  isEdit?: boolean
  isLoading: boolean
  formData: BlocFormData
  onChange: (data: BlocFormData) => void
  onConfirm: () => void
  etages: Etage[]
}
// ---------------------------------------------------------------------------

export function BlocDialog({
  isOpen,
  onClose,
  isEdit = false,
  isLoading,
  formData,
  onChange,
  onConfirm,
  etages,
}: BlocDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le bloc" : "Ajouter un bloc"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations du bloc ci-dessous."
              : "Remplissez les informations du nouveau bloc."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nom --------------------------------------------------------------- */}
          <div className="grid gap-2">
            <Label htmlFor="nom_bloc">Nom du bloc</Label>
            <Input
              id="nom_bloc"
              value={formData.nom_bloc}
              onChange={(e) =>
                onChange({ ...formData, nom_bloc: e.target.value })
              }
              placeholder="Ex : A, B, C…"
            />
          </div>

          {/* Choix de l’étage (création uniquement) --------------------------- */}
          {!isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="etage">Étage</Label>
              <Select
                value={formData.etage_id?.toString() || ""}
                onValueChange={(value) =>
                  onChange({ ...formData, etage_id: Number.parseInt(value) })
                }
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
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Chargement…" : isEdit ? "Modifier" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
