import React from 'react'
import { Link } from "react-router-dom"
import LoadingButton from './LoadingButton'

const PrimaryButton = ({ disabled = false, text, to, onClick = () => { } }) => {
    return (
        <Link to={to} disabled={disabled} onClick={onClick} className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} px-6 py-2 bg-[#ffabab] border-2 border-[#a80000] text-[#553535] rounded font-bold hover:bg-transparent transition-colors duration-300`}>
            {disabled ? <LoadingButton /> : text}
        </Link>
    )
}

export default PrimaryButton