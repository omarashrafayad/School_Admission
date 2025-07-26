import LoginPage from '@/components/Authontications/LoginPage'
import TopComponent from '@/components/Nested/TopComponent'
import React from 'react'

const page = () => {
  return (
     <div className="bg-[var(--color-secondary)] w-[100vw] h-screen p-6">
      <TopComponent text='Login'/>
      <LoginPage/>
    </div>
  )
}

export default page
