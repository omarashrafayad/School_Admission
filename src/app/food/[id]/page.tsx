"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // أو useRouter في Pages Router
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import TopComponent from "@/components/Nested/TopComponent";
import { BarChart2, Star, TrendingUp } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

interface Food {
    id: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    mealType?: string;
    rate?: number;
    total?: number;
    interest?: number;
    percent?: number;
    ingredient?: string;
    nurtrition?: string;
}

const FoodDetails = () => {
    const { id } = useParams();
    const [food, setFood] = useState<Food | null>(null);

    useEffect(() => {
        const fetchFood = async () => {
            const docRef = doc(db, "Foods", id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFood({ id: docSnap.id, ...docSnap.data() });
            }
        };

        if (id) fetchFood();
    }, [id]);
    console.log("params:", useParams());

    if (!food)
        return (
            <div className="flex items-center justify-center flex-col h-screen w-full ">
                <div className="loading"></div>
                <p className="text-[var(--color-accent2)] text-sm mt-2">loading Food Details</p>
            </div>
        );

    return (
        <div className="bg-[var(--color-secondary)] p-6 ">
            <TopComponent text={"Food Details"} />
            <div className="bg-[var(--bg-background)] p-7 rounded-lg">
                <div className="flex items-start gap-8 max-md:flex-col">
                    <div>
                        {food.imageUrl && (
                            <Image
                                src={food.imageUrl}
                                alt={`Image of ${food.name} meal`}
                                loading="lazy"
                                width={450}
                                height={450}
                                className=" object-cover rounded-lg max-md:w-full"
                            />
                        )}
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-2 mb-7">
                            <h2 className="text-lg font-bold text-[var(--color-accent2)]">
                                {food.name}
                            </h2>
                            {food.mealType && (
                                <span className="bg-[var(--color-primary)] text-sm text-white rounded-2xl px-8 py-1.5 text-center w-fit">
                                    {food.mealType}
                                </span>
                            )}
                        </div>
                        <p className=" text-[var(--color-accent1)]">
                            {food.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-10 my-10 flex-wrap">
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-accent1)] text-sm">Rating</p>
                        <div className="flex items-center gap-2">
                            <Star aria-label="Food rating" className="text-orange-300 w-4 h-4" fill="orange" />
                            <span className="text-[var(--color-accent2)] font-bold">
                                {food.rate}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart2 aria-label="Total orders" className="text-[var(--color-primary)] w-16 h-16" />
                        <div>
                            <span className="text-[var(--color-accent2)] font-bold">
                                {(food.total ?? 0).toLocaleString()}
                            </span>
                            <p className="text-[var(--color-accent1)] text-sm mt-2">
                                Total Order
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <TrendingUp aria-label="Interest percentage" className="text-[var(--color-primary)] w-15 h-15" />
                        <div>
                            <span className="text-[var(--color-accent2)] font-bold">
                                {food.interest}
                            </span>
                            <p className="text-[var(--color-accent1)] text-sm mt-2">
                                Interest
                            </p>
                        </div>
                    </div>
                    {/* Percent Circle */}
                    <div className="relative w-14 h-14">
                        <CircularProgressbar
                            value={food.percent ?? 0}
                            strokeWidth={10}
                            styles={buildStyles({
                                pathColor: "#4D44B5",
                                trailColor: "#F3F4FF",
                            })}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-accent2)]">
                            {food.percent}%
                        </div>
                    </div>
                </div>
                <div className="flex items-start space-x-15 max-md:gap-5 max-[430px]:flex-col ">
                    <div>
                        <h3 className="font-bold text-[var(--color-accent2)] text-lg mb-2">
                            Ingredients
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-[var(--color-accent1)] space-y-1">
                            {(food.ingredient ?? "")
                                .split("\n")
                                .map((line: string, i: number) => (
                                    <li key={i}>{line}</li>
                                ))}
                        </ul>

                    </div>

                    <div>
                        <h3 className="font-bold text-[var(--color-accent2)] text-lg mb-2">
                            Nutrition:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-[var(--color-accent1)] space-y-1">
                            {(food.nurtrition ?? "")
                                .split("\n")
                                .map((line: string, i: number) => (
                                    <li key={i}>{line}</li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;