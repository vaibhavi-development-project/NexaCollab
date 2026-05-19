import AppRoutes from "./routes/AppRoutes"
import   { UserProvider } from "./context/UserContext"
import NotificationListener from "./components/NotificationListener"


const App = () => {
  return (
    <UserProvider>
      <AppRoutes/>
      <NotificationListener/>
    </UserProvider>
   
  )
}

export default App