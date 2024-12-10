'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {PlusCircle} from 'lucide-react'
import {RoomCard} from "@/components/room/room-card";
import {RoomFilter} from "@/components/room/room-filter";
import {CreateRoomForm} from "@/components/room/create-room-form";
import axios from "@/api/Axios";

export function Chambres() {
    const [rooms, setRooms] = useState<any[]>([])
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)
    const [hoveredRoomStudents, setHoveredRoomStudents] = useState<any[]>([])
    const [filter, setFilter] = useState({ floor: 'all', block: 'all', status: 'all', gender: 'all' });
    const [floors, setFloors] = useState<any[]>([]) // Dynamically fetched floors
    const [blocks, setBlocks] = useState<any[]>([]) // Dynamically fetched blocks
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false)

    useEffect(() => {
        fetchRooms()
        fetchFloorsAndBlocks() // Fetch floors and blocks on component mount
    }, [])

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/chambres');
            setRooms(response.data.member); // Set the rooms state with the transformed data
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };


    const fetchFloorsAndBlocks = async () => {
        try {
            // Fetch floors
            const floorsResponse = await axios.get('/api/etages')
            setFloors(floorsResponse.data.member)

            // Fetch blocks
            const blocksResponse = await axios.get('/api/blocs')
            setBlocks(blocksResponse.data.member)
        } catch (error) {
            console.error('Error fetching floors and blocks:', error)
        }
    }


    const handleRoomHover = (roomId: string) => {
        const room = rooms.find(r => r.id === roomId);
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

    const handleRoomCreated = () => {
        fetchRooms()
        setIsCreateRoomModalOpen(false)
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
                        <CreateRoomForm blocks={blocks} onRoomCreated={handleRoomCreated} />
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
