import { motion } from 'framer-motion';
import { X, MapPin, Phone, Mail, Clock, Check, Compass, ArrowRight, Calendar } from 'lucide-react';

export default function VisitModal({ branch, onClose, onBookClick }) {
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
            <h3 className="text-xl font-bold text-[#0F141E]" >{branch.name}</h3>
            <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#1F2853]/10 text-[#1F2853]">
              {branch.state} Edeco Office
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-[#0F141E] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-left space-y-6">
          {/* Branch Info Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#1F2853]" /> Office Address
              </h4>
              <p className="text-[13px] font-semibold text-slate-700 leading-relaxed font-sans pl-5">
                {branch.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Phone size={12} className="text-[#1F2853]" /> Phone Numbers
                </h4>
                <div className="flex flex-col text-[13px] text-slate-700 pl-5 font-sans font-semibold">
                  {branch.phones.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-[#1F2853] transition-colors">
                      {p}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-[#1F2853]" /> Email Address
                </h4>
                <div className="text-[13px] text-slate-700 pl-5 font-sans font-semibold">
                  <a href={`mailto:${branch.email}`} className="hover:text-[#1F2853] transition-colors">
                    {branch.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Clock size={12} className="text-[#1F2853]" /> Operating Hours
              </h4>
              <div className="text-[13px] font-semibold text-slate-600 pl-5 font-sans space-y-1">
                <p className="flex justify-between max-w-[220px]"><span>Monday - Saturday:</span> <span className="text-[#0F141E]">9:30 AM - 6:00 PM</span></p>
                <p className="flex justify-between max-w-[220px]"><span>Sunday:</span> <span className="text-red-500 font-bold">Closed</span></p>
              </div>
            </div>
          </div>

          {/* Features checklist */}
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-[#0F141E] mb-2.5" >Services Available at this Office:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-650">
              {[
                "Free Admission Counselling",
                "College Shortlisting",
                "Visa Guidance",
                "Document Verification",
                "Expert Consultations",
                "Test Preparation Help"
              ].map((svc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-[#1F2853] shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map Mockup Placeholder */}
          <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden group/map border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 via-slate-100 to-slate-200/50 animate-glow"></div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <Compass size={24} className="text-[#1F2853] animate-bounce" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Map directions loading...</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-[#1F2853]/90 opacity-0 group-hover/map:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-bold gap-1.5 cursor-pointer"
            >
              Open in Google Maps <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex gap-3 shrink-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
          >
            <MapPin size={14} />
            Get Directions
          </a>
          <button
            onClick={() => onBookClick(branch)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-[#FF4E45] text-white hover:opacity-90 text-xs font-bold shadow-sm transition-all duration-300 cursor-pointer"
            
          >
            <Calendar size={14} />
            Book Session
          </button>
        </div>
      </motion.div>
    </>
  );
}
