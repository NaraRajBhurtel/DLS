import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar/>
            <div className='flex-1 mt-12'>
                <Outlet/>
            </div>
        </div>
      )
}
export default RootLayout
