import { MdOutlineTask } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import { AiOutlineTeam } from "react-icons/ai";
import { BsActivity } from "react-icons/bs";
import {NavLink } from "react-router-dom";

const WorkspaceNav = () => {

    return (
            <div className="fixed lg:hidden bottom-0 z-30 flex  justify-evenly gap-x-6 border-t border-gray-300 px-4 bg-white pt-2 w-full text-xs">
                <NavLink
                    to="" end
                    className={({ isActive }) =>
                        isActive
                            ? "border-b-2 border-gray-900 text-gray-900 pb-2"
                            : "text-gray-700 pb-2"
                    }
                >
                    <div className="flex flex-col items-center lg:text-sm lg:flex lg:flex-row lg:gap-x-1"> <MdOutlineTask /><div >Tasks</div></div>
                </NavLink>

                <NavLink
                    to="documents"
                    className={({ isActive }) =>
                        isActive
                            ? "border-b-2 border-gray-900 text-gray-900 pb-2 items-center"
                            : "text-gray-700 pb-2"
                    }
                >
                    <div className="flex flex-col items-center lg:flex lg:flex-row lg:items-center lg:text-sm lg:gap-x-1"><GrDocumentText /><div className="">Documents</div></div>
                </NavLink>

                <NavLink
                    to="activity"
                    className={({ isActive }) =>
                        isActive
                            ? "border-b-2 border-gray-900 text-gray-900 pb-2"
                            : "text-gray-700 pb-2"
                    }
                >
                    <div className="flex flex-col items-center lg:text-sm lg:flex lg:flex-row lg:gap-x-1"><BsActivity /><div className="">Activity</div></div>
                </NavLink>

                <NavLink
                    to="team"
                    className={({ isActive }) =>
                        isActive
                            ? "border-b-2 border-gray-900 text-gray-900 pb-2"
                            : "text-gray-700 pb-2"
                    }
                >
                    <div className="flex flex-col items-center lg:text-sm lg:flex lg:flex-row lg:gap-x-1"><AiOutlineTeam /><div className="">Team</div></div>
                </NavLink>
            </div>

           
 
    )
}

export default WorkspaceNav