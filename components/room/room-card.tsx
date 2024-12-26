'use client'

import React from 'react'
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Dialog, DialogTrigger,} from "@/components/ui/dialog"
import {Accessibility} from 'lucide-react'
import {RoomInfoDialog} from "@/components/room/room-info-dialog";

const RoomCard = ({room, handleDeleteStay}: { room: Chambre, handleDeleteStay:  (stayId: number) => Promise<void> }) => {
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
            <RoomInfoDialog room={room} handleDeleteStay={handleDeleteStay}/>
        </Dialog>
    )
}

export default RoomCard
