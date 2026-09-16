import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
function App() {
  let loginInfo=useSelector((state)=>state.loginInfo.loginData)
  console.log("logon info in app page",loginInfo);
  const token = loginInfo?.token;
console.log("login info",loginInfo);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={token  ?<Home/> : <Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App
