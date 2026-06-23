import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { CheckCircle, Users, Building, Microscope } from 'lucide-react'

const MastersDegrees = () => {
  const categories = [
    { name: "UGC/AICTE Approved", icon: <CheckCircle size={16} /> },
    { name: "Alumni Network", icon: <Users size={16} /> },
    { name: "Campus Placements", icon: <Building size={16} /> },
    { name: "Research Focus", icon: <Microscope size={16} /> },
  ];

  return (
    <div>
      <div className="">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Masters' Degrees - M.Tech / MBA / M.Sc" subtitle="Deepen Your Academic Specialization and Leadership Potential" defination={"Formal postgraduate university education focusing on comprehensive academic research, advanced technical expertise, or organizational leadership frameworks."} viewAllLink="/masters-degrees"/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
    </div>
  )
}

export default MastersDegrees
