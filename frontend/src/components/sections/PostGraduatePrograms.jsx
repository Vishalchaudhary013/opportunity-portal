import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { ShieldCheck, Network, Award, CreditCard } from 'lucide-react'

const PostGraduatePrograms = () => {
  const categories = [
    { name: "100% Placement Commitment", icon: <ShieldCheck size={16} /> },
    { name: "Hiring Partner Ecosystem", icon: <Network size={16} /> },
    { name: "Capstones", icon: <Award size={16} /> },
    { name: "Pay-After-Placement Options", icon: <CreditCard size={16} /> },
  ];

  return (
    <div>
      <div className="bg-[#F8FAFC]">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Post Graduate Programs - 100% Placement Assured" subtitle="Elite Professional Training Backed by Strong Placement Assurances" defination={"Comprehensive, rigorous career-transition programs specifically designed to turn generic graduates into specialized, corporate-ready talent with formal hiring legal clauses."} viewAllLink="/post-graduate-programs"/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
    </div>
  )
}

export default PostGraduatePrograms
