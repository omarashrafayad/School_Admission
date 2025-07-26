import SchoolPerformanceChart from '@/components/AllCharts/Chart'
import DeatailsFinance from '@/components/Details/DeatailsFinance'
import SchoolExpense from '@/components/Students/SchoolExpense'
import TopComponent from '@/components/Nested/TopComponent'
import UnPaidStudent from '@/components/Students/UnPaidStudent'
import React from 'react'

const page = () => {
  return (
  <div className="bg-[var(--color-secondary)] w-[100vw] p-6 ">
    <TopComponent text='Finance'/>
    <DeatailsFinance/>
    <SchoolPerformanceChart/>
    <div className='flex gap-5 max-xl:flex-col'>
        <div className='flex-1 '>
      <UnPaidStudent/>
        </div>
        <div className='flex-1 '>
      <SchoolExpense/>
        </div>
    </div>
    </div>
  )
}

export default page
