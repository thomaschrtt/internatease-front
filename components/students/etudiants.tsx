'use client'

import {useState, useEffect} from 'react'
import {StudentTable} from "@/components/students/etudiants-tab";
import {StudentFilters} from "@/components/students/student-filter";
import {StudentStatistics} from "@/components/students/stats-etudiants";
import {StudentDetailsDialog} from "@/components/students/etudiant-detail";
import axios from '@/api/Axios';

type Student = {
    id: string
    name: string
    surname: string
    idClasse: number
    numEtu: string
    internat_weekend: boolean
    genre: 'M' | 'F' | 'N'
    room: string | null
}

export function Etudiants() {
    const [students, setStudents] = useState<Student[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [classFilter, setClassFilter] = useState('all')
    const [genreFilter, setGenderFilter] = useState('all')
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
    const [newStudent, setNewStudent] = useState<Partial<Student>>({})

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        filterStudents()
    }, [students, searchTerm, classFilter, genreFilter])

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/etudiants');
            setStudents(response.data.member)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const filterStudents = () => {
        console.log(students)
        let filtered = students.filter(student =>
            (student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.numEtu.toString().includes(searchTerm)) &&
            (classFilter === 'all' || student.classe?.id === parseInt(classFilter)) &&
            (genreFilter === 'all' || student.genre === genreFilter)
        )
        setFilteredStudents(filtered)
    }

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create the student object in the format required by the API
        const studentData = {
            nom: newStudent.nom,
            prenom: newStudent.prenom,
            genre: newStudent.genre,
            numEtu: parseInt(newStudent.numEtu),
            idClasse: newStudent.idClasse,
            internatWeekend: newStudent.internat_weekend, // Mapping the correct field name
        };

        try {
            await axios.post('/api/etudiants', studentData, {
                headers: {
                    'Content-Type': 'application/ld+json',
                }
            });
            setIsAddStudentModalOpen(false);
            setNewStudent({}); // Reset the form
            fetchStudents(); // Refresh the list of students
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`/api/etudiants/${id}`);
                fetchStudents()
            } catch (error) {
                console.error('Error deleting student:', error)
            }
        }
    }

    const [classes, setClasses] = useState([]); // State to store classes fetched from API

    // Fetch classes from API on component mount
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await axios.get('/api/classes');
                setClasses(response.data.member);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        }

        fetchClasses();
    }, []);

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Prenom,Nom,Classe,Numero Etu,Weekend,Genre\n"
            + filteredStudents.map(s =>
                `${s.prenom},${s.nom},${s.classe?.nomClasse},${s.numEtu},${s.internat_weekend},${s.genre}}`)
                .join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "students.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                setSelectedStudent={setSelectedStudent}
                handleDeleteStudent={handleDeleteStudent}
            />

            <StudentDetailsDialog
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
            />
        </div>
    )
}