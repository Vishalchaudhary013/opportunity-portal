import React from 'react'
import SectionTitle from '../../SectionTitle'
import DegreeCard from '../DegreeCard'
import { degreesData } from '../degreesData'

const IntegratedDegreesSection = () => {
  const integratedDegrees = degreesData.filter(d => d.degreeType === 'Integrated').slice(0, 4);

  return (
   <div className='py-10 bg-gray-100'>
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto">
        <SectionTitle title={"Integrated Degrees"} subtitle={"5-Years UG+PG programs"} viewAllLink="/integrated-degrees"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {integratedDegrees.map((degree, idx) => (
            <DegreeCard key={degree.id} degree={degree} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntegratedDegreesSection
