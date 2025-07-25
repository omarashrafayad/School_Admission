"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchFoods } from "@/redux/foodslice";
import Image from "next/image";
import { BarChart2, Star, TrendingUp } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Link from "next/link";


const FoodList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [category,setcategory] = useState<string[]>([])
    const [selectcategory,setselectcategory] = useState("All")
    const { Foods, error } = useSelector(
        (state: RootState) => state.food
    );
  useEffect(() => {
  dispatch(fetchFoods());
  setcategory(Array.from(new Set(Foods.map((m) => m.mealType))));
}, [dispatch, Foods]);


    // const handleDelete = (id: string) => {
    //     dispatch(deleteFoods(id));
    // };

    const filteredFoods = useMemo(() => {
  let result = Foods;
  if (selectcategory !== "All") {
    result = result.filter((f) => f.mealType === selectcategory);
  }
  return result;
}, [Foods, selectcategory]);

    if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
    if (filteredFoods.length === 0)
        return <div className="flex items-center justify-center flex-col h-[100vh]">
            <div className="loading"></div>
            <p className="text-gray-500 text-sm mt-2">loading Foods</p>
          </div>
    return (
        <div className="bg-[var(--bg-background)] rounded-xl shadow p-5 space-y-2">
            <div className="flex items-center justify-between max-md:flex-col gap-y-4">
            <h2 className="text-[var(--color-accent2)] text-xl font-bold">
                Food Menu
            </h2>
            <ul className="flex items-center gap-7 px-5 flex-wrap">
                    <li
                        className={`cursor-pointer font-semibold ${selectcategory === "All" ? "text-[var(--color-accent2)] border-b-2 border-[var(--color-accent2)]" : "text-[var(--color-accent1)]"
                            }`}
                        onClick={() => setselectcategory("All")}
                    >
                        All Menu
                    </li>
                    {category.map((cat) => (
                        <li
                            key={cat}
                            onClick={() => setselectcategory(cat)}
                            className={`cursor-pointer font-semibold ${selectcategory === cat ? "text-[var(--color-accent2)] border-b-2 border-[var(--color-accent2)]" : "text-[var(--color-accent1)]"
                                }`}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
          {filteredFoods.map((food) => (
  <div
    key={food.id}
    className="grid grid-cols-1 sm:grid-cols-[100px_1fr]  md:grid-cols-[0.5fr_1.5fr_0.7fr_1fr_1fr_0.5fr] items-center gap-5 mt-8"
  >
    {/* الصورة */}
    <div className="w-[300px] h-[150px] relative mx-auto max-lg:w-[200px] max-lg:h-[120px] max-md:w-full max-md:h-[200px] ">
      {food.imageUrl && (
        <Link href={`/food/${food.id}`}>
          <Image
            src={food.imageUrl}
            alt={`Image of ${food.name}`}
            fill
            className="object-cover rounded"
          />
        </Link>
      )}
    </div>

    {/* الاسم والتصنيف */}
    <div className="flex flex-col gap-2 text-center sm:text-left">
      {food.mealType && (
        <span className="bg-[var(--color-primary)] text-sm text-white rounded-2xl px-4 py-1.5 w-fit mx-auto sm:mx-0">
          {food.mealType}
        </span>
      )}
      <h2 className="text-lg font-bold text-[var(--color-accent2)]">
        {food.name}
      </h2>
    </div>

    {/* التقييم */}
    <div className="flex items-center justify-center sm:justify-start gap-2">
      <Star className="text-orange-300 w-5 h-5" fill="orange" />
      <span className="text-[var(--color-accent2)] font-bold">
        {food.rate}
      </span>
    </div>

    {/* الطلبات */}
    <div className="flex items-center justify-center sm:justify-start gap-2">
      <BarChart2 className="text-[var(--color-primary)] w-13 h-13 max-md:w-9 max-md:h-9" />
      <div>
        <span className="text-[var(--color-accent2)] font-bold">
          {food.total.toLocaleString()}
        </span>
        <p className="text-[var(--color-accent1)] text-sm">Total Order</p>
      </div>
    </div>

    {/* الاهتمام */}
    <div className="flex items-center justify-center sm:justify-start gap-2">
      <TrendingUp className="text-[var(--color-primary)] w-13 h-13 max-md:w-9 max-md:h-9" />
      <div>
        <span className="text-[var(--color-accent2)] font-bold">
          {food.interest}%
        </span>
        <p className="text-[var(--color-accent1)] text-sm">Interest</p>
      </div>
    </div>

    {/* الدائرة */}
    <div className="relative w-13 h-13 mx-auto sm:mx-0">
      <CircularProgressbar
        value={food.percent}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: "#4D44B5",
          trailColor: "#F3F4FF",
        })}
      />
      <div className="absolute inset-0 flex items-center justify-center text-sm text-black">
        {food.percent}%
      </div>
    </div>
  </div>
))}

            {/* <button
                onClick={() => handleDelete(food.id!)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
                Delete
            </button> */}
        </div>
    );
};

export default FoodList;