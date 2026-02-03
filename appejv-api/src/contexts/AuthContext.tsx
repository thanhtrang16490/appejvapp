'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại'
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'Email hoặc mật khẩu không đúng'
            break
          case 'Email not confirmed':
            errorMessage = 'Vui lòng xác nhận email trước khi đăng nhập'
            break
          case 'Too many requests':
            errorMessage = 'Quá nhiều lần thử. Vui lòng đợi một lúc'
            break
          default:
            errorMessage = error.message
        }
        
        return { error: errorMessage }
      }

      return {}
    } catch (err) {
      return { error: 'Đã xảy ra lỗi kết nối, vui lòng thử lại' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        let errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại'
        
        switch (error.message) {
          case 'User not found':
            errorMessage = 'Không tìm thấy tài khoản với email này'
            break
          case 'For security purposes, you can only request this once every 60 seconds':
            errorMessage = 'Vui lòng đợi 60 giây trước khi gửi lại'
            break
          default:
            errorMessage = error.message
        }
        
        return { error: errorMessage }
      }

      return {}
    } catch (err) {
      return { error: 'Đã xảy ra lỗi kết nối, vui lòng thử lại' }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}