import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from "../api/axios"
import { WiStars } from "react-icons/wi";


const ViewDoc = () => {

    const [document, setDocument] = useState({
        title: "",
        content: ""
    })
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [summaryError, setSummaryError] = useState(null)
    const [fetchError, setFetchError] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [AISummary, setAISummary] = useState("")

    const { docId, workspaceId } = useParams()

const fetchDocument = async () => {
    try {
        setFetchError(null);

        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents/${docId}`
        );

        const doc = res.data.document;

        setDocument({
            title: doc?.title || "",
            content: doc?.content || ""
        });

    } catch (err) {
        console.log(err);
        setFetchError(err.response?.data?.message || "Failed to get details");
    }
};

useEffect(() => {
    fetchDocument()
}, [])

    // const fetchDocument = async () => {
    //     try {
    //         setFetchError(null)
    //         const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents/${docId}`, 
    //             // { withCredentials: true }

    //         )
    //         setDocument(res.data.document)
    //     } catch (err) {
    //         console.log(err)
    //         setFetchError(err.response?.data?.message || "Failed to get details of document.Try again later!")
    //     }
    // }

    // useEffect(() => {
    //     fetchDocument()
    // }, [])


    const handleChange = (e) => {
        const { name, value } = e.target

        setDocument((prev) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }


    const handleSubmit = async (e) => {

        e.preventDefault()
        try {
            setSubmitError(null)
            setSubmitting(true)
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents/${docId}`, {
                title: document.title,
                content: document.content
            }, 
            // { withCredentials: true }
        )
            console.log(res)
            navigate(`/workspaces/${workspaceId}/documents`)

        } catch (err) {
            console.log(err)
            setSubmitError(err.response?.data?.message || "Failed to Update")
        } finally {
            setSubmitting(false)
        }
    }


    const getSummary = async () => {

        setIsLoading(true)

        try {
            setSummaryError(null)
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents/${docId}/summary`, 
                // { withCredentials: true }
            )
            console.log(res)
            setAISummary(res.data.response)

        } catch (err) {
            console.log(err)
            setSummaryError(err.response?.data?.message || "Failed to get Summary.Try again later!")
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className='px-4 py-2  flex flex-col w-full justify-center items-center bg-gray-50'>

            <div className='mt-3 lg:w-2/3'>
                {fetchError ? <p className='text-red-600 text-center mt-5'>{fetchError}</p> :

                    <form className=''
                        onSubmit={handleSubmit}>
                        <div className='flex px-2 mb-3 justify-between'>
                            <input className='w-1/2 outline-none text-xl font-semibold lg:text-2xl'
                                placeholder='title'
                                value={document.title}
                                name="title"
                                type="text"
                                onChange={handleChange}
                            ></input>

                            <button className=" font-semibold  text-purple-700 text-sm flex border border-purple-300 w-1/2 rounded-md px-2 py-1 justify-center lg:w-auto lg:p-2 hover:bg-purple-100"
                                type="button"
                                onClick={getSummary}>
                                <WiStars className="text-xl" />{isLoading ? "Summarizing..." : "AI Summarize"}</button>

                        </div>

                        {AISummary && (
                            <div className="mt-3 p-3 border border-purple-200 bg-purple-50 rounded-md mb-3 ">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Summary:</span> {AISummary}
                                </p>
                            </div>
                        )}


                        {summaryError && (
                            <p className='text-red-600 text-xs text-center mb-2'>{summaryError}</p>
                        )}

                        <textarea
                            className="w-full outline-none h-[60vh] bg-white border-2 p-2 border-gray-300 rounded-lg"
                            placeholder='content'
                            name="content"
                            type="text"
                            value={document.content}
                            onChange={handleChange}
                        ></textarea>

                        {submitError && (
                            <p className='text-red-600 text-xs text-center mt-2 mb-1'>{submitError}</p>
                        )}


                        <div className='flex gap-x-2'>
                            <button className="border  px-2  py-1 rounded-sm w-full border-gray-300 mt-1 hover:bg-gray-100 hover:border hover:border-gray-600"
                                type="button"
                                onClick={() => navigate(`/workspaces/${workspaceId}/documents`)}
                            >Cancel</button>

                            <button className="border  px-2  py-1 rounded-sm w-full border-gray-300 mt-1 hover:bg-gray-950 hover:text-white duration-200 lg:p-2"
                                type="submit"
                            >
                                {submitting ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>}
            </div>


        </div>
    )
}

export default ViewDoc