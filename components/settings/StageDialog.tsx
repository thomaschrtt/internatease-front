'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

interface StageDialogProps {
    /** Contrôle d'ouverture/fermeture du Dialog */
    isOpen: boolean
    onClose: () => void

    /** Permet d'afficher un titre/bouton différent si on édite */
    isEdit?: boolean

    /** Indique si une requête est en cours (pour afficher un loader, désactiver bouton, etc.) */
    isLoading: boolean

    /** Valeurs initiales du stage (pour pré-remplir le formulaire), peut être vide pour la création */
    defaultStage?: Partial<Stage>

    /** Liste des classes disponibles */
    classes: Classe[]

    /**
     * Callback qui sera appelé quand on clique sur le bouton "Ajouter"/"Modifier".
     * On lui passe les données du formulaire en paramètre.
     */
    onConfirm: (stageData: Partial<Stage>) => void
}

export function StageDialog({
                                isOpen,
                                onClose,
                                isEdit = false,
                                isLoading,
                                defaultStage = {},
                                classes,
                                onConfirm,
                            }: StageDialogProps) {
    // État interne pour gérer le "stage" que l'utilisateur est en train de remplir
    const [localStage, setLocalStage] = useState<Partial<Stage>>(defaultStage)

    /**
     * À chaque fois que le Dialog s'ouvre, on ré-initialise
     * le formulaire avec les valeurs par défaut (defaultStage).
     */
    useEffect(() => {
        if (isOpen) {
            setLocalStage(defaultStage)
        }
    }, [isOpen, defaultStage])

    // Handler appelé lors de la soumission du formulaire
    const handleConfirm = () => {
        onConfirm(localStage) // On remonte les données au parent
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Modifier le stage' : 'Ajouter un stage'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Modifiez les informations du stage ci-dessous.'
                            : 'Remplissez les informations du nouveau stage.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Date de début */}
                    <div className="grid gap-2">
                        <label>Date de début</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !localStage.date_debut && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localStage.date_debut ? (
                                        format(localStage.date_debut, "PPP", { locale: fr })
                                    ) : (
                                        <span>Sélectionner une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={localStage.date_debut}
                                    onSelect={(date) => setLocalStage({ ...localStage, date_debut: date ?? undefined })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Date de fin */}
                    <div className="grid gap-2">
                        <label>Date de fin</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !localStage.date_fin && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localStage.date_fin ? (
                                        format(localStage.date_fin, "PPP", { locale: fr })
                                    ) : (
                                        <span>Sélectionner une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={localStage.date_fin}
                                    onSelect={(date) => setLocalStage({ ...localStage, date_fin: date ?? undefined })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Classe */}
                    <div className="grid gap-2">
                        <label>Classe</label>
                        <Select
                            value={localStage.classe?.id?.toString() || ''}
                            onValueChange={(value) => {
                                const selectedClass = classes.find(c => c.id.toString() === value)
                                if (selectedClass) {
                                    setLocalStage({ ...localStage, classe: selectedClass })
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une classe" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((classe) => (
                                    <SelectItem key={classe.id} value={classe.id.toString()}>
                                        {classe.nom_classe}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Chargement...' : isEdit ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
