'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">A</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">APPE JV Admin</h1>
        <div className="flex items-center justify-center">
          <Loader className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-2" />
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    </div>
  )
}