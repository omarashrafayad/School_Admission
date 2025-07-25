'use client'
import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signup, clearError, loginWithGoogle } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SignUp = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error } = useAppSelector((state) => state.auth)
  const name = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const confirmpassword = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    if (password.current!.value !== confirmpassword.current!.value) {
      return setLocalError('Passwords do not match')
    }
    if (!name.current?.value) {
      return setLocalError('Name is required')
    }

    setLocalError('')
    const result = await dispatch(
      signup({
        name: name.current!.value,
        email: email.current!.value,
        password: password.current!.value,
      })
    )

    if (signup.fulfilled.match(result)) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 w-full">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        {(error || localError) && (
          <p className="text-red-500 mb-4 text-sm text-center">{error || localError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              ref={name}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              ref={email}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              ref={password}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              ref={confirmpassword}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div>
          <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
>
  Sign up with Google
</button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
