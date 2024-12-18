'use client'

import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CalendarCheck, CalendarX, Info } from 'lucide-react'

interface RoomInfoDialogProps {
  room: {
    id: string
    numero_chambre: string
    capacite: number
    bloc: {
      nom_bloc: string
      etage: {
        numero_etage: number
      }
    }
    occupations: Array<{
      etudiant_id: string
      etudiant: {
        nom: string
        classe: {
          nom_classe: string
        }
      }
      date_debut: string
      date_fin: string
    }>
  }
}

const formatDate = (date: string, formatString: string) => {
  return format(new Date(date), formatString, { locale: fr })
}

export function RoomInfoDialog({ room }: RoomInfoDialogProps) {
  return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between w-full mt-2">
            <DialogTitle>Chambre {room.numero_chambre}</DialogTitle>
            <Button
                onClick={() => window.location.href = `/chambres/${room.id}`}
                className="ml-4"
            >
              <Info className="mr-2 h-4 w-4" />
              Plus d&#39;infos
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt>Étage:</dt>
                <dd>{room.bloc.etage.numero_etage}</dd>
                <dt>Bloc:</dt>
                <dd>{room.bloc.nom_bloc}</dd>
                <dt>Capacité:</dt>
                <dd>
                  <Badge variant={room.occupations.length === room.capacite ? "destructive" : "default"}>
                    {room.occupations.length}/{room.capacite}
                  </Badge>
                </dd>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Occupants ce soir</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md">
                {room.occupations.length > 0 ? (
                    <ul className="space-y-2">
                      {room.occupations.map((occupation) => (
                          <li key={occupation.etudiant_id} className="flex flex-col space-y-1 text-sm">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span className="font-medium">{occupation.etudiant.nom}</span>
                              <Badge variant="secondary" className="ml-2">{occupation.etudiant.classe.nom_classe}</Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground ml-6 space-x-4">
                    <span className="flex items-center">
                      <CalendarCheck className="h-4 w-4 mr-1" />
                      {formatDate(occupation.date_debut, "dd/MM/yyyy")}
                    </span>
                              <span className="flex items-center">
                      <CalendarX className="h-4 w-4 mr-1" />
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
          </Card>
        </div>
      </DialogContent>

  )
}