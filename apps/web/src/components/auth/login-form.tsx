import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import api from "../../lib/axios" 

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            })
            if (response.data.success && response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl
        }
            
            console.log('Login successful:', response.data)
            
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-white text-black w-full max-w-sm shadow-lg border-black">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Login to your account</CardTitle>
                    <CardDescription className="text-black">
                        <div className="relative">
                            <div className="relative flex justify-center text-xs uppercase">
                                    <span className="p-2 text-black text-center bg-blue-500/80 border border-blue-700 rounded-md">
                                      Companies, please use the provided credentials to log in
                                    </span>
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {/* Email/Password Login Section */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-black"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-black"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="p-2 text-black text-center bg-red-500/80 border border-red-700 rounded-md">
                                      Students, please use your science email to log in via Google using the button below
                                    </span>
                                </div>
                            </div>

                            {/* Google Login Button */}
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full border-black" type="button" onClick={() => {
                                    window.location.href = `${process.env.BACKEND_URL}/auth/google/login`;
                                }} >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48" width="48" height="48">
                                        <path fill="#FBBC05" d="M9.83,24c0-1.52,0.25-2.98,0.7-4.36L2.62,13.6C1.08,16.73,0.21,20.26,0.21,24c0,3.74,0.87,7.26,2.41,10.39l7.9-6.05c-0.45-1.36-0.7-2.82-0.7-4.34z"/>
                                        <path fill="#EB4335" d="M23.71,10.13c3.31,0,6.3,1.17,8.65,3.09l6.84-6.83C35.04,2.77,29.7,0.53,23.71,0.53c-9.29,0-17.28,5.31-21.09,13.07l7.91,6.04c1.82-5.53,7.02-9.51,13.18-9.51z"/>
                                        <path fill="#34A853" d="M23.71,37.87c-6.16,0-11.36-3.98-13.18-9.51l-7.91,6.04C6.45,42.16,14.43,47.47,23.71,47.47c5.73,0,11.19-2.03,15.31-5.85l-7.51-5.8c-2.12,1.33-4.78,2.01-7.8,2.01z"/>
                                        <path fill="#4285F4" d="M46.15,24c0-1.39-0.21-2.88-0.54-4.27H23.71v9.07h12.6c-0.63,3.09-2.35,5.47-4.79,6.99l7.51,5.8C43.34,37.61,46.15,31.65,46.15,24z"/>
                                    </svg>
                                    Login with Google
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}