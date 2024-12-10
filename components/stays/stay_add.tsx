import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {formatDate} from "@/lib/utils";

type AddStayFormProps = {
    isAddStayModalOpen: boolean
    setIsAddStayModalOpen: (open: boolean) => void
    students: Etudiant[]
    newStay: Partial<Occupation>
    setNewStay: (stay: Occupation) => void
    handleAddStay: (e: React.FormEvent) => void
}

export function AddStayForm({
                                isAddStayModalOpen,
                                setIsAddStayModalOpen,
                                students,
                                newStay,
                                setNewStay,
                                handleAddStay,
                            }: AddStayFormProps) {
    return (
        <Dialog open={isAddStayModalOpen} onOpenChange={setIsAddStayModalOpen}>
            <DialogContent>
                <DialogTitle>
                    Étudiant à rajouter dans la chambre {newStay.chambre?.numero_chambre} du {formatDate(newStay.date_debut || null)} au {formatDate(newStay.date_fin || null)}
                </DialogTitle>

                <form onSubmit={handleAddStay} className="space-y-4">
                    <div>
                        <Label htmlFor="student">Étudiant</Label>
                        <Select
                            onValueChange={(value) => setNewStay(prev => ({...prev, etudiant_id: parseInt(value)}))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisissez un étudiant"/>
                            </SelectTrigger>
                            <SelectContent>
                                {students.map(student => (
                                    <SelectItem key={student.id}
                                                value={student.id.toString()}>{student.nom} {student.prenom}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit">Assigner</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
