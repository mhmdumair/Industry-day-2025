import React from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import { Check } from "lucide-react";

const page = () => {
  return (
      <div className="mt-3 mx-auto p-4">
        <Card className="mt-3 bg-slate-100/80">
          <CardHeader>
            <CardTitle>Register for Interviews</CardTitle>
            <CardDescription>List of all panels</CardDescription>
          </CardHeader>
          <CardContent className="">
            <Card className="mb-2 last:mb-0 flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle>MAS Holdings</CardTitle>
                <CardDescription> Stream :
                  <Badge className="bg-red-200 border-red-400 text-black ml-1 mb-3">CS</Badge>
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button variant="secondary" className="border border-green-600 bg-green-100 w-full" >
                  <Check/>Already Registered
                </Button>
              </div>
            </Card>
            <Card className="mb-2 last:mb-0 flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle>Noritake</CardTitle>
                <CardDescription> Stream :
                  <Badge className="bg-blue-200 border-blue-400 text-black ml-1 mb-3">CHEM</Badge>
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button variant="secondary" className="border border-black bg-blue-100 w-full" >
                  + Register
                </Button>
              </div>
            </Card>
          </CardContent>
          <CardFooter className="m-0 text-center">
            <CardDescription>Your registered companies will be shown below</CardDescription>
          </CardFooter>
        </Card>

        <Card className="mt-3 bg-slate-100/80">
          <CardHeader>
            <CardTitle>Registered Interviews</CardTitle>
          </CardHeader>
          <CardContent className="">
            <Card className="mb-2 last:mb-0 flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle>MAS Holdings</CardTitle>
                <CardDescription> Stream :
                  <Badge className="bg-red-200 border-red-400 text-black ml-1 mb-3">CS</Badge>
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button variant="secondary" className="border border-amber-400 bg-amber-100 w-full" >
                  In queue
                </Button>
              </div>
            </Card>
            <Card className="mb-2 last:mb-0 flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle>Codegen</CardTitle>
                <CardDescription> Stream :
                  <Badge className="bg-red-200 border-red-400 text-black ml-1 mb-3">CS</Badge>
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button variant="secondary" className="border border-red-400 bg-red-100 w-full" >
                  Finished
                </Button>
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
  );
}

export default page