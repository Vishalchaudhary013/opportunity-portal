import React from 'react'
import SectionTitle from '../SectionTitle'
import { Link } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'

const Bootcamps = () => {
    return (
        <>
            <div className="">
                <div className="w-[1350px] mx-auto py-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <SectionTitle title={"In-Demands Program"} subtitle={"Gain practical skills through expert-led bootcamps and hands-on learning."} />
                        </div>
                        <Link
                            to="/bootcamps"
                            className="font-medium flex gap-2 items-center text-slate-900 bg-red-600 text-white py-1 px-4 rounded-md"
                        >
                            View All
                            <FaLongArrowAltRight />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Bootcamps
