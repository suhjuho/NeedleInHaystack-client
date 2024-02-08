import { useEffect } from "react";
import translate from "translate";

import timeToSeconds from "../../utils/timeToSeconds";

function VideoScript({
  currentVideoTime,
  seekToTime,
  youtubeVideoId,
  transcript,
  transcripts,
  transcriptTimeLines,
}) {
  return (
    <div className="absolute top-[176px] left-[830px] h-[610px] mr-4 p-2 border-2 border-slate-500 text-justify overflow-scroll">
      {transcript !== " " &&
        transcriptTimeLines.map((transcriptTimeLine, index) => {
          const isInTime =
            timeToSeconds(transcriptTimeLine) <= currentVideoTime &&
            timeToSeconds(transcriptTimeLines[index + 1]) > currentVideoTime;

          return (
            <button
              key={youtubeVideoId + transcriptTimeLine + transcripts[index]}
              className="flex"
              onClick={() => {
                seekToTime(timeToSeconds(transcriptTimeLine));
              }}
            >
              <p className={`${isInTime && "bg-red-100"} mr-2`}>
                {transcriptTimeLine}
              </p>
              <p className={`${isInTime && "bg-red-100"}`}>
                {transcripts[index]}
              </p>
            </button>
          );
        })}
    </div>
  );
}

export default VideoScript;
