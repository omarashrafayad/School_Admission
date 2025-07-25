import FoodList from '@/components/FoodList'
import TopComponent from '@/components/TopComponent'
import React from 'react'

const page = () => {
  return (
        <div className="bg-[var(--color-secondary)] p-6 w-[100vw]">
      <TopComponent text="Foods"/>
      <FoodList/>
    </div>
  )
}

export default page
