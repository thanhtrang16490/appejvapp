'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Eye, EyeOff, Phone, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      toast.error('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    const loadingToast = toast.loading('Đang đăng nhập...');

    try {
      const user = await login({ phone, password });
      if (user) {
        toast.dismiss(loadingToast);
        toast.success(`Chào mừng ${user.name}! Đăng nhập thành công.`);
        
        // Redirect based on user role
        setTimeout(() => {
          if (user.role?.name === 'admin') {
            router.push('/');
          } else if (user.role?.name === 'agent') {
            router.push('/');
          } else if (user.role?.name === 'customer') {
            router.push('/');
          } else {
            router.push('/');
          }
        }, 1000);
      } else {
        toast.dismiss(loadingToast);
        setError('Số điện thoại hoặc mật khẩu không đúng');
        toast.error('Số điện thoại hoặc mật khẩu không đúng');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { phone: '0123456789', password: '123456', role: 'Admin', name: 'Admin User' },
    { phone: '0987654321', password: '123456', role: 'Agent', name: 'Agent User' },
    { phone: '0111222333', password: '123456', role: 'Customer', name: 'Customer User' },
  ];

  const handleDemoLogin = (account: { phone: string; password: string; name: string }) => {
    setPhone(account.phone);
    setPassword(account.password);
    toast.info(`Đã điền thông tin cho tài khoản ${account.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">APPE JV Vietnam</h1>
          <p className="text-gray-600">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="0123456789"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài khoản demo</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(account)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.phone}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {account.role}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Nhấn vào tài khoản để tự động điền thông tin đăng nhập
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 CÔNG TY CỔ PHẦN APPE JV VIỆT NAM</p>
        </div>
      </div>
    </div>
  );
}