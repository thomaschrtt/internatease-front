'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {ChartConfig, ChartContainer} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {Monitor} from "lucide-react";
import {RoomGanttChart} from "@/components/room/gant-chart";

type Stay = {
  id: number
  date_debut: string
  date_fin: string
  etudiant: {
    id: number
    nom: string
    prenom: string
    internat_weekend: boolean
    genre: string
    numEtu: number
    classe: {
      id: number
      nomClasse: string
      stages: any[]
    }
  }
}

type Room = {
  id: number
  numero_chambre: string
  capacite: number
  bloc: {
    id: number
    nom: string
    etage: {
      id: number
      numero: number
      genre: string
    }
  }
}

const chartConfig = {

} satisfies ChartConfig

export function RoomDetailsComponent({ idRequest }: { idRequest: { id: number } }) {
  const router = useRouter()
  const { id } = {id:idRequest}
  const [room, setRoom] = useState<Room | null>(null)
  const [stays, setStays] = useState<Stay[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      fetchRoomDetails()
      fetchRoomStays()
    }
  }, [id])

  useEffect(() => {
    prepareChartData()
  }, [stays])

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

  const prepareChartData = () => {
    if (stays.length === 0) return

    const startDate = parseISO(stays[0].date_debut)
    const endDate = parseISO(stays[stays.length - 1].date_fin)
    const totalDays = differenceInDays(endDate, startDate) + 1

    const data = stays.map(stay => ({
      name: `${stay.etudiant.prenom} ${stay.etudiant.nom}`,
      start: differenceInDays(parseISO(stay.date_debut), startDate),
      duration: differenceInDays(parseISO(stay.date_fin), parseISO(stay.date_debut)) + 1,
    }))

    setChartData(data)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-bold">{data.name}</p>
          <p>Début: {format(parseISO(stays[data.index].date_debut), 'dd MMM yyyy', { locale: fr })}</p>
          <p>Fin: {format(parseISO(stays[data.index].date_fin), 'dd MMM yyyy', { locale: fr })}</p>
          <p>Durée: {data.duration} jours</p>
        </div>
      )
    }
    return null
  }
  if (!room) {
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