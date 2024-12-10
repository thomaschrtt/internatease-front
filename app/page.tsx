import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Users, Calendar} from 'lucide-react'


export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Bienvenue sur InternatEase</h1>
                    <p className="text-xl text-blue-700">Votre solution complète pour la gestion des internats</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardHeader>
                            <Bed className="h-8 w-8 text-blue-500 mb-2"/>
                            <CardTitle>Gestion des Chambres</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Optimisez l'attribution et la gestion des chambres de votre
                                internat.</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Users className="h-8 w-8 text-green-500 mb-2"/>
                            <CardTitle>Suivi des Étudiants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Gérez efficacement les informations et les séjours des
                                étudiants.</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Calendar className="h-8 w-8 text-purple-500 mb-2"/>
                            <CardTitle>Planification des Séjours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Planifiez et visualisez facilement les séjours des
                                étudiants.</CardDescription>
                        </CardContent>
                    </Card>

                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Prêt à simplifier la gestion de votre
                        internat ?</h2>
                    <div className="space-x-4">
                        <Button asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/contact">Nous Contacter</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="bg-blue-900 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 InternatEase. Tous droits réservés.</p>
                    <div className="mt-4">
                        <Link href="/privacy" className="text-blue-300 hover:text-blue-100 mr-4">Politique de
                            confidentialité</Link>
                        <Link href="/terms" className="text-blue-300 hover:text-blue-100">Conditions
                            d'utilisation</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

