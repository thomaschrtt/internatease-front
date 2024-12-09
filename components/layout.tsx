'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {cn} from "@/lib/utils"
import {Bed, Home, LogOut, Menu, Users} from 'lucide-react'
import {SearchBar} from "@/components/search-bar";
import axios from "@/api/Axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const sidebarItems = [
    {icon: Home, label: 'Gestion', href: '/dashboard'},
    {icon: Users, label: 'Étudiants', href: '/etudiants'},
    {icon: Bed, label: 'Chambres', href: '/chambres'},
]


const queryClient = new QueryClient()

export function LayoutComponent({children}: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(''); // Stocker l'entrée utilisateur
    const [suggestions, setSuggestions] = useState([]); // Stocker les suggestions
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter(); // Correct router import

    useEffect(() => {
        fetchRooms();
        fetchStudents();
    }, []); // Appel initial pour récupérer les chambres et étudiants

    useEffect(() => {
        if (searchTerm.length > 0) {
            setIsSearchOpen(true);  // Assure que le popover reste ouvert pendant la recherche
            const isRoomNumber = !isNaN(Number(searchTerm)); // Déterminer si l'entrée est un numéro de chambre

            if (isRoomNumber) {
                const filteredRooms = rooms.filter((room) =>
                    room.numero_chambre.includes(searchTerm)
                );
                console.log("Filtered rooms:", filteredRooms);
                setSuggestions(filteredRooms.map(room => ({href: getHrefForRoom(room), ...room})));
            } else {
                const filteredStudents = students.filter((student) =>
                    student.nom.toLowerCase().includes(searchTerm.toLowerCase())
                );
                console.log("Filtered students:", filteredStudents);
                setSuggestions(filteredStudents.map(student => ({href: getHrefForEtudiant(student), ...student})));
            }
        } else {
            setSuggestions([]);  // Mettre à jour les suggestions avec rien si le champ est vide
        }
    }, [rooms, searchTerm, students]);


    const getHrefForRoom = (room) => {
        return '/chambres/' + room.id;
    }

    const getHrefForEtudiant = (etu) => {
        return '/etudiants/' + etu.id;
    }

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/chambres');
            setRooms(response.data.member); // Set the rooms state with the transformed data
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('/api/etudiants');
            setStudents(response.data.member)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background font-sans antialiased">
                <nav
                    className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center px-4">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost"
                                        className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden">
                                    <Menu className="h-5 w-5"/>
                                    <span className="sr-only">Ouvrir Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72">
                                <div className="flex flex-col space-y-4 py-4">
                                    {sidebarItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                                                pathname === item.href ? "bg-accent" : "transparent"
                                            )}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5"/>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <Bed className="h-6 w-6"/>
                                <span className="inline-block font-bold">InternatEase</span>
                            </Link>
                        </div>
                        <div className="flex flex-1 items-center space-x-4 md:justify-end">
                            <SearchBar/>
                        </div>
                    </div>
                </nav>
                <div className="flex">
                    <aside
                        className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-72 border-r bg-background md:block">
                        <div className="flex h-full flex-col py-4">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                                        pathname === item.href ? "bg-accent" : "transparent"
                                    )}
                                >
                                    <item.icon className="h-5 w-5"/>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <div className="mt-auto">
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/logout" className="flex items-center space-x-3">
                                        <LogOut className="h-5 w-5"/>
                                        <span>Déconnexion</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1 overflow-y-auto pt-16 md:pl-72">
                        <div className="container mx-auto p-4 md:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </QueryClientProvider>
    )
}
