'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockAuthService } from '@/services/mock-data';

interface Commission {
  id: number;
  created_at: string;
  paid: boolean;
  seller: number;
  money: number;
  sector_id: number;
  contract_id: number | null;
}

interface Agent {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
  address: string | null;
  commission_rate: number;
  total_commission: number;
  child_turnover: number;
  created_at: string;
  commissions: Commission[];
  role_id: number;
  code: string | null;
}

// Mock data for agents and commissions
const mockAgents: Agent[] = [
  {
    id: 2,
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    avatar: null,
    address: 'Hà Nội',
    commission_rate: 5,
    total_commission: 15000000,
    child_turnover: 25000000,
    created_at: '2024-01-15T10:00:00Z',
    commissions: [
      {
        id: 1,
        created_at: '2024-02-01T14:30:00Z',
        paid: true,
        seller: 2,
        money: 2500000,
        sector_id: 1,
        contract_id: 101,
      },
      {
        id: 2,
        created_at: '2024-02-02T09:15:00Z',
        paid: false,
        seller: 2,
        money: 1800000,
        sector_id: 1,
        contract_id: null,
      },
    ],
    role_id: 1,
    code: 'AGT001',
  },
  {
    id: 3,
    name: 'Trần Thị B',
    phone: '0912345678',
    avatar: null,
    address: 'TP.HCM',
    commission_rate: 4,
    total_commission: 12000000,
    child_turnover: 18000000,
    created_at: '2024-01-20T15:30:00Z',
    commissions: [
      {
        id: 3,
        created_at: '2024-02-01T16:45:00Z',
        paid: true,
        seller: 3,
        money: 3200000,
        sector_id: 2,
        contract_id: 102,
      },
    ],
    role_id: 1,
    code: 'AGT002',
  },
  {
    id: 4,
    name: 'Lê Văn C',
    phone: '0923456789',
    avatar: null,
    address: 'Đà Nẵng',
    commission_rate: 6,
    total_commission: 8000000,
    child_turnover: 12000000,
    created_at: '2024-02-01T08:00:00Z',
    commissions: [
      {
        id: 4,
        created_at: '2024-02-02T11:20:00Z',
        paid: false,
        seller: 4,
        money: 1500000,
        sector_id: 1,
        contract_id: 103,
      },
    ],
    role_id: 1,
    code: 'AGT003',
  },
  {
    id: 5,
    name: 'Phạm Thị D',
    phone: '0934567890',
    avatar: null,
    address: 'Cần Thơ',
    commission_rate: 5,
    total_commission: 6000000,
    child_turnover: 8000000,
    created_at: '2024-02-01T12:00:00Z',
    commissions: [
      {
        id: 5,
        created_at: '2024-02-01T13:30:00Z',
        paid: true,
        seller: 5,
        money: 900000,
        sector_id: 2,
        contract_id: null,
      },
    ],
    role_id: 1,
    code: 'AGT004',
  },
];

