'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Pencil, Trash2, Plus } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

import { StageDialog } from './StageDialog'


interface StageManagementProps {
    stages: Stage[]
    classes: Classe[]
    onAdd: (stage: Omit<Stage, 'id'>) => Promise<void>
    onEdit: (id: number, stage: Partial<Stage>) => Promise<void>
    onDelete: (id: number) => Promise<void>
}

export function StageManagement({
                                    stages,
                                    classes,
                                    onAdd,
                                    onEdit,
                                    onDelete,
                                }: StageManagementProps) {
    // Ouverture / fermeture des dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Stage sélectionné pour l'édition/suppression
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null)

    // Indicateur de chargement pour les actions (ajout, edit, suppr)
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Lorsque l'utilisateur valide le formulaire pour ajouter un stage.
     */
    const handleAdd = async (stageData: Partial<Stage>) => {
        if (!stageData.date_debut || !stageData.date_fin || !stageData.classe) return

        setIsLoading(true)
        try {
            await onAdd(stageData as Omit<Stage, 'id'>)
            setIsAddDialogOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Lorsque l'utilisateur valide le formulaire pour éditer un stage.
     */
    const handleEdit = async (stageData: Partial<Stage>) => {
        if (!selectedStage) return

        setIsLoading(true)
        try {
            await onEdit(selectedStage.id, stageData)
            setIsEditDialogOpen(false)
            setSelectedStage(null)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Confirmation de suppression
     */
    const handleDelete = async () => {
        if (!selectedStage) return
        setIsLoading(true)

        try {
            await onDelete(selectedStage.id)
            setIsDeleteDialogOpen(false)
            setSelectedStage(null)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des stages</h2>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un stage
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Classe</TableHead>
                        <TableHead>Date de début</TableHead>
                        <TableHead>Date de fin</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stages.map((stage) => (
                        <TableRow key={stage.id}>
                            <TableCell>{stage.classe.nom_classe}</TableCell>
                            <TableCell>
                                {format(new Date(stage.date_debut), "PPP", { locale: fr })}
                            </TableCell>
                            <TableCell>
                                {format(new Date(stage.date_fin), "PPP", { locale: fr })}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedStage(stage)
                                        setIsEditDialogOpen(true)
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedStage(stage)
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

            {/* Dialog d'ajout */}
            <StageDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                isLoading={isLoading}
                defaultStage={{}}          // Aucune valeur par défaut => création
                onConfirm={handleAdd}
                classes={classes}
            />

            {/* Dialog d'édition */}
            <StageDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false)
                    setSelectedStage(null)
                }}
                isEdit
                isLoading={isLoading}
                defaultStage={selectedStage ?? {}}  // On passe le stage sélectionné
                onConfirm={handleEdit}
                classes={classes}
            />

            {/* Dialog de suppression */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Êtes-vous sûr de vouloir supprimer ce stage ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Le stage sera définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setIsDeleteDialogOpen(false)
                                setSelectedStage(null)
                            }}
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
