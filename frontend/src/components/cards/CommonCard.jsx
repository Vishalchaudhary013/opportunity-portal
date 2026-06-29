import React from "react";
import { Link } from "react-router-dom";
import { RiArrowRightUpLongLine } from "react-icons/ri";
import { formatStipendText, getInternshipTags } from "../../utils/internshipCardData";

const getTimeAgo = (createdAt) => {
  if (!createdAt) return 'Recently';
  const days = Math.max(0, Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)));
  if (days === 0) return "Today";
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
};

const CommonCard = ({ item }) => {
  return (
    <div className="rounded-md bg-white shadow p-4 h-full">
      <div className="flex flex-col gap-15">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="w-9.5 h-9.5 rounded-md border border-black/5 flex items-center justify-center overflow-hidden">
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.company}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-black text-white font-semibold flex items-center justify-center">
                  {String(item.company || "I")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-medium text-[15px]">{item.company}</span>
            {/* <span className="text-sm text-gray-600 font-medium italic tracking-[-1px]">
              {getTimeAgo(item.createdAt)}
            </span> */}
          </div>

          <h3 className="text-[20px] font-semibold mb-2">{item.title}</h3>

          <div className="flex items-center flex-wrap gap-1.5">
            {
              getInternshipTags(item).slice(0, 2).map((tag, index) => (
                <div className="rounded-md px-3 bg-gray-100 text-gray-700 text-[13px] py-[2px]" key={index}>{tag}</div>
              ))
            }
          </div>
        </div>

        <div className="flex items-center pt-3 justify-between gap-1 mt-auto border-t border-black/10">
          <div className="flex flex-col leading-5">
            <span className="inline-flex items-baseline gap-1 text-[15.5px]">
              {formatStipendText(item)}
              {/\d/.test(formatStipendText(item)) && (
                <span className="text-[13px] font-normal text-gray-600 tracking-tight">
                  {item.stipendDetails?.period?.toLowerCase().includes('year') ? '/ year' : '/ month'}
                </span>
              )}
            </span>
            {/* <span className="text-[13.5px] font-medium">{item.location}</span> */}
          </div>

          <Link to={`/internship/${item.id}`} className="bg-[#1F2853] px-4 text-white rounded-md py-1 flex items-center gap-1">
            Apply <RiArrowRightUpLongLine />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommonCard;
