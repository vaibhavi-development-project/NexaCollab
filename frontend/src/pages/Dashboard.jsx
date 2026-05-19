import { useState, useContext, useEffect } from "react"
import { MdOutlineTask } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import { AiOutlineTeam } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import axios from "../api/axios"
import { useNavigate } from "react-router-dom";
import socket from "../Socket";
import { UserContext } from "../context/UserContext";


const Dashboard = () => {

  const { user, loading } = useContext(UserContext)

  const [deleteError, setDeleteError] = useState(null)
  const [error, setError] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const [deleting, setDeleting] = useState(false)
  const [submit, setSubmit] = useState(false)

  const [workspaces, setWorkspaces] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

   const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const navigate = useNavigate()


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


 
  console.log("user:", user)


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      setSubmit(true)

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/workspace`, {
        name,
        description,
      }, 
      // { withCredentials: true }
      )

      setName("")
      setDescription("")
      setShowForm(false)

    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to submit")

    } finally {
      setSubmit(false)
    }
  }


  const handleDelete = async (workspaceId) => {

    try {

      setDeleting(true)
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}`, 
        // { withCredentials: true }
      )

      setWorkspaces(prev =>
        prev.filter(ws => ws.workspaceId._id !== workspaceId)
      )

      setOpenMenuId(null)
      setShowConfirm(false)

    } catch (err) {
      console.log(err)
      setDeleteError(err.response?.data?.message || "Failed to Delete")

    } finally {
      setDeleting(false)
    }
  }

  const fetchWorkspaces = async () => {

    try {

      setFetchError(null)
      setFetchLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces`, 
        // { withCredentials: true }
      )
      console.log(res)
      setWorkspaces(res.data.workspaces)

    } catch (err) {
      console.log(err)
      setFetchError(err.response?.data?.message || "Failed to fetch workspaces")

    } finally {
      setFetchLoading(false)
    } 
 }

  useEffect(() => {

    fetchWorkspaces()

    socket.on("workspaceAdded", fetchWorkspaces)

    return () => {
      socket.off("workspaceAdded", fetchWorkspaces)
    }
  }, [])


  useEffect(() => {
    if (!loading && !user) {
      navigate("/")
    }
  }, [user, loading])

  return (

    <div className=" px-5 py-5 w-full lg:px-10 lg:py-10 bg-gray-50">

     
      
      <div className={showForm || showConfirm ? "pointer-events-none select-none" : ""}>
        <div className=" py-5 lg:flex justify-between items-center">
          <div className="flex flex-col justify-between mb-5">
            <h1 className="font-semibold text-2xl lg:text-2xl">Workspaces</h1>
            <p className="text-md mt-1 text-gray-500 lg:text-lg">Manage your projects and collaborate with your team</p>
          </div>

          <button className="text-sm bg-gray-900 text-white py-2 rounded-md w-full lg:w-1/4 lg:text-lg"
            onClick={() => {
              setShowForm(true)
              setError(null)
            }
            }
          >+ New Workspace</button>
        </div>


        {fetchError && (
          <p className="text-red-500 text-xs mt-4 text-center">{fetchError}</p>
        )}


        {fetchLoading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : workspaces.length === 0 && !fetchError ? (
          <div className="text-gray-600 text-center mt-5">
            <p className="font-semibold text-lg">No Workspace yet</p>
            <p className="text-sm mt-1">Create Your first Workspace</p>
          </div>
        ) :
          <div className="grid grid-cols-1 gap-4 mt-5 lg:grid lg:grid-cols-4">

            {workspaces.map(ws => (

              <div className="flex flex-col bg-white p-4 border border-gray-500 shadow-sm rounded-lg hover:border-2 hover:border-gray-700"
                key={ws._id}
                onClick={() => navigate(`/workspaces/${ws.workspaceId._id}`)}
              >
                <div className="border-b border-gray-200 flex lg:flex-1">
                  <div className="flex flex-row justify-between w-full ">
                    <div className="">
                      <h1 className="font-semibold lg:text-lg">{ws.workspaceId.name}</h1>
                      <p className="mb-5 text-xs text-gray-600 lg:text-sm">{ws.workspaceId.description}</p>
                    </div>

                    <div className="text-sm relative">
                      <CiMenuKebab onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(
                          openMenuId === ws.workspaceId._id ? null : ws.workspaceId._id
                        )
                      }}

                      />
                      {openMenuId === ws.workspaceId._id && (

                        <div className="absolute z-30  rounded-md border border-gray-300 bg-white shadow-lg right-2 flex flex-col text-xs top-3 font-semibold">

                          <button className="px-3 py-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteId(ws.workspaceId._id)
                              setShowConfirm(true)
                              setDeleteError(null)
                            }
                            }
                          >Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-x-10 mt-5">


                  <div className="flex flex-col jutify-center items-center">
                    <MdOutlineTask className="text-sm" />
                    <p className="text-gray-500 text-xs mt-1 lg:font-semibold">Tasks</p>
                  </div>

                  <div className="flex flex-col jutify-center items-center">
                    <GrDocumentText className="text-sm" />
                    <p className="text-gray-500 text-xs mt-1 lg:font-semibold">Docs</p>
                  </div>

                  <div className="flex flex-col jutify-center items-center">
                    <AiOutlineTeam className="text-sm" />
                    <p className="text-gray-500 text-xs mt-1 lg:font-semibold">Members</p>
                  </div>

                </div>

                <div className="text-xs text-gray-800 mt-5  ">
                  {`Created- ${timeAgo(ws.createdAt)}`}
                </div>

              </div>

            ))}
          </div>
        }
      </div>
      

      {showConfirm && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex justify-center items-center">

          <div className="bg-white p-4 rounded-md w-60">
            <h2 className="font-semibold text-lg">Delete Document</h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>

            {deleteError ? <p className="text-red-500 text-xs mt-5">{deleteError}</p> : ""}
            <div className="flex justify-end gap-2 mt-4 w-full">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setDeleteError(null)
                }}
                className="px-3 py-1 border rounded-md w-1/2 "
              >
                Cancel
              </button>


              <button
                onClick={() => {
                  handleDelete(deleteId)
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-md w-1/2"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

        </div>
      )
      }

      {showForm && (
        <div className="fixed inset-0 z-30 bg-black/40 flex justify-center items-center">

          <div className="flex flex-col px-4 py-2 bg-white w-[90vw] min-h-[50vh] rounded-lg items-center justify-center gap-y-5 lg:w-1/4">


            <div className="">
              <h1 className="text-2xl font-semibold text-center">Create New Workspace</h1>
            </div>

            <form className="flex flex-col gap-y-3 w-full"
              onSubmit={handleSubmit}>

              <div className="flex flex-col gap-1">
                <label className="hidden lg:block text-sm font-semibold">Workspace Name</label>
                <input className="text-sm p-2 bg-gray-100 border border-gray-400 outline-0 rounded"
                  placeholder='e.g., Project 1'
                  required
                  type="text"
                  value={name}
                  disabled={submit}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="hidden lg:block text-sm font-semibold">Description</label>
                <textarea className="text-sm p-2 bg-gray-100  border border-gray-400 outline-0 rounded"
                  placeholder='Brief description of the workspace'
                  required
                  type="text"
                  disabled={submit}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error ? <p className="text-red-500 text-xs">{error}</p> : ("")}

              <div className="flex justify-between gap-x-3">
                <button className="bg-white text-black  px-2 py-1 rounded-sm border border-gray-300 w-1/2 hover:bg-gray-100 hover:border-gray-700"
                  onClick={() => {
                    setShowForm(false)
                    setError(null)
                  }}
                  type="button"
                >Cancel</button>

                <button className="bg-black text-white px-2 py-1 rounded-sm w-1/2"
                  type="submit"
                >
                  {submit ? "Creating..." : "Create"}
                </button>
              </div>

            </form>
          </div>



        </div>
      )}

    </div>

  )
}

export default Dashboard