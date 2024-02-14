import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import Header from "../Header";
import Video from "../Video";
import VideoScript from "../VideoScript";

import { useHeaderStateStore } from "../../store/store";

function VideoDetailPage() {
  const { video } = useLocation().state;
  const { setHeaderState } = useHeaderStateStore();
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    setHeaderState("DetailPage");
  }, []);

  function handleSeekToTime(seconds) {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "fractions", "play");
    }
  }

  return (
    <>
      <Header />
      <div className="flex">
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
      </div>
    </>
  );
}

export default VideoDetailPage;
