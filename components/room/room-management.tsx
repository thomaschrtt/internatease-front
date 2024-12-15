import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { Button } from "@/components/ui/button" // Update path as needed
import { Calendar } from "@/components/ui/calendar" // Update path as needed
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {fetchEtageForSpecificDate} from "@/api/chambreAPI";
import RoomCard from "@/components/room/room-card";
import {Skeleton} from "@/components/ui/skeleton";

const RoomManagementInterface = () => {
    const [selectedFloor, setSelectedFloor] = useState('1')
    const [date, setDate] = useState<Date>(new Date())

    const { data: floors, isLoading } = useCustomQuery(
        ['floors', date],
        () => fetchEtageForSpecificDate(format(date, 'yyyy-MM-dd')),
        { initialData: [] }
    )

    const goToPreviousDay = () => {
        setDate((prevDate) => addDays(prevDate, -1))
    }

    const goToNextDay = () => {
        setDate((prevDate) => addDays(prevDate, 1))
    }

    const goToToday = () => {
        setDate(new Date())
    }

    const selectedFloorData = floors ? floors.find((floor) => floor.id.toString() === selectedFloor) : { blocs: [] }


    const SkeletonLoading = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x">
            {[1, 2, 3].map((bloc) => (
                <div key={bloc} className="space-y-4 px-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                        {[1, 2, 3, 4].map((room) => (
                            <Skeleton key={room} className="h-24 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )


    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Centered Date Navigation & Picker */}
            <div className="p-4 border-b flex justify-center items-center gap-2">
                <Button variant="outline" onClick={goToPreviousDay} className="w-10 h-10 p-0 justify-center">
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex items-center gap-2 font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="h-4 w-4" />
                            {date ? format(date, "PPP") : "Choisir une date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => newDate && setDate(newDate)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Button variant="outline" onClick={goToNextDay} className="w-10 h-10 p-0 justify-center">
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    onClick={goToToday}
                    disabled={isLoading}
                >
                    Aujourd&#39;hui
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Floor Selection Sidebar */}
                <div className="w-24 border-r bg-muted/50">
                    <div className="flex flex-col h-full py-4">
                        {isLoading || !floors || floors.length === 0 ? (
                            [1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full mb-2" />
                            ))
                        ) : (
                            floors.sort((a, b) => a.numero_etage - b.numero_etage).map((floor) => (
                                <button
                                    key={floor.id}
                                    onClick={() => setSelectedFloor(floor.id.toString())}
                                    className={cn(
                                        "p-4 text-center transition-colors hover:bg-accent",
                                        selectedFloor === floor.id.toString() && "bg-accent font-bold"
                                    )}
                                >
                                    E{floor.numero_etage}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-auto">
                    {isLoading || !selectedFloorData ||!floors || floors.length === 0 ? (
                        <SkeletonLoading />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x">
                            {selectedFloorData.blocs.map((bloc) => (
                                <div key={bloc.id} className="space-y-4 px-4">
                                    {/* Bloc Header */}
                                    <div className="text-xl font-semibold text-center p-2 bg-muted rounded-lg">
                                        Bloc {bloc.nom_bloc}
                                    </div>

                                    {/* Rooms Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                                        {bloc.chambres.sort((a, b) => a.numero_chambre - b.numero_chambre)
                                            .map((room) => (
                                                <RoomCard key={room.id} room={room}/>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RoomManagementInterface
