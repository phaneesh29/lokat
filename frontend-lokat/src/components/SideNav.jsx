import React from 'react'
import RoundButton from './RoundButton'
import { CircleUserRound, LayoutDashboard, LogOut, Settings, UserPlus } from "lucide-react"

const SideNav = () => {
    return (
        <nav className='fixed bg-[#ffabab] flex justify-around items-center gap-2.5 px-4 pb-2 rounded-b-full left-0 right-0 top-0'>
            <RoundButton to={"/dashboard"} title={"Dashboard"} text={<LayoutDashboard />} />
            <RoundButton to={"/profile"} title={"Profile"} text={<CircleUserRound />} />
            <RoundButton to={"/add"} title={"Add"} text={<UserPlus />} />
            <RoundButton to={"/settings"} title={"Settings"} text={<Settings />} />
            <RoundButton to={"/logout"} title={"Logout"} text={<LogOut />} />
        </nav>
    )
}

export default SideNav