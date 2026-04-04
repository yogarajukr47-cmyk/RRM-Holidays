'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Profile updated successfully!');
        update({ name: profile.name });
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch {
      setMessage('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (passwords.new !== passwords.confirm) {
      setMessage('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password updated successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setMessage(data.error || 'Failed to update password');
      }
    } catch {
      setMessage('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={30} className="animate-spin text-amber-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Profile Settings</h1>
          <p className="text-sm text-stone-400">Manage your account information</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 ${
            message.includes('success')
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.includes('success') ? <CheckCircle size={16} /> : null}
            {message}
          </div>
        )}

        {/* Avatar */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-2xl font-bold border border-amber-500/20">
              {profile.name.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">{profile.name}</h2>
              <p className="text-sm text-stone-400">{profile.email}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider mt-1">
                {session && (session.user as { role?: string }).role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-stone-100 mb-4">Personal Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-stone-100 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Current Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
