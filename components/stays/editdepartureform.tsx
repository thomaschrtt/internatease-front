import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";

type EditDepartureDateFormProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentDateFin: { date_fin: string };
    onSubmit: (newDateFin: string) => void;
};

export const EditDepartureDateForm = ({isOpen, setIsOpen, currentDateFin, onSubmit}: EditDepartureDateFormProps) => {
    const [newDateFin, setNewDateFin] = useState(currentDateFin.date_fin.split("T")[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(newDateFin);
        setIsOpen(false); // Close the modal after submission
    };

    useEffect(() => {
        setNewDateFin(currentDateFin.date_fin.split("T")[0])
    }, [currentDateFin.date_fin]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier la date de sortie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="date_fin">Nouvelle date de sortie</Label>
                        <Input
                            id="date_fin"
                            type="date"
                            value={newDateFin}
                            onChange={(e) => setNewDateFin(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit">Modifier</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
