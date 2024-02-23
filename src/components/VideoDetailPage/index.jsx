import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

import Header from "../Header";
import Video from "../Video";
import VideoScript from "../VideoScript";
import { Loading, CustomLoading } from "../shared/Loading";

import {
  useAutoCrawlingTimerStore,
  useHeaderStateStore,
  usePlayerDimensions,
} from "../../store/store";
import CONSTANT from "../../constants/constant";

function VideoDetailPage() {
  const { video } = useLocation().state;
  const { setHeaderState } = useHeaderStateStore();
  const { autoCrawlingTimer, setAutoCrawlingTimer } =
    useAutoCrawlingTimerStore();
  const { playerDimensions } = usePlayerDimensions();

  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isScriptShown, setIsScriptShown] = useState(true);
  const [language, setLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedCode, setExtractedCode] = useState("");

  const playerRef = useRef(null);
  const keysPressedRef = useRef({});
  const editorRef = useRef();

  useEffect(() => {
    setLanguage("javascript");

    if (!isScriptShown)
      setTimeout(() => {
        editorRef.current.getAction("editor.action.formatDocument").run();
      }, 0);
  }, [isCapturing]);

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

  function handleToggleClick() {
    setIsScriptShown((prev) => !prev);
  }

  function handleCaptureClick() {
    setIsCapturing((prev) => !prev);
  }

  function handleKeyDown(event) {
    keysPressedRef.current[event.key] = true;

    if (keysPressedRef.current.z && keysPressedRef.current.x) {
      handleCaptureClick();
    }
  }

  function handleKeyUp() {
    keysPressedRef.current = {};
  }

  function handleSeekToTime(seconds) {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "fractions", "play");
    }
  }

  async function handleEditorMount(editor) {
    editorRef.current = editor;

    setTimeout(() => {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }, 0);
  }

  async function handleEditorChange(value) {
    setExtractedCode(value);

    await navigator.clipboard.writeText(value);
  }

  async function handleOptionChange(event) {
    setLanguage(event.target.value);

    setTimeout(() => {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }, 0);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keypress", handleKeyUp);
    };
  }, []);

  return (
    <>
      {isLoading && <CustomLoading text="Extracting Code..." />}
      <Header />
      <div className="flex">
        <Video
          video={video}
          playerRef={playerRef}
          currentVideoTime={currentVideoTime}
          setCurrentVideoTime={setCurrentVideoTime}
          isCapturing={isCapturing}
          setIsCapturing={setIsCapturing}
          handleCaptureClick={handleCaptureClick}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setExtractedCode={setExtractedCode}
          setIsScriptShown={setIsScriptShown}
        />
        {isScriptShown ? (
          <VideoScript
            currentVideoTime={currentVideoTime}
            seekToTime={handleSeekToTime}
            youtubeVideoId={video.youtubeVideoId}
            transcript={video.transcript}
            transcripts={video.transcripts}
            transcriptTimeLines={video.transcriptTimeLines}
            isScriptShown={isScriptShown}
            handleToggleClick={handleToggleClick}
          />
        ) : (
          <div
            className="hidden lg:block w-[45rem] m-2 border-2 rounded-xl"
            style={{
              height: `${parseInt(playerDimensions.height, 10) - 48}px `,
            }}
          >
            <div className="overflow-hidden flex items-center justify-between sticky z-9 p-2 top-0 bg-white font-bold text-xl rounded-xl">
              <div className="flex items-center gap-x-1">
                <div className="shrink-0">Code Editor</div>
                <select
                  className="w-max h-max mx-1 p-1 border border-black rounded focus:border-green-300 outline-none text-sm text-left"
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
              <button className="text-sm" onClick={handleToggleClick}>
                See Script
              </button>
            </div>
            <Editor
              theme="vs-dark"
              defaultLanguage="javascript"
              language={language}
              value={extractedCode}
              onMount={handleEditorMount}
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
          </div>
        )}
      </div>
    </>
  );
}

export default VideoDetailPage;
