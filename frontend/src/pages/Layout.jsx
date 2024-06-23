import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../component/layout/Footer'
import Navbar from '../component/layout/Navbar'

const Layout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
