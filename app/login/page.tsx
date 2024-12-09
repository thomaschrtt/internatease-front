import {LoginForm} from "@/app/(auth)/login/components/LoginForm";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <LoginForm />
        </div>
    );
}