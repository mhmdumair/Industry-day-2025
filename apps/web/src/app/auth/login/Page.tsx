'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'

const Page = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-[300px] max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4"> 
            <div>
              <Label htmlFor="email" className='pb-2'>Email</Label>
              <Input id="email" type="email" required placeholder='Email' />
            </div>
            <div>
              <Label htmlFor="password" className='pb-2'>Password</Label>
              <Input id="password" type="password" required placeholder='Password' />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
