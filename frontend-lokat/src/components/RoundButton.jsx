import React from 'react'
import { Link, NavLink } from "react-router-dom"

const RoundButton = ({ text, title, to }) => {
    return (
        <NavLink to={to} title={title} className={({ isActive }) => `hover:bg-[#f4f4d1] size-10 rounded-b-full bg-[#fafae0] flex justify-center items-center py-4 ${isActive ? "bg-amber-200 font-bold hover:bg-amber-200" : ""}`}>
            {text}
        </NavLink>
    )
}

export default RoundButton