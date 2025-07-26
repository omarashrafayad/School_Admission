"use client"

import CurrentFoodMenu from "@/components/Foods/CurrentFoodMenu"
import DashboardCharts from "@/components/AllCharts/DashboardCharts"
import DetailsDashboard from "@/components/Details/DetailsDashboard"
import ResentStudents from "@/components/Students/ResentStudents"
import TopComponent from "@/components/Nested/TopComponent"
import UnPaidStudent from "@/components/Students/UnPaidStudent"
import ChatSidebar from "@/components/Chats/ChatList"

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
      <div className="bg-[var(--bg-background)] flex-1 p-6 rounded-lg w-full ">
        <ResentStudents/>
        <ChatSidebar/>
        <CurrentFoodMenu/>
      </div>
    </div>
    </div>
  )
}
