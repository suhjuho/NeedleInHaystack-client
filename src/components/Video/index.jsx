import { useState } from "react";
import ReactPlayer from "react-player/youtube";

function Video({ video }) {
  const youtubeURL = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div>
      {isAvailable ? (
        <>
          <ReactPlayer
            style={{
              marginTop: 80,
              marginLeft: 16,
              borderWidth: 2,
              borderColor: "rgb(100 116 139)",
            }}
            width={800}
            height={450}
            url={youtubeURL}
            onError={() => {
              setIsAvailable(false);
            }}
            controls
          />
          <div className="flex flex-col w-[800px] mt-2 ml-4 mb-4 p-2 border-2 border-slate-500">
            <div className="border font-bold">제목: {video.title}</div>
            <div className="border">설명: {video.description}</div>
            <div className="border">채널명: {video.channel}</div>
            {video.tag === " " || (
              <div className="border">태그: {video.tag}</div>
            )}
          </div>
        </>
      ) : (
        <>
          <img
            className="w-[800px] h-[450px] mt-20 ml-4 border-2 border-slate-500"
            src={video.thumbnailURL}
            alt="thumbnail"
          />
          <div className="flex flex-col w-[800px] mt-2 ml-4 mb-4 p-2 border-2 border-slate-500">
            <div className="border font-bold text-red-500 uppercase ">
              This video is no longer available and archived by Haystack
            </div>
            <div className="border font-bold">제목: {video.title}</div>
            <div className="border">설명: {video.description}</div>
            <div className="border">채널명: {video.channel}</div>
            {video.tag === " " || (
              <div className="border">태그: {video.tag}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Video;
