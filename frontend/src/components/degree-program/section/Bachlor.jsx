import React from 'react'
import SectionTitle from '../../SectionTitle'
import DegreeCard from '../DegreeCard'
import { degreesData } from '../degreesData'

const Bachlor = () => {
  const bachelorDegrees = degreesData.filter(d => d.degreeType === 'Bachelor').slice(0, 4);

  return (
    <section className="py-10 bg-slate-50">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto">
        <SectionTitle title={"Bachelor’s Degrees"} subtitle={"4-Year undergraduate programs"} viewAllLink="/bachelors-degrees"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {bachelorDegrees.map((degree, idx) => (
            <DegreeCard key={degree.id} degree={degree} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Bachlor
