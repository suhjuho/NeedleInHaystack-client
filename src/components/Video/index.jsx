import { useState, useEffect, useRef } from "react";
import { useSelectionContainer } from "@air/react-drag-to-select";
import ReactPlayer from "react-player/youtube";
import Editor from "@monaco-editor/react";

import axios from "axios";
import CONSTANT from "../../constants/constant";
import { usePlayerDimensions } from "../../store/store";
import { Loading } from "../shared/Loading";

function Video({
  video,
  playerRef,
  currentVideoTime,
  setCurrentVideoTime,
  isCapturing,
  setIsCapturing,
  handleCaptureClick,
}) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedCode, setExtractedCode] = useState(null);
  const [language, setLanguage] = useState("");
  const { playerDimensions, setPlayerDimensions } = usePlayerDimensions();

  const videoLeft = useRef(0);
  const videoTop = useRef(0);
  const videoRight = useRef(0);
  const videoBottom = useRef(0);

  const captureStartX = useRef(0);
  const captureStartY = useRef(0);
  const captureEndX = useRef(0);
  const captureEndY = useRef(0);

  const playerContainerRef = useRef();
  const elementRef = useRef(null);
  const editorRef = useRef();

  const { DragSelection } = useSelectionContainer();

  useEffect(() => {
    function handleResize() {
      if (playerContainerRef) {
        const rect = playerContainerRef.current.getBoundingClientRect();

        setPlayerDimensions({
          width: `${rect.width}px`,
          height: `${(rect.width * 9) / 16}px`,
        });
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function getVideoSize() {
      const rect = elementRef.current.getBoundingClientRect();

      videoLeft.current = rect.left;
      videoTop.current = rect.top;
      videoRight.current = Math.floor(rect.right);
      videoBottom.current = Math.floor(rect.bottom);

      console.log(videoLeft.current);
      console.log(videoTop.current);
    }

    getVideoSize();
  }, [isCapturing]);

  function handleMoreClick() {
    setShowMore((prev) => !prev);
  }

  function handleMouseDown(event) {
    captureStartX.current = event.clientX - videoLeft.current;
    captureStartY.current = event.clientY - videoTop.current;
  }

  async function handleMouseUp(event) {
    setIsLoading(true);
    setExtractedCode(() => null);

    captureEndX.current = event.clientX - videoLeft.current;
    captureEndY.current = event.clientY - videoTop.current;

    const clientCoordinate = {
      left: Math.min(captureStartX.current, captureEndX.current),
      top: Math.min(captureStartY.current, captureEndY.current),
    };

    const videoSize = {
      width: videoRight.current - videoLeft.current,
      height: videoBottom.current - videoTop.current,
    };

    const captureBoxSize = {
      width:
        Math.max(captureStartX.current, captureEndX.current) -
        Math.min(captureStartX.current, captureEndX.current),
      height:
        Math.max(captureStartY.current, captureEndY.current) -
        Math.min(captureStartY.current, captureEndY.current),
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/extraction`,
      {
        clientCoordinate,
        videoSize,
        captureBoxSize,
        currentVideoTime,
        youtubeVideoId: video.youtubeVideoId,
      },
    );

    if (response.data) {
      setIsLoading(false);
    }

    setExtractedCode(response.data.extractedCode);
    setIsCapturing((prev) => !prev);
  }

  async function handleEditorDidMount(editor) {
    editorRef.current = editor;

    setTimeout(() => {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }, 100);
  }

  async function handleEditorChange(value) {
    await navigator.clipboard.writeText(value);
  }

  async function handleOptionChange(event) {
    setLanguage(() => event.target.value);
    setTimeout(() => {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }, 100);
  }

  return (
    <>
      {isLoading && <Loading />}
      <div
        id="player-container"
        ref={playerContainerRef}
        className="relative w-full mr-4"
      >
        {isAvailable ? (
          <div className="absolute m-2">
            <div className="m-0 p-0" ref={elementRef}>
              <ReactPlayer
                className="overflow-hidden rounded-xl"
                ref={playerRef}
                url={CONSTANT.YOUTUBE_URL + video.youtubeVideoId}
                onError={() => {
                  setIsAvailable(false);
                }}
                playing={!isCapturing}
                controls
                onProgress={(progress) =>
                  setCurrentVideoTime(parseInt(progress.playedSeconds, 10))
                }
                width={playerDimensions.width}
                height={playerDimensions.height}
              />
            </div>
            <div className="my-4 p-2 border-gray-500 rounded-xl bg-gray-100">
              <button
                className="hidden sm:block px-4 py-1 rounded-lg bg-yellow-300 hover:bg-yellow-400"
                onClick={handleCaptureClick}
              >
                Extract Code
              </button>
              <div className="mb-3 font-bold text-xl">{video.title}</div>
              <div className="mb-3 font-bold">{video.channel}</div>
              {video.description.length <= 100 ? (
                <div>{video.description}</div>
              ) : (
                <button className="text-left" onClick={handleMoreClick}>
                  {showMore ? (
                    <>
                      {video.description}
                      <span className="font-bold">Show less</span>
                    </>
                  ) : (
                    <>
                      {video.description.slice(0, 100)}
                      <span className="ml-2 font-bold">... more</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {extractedCode && (
              <div className="flex">
                <Editor
                  height="200px"
                  width="500px"
                  defaultLanguage="javascript"
                  language={language}
                  theme="vs-dark"
                  value={extractedCode}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                  options={{
                    tabSize: 2,
                    fontSize: "16px",
                    renderValidationDecorations: "off",
                    autoClosingBrackets: true,
                    formatOnPaste: true,
                    autoIndent: "full",
                    minimap: { enabled: false },
                  }}
                />
                <span className="w-max ml-2">Language selected : </span>
                <select
                  className="w-max h-max ml-2 border-2"
                  aria-label="language"
                  onChange={handleOptionChange}
                >
                  {CONSTANT.LANGUAGE_OPTIONS.map((language) => (
                    <option
                      key={language}
                      value={language}
                      defaultValue={language === "javascript"}
                    >
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <>
            <img
              className="w-full max-w-xl h-48 mt-20 ml-4 border-2 border-gray-500"
              src={video.thumbnailURL}
              alt="thumbnail"
            />
            <div className="max-w-xl mt-2 ml-4 mb-4 p-2 border-2 border-gray-500">
              <div className="border font-bold text-red-500 uppercase">
                This video is no longer available and archived by Haystack
              </div>
              <div className="border font-bold">제목: {video.title}</div>
              <div className="border">설명: {video.description}</div>
              <div className="border">채널명: {video.channel}</div>
              {video.tag === " " || (
                <div className="border">태그: {video.tag}</div>
              )}
            </div>
          </>
        )}
      </div>
      {isCapturing && (
        <div
          className="absolute top-[109px] left-[8px] opacity-40 bg-slate-200"
          style={{
            width: parseInt(playerDimensions.width, 10),
            height: parseInt(playerDimensions.height, 10),
          }}
          role="none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {" "}
          <DragSelection />
        </div>
      )}
    </>
  );
}

export default Video;
