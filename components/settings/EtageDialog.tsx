import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


// EtageDialog.tsx ------------------------------------------------------------
export interface EtageDialogProps {
  isOpen: boolean
  onClose: () => void
  isEdit?: boolean
  formData: Partial<Etage>
  onChange: (data: Partial<Etage>) => void
  onConfirm: () => void
  isLoading: boolean
}

export function EtageDialog({
  isOpen, onClose, isEdit = false,
  formData, onChange, onConfirm, isLoading,
}: EtageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'étage" : "Ajouter un étage"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations de l'étage ci-dessous."
              : "Remplissez les informations du nouvel étage."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="numero_etage">Numéro d'étage</Label>
            <Input
              id="numero_etage"
              type="number"
              value={formData.numero_etage || ""}
              onChange={(e) => onChange({ ...formData, numero_etage: Number.parseInt(e.target.value) })}
              placeholder="Ex: 1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={formData.genre || ""}
              onValueChange={(value) => onChange({ ...formData, genre: value || null })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un genre (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
                <SelectItem value="N">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
                {isLoading ? 'Chargement…' : isEdit ? 'Modifier' : 'Ajouter'}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
