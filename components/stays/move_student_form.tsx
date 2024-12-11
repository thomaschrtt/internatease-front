import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {searchAvailableRoom} from "@/api/sejourAPI";
import {useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {toast} from "@/hooks/use-toast";
import {formatDate} from "@/lib/utils";

type MoveStudentFormProps = {
    stay: Occupation;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onMove: (data: MoveStudentData) => void;
}

export const MoveStudentForm = ({stay, isOpen, setIsOpen, onMove}: MoveStudentFormProps) => {
    const [newRoom, setNewRoom] = useState<number>();
    const [startDate, setStartDate] = useState<string>(formatDate(new Date()));
    const [isDefinitive, setIsDefinitive] = useState(false);

    useEffect(() => {
        setStartDate(new Date() > new Date(stay.date_debut) ? formatDate(new Date()) : formatDate(new Date(stay.date_debut)));
    }, [isOpen]);


    const {data: rooms} = useCustomQuery<AvailableChambre[]>(
        ['availableRooms', startDate ? startDate : '', stay.date_fin.toString()],
        () => searchAvailableRoom(startDate, stay.date_fin.toString(), [stay.etudiant_id], [stay.chambre_id]),
        {enabled: !!startDate, initialData: []}
    );



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newRoom || !startDate ) {
            toast({
                title: 'Erreur',
                description: 'Veuillez remplir tous les champs',
                variant: 'destructive'
            })
            return;
        }
        if (newRoom === stay.chambre_id) {
            toast({
                title: 'Erreur',
                description: 'L\'étudiant est déjà dans cette chambre',
                variant: 'destructive'
            })
            return
        }

        const data: MoveStudentData = {
            p_etudiant_id: stay.etudiant.id,
            p_new_chambre_id: newRoom,
            p_date_debut: startDate,
            p_is_definitive: isDefinitive,
            p_stay_id: stay.id
        };

        try {
            onMove(data);
            setIsOpen(false);
        } catch (error) {
            console.error('Error moving student:', error);
        }
    };

    if (!rooms) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Déplacer l&#39;étudiant de chambre</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="room">Nouvelle Chambre</Label>
                        <Select onValueChange={(value) => setNewRoom(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une chambre"/>
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room) => (
                                    <SelectItem key={room.chambre_id} value={room.chambre_id.toString()}>
                                        Chambre {room.numero_chambre} - {room.capacite} place(s)
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
                            onChange={(e) => {
                                const today = new Date();
                                const earliestPossibleDate = today > new Date(stay.date_debut) ? today : new Date(stay.date_debut);
                                const selectedDate = new Date(e.target.value);
                                if (selectedDate < earliestPossibleDate) {
                                    toast({
                                        title: 'Erreur',
                                        description: 'La date de début ne peut pas être antérieure à la date actuelle',
                                        variant: 'destructive'
                                    });
                                    return;
                                }
                                if (selectedDate >= new Date(stay.date_fin)) {
                                    toast({
                                        title: 'Erreur',
                                        description: 'La date de début ne peut pas être postérieure à la date de fin actuelle',
                                        variant: 'destructive'
                                    });
                                    return;
                                }
                                setStartDate(e.target.value);
                            }}
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
