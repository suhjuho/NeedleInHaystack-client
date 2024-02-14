import { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import CONSTANT from "../../constants/constant";
import { usePlayerDimensions } from "../../store/store";

function Video({ video, playerRef, setCurrentVideoTime }) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const { playerDimensions, setPlayerDimensions } = usePlayerDimensions();

  useEffect(() => {
    function handleResize() {
      const playerContainer = document.getElementById("player-container");

      if (playerContainer) {
        const rect = playerContainer.getBoundingClientRect();

        setPlayerDimensions({
          width: `${rect.width}px`,
          height: `${(rect.width * 9) / 16}px`,
        });
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleMoreClick() {
    setShowMore((prev) => !prev);
  }

  return (
    <div id="player-container" className="relative w-full">
      {isAvailable ? (
        <div className="absolute mt-4 ml-4 mb-4">
          <ReactPlayer
            className="overflow-hidden rounded-xl"
            ref={playerRef}
            url={CONSTANT.YOUTUBE_URL + video.youtubeVideoId}
            onError={() => {
              setIsAvailable(false);
            }}
            playing
            controls
            onProgress={(progress) =>
              setCurrentVideoTime(parseInt(progress.playedSeconds, 10))
            }
            width={playerDimensions.width}
            height={playerDimensions.height}
          />
          <div className="mt-4 mb-4 p-2 border-gray-500 rounded-xl bg-gray-100">
            <div className="mb-3 font-bold text-xl">{video.title}</div>
            <div className="mb-3 font-bold">{video.channel}</div>
            {video.description.length <= 100 ? (
              <div>{video.description}</div>
            ) : (
              <button className="text-left" onClick={handleMoreClick}>
                {showMore ? (
                  <>
                    {video.description}
                    <span className="font-bold">Show less</span>
                  </>
                ) : (
                  <>
                    {video.description.slice(0, 100)}
                    <span className="ml-2 font-bold">... more</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <img
            className="w-full max-w-xl h-48 mt-20 ml-4 border-2 border-gray-500"
            src={video.thumbnailURL}
            alt="thumbnail"
          />
          <div className="max-w-xl mt-2 ml-4 mb-4 p-2 border-2 border-gray-500">
            <div className="border font-bold text-red-500 uppercase">
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
