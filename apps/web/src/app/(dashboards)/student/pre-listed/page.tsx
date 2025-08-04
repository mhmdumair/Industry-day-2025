"use client"

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
      <div className="mt-3 mx-auto p-4">
        <Card className="mt-3 bg-slate-100/80">
          <CardHeader>
            <CardTitle>Pre-Listed Queues</CardTitle>
            <CardDescription>List of all pre-listed interview queues</CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="m-auto mb-2">
              <CardHeader>
                <CardTitle>MAS Holdings</CardTitle>
                <CardDescription>Location: Physics Upper Hall</CardDescription>
              </CardHeader>
              <CardContent>
                Status :
                <Button
                    variant="outline"
                    className="ml-7 border-amber-400 bg-amber-200/80 w-1/2">
                  In queue
                </Button>
              </CardContent>
            </Card>
            {/* Stall 1 - Static */}
            <Card className="m-auto mb-2">
              <CardHeader>
                <CardTitle>Noritake</CardTitle>
                <CardDescription>Location: MLT</CardDescription>
              </CardHeader>
              <CardContent>
                Status :
                <Button
                variant="outline"
                className="ml-7 border-green-700 bg-green-200/80 w-1/2">
                  Position : 3
                </Button>
              </CardContent>
            </Card>


          </CardContent>
          <CardFooter className="m-0">
            <CardDescription>To register for more company queues, please go to Interviews menu</CardDescription>
          </CardFooter>
        </Card>
      </div>
  );
}

export default Page