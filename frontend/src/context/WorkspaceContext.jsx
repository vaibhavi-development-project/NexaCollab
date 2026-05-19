import { createContext, useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import axios from "../api/axios"

export const WorkspaceContext = createContext()

export const WorkspaceProvider = ({ children }) => {

    const {workspaceId}=useParams()
    const [workspace,setWorkspace]=useState()

    useEffect(() => {

        if(!workspaceId){
            return
        }

      const fetchWorkspace=async()=>{
          try {

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspaces/${workspaceId}`,
                // {withCredentials:true}
            )
            // console.log("res:",res.data.workspace)
            setWorkspace(res.data.workspace)
            

        } catch (err) {

            console.log(err)

        }
      }

      fetchWorkspace()
    }, [workspaceId])







    return (
        <WorkspaceContext.Provider value={{ workspace }}>
            {children}
        </WorkspaceContext.Provider>
    )


}