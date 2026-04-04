'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Users,
  Loader2,
  Search,
  Save,
  Eye,
} from 'lucide-react';

interface EnquiryWithUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  destination: string | null;
  travelDate: string | null;
  travellers: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  user: { name: string; email: string } | null;
}

const WHATSAPP_NUMBER = '919108597154';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryWithUser | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/admin/enquiries');
        if (res.ok) {
          setEnquiries(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch enquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    } finally {
      setSaving(false);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'New' },
    read: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', label: 'Read' },
    replied: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', label: 'Replied' },
    closed: { bg: 'bg-stone-500/10 border-stone-500/20', text: 'text-stone-400', label: 'Closed' },
  };

  const filtered = enquiries.filter(e => {
    const matchesSearch = search === '' ||
      (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.destination || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Manage Enquiries</h1>
          <p className="text-sm text-stone-400">{enquiries.length} total enquiries</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'read', 'replied', 'closed'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === f
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-900/50 text-stone-500 border border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MessageSquare size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No enquiries found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((enquiry) => {
              const status = statusConfig[enquiry.status] || statusConfig.new;
              return (
                <div key={enquiry.id} className="glass rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-stone-200">
                            {enquiry.destination || 'General Enquiry'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 flex-wrap">
                          <span>{enquiry.name}</span>
                          {enquiry.email && <span>{enquiry.email}</span>}
                          {enquiry.phone && <span>{enquiry.phone}</span>}
                          {enquiry.travelDate && (
                            <span className="flex items-center gap-1">
                              <CalendarCheck size={10} />
                              {new Date(enquiry.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setSelectedEnquiry(enquiry); setEditStatus(enquiry.status); }}
                        className="p-1.5 rounded-lg bg-neutral-800 text-stone-400 hover:text-stone-200 hover:bg-neutral-700 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      {enquiry.phone && (
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! Regarding enquiry from ${enquiry.name} (${enquiry.destination || 'General'}) - ${enquiry.message || ''}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                        >
                          <Phone size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)} />
            <div className="relative w-full max-w-md glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-stone-100 mb-4">Enquiry Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  {[
                    { label: 'Name', value: selectedEnquiry.name },
                    { label: 'Email', value: selectedEnquiry.email || 'N/A' },
                    { label: 'Phone', value: selectedEnquiry.phone || 'N/A' },
                    { label: 'Destination', value: selectedEnquiry.destination || 'Not specified' },
                    { label: 'Travel Date', value: selectedEnquiry.travelDate ? new Date(selectedEnquiry.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set' },
                    { label: 'Travellers', value: selectedEnquiry.travellers || 'Not specified' },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-xs text-stone-500">{f.label}</span>
                      <span className="text-sm text-stone-300">{f.value}</span>
                    </div>
                  ))}
                </div>

                {selectedEnquiry.message && (
                  <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                    <p className="text-xs text-stone-500 mb-1">Message</p>
                    <p className="text-sm text-stone-300">{selectedEnquiry.message}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Update Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-stone-300 text-sm font-semibold hover:bg-neutral-700 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedEnquiry.id, editStatus)}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
