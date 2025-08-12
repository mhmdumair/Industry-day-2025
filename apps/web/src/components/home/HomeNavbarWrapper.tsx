'use client'; 

import { Suspense } from 'react';
import HomeNavbar from './home-navbar';

export default function HomeNavbarWrapper() {
  return (
    <Suspense fallback={<div>Loading navbar...</div>}>
      <HomeNavbar />
    </Suspense>
  );
}