import React from 'react'
import { Link } from "react-router-dom"

const BottomNav = () => {
    return (
        <div className="fixed bottom-4 left-4">
            <Link to={"/"} className='rounded-bl-2xl rounded-tr-2xl text-[#553535] bg-[#ffabab] px-2 py-1 font-semibold shadow-md block'>Home</Link>
        </div>
    )
}

export default BottomNav