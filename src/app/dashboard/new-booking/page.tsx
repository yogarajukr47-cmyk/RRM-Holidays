'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MapPin,
  CalendarCheck,
  Users,
  Car,
  User,
  Phone,
  FileText,
  Loader2,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

const DESTINATIONS = [
  'Mysuru', 'Bengaluru', 'Coorg', 'Hampi', 'Chikmagalur', 'Mangalore', 'Ooty', 'Kodaikanal',
  'Kerala', 'Munnar', 'Kochi', 'Alleppey', 'Kovalam', 'Thekkady', 'Wayanad',
  'Goa', 'Panaji', 'Baga Beach', 'Old Goa', 'Dudhsagar Falls',
  'Tamil Nadu', 'Chennai', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Pondicherry',
  'Andhra Pradesh', 'Tirupati', 'Visakhapatnam', 'Araku Valley', 'Vijayawada',
  'Hyderabad', 'Telangana',
];

const VEHICLES = [
  'Sedan (Etios/Dzire)', 'Innova', 'Innova Crysta', 'Tempo Traveller',
  'Mini Bus (21 Seater)', 'Bus (25/33 Seater)', 'Luxury Coach (50 Seater)', 'Need Suggestion',
];

const WHATSAPP_NUMBER = '919108597154';

export default function NewBookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');

  const [form, setForm] = useState({
    destination: '',
    travelDate: '',
    travellers: '',
    vehicleType: '',
    name: session?.user?.name || '',
    phone: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination || !form.travelDate || !form.travellers) {
      setMessage('Please fill in destination, date, and number of travellers');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingId(data.id);
        setMessage('Booking submitted successfully! Check My Bookings for updates.');
        setForm({
          destination: '',
          travelDate: '',
          travellers: '',
          vehicleType: '',
          name: session?.user?.name || '',
          phone: '',
          notes: '',
        });
      } else {
        setMessage(data.error || 'Failed to submit booking');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = `🎉 *New Booking — RRM Holidays*

📍 *Destination:* ${form.destination}
📅 *Travel Date:* ${form.travelDate}
👥 *Travellers:* ${form.travellers}
${form.name ? `👤 *Name:* ${form.name}` : ''}
${form.phone ? `📱 *Phone:* ${form.phone}` : ''}
${form.vehicleType ? `🚗 *Vehicle:* ${form.vehicleType}` : ''}
${form.notes ? `📝 *Notes:* ${form.notes}` : ''}
${bookingId ? `\n📋 *Booking ID:* ${bookingId}` : ''}

Please share packages & pricing. Thank you!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-stone-100">New Booking</h1>
          <p className="text-sm text-stone-400">Submit a booking request for your next trip</p>
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

        {/* Booking Form */}
        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                <MapPin size={14} className="inline mr-1.5 text-amber-400" />
                Destination *
              </label>
              <select
                value={form.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Destination</option>
                {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  <CalendarCheck size={14} className="inline mr-1.5 text-amber-400" />
                  Travel Date *
                </label>
                <input
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => handleChange('travelDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  <Users size={14} className="inline mr-1.5 text-amber-400" />
                  Number of Travellers *
                </label>
                <select
                  value={form.travellers}
                  onChange={(e) => handleChange('travellers', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  <option>1 Person</option>
                  <option>2 Persons</option>
                  <option>3-5 Persons</option>
                  <option>6-10 Persons</option>
                  <option>11-20 Persons</option>
                  <option>21-35 Persons</option>
                  <option>35+ Persons</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                <Car size={14} className="inline mr-1.5 text-amber-400" />
                Vehicle Preference
              </label>
              <select
                value={form.vehicleType}
                onChange={(e) => handleChange('vehicleType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Vehicle (Optional)</option>
                {VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  <User size={14} className="inline mr-1.5 text-amber-400" />
                  Contact Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  <Phone size={14} className="inline mr-1.5 text-amber-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                <FileText size={14} className="inline mr-1.5 text-amber-400" />
                Special Requests
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any special requests or notes..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-500 transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
