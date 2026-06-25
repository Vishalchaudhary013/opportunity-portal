import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Calendar } from 'lucide-react';

export default function BookingModal({ branch, onClose }) {
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: 'Morning (9:30 AM - 12:30 PM)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
    }, 1200);
  };

  if (!branch) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900 z-50 cursor-default"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-x-4 top-[5%] bottom-[5%] md:top-[10%] md:bottom-auto md:max-h-[85vh] md:max-w-lg md:mx-auto bg-white rounded-[32px] shadow-2xl z-50 overflow-hidden flex flex-col border border-slate-100 text-slate-800"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left shrink-0">
          <div>
            <h3 className="text-xl font-bold text-[#0F141E]" >Book an Appointment</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              At Edeco {branch.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-[#0F141E] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-left">
          {isSubmitSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#1F2853]/10 text-[#1F2853] flex items-center justify-center mb-6">
                <CheckCircle2 size={36} className="text-[#1F2853]" />
              </div>
              <h4 className="text-xl font-bold text-[#0F141E] mb-2" >Appointment Requested!</h4>
              <p className="text-sm text-slate-555 font-medium max-w-sm">
                Thank you. We have received your request for Edeco {branch.name}. A representative will contact you shortly to confirm your booking.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-6 py-2.5 bg-[#FF4E45] hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                
              >
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">First Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.firstName}
                    onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.lastName}
                    onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Preferred Slot</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E]"
                  >
                    <option>Morning (9:30 AM - 12:30 PM)</option>
                    <option>Afternoon (12:30 PM - 3:30 PM)</option>
                    <option>Evening (3:30 PM - 6:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Message (Optional)</label>
                <textarea
                  rows={3}
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Admissions guidance, course details..."
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#1F2853] focus:ring-2 focus:ring-[#1F2853]/10 outline-none transition-all text-xs font-semibold text-[#0F141E] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#FF4E45] text-white hover:opacity-90 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 text-sm"
                
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Calendar size={16} />
                    Confirm Appointment Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
