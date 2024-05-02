import React from 'react'
import NavigationBar from '../shared/NavigationBar'
import UserHome from '../components/UserHome'

export default function User() {
  return (
  <>
  <main className='w-[100vw] h-[100vh] bg-purple-200 '>
  <NavigationBar/>
  <UserHome/>
  </main>
  </>
  )
}
