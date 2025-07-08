"use client";
import React, {useState} from 'react'
import {Header} from "@/components/common/header";
import {
    Alert,
    AlertTitle,
} from "@/components/ui/alert"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";

const companies = ["A", "B", "C"];

export default function CompanyFilter() {
    const [selected, setSelected] = useState(null);
    return (
            <div className="flex flex-col  items-center min-h-screen w-3/4 mx-auto p-4 ">
                <Header></Header>
                <Alert className="flex bg-teal-100 border-black">
                    <AlertTitle className="text-2xl flex w-3/4">Date : 14th August 2025</AlertTitle>
                    <AlertTitle className="text-2xl flex fit">Time : 12.00.00</AlertTitle>
                </Alert>
                <div className="mt-3 w-full  justify-start ">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-black w-[280px] justify-between text-left font-normal bg-gray-300 flex items-center"
                                data-empty={!selected}
                            >
                              <span>
                                {selected ? `Company ${selected}` : "Company"}
                              </span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                            <div className="flex flex-col">
                                {companies.map((company) => (
                                    <button
                                        key={company}
                                        className={`px-4 py-2 text-left hover:bg-gray-200 ${selected === company ? "bg-gray-300 font-bold" : ""}`}
                                        onClick={() => setSelected(company)}
                                    >
                                        Company {company}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        )
    }
