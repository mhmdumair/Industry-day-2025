"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          <h1 className="text-2xl font-semibold">SIIC Homepage</h1>
          <Button onClick={() => router.push('/auth/login')}>
            Portal
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
