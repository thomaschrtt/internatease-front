import React, {useMemo, useState} from 'react'
import {CalendarIcon, Search} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {cn} from "@/lib/utils"
import {format} from 'date-fns'
import {toast} from "@/hooks/use-toast"

type RoomSearchProps = {
    searchStartDate: Date | undefined
    searchEndDate: Date | undefined
    setSearchStartDate: (date: Date | undefined) => void
    setSearchEndDate: (date: Date | undefined) => void
    availableRooms: AvailableChambre[]
    handleRoomClick: (roomId: number, roomNumber: string) => void
    resetSearch: () => void
}

export function RoomSearch({
                               searchStartDate,
                               searchEndDate,
                               setSearchStartDate,
                               setSearchEndDate,
                               availableRooms,
                               handleRoomClick,
                               resetSearch
                           }: RoomSearchProps) {
    const [searchRoomNumber, setSearchRoomNumber] = useState("")
    const [searchPlaces, setSearchPlaces] = useState("")
    const [sortBy, setSortBy] = useState<"etage" | "placesRestantes">("etage")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const filteredAndSortedRooms = useMemo(() => {
        return availableRooms
            .filter(room => {
                const remainingPlaces = room.capacite - room.occ_count
                const matchesRoom = searchRoomNumber === "" || room.numero_chambre.toString().startsWith(searchRoomNumber)
                const matchesPlaces = searchPlaces === "" || (parseInt(searchPlaces, 10) <= remainingPlaces)
                return matchesRoom && matchesPlaces
            })
            .sort((a, b) => {
                if (sortBy === "etage") {
                    return sortOrder === "asc" ? a.numero_etage - b.numero_etage : b.numero_etage - a.numero_etage
                } else {
                    const aPlaces = a.capacite - a.occ_count
                    const bPlaces = b.capacite - b.occ_count
                    return sortOrder === "asc" ? aPlaces - bPlaces : bPlaces - aPlaces
                }
            })
    }, [availableRooms, searchRoomNumber, searchPlaces, sortBy, sortOrder])

    const handleSort = (column: "etage" | "placesRestantes") => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(column)
            setSortOrder("asc")
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Rechercher chambres libres</h2>

            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                    <Label htmlFor="start-date">Date d&#39;arrivée</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !searchStartDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {searchStartDate ? format(searchStartDate, "PPP") : <span>Choisissez une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={searchStartDate}
                                onSelect={(date) => {
                                    if (date && searchEndDate && date >= searchEndDate) {
                                        toast({
                                            title: 'Erreur',
                                            description: 'La date de début ne peut pas être postérieure ou égale à la date de fin',
                                            variant: 'destructive'
                                        })
                                        return
                                    }
                                    setSearchStartDate(date)
                                }}
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
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !searchEndDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {searchEndDate ? format(searchEndDate, "PPP") : <span>Choisissez une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={searchEndDate}
                                onSelect={(date) => {
                                    if (date && searchStartDate && date <= searchStartDate) {
                                        toast({
                                            title: 'Erreur',
                                            description: 'La date de fin ne peut pas être antérieure ou égale à la date de début',
                                            variant: 'destructive'
                                        })
                                        return
                                    }
                                    setSearchEndDate(date)
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button onClick={resetSearch}>Réinitialiser</Button>
            </div>

            {availableRooms.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Chambres libres :</h3>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <Label htmlFor="search-room-number" className="text-sm font-medium">
                                    Numéro de chambre
                                </Label>
                                <div className="mt-1 relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <Input
                                        id="search-room-number"
                                        className="pl-10"
                                        placeholder="Ex: 101"
                                        value={searchRoomNumber}
                                        onChange={(e) => setSearchRoomNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 sm:space-y-0 sm:flex sm:gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="search-places-min" className="text-sm font-medium">
                                        Places restantes min
                                    </Label>
                                    <Input
                                        type="number"
                                        id="search-places-min"
                                        className="mt-1"
                                        value={searchPlaces}
                                        onChange={(e) => setSearchPlaces(e.target.value)}
                                        placeholder="Min"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro de chambre</TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort("etage")}>
                                    Étage / Bloc {sortBy === "etage" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort("placesRestantes")}>
                                    Places restantes {sortBy === "placesRestantes" && (sortOrder === "asc" ? "↑" : "↓")}
                                </TableHead>
                                <TableHead>Capacité max</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedRooms.map(room => (
                                <TableRow
                                    key={room.chambre_id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleRoomClick(room.chambre_id, room.numero_chambre.toString())}
                                >
                                    <TableCell>{room.numero_chambre}</TableCell>
                                    <TableCell>{room.numero_etage} / {room.nom_bloc}</TableCell>
                                    <TableCell>{room.capacite - room.occ_count}</TableCell>
                                    <TableCell>{room.capacite}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}