import React, { useEffect } from 'react'
import SideNav from "../components/SideNav"
import { Link, useLocation, useNavigate } from 'react-router-dom'

const TrackPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, other } = location.state || {}

    useEffect(() => {
        if (!user || !other) {
            navigate("/")
        }
    }, [location.state])
    const url = ``
    return (
        <div className='min-h-screen'>
            <SideNav />
            <div className='pt-20 px-2'>

                <div>
                    <p>{user?.email}</p>
                    <p>{user?.username}</p>
                    <p>{user?.latitude}</p>
                    <p>{user?.longitude}</p>
                </div>
                <div>
                    <p>{other?.sender.email}</p>
                    <p>{other?.sender.username}</p>
                    <p>{other?.sender.latitude}</p>
                    <p>{other?.sender.longitude}</p>
                </div>
            </div>
        </div>
    )
}

export default TrackPage