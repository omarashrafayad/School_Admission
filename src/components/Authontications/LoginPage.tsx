'use client'
import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { login, clearError, loginWithGoogle } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { loading, error } = useAppSelector((state) => state.auth)

    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const [localError, setLocalError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(clearError())

        if (!email.current || !password.current) return
        setLocalError('')

        const result = await dispatch(
            login({
                email: email.current.value,
                password: password.current.value,
            })
        )

        if (login.fulfilled.match(result)) {
            router.push('/')
        }
    }

    const handleGoogleLogin = async () => {
        const result = await dispatch(loginWithGoogle())
        if (loginWithGoogle.fulfilled.match(result)) {
            router.push('/')
        }
    }

    return (
        <div className=" relative w-full ">
            <div className="w-full max-w-md bg-[var(--bg-background)] p-7 rounded-xl shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-accent2)]">
                            Email
                        </label>
                        <input
                            type="email"
                            ref={email}
                            className="mt-1.5 w-full px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-[var(--foreground)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-accent2)]">
                            Password
                        </label>
                        <input
                            type="password"
                            ref={password}
                            className="mt-1.5 w-full px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-[var(--foreground)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white py-2 rounded transition-all duration-500 mt-3 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full mt-4 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white py-2 rounded transition-all duration-500 cursor-pointer"
                    >
                        Login with Google
                    </button>
                </div>
                {(error || localError) && (
                    <p className="text-red-600 my-4 text-sm text-center">
                        {error || localError}
                    </p>
                )}
                <div className="mt-4 text-center text-sm text-[var(--color-accent2)]">
                    You do not have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-hover)] transition-all duration-300"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
