import { useEffect, useState } from "react"
import SideNav from "../components/SideNav"
import axios from "../lib/axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { LoaderCircle } from "lucide-react"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})

  const fetchUser = async () => {
    try {
      setLoading(true)
      const result = await axios.get("/auth/profile")
      setUser(result.data.user)
      toast.success(`Welcome ${result?.data?.user?.username}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-[#fafae0]">
        <LoaderCircle size={60} className="animate-spin text-[#553535]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center">
      <SideNav />
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-4xl font-bold text-center mb-6">
            Welcome, <span className="italic font-mono text-[#a80000]">{user.username}</span>
          </h1>
          <div className="space-y-3 text-lg">
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Full Name:</strong> {user.fullName}</div>
            <div><strong>Latitude:</strong> {user.latitude}</div>
            <div><strong>Longitude:</strong> {user.longitude}</div>
            <div><strong>Location:</strong> {user.location}</div>
            <div><strong>Active:</strong> {user.isActive ? "Yes ✅" : "No ❌"}</div>
            <div><strong>Verified:</strong> {user.isVerified ? "Yes ✅" : "No ❌"}</div>
            <div><strong>Joined on:</strong> {new Date(user.createdAt).toDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
