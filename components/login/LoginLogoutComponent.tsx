"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogIn, LogOut} from "lucide-react";
import {signout} from "@/components/login/actions";
import {createClient} from "@/utils/supabase/client";
import {UserMetadata} from "@supabase/auth-js";


const AuthButton = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const [user, setUser] = useState<UserMetadata | null>(null)

    const fetchUser = async () => {
        const supabase = await createClient()
        const userdata = (await supabase.auth.getSession())?.data.session?.user?.user_metadata
        if (userdata) {
            setUser(userdata)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])


    const handleSignOut = async () => {
        setIsLoading(true)
        try {
            setUser(null)
            signout()
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user["avatar_url"]} alt={user['last_name']} />
                            <AvatarFallback>{user['last_name'].charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">{user['last_name']} {user['first_name']}</DropdownMenuItem>
                    <DropdownMenuItem className="text-muted-foreground">{user.email}</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} disabled={false}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isLoading ? 'Déconnexion...' : 'Déconnexion'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="flex items-center space-x-2"
        >
            <LogIn className="h-4 w-4" />
            <span>Connexion</span>
        </Button>
    )
};

export default AuthButton;