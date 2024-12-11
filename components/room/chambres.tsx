'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {PlusCircle} from 'lucide-react'
import {RoomCard} from "@/components/room/room-card";
import {RoomFilter} from "@/components/room/room-filter";
import {CreateRoomForm} from "@/components/room/create-room-form";
import {addRoom, fetchBlocs, fetchEtages, fetchRooms} from "@/api/chambreAPI";
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {toast} from "@/hooks/use-toast";

export function Chambres() {
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false)
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)
    const [hoveredRoomStudents, setHoveredRoomStudents] = useState<Etudiant[]>([])
    const [filter, setFilter] = useState({ floor: 'all', block: 'all', status: 'all', gender: 'all' });
    const {data: rooms} = useCustomQuery(['rooms'], fetchRooms, {initialData: []})
    const {data: floors} = useCustomQuery(['floors'], fetchEtages, {initialData: []})
    const {data: blocks} = useCustomQuery(['blocks'], fetchBlocs, {initialData: []})
    const {mutate: addRoomMutation} = useCustomMutation(
        (roomData: ChambreInsert) => addRoom(roomData),
        [['rooms']],
        {
            onSuccess: () => {
                toast({title: 'Chambre ajoutée', description: 'La chambre a été ajoutée avec succès'})
                setIsCreateRoomModalOpen(false)
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de l\'ajout de la chambre'})
            }
        }
    )


    const handleRoomHover = (roomId: string) => {
        const room = rooms.find(r => r.id.toString() === roomId);
        if (room) {
            setHoveredRoomStudents(room.etudiants); // Directly use the etudiants from the room object
        }
        setHoveredRoom(roomId); // Update hovered room ID
    };



    const filteredRooms = rooms.filter(room => {
        const floorMatch = filter.floor === 'all' || room.bloc.etage.id === parseInt(filter.floor)
        const blockMatch = filter.block === 'all' || room.bloc.id === parseInt(filter.block);
        // const statusMatch = filter.status === 'all' ||
        //     (filter.status === 'empty' && room.etudiants.length === 0) ||
        //     (filter.status === 'occupied' && room.etudiants.length > 0) ||
        //     (filter.status === 'available' && room.etudiants.length < room.capacite);
        const genderMatch = filter.gender === 'all' || room.bloc.etage.genre === filter.gender;
        const searchMatch = searchTerm === '' || room.numero_chambre.toString().toLowerCase().includes(searchTerm.toLowerCase());
        return blockMatch && genderMatch && searchMatch && floorMatch;
    });

    if (!rooms || !floors || !blocks) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tableau de gestion</h1>
                <Dialog open={isCreateRoomModalOpen} onOpenChange={setIsCreateRoomModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter une chambre
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter une nouvelle chambre</DialogTitle>
                        </DialogHeader>
                        <CreateRoomForm blocks={blocks} addRoomMutation={addRoomMutation} />
                    </DialogContent>
                </Dialog>
            </div>

            <RoomFilter
                floors={floors}
                blocks={blocks}
                filter={filter}
                searchTerm={searchTerm}
                setFilter={setFilter}
                setSearchTerm={setSearchTerm}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredRooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        handleRoomHover={handleRoomHover}
                        setHoveredRoom={setHoveredRoom}
                        hoveredRoomStudents={hoveredRoomStudents}
                    />
                ))}
            </div>
        </div>
    );

}
