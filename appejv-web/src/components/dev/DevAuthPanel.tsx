'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

const DevAuthPanel = () => {
  const { authState, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development' && process.env.NEXT_PUBLIC_SKIP_AUTH !== 'true') {
    return null;
  }

  const switchRole = async (roleId: number, roleName: string) => {
    if (!authState.user) return;

    const updatedUser: Partial<User> = {
      ...authState.user,
      role_id: roleId,
      role: { id: roleId, name: roleName, description: `${roleName} role` }
    };

    await updateUser(updatedUser);
  };

  const roles = [
    { id: 1, name: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { id: 2, name: 'agent', label: 'Agent', color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'customer', label: 'Customer', color: 'bg-green-100 text-green-800' },
    { id: 4, name: 'public', label: 'Public', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Development Auth Panel"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-64">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">Dev Auth Panel</h3>
            <p className="text-xs text-gray-500">Development mode only</p>
          </div>

          {authState.user && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{authState.user.name}</p>
                <p className="text-gray-600">{authState.user.email}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  roles.find(r => r.id === authState.user?.role_id)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {authState.user.role?.name || 'Unknown'}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Switch Role:</p>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => switchRole(role.id, role.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  authState.user?.role_id === role.id
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Auth Status: {authState.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevAuthPanel;