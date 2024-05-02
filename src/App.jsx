import { useState } from 'react'
import {Code} from "@nextui-org/react";
import User from './pages/User';
import Admin from './pages/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    {/* <User/> */}
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<User/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
