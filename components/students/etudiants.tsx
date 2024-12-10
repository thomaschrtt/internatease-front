'use client'

import {useEffect, useState} from 'react'
import {StudentTable} from "@/components/students/etudiants-tab";
import {StudentFilters} from "@/components/students/student-filter";
import {StudentStatistics} from "@/components/students/stats-etudiants";
import {addStudent, deleteStudent, fetchClasses, fetchStudents} from "@/api/studentAPI";
import {useCustomMutation, useCustomQuery} from "@/tanstackQuery/queryGenerator";
import {toast} from "@/hooks/use-toast";

export function Etudiants() {
    const {data: classes, isLoading: classLoading} = useCustomQuery(['classes'], fetchClasses)
    const {data: students, isLoading: studentLoading} = useCustomQuery(['students'], fetchStudents)

    const {mutate: addStudentMutation} = useCustomMutation(
        (studentData: Partial<Etudiant>) => addStudent(studentData),
        [['students']],
        {
            onSuccess: () => {
                toast({title: 'Etudiant ajouté', description: 'L\'étudiant a été ajouté avec succès'})
            },
            onError: () => {
                toast({title: 'Erreur', description: 'Une erreur s\'est produite lors de l\'ajout de l\'étudiant'})
            }
        }
    )

    const {mutate: deleteStudentMutation} = useCustomMutation(
        (id: number) => deleteStudent(id),
        [['students']],
        {
            onSuccess: () => toast({title: 'Etudiant supprimé', description: 'L\'étudiant a été supprimé avec succès'}),
            onError: () => toast({
                title: 'Erreur',
                description: 'Une erreur s\'est produite lors de la suppression de l\'étudiant'
            })
        }
    )

    const [filteredStudents, setFilteredStudents] = useState<Etudiant[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [classFilter, setClassFilter] = useState('all')
    const [genreFilter, setGenderFilter] = useState('all')

    const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null)
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
    const [newStudent, setNewStudent] = useState<Partial<Etudiant>>({})

    useEffect(() => {
        if (students) {
            filterStudents()
        }
    }, [students, searchTerm, classFilter, genreFilter])


    const filterStudents = () => {
        let filtered = students.filter(student =>
            (student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.num_etu.toString().includes(searchTerm)) &&
            (classFilter === 'all' || student.classe?.id === parseInt(classFilter)) &&
            (genreFilter === 'all' || student.genre === genreFilter)
        )
        setFilteredStudents(filtered)
    }


    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            addStudentMutation(newStudent);
            setIsAddStudentModalOpen(false);
            setNewStudent({}); // Reset the form
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleDeleteStudent = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                deleteStudentMutation(id);
            } catch (error) {
                console.error('Error deleting student:', error)
            }
        }
    }


    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Prenom,Nom,Classe,Numero Etu,Weekend,Genre\n"
            + filteredStudents.map(s =>
                `${s.prenom},${s.nom},${s.classe?.nom_classe},${s.num_etu},${s.internat_weekend},${s.genre}}`)
                .join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "students.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (studentLoading || classLoading) {
        return <div>Loading...</div>
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des étudiants</h1>

            <StudentFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setClassFilter={setClassFilter}
                setGenderFilter={setGenderFilter}
                isAddStudentModalOpen={isAddStudentModalOpen}
                setIsAddStudentModalOpen={setIsAddStudentModalOpen}
                handleAddStudent={handleAddStudent}
                newStudent={newStudent}
                setNewStudent={setNewStudent}
                classes={classes}
                exportToCSV={exportToCSV}
            />

            <StudentStatistics students={students}/>

            <StudentTable
                filteredStudents={filteredStudents}
                handleDeleteStudent={handleDeleteStudent}
            />
        </div>
    )
}