import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { fetchteachers } from '@/redux/teacherslice'
import { Calendar, UserRound, Users, UtensilsCrossed } from 'lucide-react'
import React, { useEffect } from 'react'

const DetailsDashboard = () => {
    const dispatch = useAppDispatch()
    const { students, teachers, Foods } = useAppSelector((state: RootState) => ({
        students: state.student.students.length,
        teachers: state.teacher.teachers.length,
        Foods: state.food.Foods.length,
    }));
    useEffect(() => {
        if (!teachers) {
            dispatch(fetchteachers());
        }
    }, [dispatch, teachers]);
    return (
        <div className="bg-[var(--bg-background)] p-5 mb-6 flex items-center justify-between rounded-lg flex-wrap gap-3 max-md:gap-5">
            <div className="flex items-center gap-5 flex-1">
                <span className="bg-[var(--color-primary)] rounded-full p-3 text-white ">
                    <Users />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">Students</span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl" aria-label={`${students} students`}>{students}</span>
                </div>
            </div>
            <div className="flex items-center gap-5 flex-1">
                <span className="bg-[var(--color-orange)] rounded-full p-3 text-white ">
                    <UserRound />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">Teachers</span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl" aria-label={`${teachers} students`}>{teachers}</span>
                </div>
            </div>
            <div className="flex items-center gap-5 flex-1">
                <span className="bg-[var(--color-yellow)] rounded-full p-3 text-white ">
                    <Calendar />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">Events</span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl">40</span>
                </div>
            </div>
            <div className="flex items-center gap-5 flex-1">
                <span className="bg-[var(--color-red)] rounded-full p-3 text-white ">
                    <UtensilsCrossed />
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-accent1)] text-sm">Foods</span>
                    <span className="text-[var(--color-accent2)] font-bold text-2xl" aria-label={`${Foods} Foods`}>{Foods}</span>
                </div>
            </div>
        </div>
    )
}

export default DetailsDashboard
