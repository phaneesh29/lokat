import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import LoadingButton from '../components/LoadingButton'

const VerifyOTP = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        email: "",
        otp: ""
    })
    const [loading, setLoading] = useState(false)
    const [resendBtn, setResendBtn] = useState(false)
    const handleChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userData.email || !userData.otp) {
            toast.error("All fileds are required")
            return
        }
        try {
            setLoading(true)
            const result = await axios.post("/auth/verify", userData)
            toast.success(result.data.message)
            navigate("/login")
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResendBtn(true)
        setTimeout(() => {
            setResendBtn(false)
        }, 60000);
        if (!userData.email) {
            toast.error("Fill email field")
            return
        }
        try {
            setLoading(true)
            const result = await axios.post("/auth/resend", {email:userData.email,emailType:"VERIFY"})
            toast.success(result.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='h-screen px-2 flex justify-center items-center'>
            <div className='w-sm p-3 sm:w-lg md:w-7xl rounded bg-[#dbfdff]'>

                <div className='text-3xl font-bold text-center mb-3 py-2'>
                    <h1>Verify your account</h1>
                </div>
                <form className='flex flex-col justify-center gap-2.5' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input value={userData.email} onChange={handleChange} className='border-2 w-full px-3 py-2 rounded-lg border-gray-600 focus:outline-0' placeholder='someone@example.com' type="email" name="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="otp">OTP</label>
                        <input value={userData.otp} onChange={handleChange} type="number" name="otp" id="otp" maxLength={"6"} className='border-2 w-full px-3 py-2 rounded-lg border-gray-600 focus:outline-0' placeholder='123456' />
                    </div>
                    <div>
                        <button type='button' disabled={resendBtn} onClick={handleResend} className={`${resendBtn ? "cursor-not-allowed" : "cursor-pointer"}`}>resend OTP</button>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button type="submit" disabled={loading} className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} p-3 border-2 rounded-full font-bold hover:bg-[#ffaeae] w-40 transition-all duration-200`}>{loading ? <LoadingButton /> : "Verify"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyOTP