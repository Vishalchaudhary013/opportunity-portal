import React from 'react'
import { Link } from 'react-router-dom'
import { LiaStarSolid } from "react-icons/lia";

const Testimonials = () => {
    return (
        <>
            <div className='bg-gray-100'>
                <div className='w-[1350px] mx-auto py-10'>
                    <div className='grid grid-cols-12 gap-14'>
                        {/* left part */}
                        <div className="col-span-5 ">
                            <div className='grid grid-cols-2  gap-14'>
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl shadow-sm p-4 relative">

                                        <div className="absolute -top-8.5 left-1/6 -translate-x-1/2  ">
                                            {/* <img src="https://i.pinimg.com/736x/28/e5/6c/28e56c34e04a4baa7a58d2f6c3eff698.jpg" alt="" className='bg-white w-11 h-11 rotate-180' /> */}
                                        </div>




                                        <p className=' text-[13px]  pr-7 pl-4 font-medium  mb-4'>
                                            Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.
                                        </p>

                                        <div className='leading-4.5'>
                                            <h4>James Brown</h4>
                                            <span className='text-[10.5px]'>CEO Doping Company <Link to='' className='text-blue-500'>@YourHosting</Link></span>
                                        </div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-17 h-17 rounded-full border-6 border-white overflow-hidden ">


                                            <img src="https://st.depositphotos.com/1144472/2003/i/450/depositphotos_20030237-stock-photo-cheerful-young-man-over-white.jpg" alt="" className='object-cover rounded-full' />





                                        </div>

                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-4">

                                    </div>

                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-4 relative mt-11">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-25 h-25 rounded-full border bg-white overflow-hidden border-6 border-white">
                                        <img src="https://st.depositphotos.com/1144472/2003/i/450/depositphotos_20030237-stock-photo-cheerful-young-man-over-white.jpg" alt="" className='object-cover rounded-full' />
                                    </div>
                                    <div className="flex justify-center mt-10 mb-2 gap-1 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((indx) => (
                                            <LiaStarSolid size={20} key={indx} />
                                        ))}
                                    </div>

                                    <h3 className='text-center font-semibold mb-1'>I really appreciate!!</h3>

                                   <p className=' text-[13px] px-2  font-medium  mb-4'>
                                            Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.
                                        </p>

                                         <div className='leading-4.5'>
                                            <h4>James Brown</h4>
                                            <span className='text-[10.5px]'>CEO Doping Company <Link to='' className='text-blue-500'>@YourHosting</Link></span>
                                        </div>

                                </div>
                                <div className="border p-5 col-span-2">


                                </div>

                            </div>
                        </div>
                        {/* middle part */}
                        <div className="col-span-3 space-y-6 ">
                            <div className="border p-5 h-30"></div>
                            <div className="border p-5 h-21"></div>
                        </div>

                        {/* right part */}

                        <div className="col-span-4 space-y-6">
                            <div className="border p-5 relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border bg-white">
                                </div>
                            </div>
                            <div className="border p-5 h-16"></div>
                            <div className="border p-5 h-18"></div>


                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonials
