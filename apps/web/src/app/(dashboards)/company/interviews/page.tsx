import React from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

const page = () => {
    return (
      <>
        <div>Interviews page</div>
        <Card>
          <CardHeader>
            <CardTitle>Interviews</CardTitle>
            <CardDescription>List of all interview stalls</CardDescription>
          </CardHeader>
          <CardContent>
              <Card className="m-auto">
                <CardHeader>
                  <CardTitle>Stall 1</CardTitle>
                  <CardDescription>Location: Physics Upper Hall</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>Stall 2</CardTitle>
                      <CardDescription>Location: Physics Upper Hall</CardDescription>
                  </CardHeader>
                  <CardContent>
                  </CardContent>
              </Card>
          </CardContent>
          <CardFooter>
            <CardDescription>To Add more Interview Stalls Please Contact the respective Room Admin</CardDescription>
          </CardFooter>
        </Card>
      </>
    );
}

export default page