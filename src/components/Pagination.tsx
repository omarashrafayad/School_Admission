import { useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { ArrowLeft, ArrowRight, ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import React from 'react'

type PaginationProps = {
  currentpage: number;
  setcurrentpage: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  data: number;
};

const Pagination = ({ currentpage, setcurrentpage, totalPage, data }: PaginationProps) => {

  // دالة عشان تحدد أرقام الصفحات اللي هتظهر بناءً على حجم الشاشة
  const getPageNumbers = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      // 📱 في الموبايل نعرض 3 أرقام فقط
      const start = Math.max(1, currentpage - 1)
      const end = Math.min(totalPage, currentpage + 1)
      const pages = []
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    }
    // 💻 في الشاشات الكبيرة نعرض كل الأرقام
    return Array.from({ length: totalPage }, (_, i) => i + 1)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-3 sm:gap-0">
      <p className="text-xs text-[var(--color-accent1)] text-center sm:text-left">
        Showing {currentpage}-{totalPage} from {data} data
      </p>
      <div className="flex space-x-2 justify-center sm:justify-end items-center flex-wrap">
        <span className="text-[var(--color-accent1)] mr-1">
          <ArrowLeft
            size={25}
            className="cursor-pointer "
            onClick={() => setcurrentpage((prev) => Math.max(prev - 1, 1))}
          />
        </span>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setcurrentpage(num)}
            className={`border border-gray-500 w-9 h-9  rounded-full transition-all duration-500 cursor-pointer shadow-sm text-[14px]  ${
              num === currentpage
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "text-[var(--color-accent1)]"
            }`}
          >
            {num}
          </button>
        ))}

        <span className="text-[var(--color-accent1)] ml-1">
          <ArrowRight
            size={25}
            className="cursor-pointer max-[400px]:w-5"
            onClick={() => setcurrentpage((prev) => Math.min(prev + 1, totalPage))}
          />
        </span>
      </div>
    </div>
  )
}

export default Pagination
