import React from 'react'
import NavigationBar from '../shared/NavigationBar'
import AdminHome from '../components/AdminHome'

export default function Admin() {
  return (
    <>
    <main className='w-[100vw] h-[100vh] bg-purple-200 '>
    <NavigationBar isAdmin/>
    <AdminHome/>
    </main>
    </>
  )
}
