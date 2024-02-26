import { useEffect, useRef, useState } from "react";
import translate from "translate";

import timeToSeconds from "../../utils/timeToSeconds";
import { usePlayerDimensions } from "../../store/store";

function VideoScript({
  currentVideoTime,
  seekToTime,
  youtubeVideoId,
  transcript,
  transcripts,
  transcriptTimeLines,
  isScriptShown,
  handleToggleClick,
}) {
  const [koreanScripts, setKoreanScripts] = useState([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [transcriptLanguage, setTranscriptLanguage] = useState("EN");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { playerDimensions } = usePlayerDimensions();
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
  }, []);

  function handleShowTranscriptButton() {
    setShowTranscript((prev) => !prev);
    setShowLanguageDropdown(false);
  }

  function handleTranscriptLanguageButton() {
    if (showTranscript) {
      setShowLanguageDropdown((prev) => !prev);
    }
  }

  function handleLanguageSelect(language) {
    setTranscriptLanguage(language);
    setShowLanguageDropdown(false);
  }

  return (
    <div
      className="overflow-y-auto border-2 w-[45rem] sm:max-w-screen-xl border-grey-800 rounded-xl sm:ml-4 sm:max-h-[580px] h-[450px] sm:h-[850px]"
      // style={{ height: playerDimensions.height }}
    >
      <div className="flex items-center justify-between sticky p-2 top-0 bg-white font-bold text-2xl">
        <div className="flex gap-x-2">
          <p>Transcript</p>
          <div className="relative">
            <button
              className="mr-4 text-sm"
              onClick={handleTranscriptLanguageButton}
            >
              {transcriptLanguage}
            </button>
            {showLanguageDropdown && (
              <div className="absolute w-20 mt-1 py-1 top-full right-0 bg-white border border-gray-300">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleLanguageSelect("EN")}
                >
                  EN
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleLanguageSelect("KR")}
                >
                  KR
                </button>
              </div>
            )}
            <button onClick={handleShowTranscriptButton}>
              {showTranscript ? "-" : "+"}
            </button>
          </div>
        </div>
        <button
          className="hidden sm:block ml-2 text-sm "
          onClick={handleToggleClick}
        >
          See {isScriptShown ? "Editor" : "Script"}
        </button>
      </div>
      {showTranscript && (
        <div className="overflow-y-auto overflow-x-hidden">
          {transcript !== " " &&
            transcriptTimeLines.map((transcriptTimeLine, index) => {
              const isInTime =
                timeToSeconds(transcriptTimeLine) <= currentVideoTime &&
                timeToSeconds(transcriptTimeLines[index + 1]) >
                  currentVideoTime;

              return (
                <button
                  key={youtubeVideoId + transcriptTimeLine + transcripts[index]}
                  className={`flex w-full ${isInTime && "bg-secondary"} hover:bg-secondary-hover`}
                  onClick={() => {
                    seekToTime(timeToSeconds(transcriptTimeLine));
                  }}
                  ref={(element) => {
                    scriptRef.current[index] = element;
                  }}
                >
                  <p className="m-2 px-1 rounded bg-blue-200 text-sky-600 font-bold">
                    {transcriptTimeLine}
                  </p>
                  <p className="m-2 text-left">
                    {transcriptLanguage === "EN"
                      ? transcripts[index]
                      : koreanScripts[index]}
                  </p>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default VideoScript;
