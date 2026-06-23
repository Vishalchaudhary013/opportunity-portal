import React from 'react'
import SectionTitle from '../SectionTitle'
import FilterChips from '../FilterChips'
import { Clock, BookOpen, Unlock, Award } from 'lucide-react'

const IntegratedDegrees = () => {
  const categories = [
    { name: "Time-Saving Track", icon: <Clock size={16} /> },
    { name: "Continuous Curriculum", icon: <BookOpen size={16} /> },
    { name: "No Re-Entrance Exams", icon: <Unlock size={16} /> },
    { name: "Dual Degree Advantage", icon: <Award size={16} /> },
  ];

  return (
    <div>
      <div className="bg-[#F8F9FE]">
                <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
                   <div className="mb-5">
            <SectionTitle title="Integrated Degrees - UG - PG" subtitle="Seamless Transition from Bachelor’s to Master’s with Unified Tracks" defination={"An accelerated dual-degree model combining both Undergraduate and Postgraduate studies into a single, cohesive curriculum, saving both time and application overhead."} viewAllLink="/integrated-degrees"/>
          </div>
          <FilterChips categories={categories} />
                </div>
            </div>
    </div>
  )
}

export default IntegratedDegrees
