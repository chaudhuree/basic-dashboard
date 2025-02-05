'use client';
import Lottie from 'lottie-react';
import React from 'react';
import loader from '@/assests/loader.json';

interface LoaderProps {
    className?: string; // Optional string type for className
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div>
            <Lottie animationData={loader} className={`${className || ''} mx-auto`} />
        </div>
    );
};

export default Loader;
