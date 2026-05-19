import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"

const ViewTask = () => {

  const [updating, setUpdating] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "Todo",
    assignToMember: ""
  })  

  const navigate = useNavigate()

  const { taskId, workspaceId } = useParams()

  const fetchTask = async () => {
    try {

      setFetchError(null)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/task/${taskId}`, 
        // { withCredentials: true }
      )
      console.log("fetched", res.data.task)

      setTask({
        title: res.data.task.title,
        description: res.data.task.description,
        priority: res.data.task.priority,
        status: res.data.task.status,
        assignToMember: res.data.task.assignTo?.email || ""
      })

    } catch (err) {
      console.log(err)
      setFetchError(err.response?.data?.message || "Failed to get Task details")
    }
  }

  useEffect(() => {
    fetchTask()
  }, [])

  const handleChange = (e) => {

    const { name, value } = e.target
    setTask(prev => ({
      ...prev,
      [name]: value
    })
    )

  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    try {
      setSubmitError(null)
      setUpdating(true)
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/task/${taskId}`,

        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignToMember: task.assignToMember
        },
        // { withCredentials: true }
      )

      navigate(`/workspaces/${workspaceId}/task`)

    } catch (err) {
      console.log(err)
      setSubmitError(err.response?.data?.message || "Failed to Update")

    } finally {
      setUpdating(false)
    }
  }


  return (

    <div className="h-[calc(100vh-60px)] w-full px-2 flex items-center justify-center lg:bg-gray-50">
      <div className="flex flex-col px-4 py-2 bg-white rounded-lg w-full lg:w-[50vw] h-[80vh] lg:p-0 lg:rounded-2xl lg:shadow-md lg:border border-gray-300">

        <h1 className="text-xl font-semibold text-center mb-2 lg:text-2xl lg:mt-2 lg:p-3">Task Details</h1>
        {fetchError ? (
          <p className="text-red-600 text-center mb-2 mt-2">{fetchError}</p>
        ) : <form className="flex flex-col gap-y-2 lg:p-4 lg:overflow-y-auto lg:border-t border-gray-300"
          onSubmit={handleSubmit}
        >

          <div className="flex flex-col">
            <label className="text-xs lg:text-sm font-semibold">Title</label>
            <input className='w-full text-sm outline-none bg-gray-50 border px-2 py-1 lg:p-3 border-gray-300 rounded-lg mb-2'
              placeholder='title'
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
            ></input>
          </div>

          <div className="flex flex-col ">
            <label className="text-xs lg:text-sm font-semibold">Description</label>
            <textarea
              className="w-full text-sm outline-none bg-gray-50 border px-2 py-1 lg:p-3 border-gray-300 rounded-lg"
              placeholder='brief description about task'
              type="text"
              name="description"
              value={task.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-xs lg:text-sm font-semibold ">Status</label>

            <select className="text-sm px-2 py-1 lg:p-3 bg-gray-50 rounded-md border border-gray-300 "
              value={task.status}
              name="status"
              onChange={handleChange}><option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

          </div>

          <div className="flex flex-col flex-1">
            <label className="text-xs lg:text-sm font-semibold ">Priority</label>

            <select className="text-sm px-2 py-1 lg:p-3 bg-gray-50 rounded-md border border-gray-300"
              value={task.priority}
              name="priority"
              onChange={handleChange}  > <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>

          </div>

          <div className="flex flex-col flex-1">
            <label className="text-xs lg:text-sm font-semibold">Assigned to</label>

            <input className='w-full text-sm outline-none bg-gray-50 border px-2 py-1 lg:p-3 border-gray-300 rounded-lg mb-2'
              type="text"
              name="assignToMember"
              value={task.assignToMember}
              onChange={handleChange}
            ></input>
          </div>

          {submitError && (
            <p className="text-red-600 text-xs lg:text-sm text-center">{submitError}</p>
          )}

          <div className="flex gap-x-2  mt-1">
            <button className="px-2  py-1 w-full bg-white border border-gray-400 rounded-md lg:p-3 hover:bg-gray-100 hover:border-gray-600"
              type="button"
              onClick={() => navigate(`/workspaces/${workspaceId}/task`)}
            >Cancel</button>
            <button className=" px-2  py-1 w-full bg-gray-950 text-white rounded-md lg:p-3"
              type="submit"
            >
              {updating ? "updating..." : "Save Changes"}
            </button>
          </div>
        </form>}


      </div>
    </div>
  )
}

export default ViewTask