'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/types';

interface RoleSwitcherProps {
  currentUser: User;
  onUserChange: (user: User) => void;
}

export default function RoleSwitcher({ currentUser, onUserChange }: RoleSwitcherProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Will be set in useEffect
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Set initial position to bottom right, above bottom nav
  useEffect(() => {
    const updatePosition = () => {
      const bottomNavHeight = 80; // Height of bottom navigation
      const margin = 16;
      const elementWidth = isCollapsed ? 48 : 300; // Approximate width
      
      setPosition({
        x: window.innerWidth - elementWidth - margin,
        y: window.innerHeight - bottomNavHeight - 60 - margin, // 60px for element height + margin
      });
    };

    // Set initial position
    updatePosition();

    // Update position on window resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isCollapsed]);

  const users: User[] = [
    {
      id: 1,
      role_id: 1,
      email: 'admin@appejv.vn',
      password: '123456',
      created_at: '2024-01-01T00:00:00Z',
      commission_rate: 10,
      name: 'Admin User',
      phone: '0123456789',
      parent_id: null,
      total_commission: 1000000,
      role: { name: 'admin', description: 'Administrator', id: 1 },
      address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
    },
    {
      id: 2,
      role_id: 2,
      email: 'agent@appejv.vn',
      password: '123456',
      created_at: '2024-01-15T00:00:00Z',
      commission_rate: 5,
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      parent_id: 1,
      total_commission: 500000,
      role: { name: 'agent', description: 'Sales Agent', id: 2 },
      address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
    },
    {
      id: 3,
      role_id: 3,
      email: 'user@appejv.vn',
      password: '123456',
      created_at: '2024-02-01T00:00:00Z',
      commission_rate: null,
      name: 'Trần Thị B',
      phone: '0901234567',
      parent_id: 2,
      total_commission: null,
      role: { name: 'user', description: 'Customer', id: 3 },
      address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
    },
    {
      id: 4,
      role_id: 4,
      email: null,
      password: '',
      created_at: '2024-01-01T00:00:00Z',
      commission_rate: null,
      name: 'Khách vãng lai',
      phone: '',
      parent_id: null,
      total_commission: null,
      role: { name: 'public', description: 'Public User', id: 4 },
      address: undefined,
    },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const bottomNavHeight = 80; // Height of bottom navigation
    const elementWidth = isCollapsed ? 48 : 300;
    const elementHeight = isCollapsed ? 48 : 100;

    const newX = Math.max(0, Math.min(window.innerWidth - elementWidth, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - bottomNavHeight - elementHeight, e.clientY - dragStart.y));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, handleMouseMove]);

  // Auto-collapse after 5 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentUser]); // Reset timer when user changes

  return (
    <div
      ref={elementRef}
      className={`fixed z-50 bg-white rounded-lg shadow-lg border transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${isCollapsed ? 'w-12 h-12' : 'p-3'}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      {isCollapsed ? (
        // Collapsed state - show only current role
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full h-full flex items-center justify-center bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
          title="Click to expand role switcher"
        >
          {currentUser.role.name.charAt(0).toUpperCase()}
        </button>
      ) : (
        // Expanded state
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-700">Demo - Switch Role:</p>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs"
                title="Collapse"
              >
                −
              </button>
              <div 
                className="w-4 h-4 flex items-center justify-center text-gray-400 cursor-grab"
                title="Drag to move"
              >
                ⋮⋮
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onUserChange(user)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  currentUser.id === user.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {user.role.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}