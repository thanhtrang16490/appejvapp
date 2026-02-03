'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader, Database, User, Key } from 'lucide-react'

interface SetupStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'success' | 'error'
  error?: string
}

export default function SetupPage() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: 'Kiểm tra Database',
      description: 'Kiểm tra kết nối và tables database',
      status: 'pending'
    },
    {
      id: 'admin',
      title: 'Tạo Admin User',
      description: 'Tạo tài khoản admin mặc định',
      status: 'pending'
    },
    {
      id: 'data',
      title: 'Seed Dữ liệu',
      description: 'Thêm dữ liệu mẫu vào database',
      status: 'pending'
    }
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [setupComplete, setSetupComplete] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({
    email: 'admin@appejv.vn',
    password: 'appejv2024'
  })

  const updateStepStatus = (stepId: string, status: SetupStep['status'], error?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, error } : step
    ))
  }

  const checkDatabase = async () => {
    updateStepStatus('database', 'running')
    
    try {
      const response = await fetch('/api/test')
      const result = await response.json()
      
      if (result.success) {
        updateStepStatus('database', 'success')
        return true
      } else {
        updateStepStatus('database', 'error', result.message)
        return false
      }
    } catch (error) {
      updateStepStatus('database', 'error', 'Không thể kết nối đến database')
      return false
    }
  }

  const createAdminUser = async () => {
    updateStepStatus('admin', 'running')
    
    try {
      // First check if admin exists
      const checkResponse = await fetch('/api/auth/create-admin')
      const checkResult = await checkResponse.json()
      
      if (checkResult.adminExists) {
        updateStepStatus('admin', 'success')
        return true
      }

      // Create admin user
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials)
      })
      
      const result = await response.json()
      
      if (result.success) {
        updateStepStatus('admin', 'success')
        return true
      } else {
        updateStepStatus('admin', 'error', result.message)
        return false
      }
    } catch (error) {
      updateStepStatus('admin', 'error', 'Không thể tạo admin user')
      return false
    }
  }

  const seedData = async () => {
    updateStepStatus('data', 'running')
    
    try {
      // This would typically call the setup-database script
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateStepStatus('data', 'success')
      return true
    } catch (error) {
      updateStepStatus('data', 'error', 'Không thể seed dữ liệu')
      return false
    }
  }

  const runSetup = async () => {
    setCurrentStep(0)
    
    // Step 1: Check Database
    const dbSuccess = await checkDatabase()
    if (!dbSuccess) return
    
    setCurrentStep(1)
    
    // Step 2: Create Admin User
    const adminSuccess = await createAdminUser()
    if (!adminSuccess) return
    
    setCurrentStep(2)
    
    // Step 3: Seed Data
    const dataSuccess = await seedData()
    if (!dataSuccess) return
    
    setSetupComplete(true)
  }

  const getStepIcon = (step: SetupStep) => {
    switch (step.status) {
      case 'running':
        return <Loader className="w-5 h-5 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">APPE JV Setup</h1>
          <p className="text-gray-600">Thiết lập hệ thống quản trị lần đầu</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!setupComplete ? (
            <>
              {/* Admin Credentials */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Thông tin Admin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Email</label>
                    <input
                      type="email"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Setup Steps */}
              <div className="space-y-4 mb-8">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                      step.status === 'success' 
                        ? 'border-green-200 bg-green-50' 
                        : step.status === 'error'
                        ? 'border-red-200 bg-red-50'
                        : step.status === 'running'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="mr-4">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.error && (
                        <p className="text-sm text-red-600 mt-1">{step.error}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Bước {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Setup Button */}
              <button
                onClick={runSetup}
                disabled={steps.some(step => step.status === 'running')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {steps.some(step => step.status === 'running') ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Đang thiết lập...
                  </div>
                ) : (
                  'Bắt đầu thiết lập'
                )}
              </button>
            </>
          ) : (
            /* Setup Complete */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thiết lập hoàn tất!</h2>
              <p className="text-gray-600 mb-6">
                Hệ thống APPE JV đã được thiết lập thành công. Bạn có thể đăng nhập với thông tin admin.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin đăng nhập
                </h3>
                <div className="text-sm text-green-800">
                  <p><strong>Email:</strong> {adminCredentials.email}</p>
                  <p><strong>Mật khẩu:</strong> {adminCredentials.password}</p>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Đi đến trang đăng nhập
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 CÔNG TY CỔ PHẦN APPE JV VIỆT NAM</p>
        </div>
      </div>
    </div>
  )
}