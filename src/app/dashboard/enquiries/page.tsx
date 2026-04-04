'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Users,
  Loader2,
  X,
} from 'lucide-react';

interface Enquiry {
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
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/enquiries');
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

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'New' },
    read: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', label: 'Read' },
    replied: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', label: 'Replied' },
    closed: { bg: 'bg-stone-500/10 border-stone-500/20', text: 'text-stone-400', label: 'Closed' },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-stone-100">My Enquiries</h1>
          <p className="text-sm text-stone-400">View your submitted enquiries and their status</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-amber-400" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MessageSquare size={48} className="text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-300 mb-2">No enquiries yet</h3>
            <p className="text-sm text-stone-500">Your submitted enquiries will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enquiry) => {
              const status = statusConfig[enquiry.status] || statusConfig.new;
              return (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="glass rounded-xl p-4 hover:border-amber-500/20 transition-all cursor-pointer"
                >
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
                          {enquiry.travelDate && (
                            <span className="flex items-center gap-1">
                              <CalendarCheck size={10} />
                              {new Date(enquiry.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {enquiry.travellers && (
                            <span className="flex items-center gap-1">
                              <Users size={10} />
                              {enquiry.travellers}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-stone-500">
                      {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)} />
            <div className="relative w-full max-w-md glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-100">Enquiry Details</h2>
                <button onClick={() => setSelectedEnquiry(null)} className="text-stone-400 hover:text-white text-xl">×</button>
              </div>

              {(() => {
                const status = statusConfig[selectedEnquiry.status] || statusConfig.new;
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {[
                        { label: 'Destination', value: selectedEnquiry.destination || 'Not specified', icon: MapPin },
                        { label: 'Travel Date', value: selectedEnquiry.travelDate ? new Date(selectedEnquiry.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set', icon: CalendarCheck },
                        { label: 'Travellers', value: selectedEnquiry.travellers || 'Not specified', icon: Users },
                        { label: 'Email', value: selectedEnquiry.email || 'Not provided', icon: Mail },
                        { label: 'Phone', value: selectedEnquiry.phone || 'Not provided', icon: Phone },
                      ].map((field) => (
                        <div key={field.label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                          <field.icon size={14} className="text-stone-500 shrink-0" />
                          <span className="text-xs text-stone-500 w-24">{field.label}</span>
                          <span className="text-sm text-stone-300">{field.value}</span>
                        </div>
                      ))}
                    </div>

                    {selectedEnquiry.message && (
                      <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/5">
                        <p className="text-xs text-stone-500 mb-1">Message</p>
                        <p className="text-sm text-stone-300">{selectedEnquiry.message}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Status:</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} border`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
