import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type RoomSearchProps = {
    searchStartDate: Date | undefined
    searchEndDate: Date | undefined
    setSearchStartDate: (date: Date | undefined) => void
    setSearchEndDate: (date: Date | undefined) => void
    availableRooms: Room[]
    searchAvailableRooms: () => void
    handleRoomClick: (roomId: number, roomNumber: string) => void // New function to handle room click
}

export function RoomSearch({
                               searchStartDate,
                               searchEndDate,
                               setSearchStartDate,
                               setSearchEndDate,
                               availableRooms,
                               searchAvailableRooms,
                               handleRoomClick // Added handler for room click
                           }: RoomSearchProps) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Rechercher chambres libres</h2>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                    <Label htmlFor="start-date">Date d&#39;arrivée</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !searchStartDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {searchStartDate ? format(searchStartDate, "PPP") : <span>Choisissez une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={searchStartDate}
                                onSelect={setSearchStartDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex-1">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !searchEndDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {searchEndDate ? format(searchEndDate, "PPP") : <span>Choisissez une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={searchEndDate}
                                onSelect={setSearchEndDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button onClick={searchAvailableRooms}>Rechercher</Button>
            </div>

            {availableRooms.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Chambres libres :</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableRooms.map(room => {
                            const remainingPlaces = room.capacite - room.occupe;
                            return (
                                <Card
                                    key={room.id}
                                    className="shadow-lg transition transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRoomClick(room.id, room.numero_chambre)}
                                >
                                    <CardHeader>
                                        <CardTitle>Chambre {room.numero_chambre} - Etage {room.bloc.etage.genre} </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">
                                            {remainingPlaces > 0
                                                ? `Peut loger ${remainingPlaces} étudiant${remainingPlaces > 1 ? 's' : ''}`
                                                : "Aucune place disponible"}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    )
}
