"use client";
import React, { useEffect, useRef } from 'react'
import {Card} from "@/components/ui/card";
import {Header} from "@/components/common/header";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

const departmentData = [
    { department: "Computer Science", companies: "Google, Microsoft", buttonColor: "#ef4444" },
    { department: "Mathematics", companies: "Deloitte, PWC", buttonColor: "#3b82f6" },
    { department: "Physics", companies: "Tesla, SpaceX", buttonColor: "#10b981" },
    { department: "Chemistry", companies: "Pfizer, DuPont", buttonColor: "#f59e0b" },
    { department: "Biology", companies: "Roche, Merck", buttonColor: "#8b5cf6" },
    { department: "Statistics", companies: "Nielsen, Palantir", buttonColor: "#ec4899" },
    { department: "Geology", companies: "ExxonMobil, Rio Tinto", buttonColor: "#14b8a6" },
];

export default function page() {
    const mapRef = useRef(null);

    useEffect(() => {
        // Load Leaflet CSS and JS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => {
            if (mapRef.current && window.L) {
                // Faculty of Science coordinates (approximate based on university location)
                const facLat = 7.259357707773473;
                const facLng = 80.59864417369857;

                // Initialize map focused on Faculty of Science
                const map = window.L.map(mapRef.current).setView([facLat, facLng], 17);

                // Add OpenStreetMap tiles
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

                // Department locations (approximate positions within the faculty)
                const departments = [
                    {
                        lat: 7.258993569138258,
                        lng: 80.59856013481138,
                        name: "Department of Chemistry",
                        description: "",
                        color: departmentData.find(d => d.department === "Chemistry")?.buttonColor,
                        code: "CHEM"
                    },
                    {
                        lat: 7.259639093821609,
                        lng: 80.5985844623975,
                        name: "Department of Physics",
                        color: "#0284c7",
                        code: "PHYS"
                    },
                    {
                        lat: 7.261154599947815,
                        lng: 80.60082147680663,
                        name: "Department of Statistics and Computer Science",
                        color: "#7c3aed",
                        code: "STAT"
                    }
                ];

                // Add department markers
                departments.forEach(dept => {
                    const marker = window.L.marker([dept.lat, dept.lng], {
                        icon: window.L.divIcon({
                            html: `<div style="background-color: ${dept.color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; font-size: 8px;">${dept.code}</div>`,
                            iconSize: [30, 30],
                            className: 'custom-div-icon'
                        })
                    }).addTo(map);

                    marker.bindPopup(`<b>${dept.name}</b><br>${dept.description}`);
                });

            }
        };
        document.head.appendChild(script);

        // Cleanup function
        return () => {
            if (link.parentNode) link.parentNode.removeChild(link);
            if (script.parentNode) script.parentNode.removeChild(script);
        };
    }, []);

    return (
        <div className='flex flex-col justify-center items-center h-full w-full p-4'>
            <Header></Header>
            <Card className={"shadow-lg p-6 w-11/12 bg-gray-100 border-black"}>
                <div
                    ref={mapRef}
                    className='w-full h-96 border-1 border-black rounded-md shadow-lg'
                    style={{ minHeight: '450px' }}
                />
                <div className='mt-4 space-y-2'>
                    <Table>
                        <TableCaption>
                            Participating departments and their associated companies for Industry Day 2025.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]"></TableHead>
                                <TableHead className="w-[200px]">Department</TableHead>
                                <TableHead>Companies</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentData.map((item) => (
                                <TableRow key={item.department}>
                                    <TableCell>
                                        <Button
                                            style={{
                                                backgroundColor: item.buttonColor,
                                                color: "#fff",
                                                cursor: "not-allowed",
                                                width: "16px",
                                                height: "16px",
                                                padding: 0,
                                                border: "none",
                                                boxShadow: "none",
                                                opacity: 1,
                                            }}
                                            disabled
                                            tabIndex={-1}
                                            aria-label={item.department}
                                        >
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.department}</TableCell>
                                    <TableCell>{item.companies}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    Total Departments: {departmentData.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

            </Card>
        </div>
    )
}