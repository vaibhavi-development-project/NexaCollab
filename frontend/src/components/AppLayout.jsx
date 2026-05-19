import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

const AppLayout = () => {

  const {loading}=useContext(UserContext)


  return (

    loading ? (<p className='text-center mt-10'>"loading..."</p>) : (

      <div className='min-h-screen flex flex-col '>

        <Navbar/>
        

       <div className='flex-1 flex overflow-y-auto pt-16'>
        <Outlet/>
       </div>


    </div>
    )

  )
}

export default AppLayout