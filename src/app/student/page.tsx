import CreateStudentForm from '@/components/CreateStudentForm'
import StudentList from '@/components/StudentList'
import TopComponent from '@/components/TopComponent'
import React from 'react'

const page = () => {
  return (
   <div className="bg-[var(--color-secondary)] w-full p-6">
   <TopComponent text='Student'/>
   {/* <CreateStudentForm/> */}
    <StudentList/>
   </div>
    
  )
}

export default page
