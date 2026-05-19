import { FaArrowLeft } from "react-icons/fa";
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import axios from "../api/axios"

const Profile = () => {

  const { user, setUser } = useContext(UserContext)

  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [logoutError, setLogoutError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [logout, setLogout] = useState(false)

  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })


  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.fullName.firstName || "",
        lastName: user.fullName.lastName || "",
        email: user.email || ""
      })
    }
  }, [user])


  const handleChange = (e) => {

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      setUpdating(true)
      setUpdateError(null)
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/update`, {

        firstName: form.firstName,
        lastName: form.lastName

      },
        // { withCredentials: true }
      )

      setUser(res.data.updatedUser)
      navigate("/dashboard")

    } catch (err) {
      console.log(err)
      setUpdateError(err.response?.data?.message || "Failed to update")
    } finally {
      setUpdating(false)
    }

  }

  const logoutHandler = async () => {

    try {
      setLogoutError(null)
      setLogout(true)
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {},
        // { withCredentials: true }
      )
      setUser(null)
      localStorage.removeItem("token");
      navigate("/")

    } catch (err) {
      console.log(err)
      setLogoutError(err.response?.data?.message || "Failed to Logout")
    } finally {
      setLogout(false)
    }

  }

  return (


    <div className="flex justify-center items-center w-full bg-gray-50">


      <div className="w-full px-4 py-2 lg:w-1/4 lg:bg-white lg:shadow-md lg:rounded-2xl">
        <div className="flex items-center justify-center">
          <img className="rounded-full h-20 w-20 lg:h-25 lg:w-25"
            src={user?.avatar}></img>
        </div>

        <form className="flex flex-col gap-y-2 mt-3"
          onSubmit={handleSubmit}>

          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 lg:text-sm">First Name</label>
            <input className="border border-gray-300 p-2 rounded-sm text-sm outline-none "
              required
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            ></input>

          </div>

          <div className="flex flex-col ">
            <label className="text-xs font-semibold mb-1 lg:text-sm">Last Name</label>
            <input className="border border-gray-300 p-2 rounded-sm text-sm outline-none "
              required
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            ></input>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 lg:text-sm">Email</label>
            <input className="border border-gray-200 bg-gray-100 p-2 rounded-sm text-sm outline-none  cursor-not-allowed"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled
            ></input>
          </div>

          {updateError && (
            <p className="text-red-600 text-center text-xs mt-2">{updateError}</p>
          )}

          {/* <button className="bg-white border border-gray-300 px-2 py-1 rounded-sm text-black">Cancel</button> */}
          <button className="bg-black p-2 rounded-sm text-sm text-white mt-3 hover:shadow-lg"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>

        </form>

        <button className="bg-red-700 p-2 rounded-sm text-sm text-white mt-2 w-full hover:shadow-lg"
          onClick={() => {
            logoutHandler
            setShowConfirm(true)
          }}
        >Log Out</button>

      </div>



      {showConfirm && (
        <div className="fixed inset-0 z-30 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-4 rounded-md w-60">
            <h2 className="font-semibold text-lg">Do you want to log out</h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>

            {logoutError && (
              <p className="text-red-600 text-center text-xs mt-2">{logoutError}</p>
            )}

            <div className="flex justify-end gap-2 mt-4 w-full">
              <button
                onClick={() => {
                  setShowConfirm(false)
                }}
                className="px-3 py-1 border rounded-md w-1/2 "
              >
                Cancel
              </button>


              <button
                className="px-3 py-1 bg-red-700 text-white rounded-md w-1/2"
                onClick={logoutHandler}
              >
                {logout ? "..." : "Log Out"}
              </button>
            </div>
          </div>

        </div>
      )
      }

    </div>

  )
}

export default Profile