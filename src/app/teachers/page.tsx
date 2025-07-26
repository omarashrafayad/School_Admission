import TeachersListPage from '@/components/Teachers/TeacherList'
import TopComponent from '@/components/Nested/TopComponent'
import React from 'react'

const page = () => {
  return (
    <div className="bg-[var(--color-secondary)] w-[100vw] p-6">
      <TopComponent text='Teachers'/>
      <TeachersListPage/>
    </div>
  )
}

export default page
