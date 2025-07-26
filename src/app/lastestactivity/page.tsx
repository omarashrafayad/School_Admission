import Notifications from '@/components/Details/Notifications'
import TopComponent from '@/components/Nested/TopComponent'
import React from 'react'

const page = () => {
  return (
    <div className="bg-[var(--color-secondary)] w-[100vw] p-6">
    <TopComponent text='Notification & Lastest Activity'/>
    <Notifications/>
    </div>
  )
}

export default page
