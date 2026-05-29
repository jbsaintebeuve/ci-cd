import { Toaster } from "sonner"
import RegistrationForm from './components/RegistrationForm'
import UserList from './components/UserList'

function App() {
  return (
    <>
      <RegistrationForm />
      <UserList />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
