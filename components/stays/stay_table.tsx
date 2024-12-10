import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {format, parseISO} from 'date-fns'
import {FileSliders, Pen, Trash2} from "lucide-react";
import {useState} from "react";
import {MoveStudentForm} from "@/components/stays/move_student_form";
import {EditDepartureDateForm} from "@/components/stays/editdepartureform";

type StaysTableProps = {
    stays: Occupation[];
    onDelete: (stayId: number) => void; // Function to handle delete
    onEdit: (stayId: number, newDateFin: string) => void; // Function to handle edit
    allRooms: Chambre[];
    handleMovedStudent: () => void;
}

export function StaysTable({stays, onDelete, onEdit, allRooms, handleMovedStudent}: StaysTableProps) {
    const [selectedStay, setSelectedStay] = useState<Occupation | null>(null); // State to store the stay for the move
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openMoveModal = (stay: Occupation) => {
        setSelectedStay(stay);
        setIsMoveModalOpen(true);
    };


    const openEditModal = (stay: Occupation) => {
        setSelectedStay(stay);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (newDateFin: string) => {
        if (selectedStay) {
            onEdit(selectedStay.id, newDateFin); // Call the onEdit function passed as a prop
        }
    };


    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Etudiant</TableHead>
                        <TableHead>Chambre</TableHead>
                        <TableHead>Date d&#39;arrivée</TableHead>
                        <TableHead>Date de sortie</TableHead>
                        <TableHead>Déplacer</TableHead>
                        <TableHead>Supprimer</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stays.map((stay) => (
                        <TableRow key={stay.id}>
                            <TableCell>{stay.etudiant.nom}</TableCell>
                            <TableCell>{stay.chambre.numero_chambre}</TableCell>
                            <TableCell>{format(parseISO(stay.date_debut.toString()), 'PP')}</TableCell>
                            <TableCell>
                                {format(parseISO(stay.date_fin.toString()), 'PP')}
                                <Button variant="ghost" size="icon" onClick={() => openEditModal(stay)}>
                                    <Pen className="h-4 w-4"/>
                                    <span className="sr-only">Modifier la date de sortie</span>
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => openMoveModal(stay)}>
                                    <FileSliders className="h-4 w-4"/>
                                    <span className="sr-only">Modifier la chambre</span>
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(stay.id)}>
                                    <Trash2 className="h-4 w-4"/>
                                    <span className="sr-only">Supprimer le séjour</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {selectedStay && (
                <MoveStudentForm
                    allRooms={allRooms}
                    stay={selectedStay}
                    isOpen={isMoveModalOpen}
                    setIsOpen={setIsMoveModalOpen}
                    handleMovedStudent={handleMovedStudent}
                />
            )}
            {/* Use the new EditDepartureDateForm */}
            {selectedStay && (
                <EditDepartureDateForm
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                    currentDateFin={selectedStay} // Pass the current date_fin
                    onSubmit={handleEditSubmit}
                />
            )}
        </>
    )
}
