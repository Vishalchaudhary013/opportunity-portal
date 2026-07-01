import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Instagram from '../components/Instagram'
import Linkedinn from '../components/Linkedinn'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'

const Resource = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  return (
    <div className=" pb-20">
      {(!tab || tab === 'testimonials') && <Testimonials />}
      {(!tab || tab === 'gallery') && <Gallery />}
       {(!tab || tab === 'instagram') && <Instagram />}
        {(!tab || tab === 'linkdin') && <Linkedinn />}
      
    </div>
  )
}

export default Resource
