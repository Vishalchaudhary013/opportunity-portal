import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { Link } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { Wallet, ShieldCheck, Briefcase, Users } from 'lucide-react'

const Apprenticeships = () => {
    const categories = [
      { name: "Earn While Learning", icon: <Wallet size={16} /> },
      { name: "Govt. Certified", icon: <ShieldCheck size={16} /> },
      { name: "Long-Term Employment", icon: <Briefcase size={16} /> },
      { name: "Structured Mentorship", icon: <Users size={16} /> },
    ];

    return (
        <>
            <div className=" bg-[]">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Apprenticeships" subtitle="Earn While You Learn with Structured On-the-Job Training" defination="A formal, long-term training program combining paid employment with technical instruction. Apprenticeships focus on developing highly specific, mastery-level trade and corporate skills." viewAllLink="/apprenticeships"/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
        </>
    )
}

export default Apprenticeships
