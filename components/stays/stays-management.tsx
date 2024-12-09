'use client'

import {useState} from 'react'
import {RoomSearch} from "@/components/stays/stay_search";
import {StaysTable} from "@/components/stays/stay_table";
import {AddStayForm} from "@/components/stays/stay_add";
import {Separator} from "@/components/ui/separator"
import axios from "@/api/Axios";
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {addStay, editStay, fetchRooms, fetchStays, fetchStudents, searchAvailableStudents} from "@/api/sejourAPI";
import {toast} from "@/hooks/use-toast";
import {formatDate} from "@/lib/utils";


export function StaysManagement() {
    const {data: stays, isLoading: staysLoading} = useCustomQuery<Occupation[]>(
        ['occupations'],
        () => fetchStays()
    )

    const {data: rooms, isLoading: roomsLoading} = useCustomQuery<Chambre[]>(
        ['chambres'],
        () => fetchRooms()
    )
    const {data: students, isLoading: studentsLoading} = useCustomQuery<Etudiant[]>(
        ['etudiants'],
        () => fetchStudents()
    )

    const [searchStartDate, setSearchStartDate] = useState<Date>()
    const [searchEndDate, setSearchEndDate] = useState<Date>()
    const [availableRooms, setAvailableRooms] = useState<Chambre[]>([])
    const [availableStudents, setAvailableStudents] = useState<Etudiant[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('') // Add a search term state
    const [isAddStayModalOpen, setIsAddStayModalOpen] = useState(false)
    const [newStay, setNewStay] = useState<Partial<Occupation>>({})



    const {mutate: deleteStay} = useCustomMutation(
        ({stayId}) => axios.delete(`/api/occupations/${stayId}`),
        [['occupations']],
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
        ({date_debut, date_fin, chambre_id, etudiant_id}) => addStay(date_debut, date_fin, chambre_id, etudiant_id),
        [['occupations']],
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
        [['occupations', 'chambres']],
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

    const {data: availableStudentsData, isLoading: availableStudentsLoading} = useCustomQuery<any[]>(
        ['availableStudents'],
        () => searchAvailableStudents(formatDate(searchStartDate ? searchStartDate : null), formatDate(searchEndDate ? searchEndDate : null))
    )

    const onSearchAvailableStudents = async () => {
        if (!searchStartDate || !searchEndDate) return;

        try {
            const response = await axios.get(`/api/available-students?date_debut=${formatDate(searchStartDate)}&date_fin=${formatDate(searchEndDate)}`);
            if (response.status !== 200) {
                console.error('Failed to fetch available rooms');
                return;
            }
            await fetchStudents();
            const availableStudentsIds = await response.data;
            const availableStudents = students.filter(student => Object.keys(availableStudentsIds).includes(student.id.toString()));
            setAvailableStudents(availableStudents);

        } catch (error) {
            console.error('Error fetching available students:', error);
        }
    };

    const searchAvailableRooms = async () => {
        if (!searchStartDate || !searchEndDate) return;

        try {
            const response = await axios.get(`/api/available-rooms?date_debut=${formatDate(searchStartDate)}&date_fin=${formatDate(searchEndDate)}`);

            if (response.status !== 200) {
                console.error('Failed to fetch available rooms');
                return;
            }

            const availableRoomIds = await response.data;
            const availableRooms = rooms.filter(room => Object.keys(availableRoomIds).includes(room.id.toString()));
            availableRooms.map(room => {
                    room.occupe = availableRoomIds[room.id]
                    return room;
                }
            )
            setAvailableRooms(availableRooms);

        } catch (error) {
            console.error('Error fetching available rooms:', error);
        }
    };


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
        setNewStay({
            ...newStay,
            chambre_id: roomId,
            chambre: rooms.find(room => room.id === roomId),
            date_debut: searchStartDate ? searchStartDate : null,
            date_fin: searchEndDate ? searchEndDate : null
        });
        setIsAddStayModalOpen(true);
    };


    const handleDeleteStay = async (stayId: number) => {
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce séjour ?");

        if (!isConfirmed) {
            return; // Si l'utilisateur annule, on arrête la fonction ici
        }

        deleteStay({stayId})

    };
    // Filter stays based on the search term (student's name)
    const filteredStays = stays && !staysLoading
        ? stays.filter((stay) =>
            stay.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleMovedStudent = () => {
        fetchStays()
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
                searchAvailableRooms={searchAvailableRooms}
                handleRoomClick={handleRoomClick}
            />

            <Separator className="my-4"/>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Séjours actuels</h2>
                    <AddStayForm
                        isAddStayModalOpen={isAddStayModalOpen}
                        setIsAddStayModalOpen={setIsAddStayModalOpen}
                        students={availableStudents}
                        newStay={newStay}
                        setNewStay={setNewStay}
                        handleAddStay={handleAddStay}
                    />
                </div>

                <StaysTable stays={filteredStays} onDelete={handleDeleteStay}
                            onEdit={(stayId: number, newDateFin: string) => onEdit({stayId, newDateFin})}
                            allRooms={rooms} handleMovedStudent={handleMovedStudent}/> {/* Pass the delete handler */}
            </div>
        </div>
    )
}
