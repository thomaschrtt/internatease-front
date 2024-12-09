"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {Button} from "@/components/ui/button";
import {signout} from "@/components/login/actions";

const LoginButton = () => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);
    if (user) {
        return (
            <Button
                onClick={() => {
                    signout();
                    setUser(null);
                }}
            >
                Déconnexion
            </Button>
        );
    }
    return (
        <Button
            variant="outline"
            onClick={() => {
                router.push("/login");
            }}
        >
            Login
        </Button>
    );
};

export default LoginButton;