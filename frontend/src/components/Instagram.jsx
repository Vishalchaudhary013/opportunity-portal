import React, { useState, useEffect } from 'react';
import { fetchInstagramPosts } from '../api/socialAPI';
import { FaComment, FaLinkedin } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FaInstagram, FaLinkedinIn, FaRegComment } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import { Send } from 'lucide-react';

function App() {
    return (
        <HugeiconsIcon icon={SentIcon} />
    );
}
const Instagram = () => {
    const [expandedPosts, setExpandedPosts] = useState({});

    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchInstagramPosts();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Instagram posts:", error);
                setLoading(false);
            }
        };

        loadPosts();
    }, []);


    return (
        <>
            <div>
                <div className="bg-white">
                    <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto pt-40 pb-10">
                        {/* Section Header */}

                        <div className="flex justify-center">
                            <a
                                href="https://www.linkedin.com/company/linkedin-page-name/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-[90%] max-w-4xl"
                            >
                                <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
                                    <div className="w-20 h-20 rounded-full border-3 border-red-600 bg-white flex items-center justify-center shadow-lg">
                                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                                            <FaInstagram className="text-white text-4xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center mb-20">
                                    <h3
                                        className="relative isolate z-0 bg-red-600 py-6 px-12 text-white text-[40px]
              font-semibold rounded-2xl shadow-2xl"
                                    >
                                        Follow us on Instagram
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

                                            <li className="leading-4.5">
                                                <h5 className="font-medium text-[18px]">
                                                    {post.authorName || "Saurabh Dutta"}
                                                </h5>
                                                <span className="font-medium text-red-600">
                                                    {post.authorUsername || "@username"}
                                                </span>
                                                {post.postedAt && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    </div>
                                                )}
                                            </li>
                                            <li className="mb-5">

                                            </li>

                                        </ul>
                                        <ul className="">
                                            <li><FaInstagram className="text-red-500 text-3xl" /></li>
                                        </ul>

                                    </div>

                                    {/* Post Images */}
                                    {post.images && post.images.length > 0 && (
                                        <>
                                            {typeof post.images === 'string' ? (
                                                <img
                                                    src={post.images}
                                                    alt=""
                                                    className="mb-5 rounded-sm"
                                                />
                                            ) : post.singleImage ? (
                                                <img
                                                    src={post.images[0]}
                                                    alt=""
                                                    className="mb-5 rounded-sm"
                                                />
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3 mb-2.5">
                                                    {Array.isArray(post.images) && post.images.map((imgSrc, idx) => (
                                                        <img key={idx} src={imgSrc} alt="" className=" w-full rounded-sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

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
                                            className="text-red-600  text-[14px] font-medium mb-5"
                                        >
                                            {expandedPosts[post.id] ? "Read less" : "Read more"}
                                        </button>
                                    )}



                                    {/*<div className="flex gap-4 items-center border-b pb-2 mb-2.5 border-black/10">
                                             <span className="font-semibold text-black/70">5:30AM</span>
                                              <span className="text-xs font-medium">|</span> 
                                              <span className="font-semibold text-black/70">{post.date}</span>
                                          </div>*/}

                                    {/* Post Footer */}
                                    <ul className="flex justify-between  items-center border-t pt-2.5  border-black/10 text-gray-700">
                                        <li className="flex items-center gap-1">

                                            <AiOutlineLike size={20} />
                                            <p> {post.likes} </p>

                                        </li>
                                        <li className="flex items-center gap-1">
                                            <FaRegComment size={20} />
                                            <p>{post.comments} </p>
                                        </li>

                                        <li className="flex items-center gap-1">
                                            <Send size={20} />
                                            <span>{post.shares}</span>
                                        </li>


                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {/* <div className="w-full flex justify-center mb-4">
                                  <button className="px-6 py-3 font-medium rounded-lg bg-red-600 text-white ">
                                      View More Post
                                  </button>
                              </div> */}


                    </div>
                </div>
            </div>
        </>
    )
}

export default Instagram
