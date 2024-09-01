import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login'
import Register from './register'
import Home from './Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
