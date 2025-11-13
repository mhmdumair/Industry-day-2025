import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import api from "../../lib/axios";

export function StudentLoginForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/login`;
    };

    return (
        <Card className="rounded-none bg-white dark:bg-gray-900 text-black dark:text-white w-full shadow-lg border-1">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Student Login</CardTitle>
                <CardDescription className="dark:text-gray-400">
                    Please use your science email to log in via Google
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        className="w-full rounded-none border-1"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48" width="24" height="24" className="mr-2">
                            <path fill="#FBBC05" d="M9.83,24c0-1.52,0.25-2.98,0.7-4.36L2.62,13.6C1.08,16.73,0.21,20.26,0.21,24c0,3.74,0.87,7.26,2.41,10.39l7.9-6.05c-0.45-1.36-0.7-2.82-0.7-4.34z" />
                            <path fill="#EB4335" d="M23.71,10.13c3.31,0,6.3,1.17,8.65,3.09l6.84-6.83C35.04,2.77,29.7,0.53,23.71,0.53c-9.29,0-17.28,5.31-21.09,13.07l7.91,6.04c1.82-5.53,7.02-9.51,13.18-9.51z" />
                            <path fill="#34A853" d="M23.71,37.87c-6.16,0-11.36-3.98-13.18-9.51l-7.91,6.04C6.45,42.16,14.43,47.47,23.71,47.47c5.73,0,11.19-2.03,15.31-5.85l-7.51-5.8c-2.12,1.33-4.78,2.01-7.8,2.01z" />
                            <path fill="#4285F4" d="M46.15,24c0-1.39-0.21-2.88-0.54-4.27H23.71v9.07h12.6c-0.63,3.09-2.35,5.47-4.79,6.99l7.51,5.8C43.34,37.61,46.15,31.65,46.15,24z" />
                        </svg>
                        {isLoading ? 'Redirecting...' : 'Login with Google'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function CompanyLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            if (response.data.success) {
                console.log('Login successful:', response.data);
                window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/home`;
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="rounded-none bg-white dark:bg-gray-900 text-black dark:text-white w-full shadow-lg border-1">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Company Login</CardTitle>
                <CardDescription className="dark:text-gray-400">
                    Use your provided credentials to log in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company-email">Email</Label>
                            <Input
                                id="company-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-none border-1 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company-password">Password</Label>
                            <Input
                                id="company-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-none border-1 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-none" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}