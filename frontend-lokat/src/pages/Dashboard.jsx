import { useEffect, useState } from "react"
import SideNav from "../components/SideNav"
import axios from "../lib/axios"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { LoaderCircle, LocateFixed, Mail, Map, RefreshCw, Send, Trash2, User2 } from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [viewers, setViewers] = useState([])
  const [others, setOthers] = useState([])
  const [receiverEmail, setReceiverEmail] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false)

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

  const whoCanSeeMe = async () => {
    try {
      setLoading(true)
      const result = await axios.post("/auth/viewers")
      setViewers(result.data.accesses)
    } catch (error) {
      setViewers([])
    } finally {
      setLoading(false)
    }
  }

  const othersLocation = async () => {
    try {
      setLoading(true)
      const result = await axios.post("/auth/others")
      setOthers(result.data.accesses)
    } catch (error) {
      setOthers([])
    } finally {
      setLoading(false)
    }
  }

  const shareMyLocation = async (e) => {
    e.preventDefault()

    if (!receiverEmail) {
      toast.error("Email is required to share location")
      return
    }
    try {
      setBtnLoading(true)
      const result = await axios.post("/auth/grant-access", { receiverEmail })
      whoCanSeeMe()

    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setBtnLoading(false)
      setReceiverEmail("")
    }

  }
  const deleteAccess = async (accessId) => {
    try {
      setDeleteBtnLoading(true)
      const result = await axios.post("/auth/delete-access", { accessId })
      whoCanSeeMe()
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setDeleteBtnLoading(false)
    }
  }
  useEffect(() => {
    fetchUser()
    whoCanSeeMe()
    othersLocation()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoaderCircle size={62} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SideNav />
      <div className="pt-20 pb-10 flex justify-around items-center w-full flex-wrap gap-8 px-8">

        <div className="p-4 w-full rounded-lg bg-red-100 flex flex-col justify-start items-center gap-3">
          <h2 className="text-2xl font-bold">Share my Loaction</h2>
          <form className="flex w-full justify-center items-center gap-1">
            <input value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} type="email" required name="receiverEmail" id="receiverEmail" placeholder="Enter email to share your location" className="w-full border-2 focus:outline-none px-2 py-1 rounded-lg" />
            <button disabled={btnLoading} onClick={shareMyLocation} type="submit" className={`hover:bg-blue-500 transition-all duration-300 ring-2 p-1 rounded-lg ${btnLoading ? "cursor-not-allowed" : "cursor-pointer"}`}><Send /></button>
          </form>
        </div>

        <div className="p-4 w-full rounded-lg bg-red-100 flex flex-col justify-start items-center gap-3">
          <h2 className="text-2xl font-bold">Who can see me ?</h2>

          <div className="w-full">
            {viewers?.length > 0 ? (
              <div className="flex flex-col justify-center gap-2.5">
                {viewers.map((viewer) => (
                  <div key={viewer._id} className="bg-slate-200 px-2 py-1 rounded-lg">
                    <div>
                      <p className="flex gap-2 items-center"><strong>Username</strong><span>{viewer.receiver.username}</span></p>
                      <p className="flex gap-2 items-center"><strong>Email</strong><span>{viewer.receiver.email}</span></p>
                      <p className="flex gap-2 items-center"><strong>Location</strong><span>{viewer.receiver.location}</span></p>
                    </div>
                    <button onClick={() => deleteAccess(viewer._id)} disabled={deleteBtnLoading} className={`${deleteBtnLoading ? "cursor-not-allowed" : "cursor-pointer"} bg-red-300 hover:bg-rose-300 text-base transform-all duration-300 mt-1 inline-flex justify-center gap-2 items-center font-semibold px-2 py-1 rounded-xl`}>Delete <Trash2 /> </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-semibold text-center text-red-600 text-lg">No shared Location</p>
            )}
          </div>
        </div>

        <div className="p-4 w-full relative rounded-lg bg-red-100 flex flex-col justify-start items-center gap-3">
          <h2 className="text-2xl font-bold">Others Location</h2>
          <button className="absolute right-3 top-3 bg-pink-50 p-1 rounded-full active:rotate-180 transition-all duration-300" onClick={othersLocation}><RefreshCw /></button>
          <div className="w-full">
            {others?.length > 0 ? (
              <div className="flex flex-col justify-center gap-2.5">
                {others.map((other) => (
                  <div key={other._id} className="bg-slate-200 px-2 py-1 rounded-lg ">
                    <div>
                      <p className="flex gap-2 items-center"><strong>Username</strong><span>{other.sender.username}</span></p>
                      <p className="flex gap-2 items-center"><strong>Email</strong><span>{other.sender.email}</span></p>
                      <p className="flex gap-2 items-center"><strong>Location</strong><span>{other.sender.location}</span></p>
                    </div>
                    <Link to={`https://www.google.com/maps/dir/${user?.latitude},${user?.longitude}/${other?.sender.latitude},${other?.sender.longitude}`} target='_blank' className="bg-blue-300 hover:bg-indigo-300 transform-all duration-300 mt-1 inline-flex justify-center gap-2 items-center font-semibold px-2 py-1 rounded-xl cursor-pointer">Track <Map /></Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-semibold text-red-600 text-lg">No shared Location</p>
            )}
          </div>

        </div>



        <div className="p-4 w-full rounded-lg bg-orange-100 flex flex-col justify-start items-start gap-3">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <div className="flex justify-start gap-2 items-center"><p className="size-8 flex justify-center items-center rounded-full bg-[#ca99fe]"><User2 /></p><p className="font-semibold">{user.username}</p></div>
          <div className="flex justify-start gap-2 items-center"><p className="size-8 flex justify-center items-center rounded-full bg-[#9999fe]"><Mail /></p><p className="font-semibold">{user.email}</p></div>
          <div className="flex justify-start gap-2 items-center"><p className="size-8 flex justify-center items-center rounded-full bg-[#9999fe]"><LocateFixed /></p><p className="font-semibold">{user.location}</p></div>
        </div>


      </div>
    </div>
  )
}

export default Dashboard