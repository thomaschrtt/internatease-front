'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message } // Retourner l'erreur
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                first_name: formData.get('first-name') as string,
                last_name: formData.get('last-name') as string,
            },
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message } // Retourner l'erreur
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signInWithGoogle() {

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        console.log(error);
        redirect("/error");
    }

    redirect(data.url);
}

export async function signout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect("/error");
    }

    redirect("/logout");
}