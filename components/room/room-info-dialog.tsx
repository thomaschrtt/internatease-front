import React, {useState} from 'react'
import {format} from 'date-fns'
import {fr} from 'date-fns/locale'
import {DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {CalendarCheck, CalendarX, Info, Trash2, User} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface RoomInfoDialogProps {
    room: Chambre,
    handleDeleteStay: (stayId: number) => Promise<void>
}

const formatDate = (date: string, formatString: string) => {
    return format(new Date(date), formatString, {locale: fr})
}
const DeleteAlertDialog = ({isOpen, onClose, onConfirm, studentName}) => (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce séjour ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action supprimera le séjour de {studentName} et ne peut pas être annulée.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)

export function RoomInfoDialog({room, handleDeleteStay}: RoomInfoDialogProps) {
    const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, stayId: null, studentName: '' })

    const openDeleteDialog = (stayId: string, studentName: string) => {
        setDeleteDialogState({ isOpen: true, stayId, studentName })
    }

    const closeDeleteDialog = () => {
        setDeleteDialogState({ isOpen: false, stayId: null, studentName: '' })
    }

    const confirmDelete = () => {
        if (deleteDialogState.stayId) {
            handleDeleteStay(deleteDialogState.stayId)
        }
        closeDeleteDialog()
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <div className="flex items-center justify-between w-full mt-2">
                    <DialogTitle>Chambre {room.numero_chambre}</DialogTitle>
                    <Button
                        onClick={() => window.location.href = `/chambres/${room.id}`}
                        className="ml-4"
                    >
                        <Info className="mr-2 h-4 w-4"/>
                        Plus d&#39;infos
                    </Button>
                </div>
            </DialogHeader>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Occupants ce soir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px] w-full rounded-md">
                            {room.occupations.length > 0 ? (
                                <ul className="space-y-2">
                                    {room.occupations.map((occupation) => (
                                        <li key={occupation.id} className="flex flex-col space-y-1 text-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-2"/>
                                                    <span className="font-medium">{occupation.etudiant.nom}</span>
                                                    <Badge variant="secondary"
                                                           className="ml-2">{occupation.etudiant.classe.nom_classe}</Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteDialog(occupation.id, occupation.etudiant.nom)}
                                                    className="h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                            <div className="flex items-center text-muted-foreground ml-6 space-x-4">
                    <span className="flex items-center">
                      <CalendarCheck className="h-4 w-4 mr-1"/>
                        {formatDate(occupation.date_debut, "dd/MM/yyyy")}
                    </span>
                                                <span className="flex items-center">
                      <CalendarX className="h-4 w-4 mr-1"/>
                                                    {formatDate(occupation.date_fin, "dd/MM/yyyy")}
                    </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">Pas d&#39;étudiant dans cette chambre ce soir</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                    <DeleteAlertDialog
                        isOpen={deleteDialogState.isOpen}
                        onClose={closeDeleteDialog}
                        onConfirm={confirmDelete}
                        studentName={deleteDialogState.studentName}
                    />
                </Card>
            </div>
        </DialogContent>


    )
}