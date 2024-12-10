'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {RoomGanttChart} from "@/components/room/gant-chart";

type RoomDetailsProps = {
    id: number
}

export function RoomDetailsComponent({id}: RoomDetailsProps) {
  const router = useRouter()
  const [room, setRoom] = useState<Chambre | null>(null)
  const [stays, setStays] = useState<Occupation[]>([])

  useEffect(() => {
    if (id) {
      fetchRoomDetails()
      fetchRoomStays()
    }
  }, [id])

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`http://localhost/InternatEase/public/api/chambres/${id}`, {
        credentials: 'include',
      })
      const data = await response.json()
      setRoom(data)
    } catch (error) {
      console.error('Error fetching room details:', error)
    }
  }

  const fetchRoomStays = async () => {
    try {
      const response = await fetch(`http://localhost/InternatEase/public/api/chambres/${id}/occupations`, {
        credentials: 'include',
      })
      const data = await response.json()
      setStays(data.member)
    } catch (error) {
      console.error('Error fetching room stays:', error)
    }
  }


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
          <RoomGanttChart stays={stays} />
        </CardContent>
      </Card>
    </div>
  )
}