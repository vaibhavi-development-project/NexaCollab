import { UserContext } from "../context/UserContext"
import { useState, useContext, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MdWorkspacesOutline } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import axios from "../api/axios"
import { VscBellDot } from "react-icons/vsc";
import { GoDotFill } from "react-icons/go";


const Navbar = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { notifications, setNotifications, loading } = useContext(UserContext)
  // console.log(notifications)
  const { user } = useContext(UserContext)
  const [showNotification, setShowNotification] = useState(false)
  const [showonDesktop, setShowonDesktop] = useState(false)

  const isWorkspacePage = location.pathname.startsWith("/workspaces")
  const isPrfilePage = location.pathname.startsWith("/profile")



  const handleAccept = async (token) => {
    try {

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/invite/accept/${token}`, {},
        // { withCredentials: true }
      )
      console.log(res)

      setNotifications(prev =>
        prev.filter(n => n.token !== token)
      )


    } catch (err) {
      console.log(err)
    }
  }



  function timeAgo(dateString) {
    const now = new Date()
    const created = new Date(dateString)
    const diffMs = now - created

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`

    return created.toLocaleDateString()
  }



  return (

    <div className='fixed top-0 z-30 w-full flex items-center justify-between bg-white p-4 border-b border-gray-600 lg:px-10'>

      <div className='flex items-center justify-center gap-x-1 '>

        {isWorkspacePage || isPrfilePage ? (

          <div className="flex items-center gap-x-2 hover:text-lg"
            onClick={() => navigate("/dashboard")}>
            <FaArrowLeft className="text-xs" />
            <p className="font-semibold">Home</p>
          </div>


        ) : (
          <div className='flex items-center gap-x-1 lg:gap-x-2'>
            <div className="bg-gray-800 rounded-lg p-1"> <MdWorkspacesOutline className='text-xl text-white lg:text-2xl' /></div>
            <h1 className='font-semibold  text-lg lg:text-xl'>NexaCollab</h1>
          </div>
        )}
      </div>

      <div className="flex gap-x-4 items-center lg:w-auto">


        <div
          onClick={() => {
            setShowNotification(true)
            setShowonDesktop(prev => !prev)
          }}
          className="cursor-pointer"
        >
          {notifications.length ? (
            <VscBellDot className="text-xl lg:text-2xl " />
          ) : (
            <LuBell className="text-xl lg:text-2xl" />
          )}
        </div>

        {showonDesktop && (
          <div className="hidden lg:block absolute z-50 w-1/4 h-[50vh] top-[50px] right-[110px] bg-white rounded-xl shadow-xl border border-gray-400 overflow-hidden">

            <div className="flex justify-between border-b border-gray-300 p-3">
              <h1 className="text-sm font-semibold lg:text-lg">Notifications</h1>
              <button onClick={() => setShowonDesktop(false)}>
                <RxCross2 className="text-gray-500" />
              </button>
            </div>

            {loading ? "loading..." :
              <div className="p-2 overflow-y-auto h-full">
                {notifications.length ? (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-3 mb-2 rounded-lg bg-blue-50 text-sm"
                    >
                      <p>{n.message}</p>
                      <p
                        className="font-semibold underline cursor-pointer"
                        onClick={() => handleAccept(n.token)}
                      >
                        Click here to join
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No notifications</p>
                )}
              </div>
            }
          </div>
        )}


        {showNotification && (
          <div className="fixed lg:hidden inset-0 lg:inset-x-0 lg:top-[68.67px] lg:bottom-0 z-50 flex justify-center items-start bg-black/50 lg:justify-end">

            <div className="bg-white w-[95vw] h-[50vh] rounded-md flex flex-col lg:top-[68.67px] lg:w-1/4">

              <div className="flex justify-between border-b border-gray-300 p-3">
                <div><h1 className="text-xl font-semibold">Notifications</h1></div>
                <button onClick={() => setShowNotification(false)}><RxCross2 className="text-gray-500" /></button>
              </div>

             {loading ? "loading..." : 
              <div className="p-2 overflow-y-auto">

                {notifications?.length ?
                  (
                    notifications.map((n, i) => (
                      <div
                        key={i}
                        className="p-3 mb-2 rounded-lg bg-blue-50 text-sm flex gap-x-1"
                      >
                        <div>
                          <p> {n.message}</p>
                          <p className="font-semibold underline"
                            onClick={() => handleAccept(n.token)}>Click here to join</p>

                          <p className="text-xs text-gray-500 mt-2">{timeAgo(n.createdAt)}</p>
                        </div>

                        <div className="text-blue-500"><GoDotFill /></div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 ">
                      No notifications
                    </p>
                  )}

              </div>
             }

            </div>
          </div>
        )}

        <div className="rounded-full"
          onClick={() => navigate("/profile")}
        >
          <img className="w-7 h-7 rounded-full lg:h-9 lg:w-9" src={user?.avatar}></img>
        </div>

      </div>

    </div>
  )
}

export default Navbar