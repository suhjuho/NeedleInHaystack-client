import { useEffect, useRef, useState } from "react";
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
  const [koreanScripts, setKoreanScripts] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scriptRef = useRef([]);

  useEffect(() => {
    translate.engine = "google";
    async function translateAll(transcripts) {
      const scriptsPromises = transcripts.map(async (script) => {
        const koreanScript = await translate(script, "ko");

        return koreanScript;
      });

      try {
        const scripts = await Promise.all(scriptsPromises);
        setKoreanScripts(scripts);
      } catch (error) {
        setKoreanScripts([]);
      }
    }

    translateAll(transcripts);
  }, [transcripts]);

  useEffect(() => {
    transcriptTimeLines.forEach((transcriptTimeLine, index) => {
      const isInTime =
        timeToSeconds(transcriptTimeLine) <= currentVideoTime &&
        timeToSeconds(transcriptTimeLines[index + 1]) > currentVideoTime;
      if (isInTime) {
        setFocusedIndex(index);
      }
    });

    scriptRef.current[focusedIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, [currentVideoTime]);

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
              className={`${isInTime && "bg-red-100"} flex hover:bg-gray-100`}
              onClick={() => {
                seekToTime(timeToSeconds(transcriptTimeLine));
              }}
              ref={(element) => {
                scriptRef.current[index] = element;
              }}
            >
              <p className="w-12 mr-2">{transcriptTimeLine}</p>
              <p className="w-48">{transcripts[index]}</p>
              <p className="w-48">{koreanScripts[index]}</p>
            </button>
          );
        })}
    </div>
  );
}

export default VideoScript;
