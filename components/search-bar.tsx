'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Search} from 'lucide-react'
import {StudentDetailsDialog} from "@/components/students/etudiant-detail";

type Suggestion = {
    id: string
    type: 'student' | 'room'
    name: string
    href: string
}


type Student = {
    prenom: string;
    nom: string;
    classe: { nomClasse: string };
    numEtu: string;
    genre: string;
    internat_weekend: boolean;
}

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (searchTerm.length > 1) {
            fetchSuggestions(searchTerm)
        } else {
            setSuggestions([])
        }
    }, [searchTerm])

    const fetchSuggestions = async (term: string) => {
        try {
            const response = await fetch(`http://localhost/InternatEase/public/api/search?term=${term}`, {
                credentials: 'include',
            })
            const data = await response.json()
            const formattedSuggestions: Suggestion[] = data.map((item: any) => ({
                id: item.id,
                type: item.numero_chambre ? 'room' : 'student',
                name: item.nom || `Chambre ${item.numero_chambre}`,
                href: item.numero_chambre ? `/chambres/${item.id}` : `/etudiants/${item.id}`
            }))
            setSuggestions(formattedSuggestions)
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        }
    }


    const handleSelectSuggestion = async (suggestion: Suggestion) => {
        setSearchTerm('')
        setIsSearchOpen(false)

        if (suggestion.type === 'student') {
            try {
                // Requête pour obtenir les détails de l'étudiant
                const response = await fetch(`http://localhost/InternatEase/public/api/etudiants/${suggestion.id}`, {
                    credentials: 'include'
                });
                const studentData = await response.json();
                setSelectedStudent(studentData);  // Ouvre le dialog avec les détails de l'étudiant
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        } else {
            router.push(suggestion.href);  // Rediriger si c'est une chambre
        }
    }

    return (
        <>
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal md:w-40 lg:w-64">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
                        {searchTerm || "Rechercher..."}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 md:w-[400px]">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Rechercher étudiant ou chambre..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                            <CommandGroup>
                                {suggestions.map((suggestion) => (
                                    <CommandItem
                                        key={suggestion.id}
                                        onSelect={() => handleSelectSuggestion(suggestion)}
                                    >
                                        <Search className="mr-2 h-4 w-4"/>
                                        <span>{suggestion.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                    {suggestion.type === 'student' ? 'Étudiant' : 'Chambre'}
                  </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {/* Afficher le dialog avec les détails de l'étudiant */}
            <StudentDetailsDialog
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
            />
        </>
    )
}