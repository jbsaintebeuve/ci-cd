import { useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
function App() {

  let [count, setCount] = useState(0);
  const clickOnMe = () => {
  setCount(count+1);
  }

  return (
    <>
      <button onClick={clickOnMe}>Click me</button>
      <span data-testid="count">{count}</span>

      <RegistrationForm />
    </>
  )
}

export default App
