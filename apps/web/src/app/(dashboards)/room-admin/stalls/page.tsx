"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"

export default function StallsGroupCard() {
    const [stalls, setStalls] = useState([
        { id: 1, name: "MAS Holdings", label: "Stall 1" },
        { id: 2, name: "MAS Holdings", label: "Stall 2" },
    ]);

    const handleRemove = (id: number) => {
        setStalls((prev) => prev.filter((stall) => stall.id !== id));
    };

    const handleAddStall = () => {
        const nextID = stalls.length > 0 ? Math.max(...stalls.map(s => s.id)) + 1 : 1;
        setStalls((prev) => [
            ...prev,
            {
                id: nextID,
                name: `MAS Holdings`,
                label: `Stall ${nextID}`,
            },
        ]);
    };

    return (
        <div className="mt-3 mx-auto p-4">
            <Card className="mt-3 bg-slate-100/80">
                <CardHeader>
                    <CardTitle className="text-2xl">MLT</CardTitle>
                    <CardDescription>S/20/333</CardDescription>
                </CardHeader>

                <CardContent>
                    {stalls.map((stall) => (
                        <Card key={stall.id} className="relative mb-4">
                            {/* Destructive X Button */}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 p-1 bg-red-400"
                                onClick={() => handleRemove(stall.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <CardHeader>
                                <CardTitle>{stall.name}</CardTitle>
                                <CardDescription>{stall.label}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Optional content here */}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>

                <CardFooter className="flex flex-col justify-center items-center">
                    <CardDescription>
                        To add more interview stalls, contact the respective room admin
                    </CardDescription>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="outline">Add Stall</Button>
                            </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Edit Stall</DialogTitle>
                    
                         </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Stall Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Stall</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
                </CardFooter>
            </Card>
        </div>
    );
}
