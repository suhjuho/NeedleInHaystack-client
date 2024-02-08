import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import Header from "../Header";
import Video from "../Video";
import VideoScript from "../VideoScript";

function VideoDetailPage() {
  const navigate = useNavigate();
  const { video } = useLocation().state;
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const playerRef = useRef(null);

  const handleSeekToTime = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "fractions", "play");
    }
  };

  return (
    <>
      <button
        className="absolute top-12 left-24 w-32 h-14 inline-block border-2 rounded-lg bg-blue-300"
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로가기
      </button>
      <div className="flex justify-center mt-10">
        <Header />
      </div>
      <Video
        video={video}
        playerRef={playerRef}
        setCurrentVideoTime={setCurrentVideoTime}
      />
      <VideoScript
        currentVideoTime={currentVideoTime}
        seekToTime={handleSeekToTime}
        youtubeVideoId={video.youtubeVideoId}
        transcript={video.transcript}
        transcripts={video.transcripts}
        transcriptTimeLines={video.transcriptTimeLines}
      />
    </>
  );
}

export default VideoDetailPage;
