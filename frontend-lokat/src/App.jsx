import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NotfoundPage from './pages/NotfoundPage'
import toast, { Toaster } from 'react-hot-toast';
import VerifyOTP from './pages/VerifyOTP'
import LogoutPage from './pages/LogoutPage'
import Dashboard from './pages/Dashboard'
import TrackPage from './pages/TrackPage'
import axios from './lib/axios'
import { useEffect } from 'react'

const App = () => {

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const result = await axios.post("/auth/update/location", { latitude, longitude })
        toast.success(result.data.message)
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message)
      }

    }, (error) => {
      toast.error(`Error occured ${error.message}`);
    })
  }

  useEffect(() => {
    getLocation()
    const intervalId = setInterval(() => {
      getLocation()
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId)
    }
  }, [])



  return (
    <>
      <Toaster toastOptions={{ style: { minWidth: '250px', background: "black", color: "white" } }} />
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"/register"} element={<RegisterPage />} />
        <Route path={"/login"} element={<LoginPage />} />

        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/profile"} element={<ProfilePage />} />

        <Route path={"/verify"} element={<VerifyOTP />} />
        <Route path={"/logout"} element={<LogoutPage />} />
        <Route path={"*"} element={<NotfoundPage />} />
      </Routes>
    </>
  )
}

export default App