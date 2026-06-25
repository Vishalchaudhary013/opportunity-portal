import React from 'react'
import SectionTitle from '../../SectionTitle'
import DegreeCard from '../DegreeCard'
import { degreesData } from '../degreesData'

const Master = () => {
  const masterDegrees = degreesData.filter(d => d.level === "Master's" || d.level === "MBA").slice(0, 4);

  return (
    <section className=" bg-white py-10">
      <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto">
        <SectionTitle title={"Master’s Degrees"} subtitle={"Advanced graduate specializations"} viewAllLink="/masters-degrees"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {masterDegrees.map((degree, idx) => (
            <DegreeCard key={degree.id} degree={degree} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Master
