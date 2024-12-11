'use client'

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {LogOut} from "lucide-react";
import {Progress} from "@/components/ui/progress";

export default function Logout() {
    const router = useRouter()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const redirectTime = 3000 // 3 seconds
        const interval = 50 // Update progress every 50ms

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + (100 / (redirectTime / interval))
                return newProgress >= 100 ? 100 : newProgress
            })
        }, interval)

        const redirect = setTimeout(() => {
            router.push("/")
        }, redirectTime)

        return () => {
            clearInterval(timer)
            clearTimeout(redirect)
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-blue-100 p-3">
                        <LogOut className="h-6 w-6 text-blue-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Déconnexion réussie</CardTitle>
                    <CardDescription>Merci d&#39;avoir utilisé InternatEase</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center mb-4">Vous serez redirigé vers la page d&#39;accueil dans quelques secondes.</p>
                    <Progress value={progress} className="w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
