import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { Link } from 'react-router-dom'
import { FaCode, FaLongArrowAltRight } from 'react-icons/fa'
import { FolderOpen, CalendarDays, MonitorPlay, Briefcase } from 'lucide-react'
import { IoCodeSlashOutline } from 'react-icons/io5'

const Bootcamps = () => {
    const categories = [
      { name: "Project-Based Learning", icon: <FolderOpen size={16} /> },
      { name: "Weekend Friendly", icon: <CalendarDays size={16} /> },
      { name: "Live Coding", icon: <IoCodeSlashOutline size={16} /> },
      { name: "Design", icon: <MonitorPlay size={16} /> },
      { name: "Portfolio Ready", icon: <Briefcase size={16} /> },
    ];

    return (
        <>
            <div className="">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Workshops & Bootcamps" subtitle="Master Specific, High-Income Skills in Intensive, Fast-Paced Formats" defination={"Short, high-intensity immersive training modules designed to rapidly upskill candidates in a specific tool, framework, or methodology through project-based learning."} viewAllLink="/workshops-and-bootcamps"/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
        </>
    )
}

export default Bootcamps
