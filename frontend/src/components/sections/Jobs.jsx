import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { Link } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { Banknote, ClipboardCheck, TrendingUp, Gift } from 'lucide-react'

const Jobs = () => {
  const categories = [
    { name: "Full-Time CTC", icon: <Banknote size={16} /> },
    { name: "Comprehensive Onboarding", icon: <ClipboardCheck size={16} /> },
    { name: "Annual Performance Bonuses", icon: <TrendingUp size={16} /> },
    { name: "Corporate Benefits", icon: <Gift size={16} /> },
  ];

  return (
    <>

    <div className="">
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Entry-Level Jobs" subtitle="Kickstart Your Professional Career with Roles Built for Freshers"  defination="Full-time corporate openings designed specifically for recent graduates. These positions expect limited professional experience and prioritize potential, adaptability, and fundamental skill sets." viewAllLink="/entry-level-jobs"/>
          </div>
          <FilterChips categories={categories} />
                </div>
    </div>
      
    </>
  )
}

export default Jobs
