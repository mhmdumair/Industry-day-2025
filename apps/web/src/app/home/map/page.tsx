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
import { Description } from '@radix-ui/react-dialog';

const departmentData = [
    { department: "Computer Science", location: "SCLT2,SCLT1", companies: "Sands Active (Pvt) Ltd", buttonColor: "#ef4444" },
    { department: "Mathematics", location: "M1", companies: "Federation for Environment, Climate and Technology", buttonColor: "#3b82f6" },
    { department: "Physics", location: "P-Upper", companies: "A Baur & Co (Pvt) Ltd", buttonColor: "#10b981" },
    { department: "Chemistry", location: "C-Upper", companies: "Hemas Consumer Brands", buttonColor: "#f59e0b" },
    { department: "Zoology", location: "Z1", companies: "MAS Holdings", buttonColor: "#8b5cf6" },
    { department: "Botany", location: "SCLT2", companies: "Noritake Lanka Porcelain (Pvt) Ltd", buttonColor: "#ec4899" },
    { department: "Geology", location: "GEO Seminar room", companies: "LiveRoom (Pvt) Ltd, Aayu Technologies", buttonColor: "#14b8a6" },
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
                const rawDepartments = [
                    {
                        lat: 7.258993569138258,
                        lng: 80.59856013481138,
                        name: "Department of Chemistry",
                        code: "CHEM"
                    },
                    {
                        lat: 7.259639093821609,
                        lng: 80.5985844623975,
                        name: "Department of Physics",
                        code: "PHY"
                    },
                    {
                        lat: 7.261154599947815,
                        lng: 80.60082147680663,
                        name: "Department of Statistics and Computer Science",
                        code: "CS"
                    },
                    {
                        lat: 7.259990844246528,
                        lng: 80.5983182833371,
                        name: "Department of Mathematics",
                        code: "MATH"
                    },
                    {
                        lat: 7.259038310667899,
                        lng: 80.59727222188562,
                        name: "Department of Botany",
                        code: "BOT"
                    },
                    {
                        lat: 7.259516360621329,
                        lng: 80.59761987221921,
                        name: "Department of Zoology",
                        code: "Zoo"
                    },
                    {
                        lat: 7.259160748238052,
                        lng: 80.59616681199911,
                        name: "Department of Geology",
                        code: "GEO"
                    },
                ];

                // Merge data from departmentData
                const departments = rawDepartments.map(dep => {
                    const match = departmentData.find(d =>
                        dep.name.toLowerCase().includes(d.department.toLowerCase())
                    );

                    return {
                        ...dep,
                        color: match?.buttonColor || "#000000",
                        description: match ? `Location: ${match.location}` : "Location: N/A",
                    };
                });

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
        <div className='flex flex-col justify-center items-center w-full bg-transparent p-2'>
            <Navbar />
            <Card className="bg-slate-100/80 w-full flex justify-center items-center shadow-sm mt-6 sm:mt-10 mx-2 sm:mx-0 text-black p-3">
                {/* Map Section */}
                <div
                    ref={mapRef}
                    className="w-full sm:w-1/2 aspect-video border border-gray-400 rounded-md shadow-sm z-[0]"
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
                                    <TableHead className="w-[40px] sm:w-[60px] text-black text-center"></TableHead>
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
                        </Table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden space-y-3">
                        <div className="text-center text-sm text-gray-600 mb-4 p-2">
                            Participating departments and their associated companies for Industry Day 2025.
                        </div>

                        {departmentData.map((item) => (
                            <Card key={item.department} className="border border-gray-300 shadow-sm gap-0.5 bg-white">
                                <div className="pl-4">
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
                    </div>
                </div>
            </Card>
        </div>

    )
}