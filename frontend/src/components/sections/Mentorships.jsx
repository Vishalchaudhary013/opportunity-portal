import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { UserPlus, FileText, Target, Share2 } from 'lucide-react'

const Mentorships = () => {
  const categories = [
    { name: "1:1 Dedicated Sessions", icon: <UserPlus size={16} /> },
    { name: "Resume & Portfolio Reviews", icon: <FileText size={16} /> },
    { name: "Mock Interview Drills", icon: <Target size={16} /> },
    { name: "Industry Referrals", icon: <Share2 size={16} /> },
  ];

  return (
    <div>
      <div className="bg-[#F8F9FE]">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Industry Mentorships" subtitle="Accelerate Your Growth Under the Guidance of Industry Veterans" defination={"One-on-one or small-group advisory sessions led by established professionals. Mentorships provide personalized career steering, resume reviews, interview strategies, and insider industry insights."}/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
    </div>
  )
}

export default Mentorships
