import Notifications from '@/components/Notifications'
import TopComponent from '@/components/TopComponent'
import React from 'react'

const page = () => {
  return (
    <div className="bg-[var(--color-secondary)] w-full p-6">
    <TopComponent text='Notification & Lastest Activity'/>
    <Notifications/>
    </div>
  )
}

export default page
