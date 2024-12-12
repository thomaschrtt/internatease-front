"use client"

import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import SignInWithGoogleButton from "@/components/login/SignInGoogleButton";
import {login} from "@/components/login/actions";
import {toast} from "@/hooks/use-toast";
import {useState} from "react";

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const result = await login(formData)

        if (result?.error) {
            toast({
                title: "Erreur lors de la connexion",
                description: result.error,
            })
        }
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Entrez vos informations pour vous connecter
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} method={"post"}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required
                                   onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full">
                            Connexion
                        </Button>
                        <SignInWithGoogleButton/>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Vous n&#39;avez pas de compte?{" "}
                    <Link href="/signup" className="underline">
                        Inscrivez-vous
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}