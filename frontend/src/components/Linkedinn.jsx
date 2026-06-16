import React, { useState } from "react";
import { FaComment, FaLinkedin } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FaLinkedinIn } from "react-icons/fa6";

const Linkedinn = () => {
    const [expandedPosts, setExpandedPosts] = useState({});

    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const posts = [
        {
            id: 1,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [
                "https://images.sociablekit.com/sources/linkedin-profile-posts/saurabh-dutta87/7399005651269763072-images-0.webp?nocache=1764062979",
                
            ],
            likes: 29,
            comments:2
        },
        {
            id: 10,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        {
            id: 9,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        {
            id: 2,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: null,
            images: [
                "https://images.sociablekit.com/sources/linkedin-profile-posts/saurabh-dutta87/7399005651269763072-images-0.webp?nocache=1764062979",
                
            ],
            likes: 19,
            comments:2
        },
        {
            id: 3,
            date: "Nov 2025",
            text1: null,
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [
                "https://images.sociablekit.com/sources/linkedin-profile-posts/saurabh-dutta87/7381760986321473536-images-0.webp?nocache=1761741101247",
            ],
            likes: 29,
            comments:2,
            singleImage: true,
        },
        {
            id: 4,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        {
            id: 5,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [
                "https://images.sociablekit.com/sources/linkedin-profile-posts/saurabh-dutta87/7382135776010035200-images-0.webp?nocache=1761741100345",
            ],
            likes: 29,
            comments:2,
            singleImage: true,
        },
        {
            id: 6,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        {
            id: 7,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        {
            id: 8,
            date: "Nov 2025",
            text1: "A vibrant and engaging day at Mahavir Senior Model School, where students delved into exciting career possibilities and strengthened their vision for the future!",
            text2: "At Uniwizard Career Fairs, we are committed to creating impactful experiences by bringing universities, industry experts, and real opportunities directly to school campuses—empowering students to make informed, clear, and goal-oriented decisions about their future",
            images: [],
            likes: 29,
            comments:2
        },
        
        
    ];

    const profileImg =
        "https://images.sociablekit.com/sources/linkedin-profile-posts/saurabh-dutta87/profile.webp?v=1761741103747";

    return (
        <section>
            <div>
                <div className="bg-[#F8F9FA]">
                    <div className="w-[1350px] mx-auto pt-40 pb-10">
                        {/* Section Header */}

                        <div className="flex justify-center">
                            <a
                                href="https://www.linkedin.com/company/linkedin-page-name/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-[90%] max-w-4xl"
                            >
                                <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
                                    <div className="w-20 h-20 rounded-full border-3 border-blue-500 bg-white flex items-center justify-center shadow-lg">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
  <FaLinkedinIn className="text-white text-4xl" />
</div>
                                    </div>
                                </div>

                                <div className="flex justify-center mb-20">
                                    <h3
                                        className="relative isolate z-0 bg-[#1E40AF] py-6 px-12 text-white text-[40px]
        font-semibold rounded-2xl shadow-2xl"
                                    >
                                        Follow us on LinkedIn
                                    </h3>
                                </div>
                            </a>
                        </div>


                        {/* Profile */}


                        {/* Posts Grid */}
                        <div className="columns-1 md:columns-2 lg:columns-4 gap-4 mb-5">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white border border-gray-100 rounded-lg p-5 break-inside-avoid mb-4"
                                >
                                    {/* Post Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <ul className="flex gap-3">
                                            <li>
                                                <img
                                                    src={profileImg}
                                                    alt=""
                                                    className="rounded-full w-10 h-10"
                                                />
                                            </li>
                                            <li className="leading-4.5">
                                                <h5
                                                    
                                                    className="font-medium  text-[18px]"
                                                >
                                                    Saurabh Dutta
                                                </h5>
                                                <span className="font-medium text-blue-500">
                                                    {/* {post.date} */}
                                                    @username
                                                </span>
                                            </li>
                                            <li className="mb-5">
                                                
                                            </li>
                                            
                                        </ul>
                                        <ul className="">
                                            <li><FaLinkedin className="text-blue-600 text-3xl"/></li>
                                        </ul>
                                        
                                    </div>

                                    {/* Post Text */}
                                    <div
                                        className={`text-gray-800 text-[15px] ${expandedPosts[post.id] ? "" : "line-clamp-4"
                                            } mb-1`}
                                    >
                                        {post.text1 && (
                                            <p className={post.text2 ? "mb-3" : ""}>{post.text1}</p>
                                        )}
                                        {post.text2 && <p>{post.text2}</p>}
                                    </div>
                                    {(post.text1 || post.text2) && (
                                        <button
                                            onClick={() => toggleExpand(post.id)}
                                            className="text-blue-600 hover:text-blue-800 text-[14px] font-medium mb-5"
                                        >
                                            {expandedPosts[post.id] ? "Read less" : "Read more"}
                                        </button>
                                    )}

                                    {/* Post Images */}
                                    {post.images && post.images.length > 0 && (
                                        <>
                                            {post.singleImage ? (
                                                <img
                                                    src={post.images[0]}
                                                    alt=""
                                                    className="mb-5"
                                                />
                                            ) : (
                                                <div className="mb-2.5">
                                                    {post.images.map((imgSrc, idx) => (
                                                        <img key={idx} src={imgSrc} alt="" className="h-95 w-full"/>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex gap-4 items-center border-b pb-2 mb-2.5 border-black/10">
                                        {/* <span className="font-semibold text-black/70">5:30AM</span>
                                        <span className="text-xs font-medium">|</span> */}
                                        <span className="font-semibold text-black/70">{post.date}</span>
                                    </div>

                                    {/* Post Footer */}
                                    <ul className="flex gap-5 items-center text-gray-700">
                                        <li className="flex items-center gap-0.5">
                                            
                                            {/* <BiSolidLike className="text-xl"/> */}
                                            <p> {post.likes} <span className="text-[15px] font-medium">Likes</span></p>
                                           
                                        </li>
                                        <li className="flex items-center gap-1">
                                            <FaComment />
                                            <p>{post.comments} <span className="text-[15px] font-medium">Comments</span></p>
                                        </li>

                                        
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="w-full flex justify-center mb-4">
                            <button className="px-6 py-3 rounded-lg bg-[#435b77] text-white hover:bg-[#3480DC]">
                                Load More Post
                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
}

export default Linkedinn;