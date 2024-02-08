import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import useFetchSingleVideo from "../../apis/useFetchSingleVideo";

function VideoList({ youtubeVideoId }) {
  const [isHover, setIsHover] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { data: video, isFetching } = useFetchSingleVideo(youtubeVideoId);
  const youtubeURL = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  return (
    <div>
      {!isFetching && (
        <Link to={`/watch?${video.youtubeVideoId}`} state={{ video }}>
          <div className="flex justify-between w-screen gap-x-6 p-2">
            <div className="flex min-w-0 gap-x-4">
              {isAvailable ? (
                <div
                  onMouseEnter={(event) => {
                    setTimeout(() => {
                      setIsHover(true);
                    }, 300);
                    event.stopPropagation();
                  }}
                  onMouseLeave={(event) => {
                    setIsHover(false);
                    event.stopPropagation();
                  }}
                >
                  <ReactPlayer
                    style={{
                      flex: "none",
                      borderColor: "rgb(100 116 139)",
                      backgroundColor: "rgb(249 250 251)",
                    }}
                    width={355}
                    height={200}
                    url={youtubeURL}
                    playing={isHover}
                    onError={() => {
                      setIsAvailable(false);
                    }}
                  />
                </div>
              ) : (
                <img
                  className="h-[200px] flex-none rounded-md bg-gray-50"
                  src={video.thumbnailURL}
                  alt="thumbnail"
                />
              )}

              <div className="min-w-0 flex-auto">
                <p className="text-lg font-semibold leading-6 text-gray-900">
                  {video.title}
                </p>
                <p className="mt-1 truncate text-sm leading-5 text-gray-600">
                  {video.channel}
                </p>
                <p className="mt-4 truncate text-xs leading-3 text-gray-500">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VideoList;
