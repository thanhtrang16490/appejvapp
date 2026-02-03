// Database Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role_id: number
  parent_id?: string
  commission_rate?: number
  total_commission?: number
  address?: string
  created_at: string
  updated_at: string
  role?: Role
}

export interface Role {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface Sector {
  id: number
  name: string
  description?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  sector_id: number
  image?: string
  created_at: string
  updated_at: string
  sector?: Sector
}

export interface Content {
  id: number
  title: string
  content: string
  image?: string
  brand?: string
  category?: string
  sector_id: number
  created_at: string
  updated_at: string
  sector?: Sector
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalSectors: number
  totalContents: number
  recentUsers: User[]
  recentProducts: Product[]
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form Types
export interface UserFormData {
  email: string
  name: string
  phone: string
  role_id: number
  parent_id?: string
  commission_rate?: number
  address?: string
}

export interface ProductFormData {
  name: string
  description?: string
  price: number
  sector_id: number
  image?: string
}

export interface SectorFormData {
  name: string
  description?: string
  image?: string
}

export interface ContentFormData {
  title: string
  content: string
  image?: string
  brand?: string
  category?: string
  sector_id: number
}

// Chart Types
export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

// Filter Types
export interface UserFilters {
  role_id?: number
  search?: string
  parent_id?: string
}

export interface ProductFilters {
  sector_id?: number
  search?: string
  min_price?: number
  max_price?: number
}

export interface ContentFilters {
  sector_id?: number
  category?: string
  brand?: string
  search?: string
}

// Auth Types
export interface AuthUser {
  id: string
  email: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Settings Types
export interface SystemSettings {
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  company_address: string
  api_rate_limit: number
  maintenance_mode: boolean
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

// Export all types
export type {
  User,
  Role,
  Sector,
  Product,
  Content,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  UserFormData,
  ProductFormData,
  SectorFormData,
  ContentFormData,
  ChartData,
  TimeSeriesData,
  UserFilters,
  ProductFilters,
  ContentFilters,
  AuthUser,
  LoginCredentials,
  SystemSettings,
  Notification
}