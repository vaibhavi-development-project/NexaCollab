import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import axios from "../api/axios"

const Task = () => {

  const { workspaceId } = useParams()


  const [submit, setSubmit] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [fetchError, setFetchError] = useState(null)


  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Todo")
  const [assign, setAssign] = useState("")
  const [priority, setPriority] = useState("High")


  const fetchTasks = async () => {
    try {
      setFetchError(null)
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/tasks`,
        //  { withCredentials: true }
        )
      console.log(res)
      setTasks(res.data.tasks)
    } catch (err) {
      console.log(err)
      setFetchError(err.response?.data?.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      setSubmit(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/task`, {
        title,
        description,
        status,
        assignToMember: assign,
        priority
      }, 
      // { withCredentials: true }
    )

      setTasks(prev => [res.data.task, ...prev])

      setTitle("")
      setDescription("")
      setStatus("Todo")
      setAssign("")
      setPriority("High")

      setShowForm(false)

    } catch (err) {
      console.log(err)
      setCreateError(err.response?.data?.message || "Failed to create task")

    } finally {
      setSubmit(false)
    }
  }

  const handleDelete = async (taskId) => {

    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/task/${taskId}`, 
        // { withCredentials: true }
      )
      console.log(res)

      setTasks(prev => prev.filter(task => task._id !== taskId))


      setShowConfirm(false)

    } catch (err) {
      console.log(err)
      setDeleteError(err.response?.data?.message || "Failed to delete")

    }

  }


  return (
    <div className='p-5  min-h-full w-full lg:px-10 bg-gray-50'>

      <div className={showForm || showConfirm ? "pointer-events-none select-none" : ""}>

        <div className="lg:flex justify-between ">
          <h1 className="text-xl font-semibold lg:text-2xl">Tasks</h1>
          <button className="w-full bg-gray-950 text-white p-2 rounded-md mt-2 lg:w-1/4 hover hover:shadow-lg duration-150"
            onClick={() => {
              setShowForm(true)
              setCreateError(null)
            }}
          >+ New Task</button>
        </div>

        {fetchError && (
          <p className="text-red-600 text-xs mt-5 text-center">{fetchError}</p>
        )}

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : tasks.length === 0 && !fetchError ?
          <div className="text-gray-600 text-center mt-5">
            <p className="font-semibold text-lg lg:text-2xl">No Tasks yet</p>
            <p className="text-sm mt-1 lg:text-lg">Create Your first Task</p>
          </div> :
          <div className="grid grid-cols-1 gap-4 mt-10 lg:grid-cols-3 lg:min-h-[250px]">
            {tasks.map(task => (
              <div className={`flex flex-col border lg:justify-start border-gray-300 px-2 py-4 rounded-lg hover hover:shadow-md ${task.status === "Todo" ? "bg-red-100 hover:border hover:border-red-500" : task.status === "In Progress" ? "bg-blue-100 hover:border hover:border-blue-500" : "bg-green-100 hover:border-green-500"}`}
                key={task._id}
                onClick={() => navigate(`/workspaces/${workspaceId}/${task._id}/Viewtask`)}>
                <div className="mb-2 flex justify-between">
                  <h1 className="text-sm lg:text-lg">{task.status}</h1>
                  <button onClick={(e) => {
                    e.stopPropagation()
                    setShowConfirm(true)
                    setDeleteId(task._id)
                    setDeleteError(null)
                  }}><RiDeleteBinLine className="text-red-700 lg:text-lg hover hover:text-xl" /></button>
                </div>

                <div className="bg-white py-2 px-4 rounded-lg border border-gray-200 shadow-sm mb-5 ">
                  <div>
                    <h1 className="text-md mb-1 font-semibold ">{task.title}</h1>
                    <p className="text-xs text-gray-500 mb-2  lg:text-sm">{task.description}</p>
                  </div>

                  <h1 className="bg-red-50 border border-red-300 inline-block px-2 py-0.5 rounded-lg text-xs text-red-600 lg:text-sm">{task.priority}</h1>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex justify-center items-center">

          <div className="bg-white p-4 rounded-md w-60 min-h-50vh">
            <h2 className="font-semibold text-lg">Delete Document</h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-red-600 text-xs text-center mt-4">{deleteError}</p>
            )}

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
                Delete
              </button>
            </div>
          </div>

        </div>
      )
      }

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">

          <div className="relative flex flex-col px-4 py-2 bg-white w-[95vw] h-[95vh] rounded-lg lg:rounded-2xl lg:h-[80vh] lg:w-[50vw]">
            <h1 className="text-xl font-semibold text-center mb-5 lg:mb-0 lg:text-2xl lg:p-2 ">Create New Task</h1>

            <button
              onClick={() => {
                setCreateError(null)
                setShowForm(false)
              }}

            >
              <RxCross2 className="absolute top-3 right-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md lg:text-xl" />
            </button>



            <form className="flex flex-col gap-y-2 flex-1 lg:gap-y-3 lg:overflow-y-auto lg:mt-4 lg:px-2 lg:border-t border-gray-300"
              onSubmit={handleSubmit}>

              <div className="flex flex-col">
                <label className="text-xs lg:text-sm font-semibold lg:mt-4">Title</label>
                <input className='w-full text-sm outline-none bg-gray-50 border px-2 py-1 border-gray-300 rounded-lg mb-2 lg:p-3'
                  placeholder='title'
                  type="text"
                  disabled={submit}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>

              <div className="flex flex-col ">
                <label className="text-xs lg:text-sm font-semibold">Description</label>
                <textarea
                  className="w-full text-sm outline-none bg-gray-50 border px-2 py-1 border-gray-300 rounded-lg  lg:p-3"
                  placeholder='brief description about task'
                  type="text"
                  disabled={submit}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs lg:text-sm font-semibold ">Status</label>

                <select className="text-sm px-2 py-1 bg-gray-50 rounded-md border border-gray-300   lg:p-3"
                  value={status}
                  disabled={submit}
                  onChange={(e) => setStatus(e.target.value)}>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs lg:text-sm font-semibold ">Priority</label>

                <select className="text-sm px-2 py-1 bg-gray-50 rounded-md border border-gray-300  lg:p-3"
                  value={priority}
                  disabled={submit}
                  onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>

              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs lg:text-sm font-semibold mb-1 ">Assign to</label>

                <input className='w-full text-sm outline-none bg-gray-50 border px-2 py-1 border-gray-300 rounded-lg mb-2  lg:p-3'
                  placeholder='assign to email'
                  type="text"
                  value={assign}
                  disabled={submit}
                  onChange={(e) => setAssign(e.target.value)}
                ></input>
              </div>

              {createError && (
                <p className="text-red-500 mt-2 text-xs lg:text-sm text-center">{createError}</p>
              )}

              <div className="flex gap-x-1  mt-1 lg:mb-2 lg:gap-x-3">
                <button className="px-2  py-1 w-full bg-white border border-gray-400 rounded-md lg:rounded-xl lg:p-3
                hover:bg-gray-100 hover:border hover:border-gray-700"
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setCreateError(null)
                  }}
                >Cancel</button>
                <button className=" px-2  py-1 w-full bg-gray-950 text-white rounded-md  lg:p-3 lg:rounded-xl"
                  type="submit"
                >
                  {submit ? "Creating task..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  )
}

export default Task