"use client"

import CurrentFoodMenu from "@/components/CurrentFoodMenu"
import DashboardCharts from "@/components/DashboardCharts"
import DetailsDashboard from "@/components/DetailsDashboard"
import ResentStudents from "@/components/ResentStudents"
import TopComponent from "@/components/TopComponent"
import UnPaidStudent from "@/components/UnPaidStudent"
import ChatSidebar from "@/components/ChatList"

export default function Home() {

  return (
    <div className="bg-[var(--color-secondary)] w-full p-6">
    <TopComponent text="Dashboard"/>
    <div className="flex gap-5 max-lg:flex-col ">
    <div className="flex-3 w-full">
    <DetailsDashboard/>
    <DashboardCharts/>
    <UnPaidStudent/>
      </div>
      <div className="bg-[var(--bg-background)] flex-1 p-6 rounded-md w-full ">
        <ResentStudents/>
        <ChatSidebar/>
        <CurrentFoodMenu/>
      </div>
    </div>
    </div>
  )
}
