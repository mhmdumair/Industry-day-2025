"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../ui/card";

interface User { email:string; first_name:string; last_name:string; }


interface Company {
  companyName:string; sponsership:string; stream:string;
  contactPersonName:string; contactNumber:string;
  location:string; companyWebsite:string; logo?:string;
  user : User
}

export default function CompanyListCard() {
  const [companies,setCompanies]=useState<Company[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      try{
        const {data}=await api.get<Company[]>("/company");;
        console.log(data);
        
        setCompanies(data);
        setError(null);
      }catch(e){
        console.error(e);
        setError("Failed to fetch companies.");
        setCompanies([]);
      }finally{ setLoading(false); }
    })();
  },[]);

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Company List</CardTitle>
        <CardDescription>Fetched from database</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading?(
          <div className="p-4 text-center">Loading companies...</div>
        ):error?(
          <div className="p-4 text-center text-red-600">{error}</div>
        ):(
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {["Company","Stream",,"Email"]
                  .map(h=>(
                    <th key={h} className="border px-2 py-1">{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {companies.length?companies.map((c,i)=>(
                <tr key={i}>
                  <Td>{c?.companyName}</Td>
                  <Td>{c?.stream}</Td>
                  <Td>{c?.user?.email}</Td>
                </tr>
              )):(
                <tr><Td colSpan={6}>No companies found.</Td></tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
const Td=({children,...rest}:any)=><td className="border px-2 py-1" {...rest}>{children}</td>;
