import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { Globe, Clock, TrendingUp, Award } from 'lucide-react'

const CertificatePrograms = () => {
  const categories = [
    { name: "Global Certification", icon: <Globe size={16} /> },
    { name: "Self-Paced Learning", icon: <Clock size={16} /> },
    { name: "Resume Multiplier", icon: <TrendingUp size={16} /> },
    { name: "Vendor Endorsed", icon: <Award size={16} /> },
  ];

  return (
    <div>
      <div className="">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Most In-Demand Skill Certificate Programs" subtitle="Validate Your Expertise with Top-Tier Industry Credentials" defination={"Targeted certifications mapped directly to current global hiring trends. These programs focus entirely on building and certifying proficiency in elite enterprise tools and modern frameworks."}/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
    </div>
  )
}

export default CertificatePrograms
