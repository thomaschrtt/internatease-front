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
import { Checkbox } from "@/components/ui/checkbox"

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
export type ChambreFormData = {
  numero_chambre: number | ""
  capacite: number | ""
  type_special: string | null
  bloc_id?: number          // requis uniquement en création
}

interface ChambreDialogProps {
  /** Contrôle d’ouverture */
  isOpen: boolean
  /** Fermeture */
  onClose: () => void
  /** Mode édition ? */
  isEdit?: boolean
  /** Loader bouton principal */
  isLoading: boolean
  /** Données du formulaire */
  formData: ChambreFormData
  /** Pour mettre à jour le parent */
  onChange: (data: ChambreFormData) => void
  /** Callback de validation */
  onConfirm: () => void
  /** Liste des blocs (affichée seulement en création) */
  blocs: Bloc[]
}
// ---------------------------------------------------------------------------

export function ChambreDialog({
  isOpen,
  onClose,
  isEdit = false,
  isLoading,
  formData,
  onChange,
  onConfirm,
  blocs,
}: ChambreDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la chambre" : "Ajouter une chambre"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations de la chambre ci-dessous."
              : "Remplissez les informations de la nouvelle chambre."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Numéro ---------------------------------------------------------------- */}
          <div className="grid gap-2">
            <Label htmlFor="numero_chambre">Numéro de chambre</Label>
            <Input
              id="numero_chambre"
              type="number"
              value={formData.numero_chambre}
              onChange={(e) =>
                onChange({
                  ...formData,
                  numero_chambre: Number.parseInt(e.target.value) || "",
                })
              }
              placeholder="Ex : 101"
            />
          </div>

          {/* Capacité -------------------------------------------------------------- */}
          <div className="grid gap-2">
            <Label htmlFor="capacite">Capacité</Label>
            <Input
              id="capacite"
              type="number"
              value={formData.capacite}
              onChange={(e) =>
                onChange({
                  ...formData,
                  capacite: Number.parseInt(e.target.value) || "",
                })
              }
              placeholder="Ex : 2"
            />
          </div>

          {/* Type spécial ---------------------------------------------------------- */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type_special"
              checked={formData.type_special === "PMR"}
              onCheckedChange={(checked) =>
                onChange({
                  ...formData,
                  type_special: checked ? "PMR" : null,
                })
              }
            />
            <Label htmlFor="type_special">
              Chambre PMR (Personne à Mobilité Réduite)
            </Label>
          </div>

          {/* Bloc (uniquement en création) ---------------------------------------- */}
          {!isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="bloc">Bloc</Label>
              <Select
                value={formData.bloc_id?.toString() || ""}
                onValueChange={(value) =>
                  onChange({ ...formData, bloc_id: Number.parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bloc" />
                </SelectTrigger>
                <SelectContent>
                  {blocs.map((bloc) => (
                    <SelectItem key={bloc.id} value={bloc.id.toString()}>
                      Bloc {bloc.nom_bloc} – Étage {bloc.etage.numero_etage}
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
