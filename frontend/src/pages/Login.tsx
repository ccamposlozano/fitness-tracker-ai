import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getProfile, getMacros } from '../api'
import { useAuth } from '../context/AuthContext'

export const Login = () => {
  const navigate = useNavigate()
  const { setUser, setMacros } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const form = new FormData(e.currentTarget)
      const email = form.get('username') as string
      const password = form.get('password') as string

      const { access_token } = await login(email, password)
      localStorage.setItem('token', access_token)

      const profile = await getProfile()
      setUser(profile)

      const macros = await getMacros()
      setMacros(macros)

      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-2xl">
        

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">Sign in</h2>
          <p className="text-sm text-gray-400">Stay updated on your fitness goals</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="username"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full h-11 px-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full h-11 px-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-900 bg-opacity-40 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-sm text-center">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-2 text-sm text-center text-gray-400">
          New here?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
    

    
  )
  
}
