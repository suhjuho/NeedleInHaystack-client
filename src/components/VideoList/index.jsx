import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import { PlayIcon } from "@heroicons/react/24/solid";
import useFetchSingleVideo from "../../apis/useFetchSingleVideo";
import CONSTANT from "../../constants/constant";

import { useUserInputStore } from "../../store/store";
import { LoadingSpin } from "../shared/Loading";

function VideoList({ innerRef, youtubeVideoId }) {
  const navigate = useNavigate();
  const { setUserInput } = useUserInputStore();
  const [isHover, setIsHover] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const { data: video, isFetching } = useFetchSingleVideo(youtubeVideoId);
  const videoComponent = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoComponent) {
        const { top } = videoComponent.current.getBoundingClientRect();
        if (
          window.innerHeight * 0.15 < top &&
          top < window.innerHeight * 0.25
        ) {
          setIsHover(false);
        } else {
          setIsHover(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleMouseEnter(event) {
    setTimeout(() => {
      setIsHover(false);
    }, 300);
    event.stopPropagation();
  }

  function handleMouseLeave(event) {
    setIsHover(true);
    event.stopPropagation();
  }

  function handleClickKeyword(event, keyword) {
    event.preventDefault();

    const query = keyword.replace(/\s+/g, " ").split(" ").join("+");

    setUserInput(keyword);
    navigate(`/results?search_query=${query}`);
  }

  return (
    <div ref={videoComponent}>
      {!isFetching ? (
        <Link to={`/watch?${video.youtubeVideoId}`} state={{ video }}>
          <div
            ref={innerRef}
            className="flex justify-center sm:justify-between w-screen gap-x-6 sm:p-2"
          >
            <div className="flex flex-col sm:flex-row min-w-0 gap-x-4">
              {isAvailable ? (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <ReactPlayer
                    url={CONSTANT.YOUTUBE_URL + youtubeVideoId}
                    className="overflow-hidden rounded-xl"
                    width={340}
                    height={180}
                    light={isHover}
                    playIcon={<PlayIcon className="w-16 h-16 fill-white" />}
                    playing
                    onError={() => {
                      setIsAvailable(false);
                    }}
                    muted
                  />
                </div>
              ) : (
                <img
                  className="flex-none w-[340px] h-[180px] rounded-xl bg-gray-50"
                  src={video.thumbnailURL}
                  alt="thumbnail"
                />
              )}

              <div className="flex-auto min-w-0 w-[340px] sm:w-full mb-2 pl-1 rounded-lg bg-gray-100 sm:bg-white">
                <p className="pb-4 text-lg font-semibold leading-6 text-gray-900">
                  {video.title}
                </p>
                <div className="mb-4 flex gap-2 items-center">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={video.profileImg || "/assets/LogoSample2.png"}
                    alt="channel profile"
                  />
                  <p className="truncate text-sm leading-5 text-gray-600">
                    {video.channel}
                  </p>
                </div>
                <p className="hidden sm:block mt-4 truncate text-xs leading-3 text-gray-500">
                  {video.description}
                </p>
                <div className="hidden sm:flex mt-4 gap-2">
                  {video.tag.trim().length > 0 &&
                    video.tag
                      .split(",")
                      .slice(0, 3)
                      .map((keyword) => (
                        <button
                          onClick={(event) =>
                            handleClickKeyword(event, keyword.trim())
                          }
                          className="truncate text-xs leading-3 bg-secondary rounded-xl p-2 text-gray-500 z-10"
                          key={keyword.trim() + video.youtubeVideoId}
                        >
                          #{keyword.trim()}
                        </button>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex justify-center items-center w-[340px] h-[180px]">
          <LoadingSpin />
        </div>
      )}
    </div>
  );
}

export default VideoList;
