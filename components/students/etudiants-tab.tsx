import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';

type Student = {
    id: string;
    prenom: string;
    nom: string;
    classe?: { nomClasse: string };
    numEtu: string;
    genre: string;
    internat_weekend: boolean;
    chambre?: { numero_chambre: string };
};

interface StudentTableProps {
    filteredStudents: Student[];
    setSelectedStudent: (student: Student) => void;
    handleDeleteStudent: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
                                                              filteredStudents,
                                                              setSelectedStudent,
                                                              handleDeleteStudent
                                                          }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Numéro Etudiant</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Reste les WE</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>{student.prenom} {student.nom}</TableCell>
                        <TableCell>{student.classe?.nomClasse || "Aucune"}</TableCell>
                        <TableCell>{student.numEtu}</TableCell>
                        <TableCell>{student.genre}</TableCell>
                        <TableCell>
                            <Badge variant={student.internat_weekend ? "default" : "secondary"}>
                                {student.internat_weekend ? "Oui" : "Non"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(student)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
