import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import Header from "../Header";
import Video from "../Video";
import VideoScript from "../VideoScript";

import {
  useAutoCrawlingTimerStore,
  useHeaderStateStore,
} from "../../store/store";

function VideoDetailPage() {
  const { video } = useLocation().state;
  const { setHeaderState } = useHeaderStateStore();
  const { autoCrawlingTimer, setAutoCrawlingTimer } =
    useAutoCrawlingTimerStore();
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    setHeaderState("DetailPage");

    async function autoCrawling(videoId) {
      setAutoCrawlingTimer(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/autoCrawling`,
        {
          videoId,
        },
      );

      setAutoCrawlingTimer(false);

      return response.data;
    }

    if (!autoCrawlingTimer) {
      autoCrawling(video.youtubeVideoId);
    }
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
          currentVideoTime={currentVideoTime}
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
