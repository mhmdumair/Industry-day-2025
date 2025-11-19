"use client";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ModeToggle } from '@/components/common/mode-toggle';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Calendar, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/unilogo.png"
              alt="University Logo"
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <h1 className="lg:text-3xl md:text-4xl text-xl font-extrabold text-black dark:text-white lg:leading-7 tracking-tighter leading-5 md:leading-7">
                INDUSTRY DAY 2025
              </h1>
              <span className="text-xs md:text-base lg:text-base font-bold text-gray-700 dark:text-gray-300">
                FACULTY OF SCIENCE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              onClick={() => router.push('/auth/login')}
              variant="default"
              className="rounded-none"
            >
              Login
            </Button>
          </div>
        </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Registration Alert */}
          <Alert className="rounded-none ">
            <AlertTitle className="text-xl font-semibold  mb-3">
              Welcome to SIIC Website!
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="text-base tracking-tight">
                Have you registered for <span className='underline'>Industry Day 2025</span>?<br/>Join us for an exciting opportunity to connect with leading companies and explore career possibilities!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-end">
                <Button
                  onClick={() => router.push('/auth/register/student')}
                  variant="default"
                  className="rounded-none flex items-center justify-center gap-2"
                >
                  <GraduationCap className="h-4 w-4" />
                  Student Registration
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push('/auth/register/company')}
                  variant="outline"
                  className="rounded-none flex items-center justify-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Company Registration
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Hero Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto rounded-none" />
            <Skeleton className="h-6 w-2/3 mx-auto rounded-none" />
          </div>

          {/* Features Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-none" />
            ))}
          </div>

          {/* Additional Content Skeleton */}
          <div className="space-y-4 mt-12">
            <Skeleton className="h-8 w-1/2 mx-auto rounded-none" />
            <Skeleton className="h-20 w-full rounded-none" />
            <div className="flex justify-center gap-6 mt-6">
              <Skeleton className="h-6 w-24 rounded-none" />
              <Skeleton className="h-6 w-24 rounded-none" />
              <Skeleton className="h-6 w-24 rounded-none" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
