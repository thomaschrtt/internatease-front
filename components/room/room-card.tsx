'use client'

import React from 'react'
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Accessibility, CalendarCheck, CalendarX, User} from 'lucide-react'
import {formatDate} from "date-fns";

const RoomCard = ({room}: { room: Chambre }) => {
    const occupancyPercentage = (room.occupations.length / room.capacite) * 100

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="w-full h-auto cursor-pointer hover:bg-accent transition-colors relative">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-lg font-semibold">{room.numero_chambre}</div>
                        <Badge
                            variant={
                                occupancyPercentage === 100
                                    ? "destructive"
                                    : occupancyPercentage > 0
                                        ? "default"
                                        : "secondary"
                            }
                            className="mt-2"
                        >
                            {room.occupations.length}/{room.capacite}
                        </Badge>
                    </CardContent>
                    {room.type_special && (
                        <div className="absolute top-1 right-1">
                            <Accessibility className="h-4 w-4 text-blue-500"/>
                        </div>
                    )}
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chambre {room.numero_chambre} Détails</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <p>Etage: {room.bloc.etage.numero_etage}</p>
                    <p>Bloc: {room.bloc.nom_bloc}</p>
                    <p>Capacité: {room.occupations.length}/{room.capacite}</p>
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-4">
                    <h4 className="font-semibold mb-2">Etudiants assignés:</h4>
                    {room.occupations.length > 0 ? (
                        room.occupations.map((occupation) => (
                            <div key={occupation.etudiant_id} className="flex items-center mb-2">
                                <User className="h-4 w-4 mr-2"/>
                                <span>{occupation.etudiant.nom} - {occupation.etudiant.classe.nom_classe} </span>
                                <span className="flex items-center ml-4">
    <CalendarCheck className="h-4 w-4 mr-1"/>
                                    {formatDate(occupation.date_debut, "dd/MM/yyyy")}
  </span>
                                <span className="flex items-center ml-4">
    <CalendarX className="h-4 w-4 mr-1"/>
                                    {formatDate(occupation.date_fin, "dd/MM/yyyy")}
  </span>
                            </div>
                        ))
                    ) : (
                        <p>Pas d&#39;étudiant dans cette chambre</p>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default RoomCard
