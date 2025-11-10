import {AuthProviderButton} from "./auth-provider-button";

export function SocialLogin() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AuthProviderButton
                provider="google"
                label="Google"
                icon="/icons/google.svg"
            />
            <AuthProviderButton
                provider="github"
                label="GitHub"
                icon="/icons/github.svg"
            />
            <AuthProviderButton
                provider="discord"
                label="Apple"
                icon="/icons/apple.svg"
            />
        </div>
    );
}