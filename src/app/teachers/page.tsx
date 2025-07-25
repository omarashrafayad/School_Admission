import CreateStudentForm from '@/components/CreateteachersForm'
import TeachersListPage from '@/components/TeacherList'
import TopComponent from '@/components/TopComponent'
import React from 'react'

const page = () => {
  return (
    <div className="bg-[var(--color-secondary)] w-full p-6">
      <TopComponent text='Teachers'/>
      {/* <CreateStudentForm/> */}
      <TeachersListPage/>
    </div>
  )
}

export default page
