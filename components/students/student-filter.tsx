import React, {useEffect} from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, UserPlus } from 'lucide-react';

type StudentFiltersProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    setClassFilter: (value: string) => void;
    setGenderFilter: (value: string) => void;
    isAddStudentModalOpen: boolean;
    setIsAddStudentModalOpen: (value: boolean) => void;
    handleAddStudent: (e: React.FormEvent) => void;
    newStudent: Partial<Etudiant>;
    setNewStudent: (value: any) => void;
    classes: Classe[];
    exportToCSV: () => void;
};

export const StudentFilters: React.FC<StudentFiltersProps> = ({
                                                                  searchTerm,
                                                                  setSearchTerm,
                                                                  setClassFilter,
                                                                  setGenderFilter,
                                                                  isAddStudentModalOpen,
                                                                  setIsAddStudentModalOpen,
                                                                  handleAddStudent,
                                                                  newStudent,
                                                                  setNewStudent,
                                                                  classes,
                                                                  exportToCSV,
                                                              }) => {
    const initNewStudent: () => void = () => {
        setNewStudent({internat_weekend: false});
    }

    useEffect(() => {
        initNewStudent();
    } , [isAddStudentModalOpen]);

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            <Input
                type="text"
                placeholder="Rechercher par nom / prénom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Select onValueChange={(value) => setClassFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par Classe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les Classes</SelectItem>
                    {classes.map((classe) => (
                        <SelectItem key={`filter-${classe.id}`} value={classe.id.toString()}>
                            {classe.nom_classe}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => setGenderFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les Genres</SelectItem>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                </SelectContent>
            </Select>
            <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Ajouter un étudiant
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajout d&#39;étudiant</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div>
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input
                                id="prenom"
                                value={newStudent.prenom || ''}
                                onChange={(e) => setNewStudent((prev) => ({ ...prev, prenom: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="nom">Nom</Label>
                            <Input
                                id="nom"
                                value={newStudent.nom || ''}
                                onChange={(e) => setNewStudent((prev) => ({ ...prev, nom: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="class">Classe</Label>
                            <Select onValueChange={(value) => setNewStudent((prev) => ({ ...prev, classe_id: parseInt(value) }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner une classe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((classe) => (
                                        <SelectItem key={classe.id} value={classe.id.toString()}>
                                            {classe.nom_classe}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="numEtu">Numéro Etudiant</Label>
                            <Input
                                id="numEtu"
                                value={newStudent.num_etu || ''}
                                onChange={(e) => setNewStudent((prev) => ({ ...prev, num_etu: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="genre">Genre</Label>
                            <Select onValueChange={(value) => setNewStudent((prev) => ({ ...prev, genre: value as 'M' | 'F' | 'N' }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner un genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="internat_weekend"
                                checked={newStudent.internat_weekend ? newStudent.internat_weekend : false}
                                onCheckedChange={(checked) =>
                                    setNewStudent((prev) => ({ ...prev, internat_weekend: checked as boolean }))
                                }
                            />
                            <Label htmlFor="internat_weekend">Reste les weekend</Label>
                        </div>
                        <Button type="submit">Ajouter</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
    );
};
