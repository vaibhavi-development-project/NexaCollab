import DesktopNav from "./DesktopNav"
import WorkspaceHeader from "./WorkspaceHeader"
import WorkspaceNav from "./WorkspaceNav"
import { Outlet } from "react-router-dom"

const WorkspaceLayout = () => {



    return (

        <div className="flex flex-col flex-1 w-full">
            <WorkspaceHeader />
            <DesktopNav/>
            <div className="flex-1 flex overflow-y-auto pb-[46px] lg:pb-0">
                <Outlet />
            </div>
             <WorkspaceNav />
        </div>

    )
}

export default WorkspaceLayout