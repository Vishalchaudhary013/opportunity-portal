import React from "react";
import { Link } from "react-router-dom";
import { LiaStarSolid } from "react-icons/lia";
const data = [
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
    title: "Logoipsum",
    data: "How Puno Automated 80% of Lead Handling",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
   {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
   {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
   {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
    title: "TechFlow",
    data: "Increasing conversions by 150%",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
    title: "TechFlow",
    data: "Increasing conversions by 150%",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
    title: "TechFlow",
    data: "Increasing conversions by 150%",
  },
  {
    type: "image",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s",
    title: "James Brown",
    subtitle: "CEO Doping Company",
    data: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin.",
  },
  // {
  //   type: "video",
  //   src: "https://www.w3schools.com/html/mov_bbb.mp4",
  //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
  //   title: "TechFlow",
  //   data: "Increasing conversions by 150%",
  // },
  // {
  //   type: "video",
  //   src: "https://www.w3schools.com/html/mov_bbb.mp4",
  //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
  //   title: "TechFlow",
  //   data: "Increasing conversions by 150%",
  // },
  // {
  //   type: "video",
  //   src: "https://www.w3schools.com/html/mov_bbb.mp4",
  //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
  //   title: "TechFlow",
  //   data: "Increasing conversions by 150%",
  // },

  // {
  //   type: "video",
  //   src: "https://www.w3schools.com/html/mov_bbb.mp4",
  //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nsLLKYV9nVxC2XvyXbqYlhFDYybsvRC12lJoGAj4ug&s=10",
  //   title: "TechFlow",
  //   data: "Increasing conversions by 150%",
  // }
];

const VideoCard = ({ item }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
      className="relative w-full aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer"
      onClick={togglePlay}
    >
     
      <video
        ref={videoRef}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        poster="/images/video-thumbnail.jpg"
        loop
        playsInline
      >
        <source src={item.src} type="video/mp4" />
      </video>

      
      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

      
      <button 
        className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition text-white z-10"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

     
      <div className={`flex items-center gap-1.5 absolute bottom-24 left-6 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src={item.logo}
          alt={item.title}
          className="h-10 w-10 object-contain"
        />

        <h5 className="text-white text-xl font-semibold">{item.title}</h5>
      </div>

      
      <div className={`absolute bottom-8 left-6 right-6 text-white transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-2xl font-bold leading-tight">
          {item.data}
        </h3>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (

    
    <>
      <div className="">
        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10 mt-10">
          <h2 className=" mb-10 text-4xl font-semibold">Testimonials</h2>
          <div className="columns-1 md:columns-2 lg:columns-4 gap-5 space-y-5">
            {
              data.map((item, index) => (
                <div key={index} className="break-inside-avoid">
                  {
                    item.type === 'video' ? (
                      <VideoCard item={item} />
                    ) : (
                      <div className="bg-[#f3f4f6] rounded-xl p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <img src={item.img} alt={item.title} className="w-16 h-16 rounded-full object-cover" />
                          <span className="text-8xl text-gray-300 font-serif leading-none mt-2 tracking-tighter">“</span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-900 text-[17px] mb- leading-tight">{item.title}</h4>
                          <span className="text-[14px] text-gray-500">{item.subtitle}</span>
                        </div>

                        <p className="text-gray-800 text-[15.5px] font-medium leading-relaxed">
                          {item.data}
                        </p>
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>

    // <>
    //   <div className="bg-[#f4faff]">
    //     <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto py-10">
    //       <h2 className=" mb-10 text-4xl font-semibold">Testimonials</h2>
    //       <div className="grid grid-cols-12 gap-10 items-start">
    //         {/* left part */}
    //         <div className="col-span-5 ">
    //           <div className="grid grid-cols-2  gap-10 mb-3">
    //             <div className="space-y-6">
    //               <div className="bg-white rounded-xl shadow-sm p-4 relative">
    //                 <div className="absolute -top-8.5 left-1/6 -translate-x-1/2  ">
    //                   {/* <img src="https://i.pinimg.com/736x/28/e5/6c/28e56c34e04a4baa7a58d2f6c3eff698.jpg" alt="" className='bg-white w-11 h-11 rotate-180' /> */}
    //                 </div>

    //                 <p className=" text-[13px]  pr-7 pl-4 font-medium  mb-4">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin.
    //                 </p>

    //                 <div className="leading-4.5">
    //                   <h4>James Brown</h4>
    //                   <span className="text-[10.5px]">
    //                     CEO Doping Company{" "}
    //                     <Link to="" className="text-blue-500">
    //                       @YourHosting
    //                     </Link>
    //                   </span>
    //                 </div>
    //                 <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-17 h-17 rounded-full border-6 border-white overflow-hidden ">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="object-cover h-full w-full rounded-full"
    //                   />
    //                 </div>
    //               </div>
    //               <div className="bg-white rounded-xl shadow-sm ">
    //                 <p className=" text-[13px]  p-4 font-medium  mb-3">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin.Sodales ut etiam sit amet nisl. Semper
    //                   feugiat nibh sed pulvinar proin.
    //                 </p>

    //                 <div className="py-4 bg-black/10 rounded-b-xl relative ">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="absolute -top-6 right-4 w-15 h-15 rounded-full object-cover border-4 border-white  "
    //                   />

    //                   <div className="leading-4.5 px-4">
    //                     <h4>James Brown</h4>
    //                     <span className="text-[10.5px]">
    //                       CEO Doping Company{" "}
    //                       <Link to="" className="text-blue-500">
    //                         @YourHosting
    //                       </Link>
    //                     </span>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="mt-11 ml-5">
    //               <div className="bg-white rounded-xl shadow-sm p-4 relative ">
    //                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-25 h-25 rounded-full border bg-white overflow-hidden border-6 border-white">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="object-cover h-full w-full rounded-full"
    //                   />
    //                 </div>
    //                 <div className="flex justify-center mt-10 mb-2 gap-1 text-yellow-500">
    //                   {[1, 2, 3, 4, 5].map((indx) => (
    //                     <LiaStarSolid size={20} key={indx} />
    //                   ))}
    //                 </div>

    //                 <h3 className="text-center font-semibold mb-1">
    //                   I really appreciate!!
    //                 </h3>

    //                 <p className=" text-[13px] px-2  font-medium  mb-4">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin. Sodales ut etiam sit amet nisl. Semper
    //                   feugiat nibh sed pulvinar proin. Sodales ut etiam sit amet
    //                   nisl. Semper feugiat nibh sed pulvina
    //                 </p>

    //                 <div className="leading-4.5">
    //                   <h4>James Brown</h4>
    //                   <span className="text-[10.5px]">
    //                     CEO Doping Company{" "}
    //                     <Link to="" className="text-blue-500">
    //                       @YourHosting
    //                     </Link>
    //                   </span>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-span-2 ">
    //               <div className="bg-white rounded-xl shadow-sm p-4 mb-2  relative">
    //                 <h2 className="text-center font-semibold text-xl mb-2">
    //                   I was very impressed!
    //                 </h2>

    //                 <p className="text-center text-[13px]  mb-1 font-medium">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin.Sodales ut etiam sit amet nisl.Sodales ut
    //                   etiam sit amet nisl.
    //                 </p>

    //                 <h4 className="text-center font-medium text-black/75">
    //                   James Brown
    //                 </h4>

    //                 <div className="absolute left-1/2 -bottom-[15.5px] -translate-x-1/2 drop-shadow">
    //                   <div className="w-0 h-0  border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white"></div>
    //                 </div>
    //               </div>

    //               <div className="relative h-24 w-80 mx-auto flex items-center justify-center">
    //                 {/* Left Image */}
    //                 <div className="absolute left-9 top-1/3 -translate-y-1/2">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="w-16 h-16 rounded-full object-cover border-4 border-white"
    //                   />
    //                 </div>

    //                 {/* Center Image */}
    //                 <div className="mt-3">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="w-20 h-20 rounded-full object-cover border-4 border-white"
    //                   />
    //                 </div>

    //                 {/* Right Image */}
    //                 <div className="absolute right-9 top-1/3 -translate-y-1/2">
    //                   <img
    //                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                     alt=""
    //                     className="w-16 h-16 rounded-full object-cover border-4 border-white"
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         {/* middle part */}
    //         <div className="col-span-3 space-y-6 h-full ">
    //           <div className="bg-white rounded-xl shadow-sm p-2 h-90">
    //             <img
    //               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //               alt=""
    //               className="h-65 w-full rounded-lg object-cover"
    //             />

    //             <p className="text-[13px] p-2  font-medium">
    //               Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //               pulvinar proin.
    //             </p>

    //             <h4 className="text-end font-medium text-black/85 px-2">
    //               James Brown
    //             </h4>
    //           </div>

    //           <div className="bg-white rounded-xl shadow-sm p-2 h-60 flex flex-col items-center justify-center">
    //             <img
    //               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //               alt=""
    //               className="h-20 w-20 rounded-full object-cover"
    //             />

    //             <div className="flex justify-center mt-4 gap-1 text-yellow-500">
    //               {[1, 2, 3, 4, 5].map((indx) => (
    //                 <LiaStarSolid size={20} key={indx} />
    //               ))}
    //             </div>

    //             <p className="text-[13px] p-2 text-center font-medium">
    //               "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //               pulvinar proin.dales ut etiam sit "
    //             </p>

    //             <h4 className="text-end font-medium text-black/85 px-2">
    //               James Brown
    //             </h4>
    //           </div>
    //         </div>

    //         {/* right part */}

    //         <div className="col-span-4 space-y-6">
    //           <div className="bg-white rounded-xl shadow-sm p-2 relative h-38 mt-8">
    //             <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white">
    //               <img
    //                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                 alt=""
    //                 className="object-cover h-full w-full rounded-full"
    //               />
    //             </div>

    //             <h4 className="text-center font-medium  mt-10">Good Job!</h4>
    //             <div className="flex justify-center mt-1 gap-1 text-yellow-500">
    //               {[1, 2, 3, 4, 5].map((indx) => (
    //                 <LiaStarSolid size={20} key={indx} />
    //               ))}
    //             </div>
    //             <p className="text-[13px] p-2 text-center font-medium">
    //               "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //               pulvinar proin.dales ut etiam sit "
    //             </p>
    //           </div>
    //           <div className="bg-white rounded-xl shadow-sm p-2 h-46">
    //             <div className="flex justify-between">
    //               <div className="w-1/2">
    //                 <img
    //                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                   alt=""
    //                   className="object-cover h-42 w-48 rounded-lg "
    //                 />
    //               </div>
    //               <div className="w-1/2">
    //                 <p className="text-[13px] px-2 mb-2 font-medium">
    //                   "
    //                   <b>
    //                     Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                     pulvinar proin.dal
    //                   </b>{" "}
    //                   "
    //                 </p>
    //                 <p className="text-[13px] px-2  font-medium">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin.dales ut
    //                 </p>
    //                 <div className="leading-4.5">
    //                   <h4>James Brown</h4>
    //                   <span className="text-[10.5px]">
    //                     CEO Doping Company{" "}
    //                     <Link to="" className="text-blue-500">
    //                       @YourHosting
    //                     </Link>
    //                   </span>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="bg-white rounded-xl shadow-sm p-2 h-59">
    //             <div className="flex justify-between gap-5 p-4">
    //               <div className="w-[65%]">
    //                 <p className="text-[13px] px-2 mb-2 font-medium">
    //                   "
    //                   <b>
    //                     Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                     pulvinar proin.dal
    //                   </b>{" "}
    //                   "
    //                 </p>
    //                 <p className="text-[13px] px-2  font-medium">
    //                   Sodales ut etiam sit amet nisl. Semper feugiat nibh sed
    //                   pulvinar proin.dales ut
    //                 </p>
    //               </div>
    //               <div className="flex flex-col items-center gap-5 w-[45%]">
    //                 <img
    //                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhs1Z5SSVqH0w_4S8R4lnTj0O7Swn4NA5tA&s"
    //                   alt=""
    //                   className="object-cover w-25 h-25  rounded-full "
    //                 />

    //                 <div className="leading-4.5 text-center">
    //                   <h4>James Brown</h4>
    //                   <span className="text-[10.5px] leading-0">
    //                     CEO Doping Company{" "}
    //                     <Link to="" className="text-blue-500">
    //                       @YourHosting
    //                     </Link>
    //                   </span>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};

export default Testimonials;
