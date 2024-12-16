'use client'

import {useState} from 'react'
import {RoomSearch} from "@/components/stays/stay_search";
import {StaysTable} from "@/components/stays/stay_table";
import {AddStayForm} from "@/components/stays/stay_add";
import {Separator} from "@/components/ui/separator"
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {
    addStay,
    deleteStay,
    editStay,
    fetchStays, moveStudent,
    searchAvailableRoom,
    searchAvailableStudents
} from "@/api/sejourAPI";
import {toast} from "@/hooks/use-toast";
import {formatDate} from "@/lib/utils";
import {fetchStudents} from "@/api/studentAPI";
import {fetchRooms} from "@/api/chambreAPI";
import RoomManagementInterface from "@/components/room/room-management";


export function StaysManagement() {

    const [searchStartDate, setSearchStartDate] = useState<Date>()
    const [searchEndDate, setSearchEndDate] = useState<Date>()
    const [searchTerm] = useState<string>('') // Add a search term state
    const [isAddStayModalOpen, setIsAddStayModalOpen] = useState(false)
    const [newStay, setNewStay] = useState<Partial<Occupation>>({})

    const {data: stays, isLoading: staysLoading} = useCustomQuery(['stays'], fetchStays)
    const {data: rooms, isLoading: roomsLoading} = useCustomQuery(['rooms'], fetchRooms)
    const {data: students, isLoading: studentsLoading} = useCustomQuery(['students'], fetchStudents)
    const {data: availableRooms} = useCustomQuery<AvailableChambre[]>(
        ['availableRooms', searchStartDate ? searchStartDate.toString() : '', searchEndDate ? searchEndDate.toString() : ''],
        () => searchAvailableRoom(formatDate(searchStartDate ? searchStartDate : null), formatDate(searchEndDate ? searchEndDate : null)),
        {enabled: !!searchStartDate && !!searchEndDate, initialData: []}
    )
    const {data: availableStudents} = useCustomQuery<AvailableEtudiant[]>(
        ['availableStudents', searchStartDate ? searchStartDate.toString() : '', searchEndDate ? searchEndDate.toString() : ''],
        () => searchAvailableStudents(formatDate(searchStartDate ? searchStartDate : null), formatDate(searchEndDate ? searchEndDate : null)),
        {enabled: !!searchStartDate && !!searchEndDate, initialData: []}
    )

    const {mutate: deleteStayMutation} = useCustomMutation(
        ({stayId}) => deleteStay(stayId),
        [['stays'], ['availableRooms'], ['rooms'], ['students'], ['availableStudents'], ['floors']],
        {
            onSuccess: () => toast({
                title: "Séjour supprimé",
                description: "Le séjour a été supprimé avec succès",
                variant: "default"
            }),
            onError: () => toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de la suppression du séjour",
                variant: "destructive"
            })
        }
    )

    const {mutate: addingStay} = useCustomMutation(
        (stay: OccupationInsert) => addStay(stay),
        [['stays'], ['availableRooms'], ['rooms'], ['students'], ['availableStudents'], ['floors']],
        {
            onSuccess: () => toast({
                title: "Séjour ajouté",
                description: "Le séjour a été ajouté avec succès",
                variant: "default"
            }),
            onError: () => toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de l'ajout du séjour",
                variant: "destructive"
            })
        }
    )

    const {mutate: onEdit} = useCustomMutation(
        ({stayId, newDateFin}) => editStay(stayId, newDateFin),
        [['stays'], ['availableRooms'], ['rooms'], ['students'], ['availableStudents'], ['floors']],
        {
            onSuccess: () => toast({
                title: "Séjour modifié",
                description: "La date de sortie a été modifiée avec succès",
                variant: "default"
            }),
            onError: () => toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de la modification de la date de sortie",
                variant: "destructive"
            })
        }
    )

    const {mutate: moveStudentMutation} = useCustomMutation(
        (data: MoveStudentData) => moveStudent(data),
        [['stays'], ['availableRooms'], ['rooms'], ['students'], ['availableStudents'], ['floors']],
        {
            onSuccess: () => toast({
                title: "Étudiant déplacé",
                description: "L'étudiant a été déplacé avec succès",
                variant: "default"
            }),
            onError: () => toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors du déplacement de l'étudiant",
                variant: "destructive"
            })
        }
    )


    const handleAddStay = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newStay.date_debut || !newStay.date_fin || !newStay.chambre_id || !newStay.etudiant_id) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive"
            })
            return;
        }
        addingStay({
            date_debut: newStay.date_debut,
            date_fin: newStay.date_fin,
            chambre_id: newStay.chambre_id,
            etudiant_id: newStay.etudiant_id
        })
        setIsAddStayModalOpen(false)
        setNewStay({})
    }

    const handleRoomClick = async (roomId: number) => {
        if (!rooms) {
            return;
        }
        setNewStay({
            ...newStay,
            chambre_id: roomId,
            chambre: rooms.find(room => room.id === roomId),
            date_debut: searchStartDate,
            date_fin: searchEndDate
        });
        setIsAddStayModalOpen(true);
    };


    const handleDeleteStay = async (stayId: number) => {
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce séjour ?");

        if (!isConfirmed) {
            return; // Si l'utilisateur annule, on arrête la fonction ici
        }

        deleteStayMutation({stayId})

    };
    // Filter stays based on the search term (student's name)
    const filteredStays = stays && !staysLoading
        ? stays.filter((stay) =>
            stay.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const resetDateSearch = () => {
        setSearchStartDate(undefined)
        setSearchEndDate(undefined)
    }

    if (staysLoading || roomsLoading || studentsLoading || !stays || !rooms || !students || !availableRooms || !availableStudents) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des chambres</h1>

            <RoomSearch
                searchStartDate={searchStartDate}
                searchEndDate={searchEndDate}
                setSearchStartDate={setSearchStartDate}
                setSearchEndDate={setSearchEndDate}
                availableRooms={availableRooms}
                handleRoomClick={handleRoomClick}
                resetSearch={resetDateSearch}
            />

            <Separator className="my-4"/>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <AddStayForm
                        isAddStayModalOpen={isAddStayModalOpen}
                        setIsAddStayModalOpen={setIsAddStayModalOpen}
                        students={availableStudents}
                        newStay={newStay}
                        setNewStay={setNewStay}
                        handleAddStay={handleAddStay}
                    />
                </div>

                {/*<StaysTable stays={filteredStays}*/}
                {/*            onDelete={handleDeleteStay}*/}
                {/*            onEdit={(stayId: number, newDateFin: string) => onEdit({stayId, newDateFin})}*/}
                {/*            onMove={moveStudentMutation}/> /!* Pass the delete handler *!/*/}
                <RoomManagementInterface/>
            </div>
        </div>
    )
}
