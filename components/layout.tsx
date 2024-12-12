'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {cn} from "@/lib/utils"
import {Bed, Home, Menu, Users} from 'lucide-react'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import LoginLogoutComponent from "@/components/login/LoginLogoutComponent";
import {createClient} from "@/utils/supabase/client";
import {UserMetadata} from "@supabase/auth-js";

const sidebarItems = [
    {icon: Home, label: 'Gestion', href: '/dashboard'},
    {icon: Users, label: 'Étudiants', href: '/etudiants'},
    {icon: Bed, label: 'Chambres', href: '/chambres'},
]


const queryClient = new QueryClient()

export function LayoutComponent({children}: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
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

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background font-sans antialiased">
                <nav
                    className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
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
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <Bed className="h-6 w-6"/>
                                <span className="inline-block font-bold">InternatEase</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LoginLogoutComponent user={user} setUser={setUser}/>
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
