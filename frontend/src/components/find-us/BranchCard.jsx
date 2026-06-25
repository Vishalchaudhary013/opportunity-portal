import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ChevronRight, ArrowRight, Navigation } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

export default function BranchCard({ branch, index, onBookClick, onVisitClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]  transition-all duration-300 group text-left"
    >
      <div>
        {/* Header Tag Row */}
        <div className="flex justify-between items-center mb-4">
          {/* State Tag */}
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F2853]/10 text-[#1F2853]">
            {branch.state}
          </span>
          {/* Get Directions */}

        </div>

        {/* Branch Title */}
        <h3 className="text-xl font-bold text-[#0F141E] mb-4.5 group-hover:text-[#1F2853] transition-colors" >
          {branch.name}
        </h3>

        {/* Contact Details */}
        <div className="space-y-4 mb-6 text-[#0F141E]">
          {/* Address */}
          <div className="flex gap-3 items-start">
            <MapPin size={16} className="text-[#1F2853] shrink-0 mt-0.5" />
            <div className="text-[13px] leading-relaxed text-slate-600 font-sans font-medium">
              {branch.address}
            </div>
          </div>

          {/* Phone */}
          {branch.phones && branch.phones.length > 0 && (
            <div className="flex gap-3 items-start">
              <Phone size={16} className="text-[#1F2853] shrink-0 mt-0.5" />
              <div className="flex flex-col text-[13px] text-slate-600 font-sans font-medium">
                {branch.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="hover:text-[#1F2853] transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex gap-3 items-center">
            <Mail size={16} className="text-[#1F2853] shrink-0" />
            <a
              href={`mailto:${branch.email}`}
              className="text-[13px] text-slate-600 font-sans font-medium hover:text-[#1F2853] transition-colors"
            >
              {branch.email}
            </a>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-50 shrink-0">
        {/* Get Directions */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-500/8 text-amber-600 hover:bg-amber-500 hover:text-white font-bold transition-all duration-200 cursor-pointer text-xs tracking-wide w-full text-center"
        >
          <Navigation size={12} className="shrink-0" />
          <span className="truncate">Directions</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent("Hi Edeco, I would like to learn more about the admissions guidelines and courses at the " + branch.name + " branch.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#25D366]/10 bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition-all duration-200 cursor-pointer w-full text-center"
        >
          <FaWhatsapp size={16}/>
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Book an Appointment */}
        <button
          onClick={() => onBookClick(branch)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-red-600 text-white hover:opacity-90 font-bold cursor-pointer text-xs w-full text-center"
        >
          <span className="truncate">Book Appointment</span>
          <ChevronRight size={14} className="shrink-0" />
        </button>

        {/* Visit Branch */}
        <button
          onClick={() => onVisitClick(branch)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F141E] font-bold transition-all duration-200 cursor-pointer text-xs w-full text-center"
        >
          <span className="truncate">Visit Branch</span>
          <ArrowRight size={14} className="shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
