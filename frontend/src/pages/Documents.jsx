import { CgFileDocument } from "react-icons/cg";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RxPerson } from "react-icons/rx";
import { LuClock } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "../api/axios"



const Documents = () => {

  const [document, setDocument] = useState([])
  const { workspaceId } = useParams()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [deleting, setDeleting]=useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [fetchError, setFetchError]=useState(null)


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


  const fetchDocuments = async () => {

    try {

      setLoading(true)
      setFetchError(null)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents`, 
        // { withCredentials: true }
      )
      setDocument(res.data.docs)
      // console.log(res.data.docs)

    } catch (err) {
      console.log(err)
      setFetchError(err.response?.data?.message || "Failed to Fetch Documents. Try again!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])



  const confirmDelete = async () => {
    try {
      setDeleting(true)
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}/documents/${deleteId}`,
        // { withCredentials: true }
      )

      setDocument(prev => prev.filter(doc => doc._id !== deleteId))
      setShowConfirm(false)

    } catch (err) {
      console.log(err)
      setDeleteError(err.response?.data?.message || "Failed to Delete")
    }finally{
      setDeleting(false)
    }
  }




  return (
    <div className="w-full p-2 flex flex-col lg:px-10 bg-gray-50">


      <div className={showConfirm ? "pointer-events-none select-none" : ""}>
        <div className="flex flex-col p-2 mt-3 lg:flex lg:flex-row lg:justify-between">
          <h1 className="text-xl font-semibold lg:text-2xl">Documents</h1>
          <button className="w-full bg-gray-950 text-white p-2 rounded-md mt-2 lg:w-1/4"
            onClick={() => navigate(`/workspaces/${workspaceId}/documents/createDocument`)}>+ New Document</button>
        </div>

        {fetchError && (
          <p className="text-red-600 text-xs text-center mt-5">{fetchError}</p>
        )}

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : document.length === 0 && !fetchError  ? (
          <div className="text-gray-600 text-center mt-5">
            <p className="font-semibold text-lg">No Documents yet</p>
            <p className="text-sm mt-1">Create Your first Document</p>
          </div>
        ) : (

          <div className="p-2 grid grid-cols-1">
            {document.map(doc =>
              <div className="border mt-5 border-gray-400 rounded-md   px-2 py-4 bg-white hover:border hover:bg-gray-200 "
                onClick={() => navigate(`/workspaces/${workspaceId}/documents/${doc._id}`)}
                key={doc._id}>

                <div className="flex gap-x-3 shrink-0">
                  <div>
                    <CgFileDocument className="text-lg text-gray-500" />
                  </div>

                  <div className="flex-1">
                    <h1 className="font-semibold">{doc.title}</h1>
                    <p className="line-clamp-2 break-word break-all text-gray-600 text-sm font-semibold overflow-hidden">{doc.content}</p>
                    <div className="flex  mt-3 items-center text-xs text-gray-700 gap-x-2">
                      <RxPerson />
                      <p className=""> {doc.createdBy.fullName.firstName} {doc.createdBy.fullName.lastName}</p>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-xs text-gray-700 flex gap-x-2 items-center">
                        <LuClock />
                        <p className="">{timeAgo(doc.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 flex items-end lg:items-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteId(doc._id)
                      setDeleteError(null)
                      setShowConfirm(true)
                    }}
                  ><RiDeleteBinLine className="text-red-700 lg:text-lg text-md hover hover:text-xl" /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-60">
            <h2 className="font-semibold text-lg">Delete Document</h2>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-red-600 text-xs mb-2 text-center">{deleteError}</p>
            )}

            <div className="flex justify-end gap-2  w-full">
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
                onClick={() => confirmDelete(deleteId)}
                className="px-3 py-1 bg-red-600 text-white rounded-md w-1/2"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default Documents