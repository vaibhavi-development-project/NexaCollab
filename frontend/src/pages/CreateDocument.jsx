import { useState, useEffect } from "react"
import axios from "../api/axios"
import { useParams, useNavigate } from "react-router-dom"


const CreateDocument = () => {

    const { workspaceId } = useParams()
    const [submit, setSubmit] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSubmit(true)
            setSubmitError(null)
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents`, {
                title,
                content
            }, 
            // { withCredentials: true }
        )

            console.log(res)
            navigate(`/workspaces/${workspaceId}/documents`)
        } catch (err) {
            console.log(err)
            setSubmitError(err.response?.data?.message || "Failed to submit")
        } finally {
            setSubmit(false)
        }

    }

    return (
        <div className="w-full lg:p-5 flex justify-center bg-gray-50">
            <div className="lg:w-2/3 items-center">
                <div className="lg:flex w-full justify-between hidden px-2">
                    <h1 className="text-center text-xl font-semibold lg:text-2xl ">Create Document</h1>
                    <div className="hidden lg:flex flex-row gap-x-2  mt-1 w-min-w-md ">
                        <button className="px-2 py-1 w-full bg-white border border-gray-400 rounded-md lg:px-2 hover:bg-gray-100hover:border-gray-400"
                            type="button"
                            onClick={() => navigate(`/workspaces/${workspaceId}/documents`)}
                        >Cancel</button>
                        <button className=" px-2  py-1 w-full bg-gray-950 text-white rounded-md lg:px-2 hover:shadow-lg"
                            type="submit" onClick={handleSubmit}
                        >
                            {submit ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>
                <h1 className="text-center text-xl font-semibold lg:text-2xl lg:hidden">Create Document</h1>
                <form className='p-2 mt-2 w-full'
                    onSubmit={handleSubmit}>

                    <input className='w-full outline-none bg-white border-2 p-2 border-gray-300 rounded-lg mb-2'
                        placeholder='title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    ></input>


                    <textarea
                        className="w-full outline-none h-[60vh] bg-white border-2 p-2 border-gray-300 rounded-lg"
                        placeholder='content'
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    {submitError && (
                        <p className="text-red-600 mt-2 text-xs text-center mb-2">{submitError}</p>
                    )}

                    <div className="flex gap-x-1  mt-1 lg:hidden">
                        <button className="px-2 py-1 w-full bg-white border border-gray-400 rounded-md lg:p-3"
                            type="button"
                            onClick={() => navigate(`/workspaces/${workspaceId}/documents`)}
                        >Cancel</button>
                        <button className=" px-2  py-1 w-full bg-gray-950 text-white rounded-md lg:p-3"
                            type="submit"
                        >
                            {submit ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )

}

export default CreateDocument