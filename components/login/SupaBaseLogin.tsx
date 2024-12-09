import {login, signInWithGoogle, signup} from './actions'
import SignInGoogleButton from "@/components/login/SignInGoogleButton";

export default function LoginPage() {
    return (
        <>
            <SignInGoogleButton/>
        </>
    )
}