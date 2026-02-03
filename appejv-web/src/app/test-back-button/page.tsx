'use client';

import { useRouter } from 'next/navigation';

export default function TestBackButtonPage() {
  const router = useRouter();

  const handleBackClick = () => {
    console.log('Test back button clicked');
    try {
      if (typeof window !== 'undefined') {
        console.log('Using window.history.back()');
        window.history.back();
      } else {
        console.log('Fallback to router.push(/)');
        router.push('/');
      }
    } catch (error) {
      console.error('Error navigating back:', error);
      router.push('/');
    }
  };

  const handleRouterBack = () => {
    console.log('Using router.back()');
    router.back();
  };

  const handleRouterPush = () => {
    console.log('Using router.push(/)');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test Back Button</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleBackClick}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test window.history.back()
          </button>
          
          <button
            onClick={handleRouterBack}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test router.back()
          </button>
          
          <button
            onClick={handleRouterPush}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Test router.push('/')
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Navigate to this page from another page, then test the back buttons.</p>
          <p>Check the browser console for debug logs.</p>
        </div>
      </div>
    </div>
  );
}