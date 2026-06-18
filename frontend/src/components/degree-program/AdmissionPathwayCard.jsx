import logo from  "../../assets/images/admissionSection.png";
const AdmissionPathwayCard = ({
  university,
  title,
  description,
  deadline,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 hover:shadow-md transition">
      
      {/* LOGO */}
      <div className="flex items-center justify-center h-[120px] mb-4">
        <img
          src={logo}
          alt={university}
          className="h-[120px] object-contain"
        />
      </div>

      {/* UNIVERSITY */}
      <p className="text-[13px] text-gray-600 mb-1">
        {university}
      </p>

      {/* TITLE */}
      <h3 className="text-[16px] font-semibold text-[#1f1f1f] mb-3 leading-snug">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
        {description}
      </p>

      {/* DEADLINE */}
      <p className="text-[11px] text-gray-500">
        {deadline}
      </p>
    </div>
  );
};

export default AdmissionPathwayCard;
