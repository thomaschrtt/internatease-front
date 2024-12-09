'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import axios from "@/api/Axios"

export function LoginFormComponent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        const response = await axios.post("/api/auth", {email, password}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.status !== 200) {
            setError('Login failed. Please check your credentials and try again.')
        }
        router.push('/dashboard')
        setIsLoading(false)
    }


    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
