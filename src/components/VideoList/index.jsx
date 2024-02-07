import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

import CONSTANT from "../../constants/constant";

function VideoList({ youtubeVideoId }) {
  async function fetchVideo() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/videos/${youtubeVideoId}`,
    );

    return response.data.video;
  }

  const { data: video, isFetching } = useQuery({
    queryKey: ["youtubeVideoId", youtubeVideoId],
    queryFn: () => fetchVideo(),
    staleTime: CONSTANT.FIVE_MINUTE_IN_MILLISECONDS,
  });

  return (
    <div>
      {!isFetching && (
        <Link to={`/watch?${video.youtubeVideoId}`} state={{ video }}>
          <div className="flex w-screen mb-2">
            <img
              className="w-[300px] mr-2"
              src={video.thumbnailURL}
              alt="thumbnail"
            />
            <div>
              <h1>{video.title}</h1>
              <p>{video.channel}</p>
              <p>{video.description}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VideoList;