// Format currency function
const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount) + 'đ'
  );
};

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
};

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [agents] = useState<Agent[]>(mockAgents);
  const [totalCommission, setTotalCommission] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [newMembersCount, setNewMembersCount] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [recentActivities, setRecentActivities] = useState<
    { id: number; name: string; amount: number; contractId: string; date: string }[]
  >([]);

  useEffect(() => {
    // Get current user (mock data)
    const loadUser = async () => {
      try {
        const users = await mockAuthService.getUsers();
        const currentUser = users.find(u => u.role_id === 1) || users[0];
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        // Fallback user
        setUser({
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
          address: '123 Đường ABC, Quận 1, TP.HCM',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ED1C24&color=fff',
        });
      }
    };

    loadUser();

    // Calculate statistics
    const totalAmount = agents.reduce((sum, agent) => sum + agent.child_turnover, 0);
    setTotalCommission(totalAmount);

    // Member count
    setMemberCount(agents.length);

    // New members this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newMembersCount = agents.filter(agent => {
      const createdDate = new Date(agent.created_at);
      return (
        createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
      );
    }).length;
    setNewMembersCount(newMembersCount);

    // Total bonus from commissions
    const totalBonus = agents.reduce(
      (sum, agent) =>
        sum +
        agent.commissions.reduce(
          (commissionSum, commission) => commissionSum + commission.money,
          0
        ),
      0
    );
    setTotalBonus(totalBonus);

    // Recent activities
    const activities = agents
      .flatMap(agent =>
        agent.commissions.map(commission => ({
          id: commission.id,
          name: agent.name,
          amount: commission.money,
          contractId: commission.contract_id
            ? `Hợp đồng ${commission.contract_id}`
            : `SL-${commission.id}`,
          date: formatDate(commission.created_at),
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setRecentActivities(activities);
  }, [agents]);

  // Get top 3 agents by turnover
  const topAgents = agents
    .slice()
    .sort((a, b) => b.child_turnover - a.child_turnover)
    .slice(0, 3)
    .map((agent, index) => ({
      id: agent.id,
      name: agent.name,
      amount: agent.child_turnover,
      rank: index + 1,
    }));

  // Activity Item component
  const ActivityItem = ({
    activity,
  }: {
    activity: { id: number; name: string; amount: number; contractId: string; date: string };
  }) => {
    const agent = agents.find(a => a.name === activity.name);
    return (
      <div className="flex items-center py-2 gap-2">
        <div className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden flex-shrink-0">
          {agent?.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/images/avatar-customer.jpeg"
              alt={agent?.name || 'Agent'}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 flex justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{activity.name}</span>
            <span className="text-xs text-gray-500">{activity.date}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(activity.amount).replace('đ', '')}
            </div>
            <div className="text-xs text-gray-500">{activity.contractId}</div>
          </div>
        </div>
      </div>
    );
  };

  // Top Agent Item component
  const TopAgentItem = ({
    agent,
  }: {
    agent: { id: number; name: string; amount: number; rank: number };
  }) => {
    const agentData = agents.find(a => a.id === agent.id);
    
    // Determine colors based on rank
    const getRankStyle = () => {
      switch (agent.rank) {
        case 1:
          return { bgColor: 'bg-yellow-500', textColor: 'text-white' };
        case 2:
          return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
        case 3:
          return { bgColor: 'bg-gray-100', textColor: 'text-red-600' };
        default:
          return { bgColor: 'bg-gray-100', textColor: 'text-gray-900' };
      }
    };

    const { bgColor, textColor } = getRankStyle();

    return (
      <div className={`flex items-center rounded-xl mb-1 p-1 pl-3 ${bgColor}`}>
        <div className="flex items-center justify-center">
          <span className={`text-sm font-medium ${textColor}`}>#{agent.rank}</span>
        </div>
        <div className="flex-1 flex justify-between bg-white rounded-lg p-2 ml-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden">
              {agentData?.avatar ? (
                <img
                  src={agentData.avatar}
                  alt={agentData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/images/avatar-customer.jpeg"
                  alt={agentData?.name || 'Agent'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-sm text-gray-900">{agent.name}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              {formatCurrency(agent.amount)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-900 ml-2">Nhóm đại lý</h1>
        </div>
      </div>

      <div className="pb-20">
        {/* Group Info Section */}
        <div className="bg-gray-50">
          {/* Group Header */}
          <div className="bg-red-800 flex justify-between items-center px-4 py-2">
            <span className="text-xs font-medium text-white">
              NHÓM ĐẠI LÝ CỦA {user?.name?.toUpperCase() || 'NGƯỜI DÙNG'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-white">BẠN ĐANG LÀ TRƯỞNG NHÓM</span>
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Members Panel */}
          <div className="bg-red-600 flex justify-between items-center px-4 py-3">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">{memberCount} thành viên</span>
                <button className="hover:opacity-80">
                  <img
                    src="/images/arrow-icon.png"
                    alt="View members"
                    className="w-4 h-4"
                  />
                </button>
              </div>
              <span className="text-xs font-medium text-red-200">{newMembersCount} thành viên mới</span>
            </div>

            <div className="flex">
              {agents.slice(0, 4).map((agent, index) => (
                <div
                  key={agent.id}
                  className={`w-8 h-8 rounded-full border border-white overflow-hidden ${
                    index > 0 ? '-ml-2' : ''
                  }`}
                >
                  {agent.avatar ? (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/images/avatar-customer.jpeg"
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {agents.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-white border border-white flex items-center justify-center -ml-2">
                  <span className="text-sm text-gray-500">+{agents.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sales Stats */}
          <div className="bg-gray-50 flex justify-between px-4 py-3">
            <div>
              <span className="text-xs font-medium text-gray-500">Doanh số tháng này</span>
              <div className="text-xl font-medium text-red-600">{formatCurrency(totalCommission)}</div>
              <span className="text-xs font-medium text-gray-400">{recentActivities.length} đơn hàng</span>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-gray-500">Thưởng doanh số dự kiến</span>
              </div>
              <div className="text-xl font-medium text-red-600">{formatCurrency(totalBonus)}</div>
            </div>
          </div>
        </div>

        {/* Top Sales Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center px-4 py-2">
            <h2 className="text-lg font-medium text-gray-900">Top doanh số</h2>
          </div>

          <div className="px-4">
            {topAgents.map(agent => (
              <TopAgentItem key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center px-4 py-2">
            <h2 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h2>
            <button className="flex items-center gap-2 py-1.5">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-red-600">Lịch sử</span>
            </button>
          </div>

          <div className="px-4">
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}