import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useFetchSingleVideo from "../../apis/useFetchSingleVideo";

function VideoList({ youtubeVideoId }) {
  const { data: video, isFetching } = useFetchSingleVideo(youtubeVideoId);

  return (
    <div>
      {!isFetching && (
        <Link to={`/watch?${video.youtubeVideoId}`} state={{ video }}>
          <div className="flex justify-between w-screen gap-x-6 p-2">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-[200px] flex-none rounded-md bg-gray-50"
                src={video.thumbnailURL}
                alt="thumbnail"
              />
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
