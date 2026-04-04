'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Star,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Plus,
  Shield,
  Users,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const userNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
  { label: 'New Booking', href: '/dashboard/new-booking', icon: Plus },
  { label: 'My Enquiries', href: '/dashboard/enquiries', icon: MessageSquare },
  { label: 'My Reviews', href: '/dashboard/reviews', icon: Star },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Users', href: '/admin/users', icon: Users },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: 'user' | 'admin';
}

export default function DashboardLayout({ children, type = 'user' }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = type === 'admin' ? adminNavItems : userNavItems;
  const userRole = session?.user as { role?: string } | undefined;
  const isAdmin = userRole?.role === 'admin';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col border-r border-white/5 bg-neutral-900/50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RRM Holidays" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-base font-bold tracking-tight text-stone-100">
                RRM <span className="text-amber-400">Holidays</span>
              </span>
            </Link>
          </div>

          {/* Role badge */}
          <div className="px-6 py-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              type === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {type === 'admin' ? <Shield size={10} /> : <User size={10} />}
              {type === 'admin' ? 'Admin Panel' : 'My Account'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom nav */}
          <div className="border-t border-white/5 px-3 py-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
            >
              <Home size={18} />
              Back to Home
            </Link>
            {isAdmin && (
              <Link
                href={type === 'admin' ? '/dashboard' : '/admin'}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
              >
                <ArrowLeft size={18} />
                {type === 'admin' ? 'User Dashboard' : 'Admin Panel'}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* User info */}
          <div className="border-t border-white/5 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-200 truncate">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-stone-500 truncate">{session?.user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="absolute left-0 top-0 bottom-0 w-72 bg-neutral-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="RRM Holidays" className="h-8 w-auto rounded-lg object-contain" />
              <span className="text-base font-bold tracking-tight text-stone-100">
                RRM <span className="text-amber-400">Holidays</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              type === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {type === 'admin' ? <Shield size={10} /> : <User size={10} />}
              {type === 'admin' ? 'Admin Panel' : 'My Account'}
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/5 px-3 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-stone-400 hover:text-white p-1"
              >
                <Menu size={22} />
              </button>
              <h2 className="text-base font-semibold text-stone-200">
                {navItems.find(item => item.href === pathname)?.label || (
                  pathname.includes('dashboard') ? 'Dashboard' : 'Admin'
                )}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-stone-400 hover:text-stone-200 transition-colors hidden sm:block"
              >
                Home
              </Link>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
