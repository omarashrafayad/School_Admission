import StudentList from '@/components/Students/StudentList'
import TopComponent from '@/components/Nested/TopComponent'
import React from 'react'

const page = () => {
  return (
    <div className="bg-[var(--color-secondary)] w-[100vw] p-6">
    <TopComponent text='Student'/>
      <StudentList/>
  </div>
    
  )
}

export default page
