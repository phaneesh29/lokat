import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import SideNav from '../components/SideNav';

const NotfoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center font-sans text-[#553535]">
            <SideNav />
            <h1 className="text-8xl font-extrabold mb-2">404</h1>
            <p className="text-2xl mb-6 font-bold">Page Not Found</p>
            <PrimaryButton to={"/"} text={"Go Home"}/>
        </div>
    );
};

export default NotfoundPage;
