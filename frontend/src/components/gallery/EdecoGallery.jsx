import React from "react";
import SectionTitle from "../SectionTitle";
const items = [
  { type: "image", src: "https://picsum.photos/id/1011/600/900" },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    aspect: "2/3",
  },
  { type: "image", src: "https://picsum.photos/id/1015/600/850" },
  { type: "image", src: "https://picsum.photos/id/1016/600/820" },

  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  { type: "image", src: "https://picsum.photos/id/1041/600/910" },
  { type: "image", src: "https://picsum.photos/id/1052/600/770" },
  { type: "image", src: "https://picsum.photos/id/1011/600/900" },
  { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { type: "image", src: "https://picsum.photos/id/1015/600/850" },
  { type: "image", src: "https://picsum.photos/id/1016/600/820" },
  { type: "image", src: "https://picsum.photos/id/1025/600/880" },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    aspect: "2/3",
  },
  { type: "image", src: "https://picsum.photos/id/1025/600/880" },
  // { type: 'image', src: "https://picsum.photos/id/1052/600/770" },
];
const EdecoGallery = () => {
  return (
    <>
      <div>
        <div className="w-[1300px] mx-auto py-10 mt-10">
          <SectionTitle
            title={"Gallery"}
            subtitle={
              "Explore highlights, memorable moments, and achievements captured through our journey."
            }
            hideViewAll={true}
          />
          <div className="columns-4 gap-5 space-y-5 mt-10">
            {items.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[5px]"
                style={{ aspectRatio: item.aspect || "auto" }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EdecoGallery;
