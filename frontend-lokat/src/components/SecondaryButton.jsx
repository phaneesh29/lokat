import React from 'react'
import { Link } from "react-router-dom"

const SecondaryButton = ({ text,to }) => {
    return (
        <Link to={to} className="px-6 py-2 bg-transparent border-2 border-[#a80000] text-[#553535] rounded font-bold hover:bg-[#ffabab] transition-colors duration-300">
            {text}
        </Link>
    )
}

export default SecondaryButton