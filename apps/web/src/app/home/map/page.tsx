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
    { department: "Chemistry", location: "Auditorium, New Auditorium", companies: "A Baur & Co (Pvt) Ltd, Noritake Lanka Porcelain (Pvt) Ltd", buttonColor: "#dc2626" }, // red
    { department: "Science Education Unit", location: "On Site", companies: "Hemas Consumer Brands", buttonColor: "#e5d246ff" }, // yellow
    { department: "Physics", location: "Lobby, Seminar Room", companies: "Federation for Environment Climate and Technology, MAS Holdings", buttonColor: "#003097ff" }, // blue
    { department: "Mathematics", location: "M5", companies: "Aayu Technologies", buttonColor: "#a855f7" }, // purple
    { department: "Molecular Biology", location: "Upper Theater", companies: "Sands Active Pvt Ltd", buttonColor: "#f97316" }, // orange
    { department: "Qbits", location: "On Site", companies: "CodeCodeGen International (Pvt) Ltd", buttonColor: "#0f766e" }, // teal
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
                        lat: 7.259110149863792,
                        lng: 80.59855413180149,
                        name: "Department of Chemistry",
                        code: "CHEM"
                    },
                    {
                        lat: 7.258786107127077,
                        lng: 80.59858899128251,
                        name: "Science Education Unit",
                        code: "SEU"
                    },
                    {
                        lat: 7.25966946285262,
                        lng: 80.59831004155818,
                        name: "Department of Physics",
                        code: "PHY"
                    },
                    {
                        lat: 7.259932114279001,
                        lng: 80.59834497379939,
                        name: "Department of Mathematics",
                        code: "MATH"
                    },
                    {
                        lat: 7.258914631879946,
                        lng: 80.59784414737696,
                        name: "Department of Molecular Biology",
                        code: "MB"
                    },
                    {
                        lat: 7.259834952551038,
                        lng: 80.599024075498,
                        name: "QBITS",
                        code: "QB"
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
                                Participating companies and their associated locations for Industry Day 2025.
                            </TableCaption>
                            <TableHeader>
                                <TableRow className='bg-slate-400'>
                                    <TableHead className="w-[40px] sm:w-[60px] text-black text-center"></TableHead>
                                    <TableHead className="w-[150px] sm:w-[200px] lg:w-[250px] text-black">Department</TableHead>
                                    <TableHead className="text-black">Location & Company</TableHead>
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
                                        <TableCell className="text-sm sm:text-base" colSpan={2}>
                                            <div className="space-y-1">
                                                {(() => {
                                                    const locations = item.location.split(',').map(loc => loc.trim()).filter(Boolean);
                                                    const companies = item.companies.split(',').map(comp => comp.trim()).filter(Boolean);
                                                    const count = Math.max(locations.length, companies.length);

                                                    return Array.from({ length: count }).map((_, i) => {
                                                        const loc = locations[i] || "N/A";
                                                        const comp = companies[i] || "N/A";
                                                        return (
                                                            <div key={i}>
                                                                <span className="font-medium">{loc}:</span> {comp}
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden space-y-3">
                        <div className="text-center text-sm text-gray-600 mb-4 p-2">
                            Participating companies and their associated locations for Industry Day 2025.
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

                                    {/* Combined Location: Company */}
                                    <div className="pl-8">
                                        <p className="text-sm text-gray-700 font-medium mb-1">Location & Company:</p>
                                        <div className="text-sm text-gray-600 leading-relaxed break-words space-y-1">
                                            {(() => {
                                                const locations = item.location.split(',').map(loc => loc.trim()).filter(Boolean);
                                                const companies = item.companies.split(',').map(comp => comp.trim()).filter(Boolean);
                                                const count = Math.max(locations.length, companies.length);

                                                return Array.from({ length: count }).map((_, i) => {
                                                    const loc = locations[i] || "N/A";
                                                    const comp = companies[i] || "N/A";
                                                    return (
                                                        <p key={i}>
                                                            {loc}: {comp}
                                                        </p>
                                                    );
                                                });
                                            })()}
                                        </div>
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