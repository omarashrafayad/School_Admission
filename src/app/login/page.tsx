'use client'
import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { login, clearError } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Login = () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 w-full">
      <div className="w-full max-w-md bg-[var(--bg-background)] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {(error || localError) && (
          <p className="text-red-500 mb-4 text-sm text-center">{error || localError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              ref={email}
              className="mt-1 w-full px-4 py-2 border rounded-lg  outline-none  focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              ref={password}
              className="mt-1 w-full px-4 py-2 border rounded-lg outline-none  focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-2 text-center text-sm text-gray-600">
          ليس لديك حساب؟{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
