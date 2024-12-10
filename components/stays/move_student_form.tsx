import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import axios from "@/api/Axios";

type MoveStudentFormProps = {
    stay: any;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    allRooms: any[];
    handleMovedStudent: () => void;
}

export const MoveStudentForm = ({stay, isOpen, setIsOpen, allRooms, handleMovedStudent}: MoveStudentFormProps) => {
    const formatDate = (date: Date) => {
        if (!date) return
        const actual_month = date.getMonth() + 1
        const actual_day = date.getDate()
        const month = actual_month > 9 ? actual_month : "0".concat(actual_month.toString())
        const day = actual_day > 9 ? actual_day : "0".concat(actual_day.toString())
        return date.getFullYear() + "-" + month + "-" + day
    }


    const [rooms, setRooms] = useState<any[]>([]);
    const [newRoom, setNewRoom] = useState('');
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [isDefinitive, setIsDefinitive] = useState(false);

    useEffect(() => {
        // Fetch available rooms
        fetchAvailableRooms();
    }, []);


    // Fetch available rooms between the startDate and the stay's end date
    const fetchAvailableRooms = async () => {
        if (!startDate) return; // No start date yet, don't fetch
        try {
            const response = await fetch(
                `http://localhost/InternatEase/public/api/available-rooms?date_debut=${startDate}&date_fin=${stay.date_fin.split("T")[0]}`,
                {
                    credentials: 'include',
                }
            );
            const data = await response.json();
            let availableRooms = allRooms.filter(room => Object.keys(data).includes(room.id.toString()));
            availableRooms.map(room => {
                    room.occupe = data[room.id]
                    return room;
                }
            )
            availableRooms = availableRooms.filter(room => stay.chambre.id !== room.id)
            setRooms(availableRooms); // Assuming your API returns an array of available rooms
        } catch (error) {
            console.error('Error fetching available rooms:', error);
        }
    };
    useEffect(() => {
        fetchAvailableRooms();
    }, [startDate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            etudiant: stay.etudiant.id,
            chambre: newRoom,
            date_debut: startDate,
            isDefinitive: isDefinitive ? 1 : 0,
            stay_id: stay.id
        };

        try {
            await axios.post('/api/move-students', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setIsOpen(false); // Close the modal
            handleMovedStudent()
        } catch (error) {
            console.error('Error moving student:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Déplacer l&#39;étudiant de chambre</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="room">Nouvelle Chambre</Label>
                        <Select onValueChange={setNewRoom}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une chambre"/>
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id.toString()}>
                                        Chambre {room.numero_chambre} - {room.capacite - room.occupe} place(s)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="start-date">Date de début</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="is-definitive">Définitif</Label>
                        <input
                            id="is-definitive"
                            type="checkbox"
                            checked={isDefinitive}
                            onChange={() => setIsDefinitive(!isDefinitive)}
                        />
                    </div>
                    <Button type="submit">Déplacer l&#39;étudiant</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
