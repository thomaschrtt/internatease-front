'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {RoomGanttChart} from "@/components/room/gant-chart";
import {fetchRooms, fetchRoomStays} from "@/api/chambreAPI";
import {useCustomQuery} from "@/tanstackQuery/queryGenerator";

type RoomDetailsProps = {
    id: number
}

export function RoomDetailsComponent({id}: RoomDetailsProps) {
    const router = useRouter()

    const {data: allRooms} = useCustomQuery(['rooms'], fetchRooms, {initialData: []})
    const [room, setRoom] = useState<Chambre>()
    const {data: stays} = useCustomQuery(['stays', id], () => fetchRoomStays(id), {initialData: []})

    useEffect(() => {
        console.log(allRooms)
        if (allRooms) {
            setRoom(allRooms.find(r => r.id.toString() === id.toString()))
        }
    }, [allRooms, id])



    if (!room || !stays) {
        return <div>Chargement...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Button onClick={() => router.back()} className="mb-4">Retour</Button>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Détails de la chambre {room.numero_chambre}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Capacité: {room.capacite}</p>
                    <p>Bloc: {room.bloc.nom_bloc}</p>
                    <p>Étage: {room.bloc.etage.numero_etage}</p>
                    <p>Genre: {room.bloc.etage.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Planning des séjours</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoomGanttChart stays={stays}/>
                </CardContent>
            </Card>
        </div>
    )
}