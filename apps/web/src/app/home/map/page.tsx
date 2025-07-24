"use client";
import React, { useEffect, useRef } from 'react'
import {Card} from "@/components/ui/card";
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
import Navbar from "@/components/home/home-navbar";

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
        <div className='flex flex-col justify-center items-center w-full bg-slate-100 p-2'>
            <Navbar />
            <Card className="shadow-lg p-3 sm:p-4 lg:p-6 mt-6 w-full max-w-7xl bg-gray-100 border-black text-black">
                {/* Map Section */}
                <div
                    ref={mapRef}
                    className='w-full h-64 sm:h-80 lg:h-96 border border-black rounded-md shadow-lg mb-4'
                    style={{ minHeight: '250px' }}
                />

                {/* Table Section */}
                <div className='space-y-2 text-black'>
                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableCaption className="text-xs sm:text-sm lg:text-base">
                                Participating departments and their associated companies for Industry Day 2025.
                            </TableCaption>
                            <TableHeader>
                                <TableRow className='bg-slate-400'>
                                    <TableHead className="w-[40px] sm:w-[60px] text-black text-center">Color</TableHead>
                                    <TableHead className="w-[150px] sm:w-[200px] lg:w-[250px] text-black">Department</TableHead>
                                    <TableHead className="text-black">Companies</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departmentData.map((item) => (
                                    <TableRow key={item.department} className="text-black hover:bg-gray-50">
                                        <TableCell className="text-center">
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
                                                aria-label={`${item.department} color indicator`}
                                                className="rounded-full"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-sm sm:text-base">
                                            {item.department}
                                        </TableCell>
                                        <TableCell className="text-sm sm:text-base">
                                            {item.companies}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-sm sm:text-base font-medium">
                                        Total Departments: {departmentData.length}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden space-y-3">
                        <div className="text-center text-sm text-gray-600 mb-4 px-2">
                            Participating departments and their associated companies for Industry Day 2025.
                        </div>

                        {departmentData.map((item) => (
                            <Card key={item.department} className="border border-gray-300 shadow-sm bg-white">
                                <div className="p-4 space-y-3">
                                    {/* Department Header */}
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            style={{
                                                backgroundColor: item.buttonColor,
                                                color: "#fff",
                                                cursor: "not-allowed",
                                                width: "20px",
                                                height: "20px",
                                                padding: 0,
                                                border: "none",
                                                boxShadow: "none",
                                                opacity: 1,
                                            }}
                                            disabled
                                            tabIndex={-1}
                                            aria-label={`${item.department} color indicator`}
                                            className="rounded-full flex-shrink-0"
                                        />
                                        <h3 className="font-semibold text-base text-gray-900 flex-1">
                                            {item.department}
                                        </h3>
                                    </div>

                                    {/* Companies */}
                                    <div className="pl-8">
                                        <p className="text-sm text-gray-700 font-medium mb-1">Companies:</p>
                                        <p className="text-sm text-gray-600 leading-relaxed break-words">
                                            {item.companies}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Mobile Footer */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-center text-sm font-medium text-gray-700">
                                Total Departments: {departmentData.length}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

    )
}