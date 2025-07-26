"use client";
import { fetchFoods } from "@/redux/foodslice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/redux/store";
const CurrentFoodMenu = () => {
    const dispatch = useAppDispatch();
    const { Foods, loading } = useAppSelector((state: RootState) => state.food);
    useEffect(() => {
        dispatch(fetchFoods());
    }, [dispatch]);
    return (
        <div className="">
            <h1 className="text-[var(--color-accent2)] font-bold tracking-wide text-lg mb-6">
                Current Foods Menu
            </h1>
            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="flex items-center justify-center flex-col ">
                        <div className="loading"></div>
                        <p className="text-[var(--color-accent2)] text-sm mt-2">loading Foods</p>
                    </div>
                ) : (
                    <>
                        {(Foods ?? []).slice(0, 3).map((food) => (
                            <div key={food.id}>
                                    <Link href={`/food/${food.id}`}>
                                <div className=" relative w-full h-36 max-lg:h-56 ">
                                    <Image
                                        src={food.imageUrl}
                                        fill
                                        loading="lazy"
                                        alt={`Image of ${food.name}`}
                                        className="cursor-pointer hover:opacity-85 transition-all  duration-500 rounded-lg object-cover"
                                        />
                                </div>
                                        </Link>
                                <div className="mt-3">
                                    <h4 className="text-[var(--color-accent2)] font-semibold text-sm">
                                        {food.name}
                                    </h4>
                                    <p className="text-[var(--color-accent1)] text-xs line-clamp-1">
                                        {food.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/food"
                            className=" bg-[var(--color-secondary)] shadow-xs hover:bg-[var(--color-accent4)] py-3 rounded-3xl text-[var(--color-accent2)] font-semibold mt-3 cursor-pointer w-full block text-center "
                        >
                            View More
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default CurrentFoodMenu;
