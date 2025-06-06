import React from 'react'
import PrimaryButton from "../components/PrimaryButton"
import SecondaryButton from "../components/SecondaryButton"
import axios from "../lib/axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'

const LogoutPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setLoading(true)
            const result = await axios.post("/auth/logout")
            toast.success(result.data.message)
            navigate("/login")
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='h-screen px-2 flex justify-center items-center'>
            <div className='w-sm p-3 sm:w-lg md:w-7xl bg-[#fae9d6] rounded flex justify-center items-center flex-col gap-5'>
                <div className='text-3xl font-bold text-center mb-3 py-2'>
                    <h1>Logout</h1>
                </div>
                <div className='flex justify-center items-center gap-3'>
                    <PrimaryButton disabled={loading} text={"Logout"} onClick={handleLogout} />
                    <SecondaryButton to={"/dashboard"} text={"Cancel"} />
                </div>
            </div>
        </div>
    )
}

export default LogoutPage