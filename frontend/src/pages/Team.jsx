import { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom";
import { BsPersonPlus } from "react-icons/bs";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { FiShield } from "react-icons/fi";
import axios from "../api/axios"
import socket from "../Socket";
import { UserContext } from "../context/UserContext";


const Team = () => {


  const { workspaceId } = useParams()
  const { user } = useContext(UserContext)

  const [team, setTeam] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [Email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const [fetchError, setFetchError] = useState(null)
  const [submitError, setSubmitError] = useState(null)


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

  const fetchTeamMembers = async () => {

    try {
      setLoading(true)
      setFetchError(null)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/team`, 
        // { withCredentials: true }
      )

      setTeam(res.data.teamMember)
    } catch (err) {
      console.log(err)
      setFetchError(err.response?.data?.message || "Failed to get team members.Try again!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()

    socket.on("roleChanged", fetchTeamMembers)

    return () => socket.off("roleChanged", fetchTeamMembers)
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSending(true)
      setSubmitError(null)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/invite`, {
        email: Email,
        role
      }, 
      // { withCredentials: true }
    )
      console.log(res)
      setEmail("")
      setRole("")
      setShowForm(false)

    } catch (err) {
      console.log(err)
      setSubmitError(err.response?.data?.message || "Failed to send Invite.Try again!")
    } finally {
      setSending(false)
    }
  }


  return (

    <>
      <div className={` w-full p-5 flex flex-col border-b border-gray-400 overflow-y-auto lg:px-10 bg-gray-50
          ${showForm ? "pointer-events-none select-none" : ""}`}>

        <div className='lg:flex justify-between'>
          <div>
            <h1 className='text-xl font-semibold lg:text-2xl'>Team Members</h1>
            <p className='text-gray-600 text-sm mt-1 lg:text-sm'  >Number of members</p>
          </div>

          <div className='flex justify-center mt-5 '>
            <button className='bg-gray-900 text-white py-2 rounded-md text-md w-full flex items-center justify-center gap-x-2 lg:px-4 lg:py-2 hover:shadow-lg'
              onClick={() => {
                setShowForm(true)
                setSubmitError(null)
              }}
            ><BsPersonPlus />Invite Member</button>
          </div>

        </div>

        {fetchError && (
          <p className="text-red-600 text-center text-xs mt-5">{fetchError}</p>
        )}


        {loading ?
          <p className="text-center mt-5 mb-5">Loading...</p> :

          <div className="border border-gray-300 mt-5 rounded-lg p-2 lg:grid grid-cols-2 gap-x-4 lg:mt-10">

            {team.map(member => (
              <div className="p-4 border border-gray-300 justify-between bg-white mt-2 rounded-md hover:border hover:border-gray-800"
                key={member._id}>

                <div className="lg:flex justify-between">
                  <div className="flex gap-x-2 items-center">
                    <div className="">
                      <img className="h-8 w-8 rounded-full lg:h-10 lg:w-10"
                        src={`${member.userId.avatar}`}></img>
                    </div>

                    <div>

                      <div className="flex gap-x-3 items-center">
                        <h1 className="font-semibold lg:text-lg">{member.userId.fullName.firstName} {member.userId.fullName.lastName}</h1>
                        {user && member.userId._id === user._id ? (<p className="bg-blue-50 text-xs text-blue-700 border border-blue-200 rounded-lg font-semibold px-2 py-1">You</p>) : ""}
                      </div>

                      <p className="text-xs text-gray-700  font-semibold">{member.userId.email}</p>
                      <p className="text-xs mt-1 text-gray-500">{`Joined- ${timeAgo(member.createdAt)}`}</p>
                    </div>

                  </div>



                  <div className="">
                    <h1 className="text-xs bg-gray-200 border border-gray-200 py-1 px-2 rounded-md inline-block font-semibold">{member.role}</h1>
                  </div>

                </div>


              </div>
            )

            )}
          </div>

        }

        <div className="border border-gray-300 flex flex-col p-2 gap-y-2 rounded-md mt-10 ">
          <div className="p-3 flex items-center gap-x-1">
            <FiShield className="text-lg" />
            <h1 className="font-semibold text-center text-lg">Role Permissions</h1>
          </div>

          <div className="flex flex-col gap-y-2 lg:grid grid-cols-3 gap-x-4">
            <div className="bg-white p-2 rounded-lg border border-gray-300">
              <h1 className="font-semibold text-xs px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg inline-block">Owner</h1>
              <p className="text-xs text-gray-900 mt-1">Full workspace control, can delete workspace, invite members, and manage all settings.</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-gray-300 ">
              <h1 className="font-semibold text-xs  px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg inline-block">Admin</h1>
              <p className="text-xs text-gray-900 mt-1" >Access to full workspace control, deleting workspace and inviting member is forbidden.</p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-gray-300">
              <h1 className="font-semibold text-xs  px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg inline-block">Member</h1>
              <p className="text-xs text-gray-900 mt-1">Read-only access to all workspace content.</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50  flex justify-center items-center bg-black/50">

          <div className="bg-white h-[95vh] w-[90vw] rounded-2xl lg:w-1/3 lg:h-[80vh] flex flex-col p-2">

            <div className="border-b border-gray-300 p-4 flex justify-between">
              <h1 className="text-lg font-semibold lg:text-xl">Invite Team Members</h1>
              <button onClick={() => setShowForm(false)}><RxCross2 className="text-gray-500 lg:text-lg hover:text-xl" /></button>
            </div>

            <form className="flex flex-col gap-y-3 p-2 lg:p-5 overflow-y-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col mt-2">
                <label className="text-xs font-semibold lg:text-sm">Email Address</label>
                <input className="text-sm p-2 bg-gray-50 border border-gray-400 outline-0 rounded-lg mt-1  "
                  placeholder='Email'
                  required
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-600 mt-1">Send an invitation email to join this workspace</p>

              </div>


              <div className="flex flex-col gap-y-2">
                <h1 className="text-sm font-semibold ">Role</h1>
                {/* MEMBER */}
                <label className="flex items-start gap-x-3 cursor-pointer border-2 border-gray-200 p-4 rounded-2xl hover:border-gray-300">
                  <input
                    type="radio"
                    name="role"
                    value="Member"
                    checked={role === "Member"}
                    onChange={() => setRole("Member")}
                    className="mt-1"
                  />

                  <div>
                    <div className="flex items-center gap-x-1 font-medium ">
                      <span className="text-xs bg-gray-100 px-2 py-1  flex items-center gap-x-1 font-medium rounded-lg border border-gray-400 "><AiOutlineTeam />Member</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-600">
                      Read only access to all workspace content
                    </p>
                  </div>
                </label>

                {/* ADMIN */}
                <label className="flex items-start gap-x-3 cursor-pointer border-2 border-gray-200 p-4 rounded-2xl
                hover:border-gray-300">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={() => setRole("Admin")}
                    className="mt-1"
                  />

                  <div>
                    <div className="flex items-center gap-x-1 font-medium ">
                      <span className="text-xs bg-gray-100 px-2 py-1  flex items-center gap-x-1 font-medium rounded-lg border border-gray-400 "><MdOutlineAdminPanelSettings />Admin</span>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">
                      Access to all content except invitation and deletion of workspace
                    </p>
                  </div>
                </label>
              </div>



              {submitError && (
                <p className="text-red-600 text-center mt-2 text-xs">{submitError}</p>
              )}


              <div className="flex justify-between items-center py-2 gap-x-3">

                <button className="bg-white p-2 border border-gray-300 rounded-lg w-full hover hover:bg-gray-100 hover:border hover:border-gray-500"
                  onClick={() => {
                    setShowForm(false)
                    setSubmitError(null)
                  }}
                >Cancel</button>
                <button className="bg-black text-white p-2  rounded-lg w-full"
                >
                  {sending ? "Sending..." : "Send Invite"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  )


}

export default Team