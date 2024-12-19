import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check} from "lucide-react";

type AddStayFormProps = {
    isAddStayModalOpen: boolean
    setIsAddStayModalOpen: (open: boolean) => void
    students: AvailableEtudiant[]
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
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredStudents, setFilteredStudents] = useState<AvailableEtudiant[]>(students)

    useEffect(() => {
        const lowercasedSearch = searchTerm.toLowerCase()
        const filtered = students.filter(student =>
            `${student.nom} ${student.prenom}`.toLowerCase().includes(lowercasedSearch)
        )
        setFilteredStudents(filtered)
    }, [searchTerm, students])

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString() : 'Non spécifié'
    }

    newStay = newStay || {}


    return (
        <Dialog open={isAddStayModalOpen} onOpenChange={setIsAddStayModalOpen}>
            <DialogContent>
                <DialogTitle>
                    Étudiant à rajouter dans la chambre {newStay.chambre?.numero_chambre} du {formatDate(newStay.date_debut)} au {formatDate(newStay.date_fin)}
                </DialogTitle>

                <form onSubmit={handleAddStay} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="student-search">Rechercher un étudiant</Label>
                        <Command className="rounded-lg border shadow-md">
                            <CommandInput
                                placeholder="Rechercher un étudiant..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                            />
                            <CommandList>
                                <CommandEmpty>Aucun étudiant trouvé.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-y-auto">
                                    {filteredStudents.map((student) => (
                                        <CommandItem
                                            key={student.etudiant_id}
                                            value={`${student.etudiant_id}-${student.nom} ${student.prenom}`}
                                            onSelect={() => {
                                                setNewStay({ ...(newStay || {}), etudiant_id: student.etudiant_id })
                                                setSearchTerm(`${student.nom} ${student.prenom}`)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    newStay.etudiant_id === student.etudiant_id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {student.nom} {student.prenom} - {student.nom_classe}
                                        </CommandItem>
                                    ))}

                                </CommandGroup>
                            </CommandList>
                        </Command>

                    </div>
                    <Button type="submit" disabled={!newStay.etudiant_id}>Assigner</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
