import React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";

interface StudentDetailsDialogProps {
    selectedStudent: Etudiant | null;
    setSelectedStudent: (student: Etudiant | null) => void;
}

export const StudentDetailsDialog: React.FC<StudentDetailsDialogProps> = ({
                                                                              selectedStudent,
                                                                              setSelectedStudent,
                                                                          }) => {
    if (!selectedStudent) return null;
    console.log(selectedStudent)
    return (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Détails</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nom</Label>
                        <div>{selectedStudent.prenom} {selectedStudent.nom}</div>
                    </div>
                    <div>
                        <Label>Classe</Label>
                        <div>{selectedStudent.classe?.nom_classe || "Pas de classe"}</div>
                    </div>
                    <div>
                        <Label>Numéro Etudiant</Label>
                        <div>{selectedStudent.num_etu}</div>
                    </div>
                    <div>
                        <Label>Genre</Label>
                        <div>{selectedStudent.genre}</div>
                    </div>
                    <div>
                        <Label>Reste les weekends</Label>
                        <div>{selectedStudent.internat_weekend ? "Oui" : "Non"}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );
};
