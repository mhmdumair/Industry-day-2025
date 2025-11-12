"use client";
import React, { useEffect, useRef, Suspense } from 'react';
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const departmentData = [
    { 
        department: "Chemistry", 
        venues: [
            { location: "Auditorium", company: "A Baur & Co (Pvt) Ltd (Main)" },
            { location: "New Auditorium", company: "Noritake Lanka Porcelain (Pvt) Ltd" },
            { location: "Tutorial Room 1", company: "Avenir IT (Pvt) Ltd" }
        ]
    },
    { 
        department: "Science Education Unit", 
        venues: [
            { location: "SEU 208", company: "Hemas Consumer Brands" },
            { location: "ELTU 210", company: "Federation for Environment Climate and Technology" },
            { location: "SEU 309", company: "Aayu Technologies" }
        ]
    },
    { 
        department: "Physics", 
        venues: [
            { location: "Smart Room 1", company: "MAS Holdings" },
            { location: "Seminar Room", company: "Sands Active (Pvt) Ltd" },
            { location: "Smart Room 2", company: "OCTAVE" }
        ]
    },
    { 
        department: "Geology", 
        venues: [
            { location: "Seminar Room", company: "LiveRoom Technologies" },
            { location: "Room 1", company: "Creative Software" },
            { location: "Room 2", company: "Hutch" }
        ]
    },
    { 
        department: "QBITS", 
        venues: [
            { location: "On Site", company: "CodeGen International (Pvt) Ltd" }
        ]
    },
    { 
        department: "Postgraduate Institute of Science", 
        venues: [
            { location: "Block C - Room 1 & 2", company: "A Baur & Co (Pvt) Ltd (Healthcare)" },
            { location: "Old Building - Room 1", company: "A Baur & Co (Pvt) Ltd (Online)" },
            { location: "Old Building - Room 2", company: "CodeGen International (Pvt) Ltd (Online)" }
        ]
    },
];

function MapPageContent() {
    const mapRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (mapRef.current && mapRef.current.leafletMap) {
            mapRef.current.leafletMap.remove();
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
            .leaflet-container {
                background-color: ${theme === 'dark' ? '#020817' : '#f5f5f5'};
            }
            .custom-marker {
                background-color: ${theme === 'dark' ? '#f8fafc' : '#1f2937'};
                color: ${theme === 'dark' ? '#020817' : 'white'};
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 2px solid ${theme === 'dark' ? '#020817' : 'white'};
                font-size: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                background-color: ${theme === 'dark' ? '#0f172a' : '#ffffff'} !important;
                color: ${theme === 'dark' ? '#f8fafc' : '#0f172a'} !important;
                border-color: ${theme === 'dark' ? '#334155' : '#e5e7eb'} !important;
            }
            .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
                background-color: ${theme === 'dark' ? '#1e293b' : '#f3f4f6'} !important;
            }
        `;
        document.head.appendChild(style);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => {
            if (mapRef.current && window.L) {
                const facLat = 7.259357707773473;
                const facLng = 80.59864417369857;

                const map = window.L.map(mapRef.current, {
                    zoomControl: false
                }).setView([facLat, facLng], 17);
                mapRef.current.leafletMap = map;

                window.L.control.zoom({
                    position: 'bottomright'
                }).addTo(map);

                const tileUrl = theme === 'dark'
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
                
                window.L.tileLayer(tileUrl, {
                    attribution: ''
                }).addTo(map);

                const departments = [
                    { lat: 7.259110149863792, lng: 80.59855413180149, name: "Chemistry", code: "C" },
                    { lat: 7.258786107127077, lng: 80.59858899128251, name: "Science Education Unit", code: "S" },
                    { lat: 7.25966946285262, lng: 80.59831004155818, name: "Physics", code: "P" },
                    { lat: 7.259187320966107, lng: 80.5962341394956, name: "Geology", code: "G" },
                    { lat: 7.259834952551038, lng: 80.599024075498, name: "QBITS", code: "Q" },
                    { lat: 7.258617903568317, lng: 80.59660186860907, name: "PGIS", code: "PG" },
                ];

                departments.forEach(dept => {
                    const marker = window.L.marker([dept.lat, dept.lng], {
                        icon: window.L.divIcon({
                            html: `<div class="custom-marker">${dept.code}</div>`,
                            iconSize: [24, 24],
                            className: ''
                        })
                    }).addTo(map);

                    marker.bindPopup(`<b>${dept.name}</b>`);
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            if (link.parentNode) link.parentNode.removeChild(link);
            if (script.parentNode) script.parentNode.removeChild(script);
            if (style.parentNode) style.parentNode.removeChild(style);
        };
    }, [theme]);

    return (
        <div className='flex flex-col items-center w-full min-h-screen bg-background'>
            <div className='w-full px-4'>
                <div className='w-full h-96 mb-8 mt-6'>
                    <div
                        ref={mapRef}
                        className="w-full h-full border shadow-sm"
                    />
                </div>

                <Card className="w-2/3 mx-auto rounded-none p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-medium text-muted-foreground w-[25%]">Department</TableHead>
                                <TableHead className="font-medium text-muted-foreground w-[75%]">Venue & Company</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentData.map((dept, deptIndex) => (
                                <TableRow
                                    key={deptIndex}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium align-middle">
                                        {dept.department}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-y-4 py-2">
                                            {dept.venues.map((venue, venueIndex) => (
                                                <div key={venueIndex} className="flex flex-col">
                                                    <span className="font-medium">{venue.location}:</span>
                                                    <span className="text-muted-foreground">{venue.company}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                
                <div className="w-2/3 mx-auto py-3">
                    <p className="text-sm text-muted-foreground text-center">
                        A list of companies and their respective venues.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Loading map...</div>
            </div>
        }>
            <MapPageContent />
        </Suspense>
    );
}