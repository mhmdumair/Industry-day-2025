import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className=" bg-gray-300 text-black w-full max-w-sm shadow-lg border-black">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Login to your account</CardTitle>
                    <CardDescription className="text-black">
                        Please use your provided Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full border-black" type="button" onClick={() => {
                                    window.location.href = "http://localhost:3001/api/auth/google/login";
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
                            <div className="text-center text-sm">
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our Terms of Service
                and Privacy Policy.
            </div>
        </div>
    )
}
