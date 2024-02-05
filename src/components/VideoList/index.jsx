import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function VideoList({ youtubeVideoId }) {
  const [video, setVideo] = useState({});

  useEffect(() => {
    async function fetchVideo() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/${youtubeVideoId}`,
      );

      if (response.data.result === "ok") {
        setVideo(response.data.video);
      }
    }

    fetchVideo();
  }, []);

  return (
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
  );
}

export default VideoList;
