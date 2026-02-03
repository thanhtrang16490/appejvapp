import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import DevAuthPanel from '@/components/dev/DevAuthPanel';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Appejv Global - Animal Feed Solutions',
  description: 'Hệ thống quản lý bán hàng thức ăn chăn nuôi',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <DevAuthPanel />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options for all toasts
              className: '',
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              // Success toast style
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              // Error toast style
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#EF4444',
                },
              },
              // Loading toast style
              loading: {
                style: {
                  background: '#3B82F6',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#3B82F6',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}