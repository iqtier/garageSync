import React from 'react'
import Dashboard from './dashboard/page'
import { redirect } from 'next/navigation'

const Home = () => {
  return (
    redirect('/home/dashboard')
  )
}

export default Home