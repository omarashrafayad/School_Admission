"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { listenToAuthChanges } from "@/redux/authSlice";

export default function AuthListener() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listenToAuthChanges());
    }, [dispatch]);

    return null;
}