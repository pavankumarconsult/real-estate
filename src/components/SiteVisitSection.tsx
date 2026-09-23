import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  User, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Project } from '../data/projects';
import { SITE_CONFIG } from '../config/site';

interface SiteVisitSectionProps {
  project: Project;
  preselectedPlan?: string;
}

export const SiteVisitSection: React.FC<SiteVisitSectionProps> = ({
  project,
  preselectedPlan,
}) => {
  // Generate next 14 available dates
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(availableDates[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [needsCab, setNeedsCab] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [selectedConfig, setSelectedConfig] = useState(preselectedPlan || project.floorPlans[0]?.name || '');
  
  // Visitor inputs
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState('2 Guests');

  // Form state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewReady, setPreviewReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverySucceeded, setDeliverySucceeded] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');

  // Synchronize preselected plan if passed
  useEffect(() => {
    setSelectedConfig(preselectedPlan || project.floorPlans[0]?.name || '');
    setPreviewReady(false);
    setDeliverySucceeded(false);
    setDeliveryError('');
  }, [preselectedPlan, project.id, project.floorPlans]);

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!visitorName.trim()) {
      errs.name = 'Please enter your full name';
    }

    const cleanPhone = visitorPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!visitorEmail.trim() || !visitorEmail.includes('@') || !visitorEmail.includes('.')) {
      errs.email = 'Please provide a valid email address';
    }

    if (needsCab && !pickupAddress.trim()) {
      errs.pickupAddress = `Please provide your pickup location in ${project.location.city}`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setDeliveryError('');
    const deliveryUrl = SITE_CONFIG.enquiryDeliveryUrl;

    if (!deliveryUrl) {
      setDeliverySucceeded(false);
      setPreviewReady(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(deliveryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          selectedDate,
          selectedSlot,
          selectedConfig,
          visitorName,
          visitorPhone,
          visitorEmail,
          guestsCount,
          needsPickupAssistance: needsCab,
          pickupAddress: needsCab ? pickupAddress : '',
        }),
      });

      if (!response.ok) throw new Error(`Delivery failed with status ${response.status}`);
      setDeliverySucceeded(true);
      setPreviewReady(true);
    } catch {
      setDeliveryError('The request could not be delivered. Please try again after the contact destination is checked.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRequest = () => {
    setPreviewReady(false);
    setDeliveryError('');
  };

  // Generate a personal reminder only. This is deliberately not a confirmed booking.
  const handleDownloadCalendar = () => {
    const slotTimes = {
      Morning: ['100000', '130000'],
      Afternoon: ['130000', '160000'],
      Evening: ['160000', '190000'],
    } as const;
    const [startTime, endTime] = slotTimes[selectedSlot];
    const title = `Personal reminder — contact ${project.name} about a site visit`;
    const description = `Personal reminder only. No appointment has been sent or confirmed. Preferred layout: ${selectedConfig}.`;
    const loc = `${project.name}, ${project.location.address}`;
    
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//${SITE_CONFIG.businessName}//Personal Site Visit Reminder//EN`,
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${loc}`,
      `DTSTART:${selectedDate.replace(/-/g, '')}T${startTime}`,
      `DTEND:${selectedDate.replace(/-/g, '')}T${endTime}`,
      'STATUS:TENTATIVE',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Personal_Reminder_${project.name}_${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="sitevisit" className="scroll-mt-24 py-16 sm:py-24 bg-stone-100 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            06. Site Visit Planner
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Plan a Site Visit
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Choose a preferred date and layout for {project.name}. {SITE_CONFIG.enquiryDeliveryUrl ? 'Submitting sends a request to the configured destination, but does not confirm an appointment.' : 'This form is a frontend demo and does not send or confirm an appointment.'}
          </p>
          {!SITE_CONFIG.enquiryDeliveryUrl && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Demo mode: no enquiry delivery destination is configured.
            </p>
          )}
        </div>

        <div className="mt-12">
          {previewReady ? (
            /* Honest local-only preview card */
            <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-stone-900 px-8 py-6 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{deliverySucceeded ? 'Request Delivered' : 'Demo Preview Only'}</span>
                  </div>
                  <h3 className="mt-1 font-serif text-2xl text-stone-50">
                    Personal Site Visit Reminder
                  </h3>
                </div>
                <AlertCircle className="h-6 w-6 text-amber-400" aria-hidden="true" />
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Date</span>
                    <div className="mt-1 font-semibold text-stone-900 text-sm">{selectedDate}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Time Slot</span>
                    <div className="mt-1 font-semibold text-stone-900 text-sm">
                      {selectedSlot === 'Morning' && '10:00 AM – 01:00 PM'}
                      {selectedSlot === 'Afternoon' && '01:00 PM – 04:00 PM'}
                      {selectedSlot === 'Evening' && '04:00 PM – 07:00 PM'}
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Preferred Plan</span>
                    <div className="mt-1 font-semibold text-stone-900 text-sm">{selectedConfig}</div>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Pickup Request</span>
                    <div className="mt-1 font-semibold text-amber-800 text-sm">
                      {needsCab ? 'Requested, not confirmed' : 'Not requested'}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-stone-200 bg-amber-50/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <AlertCircle className="h-4 w-4 text-amber-800" />
                    <span>{deliverySucceeded ? 'Request sent; appointment still pending' : 'No appointment has been sent or confirmed'}</span>
                  </div>
                  <p className="text-stone-600">
                    {deliverySucceeded
                      ? 'Your preferences were delivered to the configured enquiry destination. The project team must still contact you to confirm availability.'
                      : 'This frontend demo validated the details locally only. Nothing was stored or delivered because no approved enquiry destination is configured.'}
                  </p>
                  {needsCab && (
                    <p className="text-amber-900 font-medium">
                      Pickup preference: {pickupAddress}. Availability must be confirmed directly by the project team.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadCalendar}
                    className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-amber-400" />
                    <span>Download Personal Reminder (.ics)</span>
                  </button>

                  <button
                    onClick={handleEditRequest}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span>Edit Request Details</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Booking Form */
            <form
              onSubmit={handleBookingSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Date & Slot Selection */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
                {/* 1. Date Selection (Next 14 Days) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-amber-700" />
                      <span>1. Select Date of Visit</span>
                    </label>
                    <span className="text-xs text-stone-400">Open 7 days a week</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDates.slice(0, 7).map((d) => {
                      const isSelected = selectedDate === d.fullDate;
                      return (
                        <button
                          key={d.fullDate}
                          type="button"
                          onClick={() => setSelectedDate(d.fullDate)}
                          aria-pressed={isSelected}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-800 bg-stone-900 text-white shadow-sm'
                              : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <div className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                            {d.dayName}
                          </div>
                          <div className="mt-0.5 font-serif text-lg font-bold tabular-nums">
                            {d.dayNumber}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {d.monthName}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Second week row */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                    {availableDates.slice(7, 14).map((d) => {
                      const isSelected = selectedDate === d.fullDate;
                      return (
                        <button
                          key={d.fullDate}
                          type="button"
                          onClick={() => setSelectedDate(d.fullDate)}
                          aria-pressed={isSelected}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-800 bg-stone-900 text-white shadow-sm'
                              : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <div className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                            {d.dayName}
                          </div>
                          <div className="mt-0.5 font-serif text-lg font-bold tabular-nums">
                            {d.dayNumber}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {d.monthName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Preferred Time Slot */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 mb-3">
                    <Clock className="h-4 w-4 text-amber-700" />
                    <span>2. Preferred Time Window</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSlot('Morning')}
                      aria-pressed={selectedSlot === 'Morning'}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSlot === 'Morning'
                          ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold">Morning Slot</div>
                      <div className="text-xs text-stone-500 mt-0.5">10:00 AM – 01:00 PM</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSlot('Afternoon')}
                      aria-pressed={selectedSlot === 'Afternoon'}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSlot === 'Afternoon'
                          ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold">Afternoon Slot</div>
                      <div className="text-xs text-stone-500 mt-0.5">01:00 PM – 04:00 PM</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSlot('Evening')}
                      aria-pressed={selectedSlot === 'Evening'}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSlot === 'Evening'
                          ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold">Sunset / Evening Slot</div>
                      <div className="text-xs text-stone-500 mt-0.5">04:00 PM – 07:00 PM</div>
                    </button>
                  </div>
                </div>

                {/* 3. Optional pickup-assistance preference */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-amber-100/70 text-amber-800">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-900">
                          Request Pickup Assistance
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Record a pickup preference for discussion with the project team. This does not confirm availability.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={needsCab}
                        onChange={(e) => setNeedsCab(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                    </label>
                  </div>

                  {needsCab && (
                    <div className="mt-4 pt-4 border-t border-stone-200 animate-in fade-in">
                      <label htmlFor="pickup-address" className="block text-xs font-medium text-stone-700 mb-1">
                        Pickup Address / Landmark in {project.location.city} *
                      </label>
                      <input
                        type="text"
                        id="pickup-address"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="e.g. Kondapur, Gachibowli, Kukatpally, Madhapur, Jubliee Hills..."
                        className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 bg-white"
                      />
                      {errors.pickupAddress && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.pickupAddress}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Visitor Information & Confirmation */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Visitor Contact Details
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    In demo mode these details remain in this browser tab and are not transmitted or stored.
                  </p>
                </div>

                {/* Configuration of interest */}
                <div>
                  <label htmlFor="selected-config" className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Unit Layout of Interest
                  </label>
                  <select
                    id="selected-config"
                    value={selectedConfig}
                    onChange={(e) => setSelectedConfig(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 bg-stone-50"
                  >
                    {project.floorPlans.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name} ({plan.superBuiltUpArea.toLocaleString('en-IN')} sq.ft)
                      </option>
                    ))}
                    <option value="Undecided / Comprehensive Tour">Undecided / Comprehensive Tour</option>
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="visitor-name" className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      id="visitor-name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full rounded-lg border border-stone-300 pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="visitor-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs font-mono font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="visitor-phone"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full rounded-r-lg border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono tabular-nums"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="visitor-email" className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      id="visitor-email"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="ramesh.varma@example.com"
                      className="w-full rounded-lg border border-stone-300 pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Guests */}
                <div>
                  <label htmlFor="guest-count" className="block text-xs font-semibold text-stone-700 mb-1">
                    Accompanying Visitors
                  </label>
                  <select
                    id="guest-count"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 bg-white"
                  >
                    <option value="1 Guest">Self (1 Guest)</option>
                    <option value="2 Guests">With Spouse / Co-buyer (2 Guests)</option>
                    <option value="3-4 Guests">With Family (3-4 Guests)</option>
                    <option value="5+ Guests">Group (5+ Guests)</option>
                  </select>
                </div>

                {/* Summary Box */}
                <div className="pt-2 text-xs text-stone-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Selected Date:</span>
                    <span className="font-semibold text-stone-800">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Window:</span>
                    <span className="font-semibold text-stone-800">{selectedSlot}</span>
                  </div>
                </div>

                {/* Submit Action */}
                {deliveryError && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {deliveryError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-stone-900 py-3.5 text-xs font-semibold text-white shadow-md hover:bg-stone-800 transition-all active:scale-98 cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Sending Request...' : SITE_CONFIG.enquiryDeliveryUrl ? 'Send Site Visit Request' : 'Review Demo Request'}</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                  <span>{SITE_CONFIG.enquiryDeliveryUrl ? 'Sent only to the configured enquiry destination' : 'Local-only demo · No data is sent'}</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
