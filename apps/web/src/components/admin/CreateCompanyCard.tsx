"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const companyStreams = [
  "ZL","BT","CH","MT","BMS","ST","GL","CS","DS",
  "ML","BL","MB","CM","AS","ES","SOR","GN"
];
const companySponsorships = ["GOLD","SILVER","BRONZE"]; 

export default function CreateCompanyCard() {
  const [formData, setFormData] = useState({
    user: { email:"", password:"", first_name:"", last_name:"" },
    company: {
      companyName:"", description:"", sponsership:"GOLD", stream:"CS",
      contactPersonName:"", contactPersonDesignation:"", contactNumber:"",
      location:"", companyWebsite:"", logo:"",
    },
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user"|"company",
  ) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
  };

  const handleSelect = (
    name:"stream"|"sponsership",
    value:string,
  ) => setFormData(p => ({ ...p, company: { ...p.company, [name]: value } }));

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    const payload = { user:{ ...formData.user, role:"company" }, company:formData.company };
    try {
      await api.post("/company", payload);
      alert("Company created!");
      setFormData({
        user: { email:"", password:"", first_name:"", last_name:"" },
        company: {
          companyName:"", description:"", sponsership:"GOLD", stream:"CS",
          contactPersonName:"", contactPersonDesignation:"", contactNumber:"",
          location:"", companyWebsite:"", logo:"",
        },
      });
    } catch (err:any) {
      console.error(err.response?.data ?? err);
      alert("Failed to create company");
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Create Company</CardTitle>
        <CardDescription>Register new company profile</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email"
              value={formData.user.email}
              onChange={e=>handleInput(e,"user")} />
            <Field label="First Name" name="first_name"
              value={formData.user.first_name}
              onChange={e=>handleInput(e,"user")} />
            <Field label="Last Name" name="last_name"
              value={formData.user.last_name}
              onChange={e=>handleInput(e,"user")} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Field label="Company Name" name="companyName"
              value={formData.company.companyName}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Description" name="description"
              value={formData.company.description}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Contact Person" name="contactPersonName"
              value={formData.company.contactPersonName}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Designation" name="contactPersonDesignation"
              value={formData.company.contactPersonDesignation}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Contact Number" name="contactNumber"
              value={formData.company.contactNumber}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Location" name="location"
              value={formData.company.location}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Company Website" name="companyWebsite"
              value={formData.company.companyWebsite}
              onChange={e=>handleInput(e,"company")} />
            <Field label="Logo URL (optional)" name="logo" required={false}
              value={formData.company.logo}
              onChange={e=>handleInput(e,"company")} />

            <div>
              <Label>Sponsorship</Label>
              <Select value={formData.company.sponsership}
                      onValueChange={v=>handleSelect("sponsership",v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {companySponsorships.map(s=>(
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Stream</Label>
              <Select value={formData.company.stream}
                      onValueChange={v=>handleSelect("stream",v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {companyStreams.map(s=>(
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">Create Company</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field(
  {label,name,value,onChange,type="text",required=true}:{
    label:string; name:string; value:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    type?:string; required?:boolean;
  }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} type={type} value={value}
             onChange={onChange} required={required} />
    </div>
  );
}
