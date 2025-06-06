import { Eye, EyeClosed } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import BottomNav from '../components/BottomNav'

const LoginPage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    emailOrUsername: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userData.emailOrUsername || !userData.password) {
      toast.error('All fields are required')
      return
    }
    try {
      setLoading(true)
      const result = await axios.post("/auth/login", userData)
      toast.success(result.data.message)
      navigate("/dashboard")
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen px-2 flex justify-center items-center'>
      <div className='w-sm p-3 sm:w-lg md:w-7xl bg-[#faf6d6] rounded'>
        <div className='text-3xl font-bold text-center mb-3 py-2'>
          <h1>Login Now</h1>
        </div>

        <form className='flex flex-col justify-center gap-2.5' onSubmit={handleSubmit}>

          <div>
            <label htmlFor="fullName">Username or Email</label>
            <input value={userData.emailOrUsername} className='border-2 w-full px-3 py-2 rounded-lg border-gray-600 focus:outline-0' placeholder='Username or Email' type="text" name="emailOrUsername" onChange={handleChange} id="emailOrUsername" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className='relative'>
              <input value={userData.password} onChange={handleChange} className='border-2 w-full px-3 py-2 rounded-lg border-gray-600 focus:outline-0' placeholder='Keep atleast 8 char long' type={showPassword ? "text" : "password"} name="password" id="password" />
              <button type="button" className='cursor-pointer absolute right-2 top-2.5 flex justify-center items-center rounded-full' onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeClosed /> : <Eye />}</button>
            </div>
          </div>

          <div className='flex justify-center items-center'>
            <button type="submit" disabled={loading} className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} p-3 border-2 rounded-full font-bold hover:bg-[#ffaeae] w-40 transition-all duration-200`}>Login</button>
          </div>

        </form>

      </div>
      <BottomNav/>
    </div>
  )
}

export default LoginPage