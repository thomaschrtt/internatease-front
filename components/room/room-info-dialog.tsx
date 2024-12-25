import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {User, CalendarCheck, CalendarX, Info, Trash2} from 'lucide-react'

interface RoomInfoDialogProps {
  room: Chambre,
  handleDeleteStay: (stayId: number) => Promise<void>
}

const formatDate = (date: string, formatString: string) => {
  return format(new Date(date), formatString, { locale: fr })
}

export function RoomInfoDialog({ room, handleDeleteStay }: RoomInfoDialogProps) {
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
              <CardTitle>Occupants ce soir</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md">
                {room.occupations.length > 0 ? (
                    <ul className="space-y-2">
                      {room.occupations.map((occupation) => (
                          <li key={occupation.id} className="flex flex-col space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span className="font-medium">{occupation.etudiant.nom}</span>
                                <Badge variant="secondary" className="ml-2">{occupation.etudiant.classe.nom_classe}</Badge>
                              </div>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteStay(occupation.id)}
                                  className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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