import React from 'react'
import SectionTitle from '../../SectionTitle'
import DegreeCard from '../DegreeCard'
import { degreesData } from '../degreesData'

const Phd = () => {
  const phdDegrees = degreesData.filter(d => d.level === "Doctorate").slice(0, 4);

  return (
    <div className='py-10 '>
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto">
        <SectionTitle title={"Doctoral & Ph.D. Programs"} subtitle={"Terminal research and terminal degrees"} viewAllLink='/phd-programs'/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {phdDegrees.map((degree, idx) => (
            <DegreeCard key={degree.id} degree={degree} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Phd
