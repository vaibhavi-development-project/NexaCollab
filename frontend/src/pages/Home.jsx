import { FaArrowRight } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { RiRobot3Line } from "react-icons/ri";
import { CiTimer } from "react-icons/ci";
import { MdOutlineSecurity } from "react-icons/md";
import { MdWorkspacesOutline } from "react-icons/md";
import { useEffect, useState, useContext } from "react"
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from 'react-router-dom';
import axios from "../api/axios";

const Home = () => {


  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const navigate = useNavigate()

  const { setUser, user, loading } = useContext(UserContext)


  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // const isMobile = window.innerWidth < 768


  // useEffect(() => {

  //   const checkAuth = async () => {

  //     try {

  //       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getme`, { withCredentials: true })

  //       if (res.data.authenticated) {
  //         navigate("/dashboard")
  //       }

  //     } catch (err) {
  //       console.log(err)
  //     }


  //   }

  //   checkAuth()

  // }, [])

  // const handleAuthSubmit = async (e) => {
  //   e.preventDefault()


  //   try {
  //     setSubmitError(null)
  //     setSubmitting(true)
  //     let url = ""
  //     let payload = {}

  //     if (showRegister) {
  //       url = "/api/register"
  //       payload = {
  //         fullName: { firstName, lastName },
  //         email: Email,
  //         password: Password
  //       }
  //     } else {
  //       url = "/api/login"
  //       payload = {
  //         email: Email,
  //         password: Password
  //       }
  //     }

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}${url}`,
  //       payload,
  //       { withCredentials: true }
  //     )

  //     setUser(res.data.User)

  //     navigate("/dashboard")

  //   } catch (err) {
  //     setSubmitError(
  //       err?.response?.data?.message || "Something went wrong"
  //     )
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

  useEffect(() => {

    if (user && !loading) {
      navigate("/dashboard")
    }

  }, [user, loading])



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      setSubmitError(null)
      setSubmitting(true)

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        fullName: {
          firstName,
          lastName
        },
        email: Email,
        password: Password
      },
      //  { withCredentials: true }
    )
    localStorage.setItem("token", res.data.token)
      setUser(res.data.User)
      navigate("/dashboard")

    } catch (err) {
      console.log("error:", err)
      setSubmitError(
        err?.response?.data?.message || "Something went wrong"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {

      setSubmitError(null)
      setSubmitting(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        email: Email,
        password: Password
      }, 
      // { withCredentials: true }
    )
localStorage.setItem("token", res.data.token)
      console.log(res.data.User)

      setUser(res.data.User)
      navigate("/dashboard")

    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Something went wrong"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='relative min-h-screen '>


      <div className={showRegister || showLogin ? " pointer-events-none select-none " : "flex flex-col "}>

        <header className="nav sticky top-0 z-30 flex p-4 items-center justify-between  lg:p-4 bg-white border-b border-gray-300">
          <div className='flex items-center gap-x-1 lg:gap-x-2'>
            <div className="bg-gray-800 rounded-lg p-1"> <MdWorkspacesOutline className='text-xl text-white lg:text-2xl' /></div>
            <h1 className='font-bold  text-lg lg:text-xl'>NexaCollab</h1>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-x-10">
            <a href="#features" className="hover:text-black font-semibold">Features</a>
            <a href="#how-it-works" className="hover:text-black font-semibold">How it works</a>
          </div>
          <button onClick={() => {
            setShowLogin(true)
          }}
            className='border font-md rounded-md px-2 py-1 text-sm text-black lg:px-8 lg:py-2 lg:mr-6 lg:font-semibold hover:bg-black hover:text-white transition'>
            Sign in</button>


        </header>

        {/* hero */}

        <section className='relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 text-center lg:px-6  border-b border-gray-300'>

          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10 hidden lg:block"
          >
            <source
              src="https://media.usepylon.com/PYLON_HOMEPAGE_HERO_Desktop_v006_Animation_Only.mp4"
              type="video/mp4"
            />
          </video>

          <video

            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10 lg:hidden "
          >
            <source
              src="https://media.usepylon.com/PYLON_HOMEPAGE_HERO_Mobile_v001_Animation_Only.mp4"
              type="video/mp4"
            />
          </video>

          <div className='relative z-10 max-w-2xl mx-auto lg:h-full'>

            <h1 className='text-3xl font-bold text-black lg:text-6xl lg:font-medium lg:text-center'>Your team's work,</h1>
            <h1 className='text-3xl font-bold text-black  lg:text-6xl lg:font-medium lg:text-center'>organised and accelerated by <span className='text-gray-500'>AI</span></h1>
            <p className='text-sm text-black mt-3 lg:text-xl lg:text-center'>Create task, collaborate on documents, and get AI-powered summaries all in one place. </p>

            <div className="flex justify-center gap-x-3 lg:gap-x-5 ">
              <button className='bg-black text-white text-sm p-2 rounded-sm mt-5 lg:flex lg:items-center lg:justify-center lg:px-4 lg:text-lg hover:shadow-lg transition'
                onClick={() => {
                  if (window.innerWidth < 768) {
                    navigate("/register")
                  } else {
                    setShowRegister(true)
                  }
                }
                } >
                Get Started <span className="lg:ml-3"></span><FaArrowRight className="text-center hidden lg:block" /></button>
            </div>

          </div>
        </section>


        {/* features */}

        <section id="features"
          className='px-4 py-10 lg:min-h-screen bg-gray-100 border-b border-gray-300 '>

          <h3 className='text-center font-bold text-xl  lg:text-4xl lg:font-semibold'>Everything your team needs</h3>
          <h3 className='text-center text-lg mb-5 lg:text-3xl text-gray-600 lg:hidden'>Features</h3>



          <div className='grid gap-4 grid-cols-1 max-w-3xl mx-auto lg:grid-cols-4 lg:max-w-6xl lg:mt-15 '>



            <div className="group p-4 bg-white border border-gray-300 lg:p-6 hover:shadow-lg transition">
              <div className="relative z-10">
                <RiTeamLine className="text-5xl mb-21" />
                <h4 className="font-semibold mt-2 lg:text-xl">Team Workspaces</h4>
                <p className="text-gray-700 mt-8 text-xs lg:text-sm">
                  Create dedicated workspaces with role-based access control.
                </p>
              </div>
            </div>



            <div className="group p-4 bg-white border border-gray-300 lg:p-6 hover:shadow-lg transition">

              <div className="relative z-10">
                <RiRobot3Line className="text-5xl mb-21" />
                <h4 className="font-semibold mt-2 lg:text-xl">AI-Powered Documents</h4>
                <p className="text-gray-700 mt-8 text-xs lg:text-sm">
                  Instantly summarise documents and save time with AI assistance.
                </p>
              </div>
            </div>



            <div className=" p-4 border border-gray-300 bg-white lg:p-6 hover:shadow-lg transition">
              <div className="relative z-10">
                <CiTimer className="text-5xl mb-21" />
                <h4 className="font-semibold mt-2 lg:text-xl">Real-Time Updates</h4>
                <p className="text-gray-700 mt-8 text-xs lg:text-sm">
                  Get instant notifications and collaborate without delays.
                </p>
              </div>
            </div>



            <div className="p-4 bg-white border border-gray-300 lg:p-6 hover:shadow-lg transition">
              <div className="relative z-10">
                <MdOutlineSecurity className="text-5xl mb-21" />
                <h4 className="font-semibold mt-2 lg:text-xl">Secure & Reliable</h4>
                <p className="text-gray-700 mt-8 text-xs lg:text-sm">
                  Enterprise-grade security ensures your data is always protected.
                </p>
              </div>
            </div>


          </div>

        </section>



        <section id="how-it-works" className="px-4 py-16 bg-white">
          <h3 className="text-2xl font-bold text-center mb-12 lg:text-4xl">
            How it works
          </h3>

          <div className="grid grid-cols-1 gap-6 max-w-md mx-auto 
                  lg:grid-cols-3 lg:max-w-6xl">

            {/* STEP 1 */}
            <div className="text-center p-6 border border-gray-400 lg:border-gray-300 bg-white hover:shadow-lg transition">
              <div className="text-4xl font-bold text-gray-400 mb-4">01</div>
              <h4 className="text-lg font-semibold mb-2 lg:text-xl">
                Create a Workspace
              </h4>
              <p className="text-gray-600 text-sm lg:text-base">
                Set up your workspace in seconds and organise tasks, docs, and teams.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="text-center p-6 border border-gray-400 lg:border-gray-300 bg-white hover:shadow-lg transition">
              <div className="text-4xl font-bold text-gray-400 mb-4">02</div>
              <h4 className="text-lg font-semibold mb-2 lg:text-xl">
                Invite Your Team
              </h4>
              <p className="text-gray-600 text-sm lg:text-base">
                Invite teammates and collaborate in real time with shared access.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="text-center p-6 border border-gray-400 lg:border-gray-300 bg-white hover:shadow-lg transition">
              <div className="text-4xl font-bold text-gray-400 mb-4">03</div>
              <h4 className="text-lg font-semibold mb-2 lg:text-xl">
                Work Faster with AI
              </h4>
              <p className="text-gray-600 text-sm lg:text-base">
                Let AI assist you in document summaries to save time.
              </p>
            </div>

          </div>
        </section>



        <footer className="bg-gray-100 border-t border-gray-300 px-6 py-10">
          <div className="max-w-6xl mx-auto flex flex-col gap-6 
                  lg:flex-row lg:items-center lg:justify-between">

            {/* BRAND */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <div className="bg-gray-800 p-1 rounded">
                  <MdWorkspacesOutline className="text-white text-lg" />
                </div>
                <span className="font-bold text-lg">NexaCollab</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 max-w-sm">
                Organise your team’s work, collaborate seamlessly, and move faster with AI.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3 lg:items-end">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    navigate("/register")
                  } else {
                    setShowRegister(true)
                  }
                }
                }
                className="bg-black text-white px-6 py-2 text-sm font-semibold hover:shadow-lg transition"
              >
                Get Started
              </button>

              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} NexaCollab · Built by Vaibhavi
              </p>
            </div>

          </div>
        </footer>



      </div>

      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm p-6 border-gray-300 rounded-sm shadow-xl relative animate-in fade-in zoom-in duration-200">

            {/* CLOSE */}
            <button
              onClick={() => {
                setShowRegister(false)
                setSubmitError(null)
              }}

            >
              <RxCross2 className="absolute top-3 right-3 text-gray-600 hover:text-black lg:text-xl" />
            </button>

            {/* REGISTER FORM */}
            <form className="flex flex-col gap-y-3"
              onSubmit={handleSubmit}>

              <div className="mb-1 flex flex-col items-center">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-gray-600 text-sm">Create your Account</p>
              </div>

              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded "
                placeholder='First name'
                required
                type="text"
                value={firstName}
                disabled={submitting}
                onChange={(e) => setFirstName(e.target.value)}
              />


              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded"
                placeholder='Last name'
                required
                type="text"
                value={lastName}
                disabled={submitting}
                onChange={(e) => setLastName(e.target.value)}
              />


              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded"
                placeholder='Email'
                required
                type="email"
                value={Email}
                disabled={submitting}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded"
                placeholder='Password'
                required
                type="password"
                value={Password}
                disabled={submitting}
                onChange={(e) => setPassword(e.target.value)}
              />

              {submitError && (
                <p className="text-xs text-center text-red-600 m-2">{submitError}</p>
              )}


              <button className="bg-black text-white p-2  rounded-lg" disabled={submitting}>{submitting ? "Please wait..." : "Create"}</button>
              <div className="text-sm">
                <p>Already have an account?
                  <Link
                    onClick={() => {
                      setShowRegister(false)
                      setShowLogin(true)
                    }}
                    className="text-blue-500 underline text-xs">Sign in</Link></p>
              </div>

            </form>

          </div>
        </div>
      )}


      {showLogin && (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className=" relative bg-white rounded-xl px-4 py-2 shadow-xl w-[90vw] min-h-[50vh] lg:w-full lg:max-w-sm">

            <button
              onClick={() => {
                setShowLogin(false)
              }}

            >
              <RxCross2 className="absolute top-3 right-3 text-gray-600 hover:text-black lg:text-2xl" />
            </button>

            <div className="flex flex-col text-center mb-2">
              <h1 className="text-2xl font-bold">Sign in</h1>
              <p className="text-gray-600 text-sm">Login your Account</p>
            </div>

            <form className="flex flex-col gap-y-3 flex-1"
              onSubmit={handleLoginSubmit}>

              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded"
                placeholder='Email'
                required
                type="email"
                value={Email}
                disabled={submitting}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input className="text-sm p-2 bg-white border border-gray-400 outline-0 rounded"
                placeholder='Password'
                required
                type="password"
                value={Password}
                disabled={submitting}
                onChange={(e) => setPassword(e.target.value)}
              />

              {submitError && (
                <p className="text-xs text-center text-red-600 m-2">{submitError}</p>
              )}

              <button className="bg-black text-white p-2  rounded-lg mt-1" disabled={submitting}>{submitting ? "Please wait..." : "Sign in"}</button>
              <div className="text-sm">
                <p>Dont't have an account? <Link

                  className="text-blue-500 underline text-xs"
                  onClick={(e) => {
                    e.preventDefault()
                    if (window.innerWidth < 768) {
                      navigate("/register")
                    } else {
                      setShowLogin(false)
                      setShowRegister(true)
                    }
                  }}
                >Sign up</Link></p>
              </div>

            </form>
          </div>
        </div>

      )}



    </div>
  )
}

export default Home
