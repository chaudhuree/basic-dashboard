'use client'
import React, { useEffect, useState } from 'react';
import NavbarSlider from './NavbarSlider';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const pathName = usePathname()

    const deviceResponsive = () => {
        let availWidth = window.innerWidth; // Use innerWidth for real viewport width
        if (availWidth <= 768) {
            setIsSidebarOpen(false); // Close sidebar on mobile
        } else {
            setIsSidebarOpen(true); // Open sidebar on larger screens
        }
    };

    // Set up the resize listener to trigger device responsiveness
    useEffect(() => {
        // Call it once on mount to set the correct state based on current screen size
        deviceResponsive();

        // Add event listener for resize events
        window.addEventListener('resize', deviceResponsive);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', deviceResponsive);
        };
    }, []);


    return (
        <div className={`w-fit border-r-2 ${pathName == '/privacy-policy' ? "hidden" : "block"}`}>
            <NavbarSlider isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}></NavbarSlider>
        </div>
    );
};

export default Navbar;