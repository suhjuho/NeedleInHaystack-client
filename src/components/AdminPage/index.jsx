import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";

import { LoadingSpin } from "../shared/Loading";
import Header from "../Header";
import { useHeaderStateStore } from "../../store/store";

function AdminPage() {
  const navigate = useNavigate();
  const [isCrawling, setIsCrawling] = useState(false);
  const [isCorrectUrl, setIsCorrectUrl] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [entryURL, setEntryURL] = useState("");
  const [maxCrawlPages, setMaxCrawlPages] = useState(1);
  const [crawlingLogList, setCrawlingLogList] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { setHeaderState } = useHeaderStateStore();
  const [stopMessage, setStopMessage] = useState("Call Stop");

  useEffect(() => {
    setHeaderState("AdminPage");
  }, []);

  useEffect(() => {
    async function checkLogin() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/check`,
        {
          withCredentials: true,
        },
      );

      if (!response.data.result || !response.data.user.isAdmin) {
        navigate("/");
      }

      return response.data;
    }

    checkLogin();
  }, []);

  useEffect(() => {
    let eventSource;
    let timer;
    const createEvents = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(
        `${import.meta.env.VITE_BASE_URL}/admin/streamCrawling`,
        { withCredentials: true },
      );

      eventSource.onmessage = (event) => {
        const crawlingLog = JSON.parse(event.data);

        if (crawlingLog.result === "ok" && crawlingLog.title === "db") {
          setStopMessage("ranking videos");
        }

        setIsCrawling(true);
        setCrawlingLogList((crawlingLogList) => [
          ...crawlingLogList,
          crawlingLog,
        ]);
      };

      eventSource.onerror = (error) => {
        timer = setTimeout(() => {
          createEvents();
        }, 1000);
      };
    };

    createEvents();

    return () => {
      clearTimeout(timer);
      setCrawlingLogList([]);
      eventSource.close();
    };
  }, []);

  async function startCrawling(entryURL) {
    if (!isCorrectUrl) {
      setInputMessage("check url first");
      return;
    }

    setCrawlingLogList([]);
    setIsCrawling(true);
    setIsStopping(false);
    setInputMessage("");

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/startCrawling/`,
      {
        params: {
          entryURL,
          maxCrawlPages,
        },
      },
    );

    setIsCrawling(false);

    return response.data;
  }

  async function stopCrawling() {
    if (!isCrawling) {
      return;
    }

    setIsStopping(true);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/stopCrawling/`,
    );

    return response.data;
  }

  async function verifyYoutubeUrl() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/verifyYoutubeUrl/`,
      {
        params: {
          videoUrl: entryURL,
        },
      },
    );

    if (response.data.result === "ok") {
      setIsCorrectUrl(true);
    }

    setInputMessage(response.data.message);

    return response.data;
  }

  const handleStartCrawling = async (ev) => {
    ev.preventDefault();

    await startCrawling(entryURL);
  };

  const handleStopCrawling = async (ev) => {
    ev.preventDefault();

    await stopCrawling(entryURL);
  };

  const handleCheckUrl = async (ev) => {
    ev.preventDefault();

    await verifyYoutubeUrl();
  };

  function handleInputChange(event) {
    setInputMessage("");
    setIsCorrectUrl(false);
    setEntryURL(event.target.value);
  }

  return (
    <div className="flex flex-col">
      <Header />
      <h1 className="w-full px-10 text-4xl font-semibold text-left">
        Web Crawler
      </h1>
      <p className="w-full px-10 my-2 text-secondary-text">
        A crawler scrap video data from youtube web page, Choose your Entry
        point for web scraping.
      </p>
      <form className="flex justify-start items-center w-full px-10 gap-x-2">
        <input
          type="text"
          onChange={handleInputChange}
          className="border border-secondary-border shadow-inner shadow-secondary rounded-lg py-2 px-4 text-xl w-full focus:border-blue-500 outline-none"
          placeholder="entry url"
        />
        <input
          type="number"
          max={10}
          min={1}
          className="w-24 border border-secondary-border shadow-inner shadow-secondary rounded-lg py-2 px-4 text-xl focus:border-blue-500 outline-none"
          value={maxCrawlPages}
          onChange={(ev) => setMaxCrawlPages(ev.target.value)}
        />
        {!isCrawling &&
          (!isCorrectUrl ? (
            <button
              onClick={handleCheckUrl}
              className="w-32 py-2 px-4 mx-2 rounded-lg text-xl flex-shrink-0 flex items-center justify-center bg-orange-100"
            >
              check
            </button>
          ) : (
            <button
              onClick={handleStartCrawling}
              className="w-32 py-2 px-4 mx-2 rounded-lg text-xl flex-shrink-0 flex items-center justify-center bg-blue-100"
            >
              start
            </button>
          ))}
        {isCrawling && (
          <button
            onClick={handleStopCrawling}
            className="w-32 py-2 px-4 mx-2 rounded-lg text-xl flex-shrink-0 flex items-center justify-center bg-red-100"
          >
            stop
          </button>
        )}
      </form>
      {inputMessage && (
        <p
          className={`w-full px-10 my-2 ${isCorrectUrl ? "text-green-500" : "text-red-500"}`}
        >
          {inputMessage}
        </p>
      )}
      <div className="flex flex-col h-[600px] overflow-auto justify-start items-start w-full gap-y-2 px-10 my-10">
        <div className="grid gap-4 grid-cols-3 border border-secondary-border shadow-inner shadow-secondary rounded-lg py-2 px-4 text-xl w-full outline-none">
          <p>state</p>
          <p>name</p>
          <p>url</p>
        </div>
        {crawlingLogList.length !== 0 &&
          crawlingLogList.map((crawlingLog) => (
            <div
              key={crawlingLog.youtubeVideoId + Date.now()}
              className="grid gap-4 grid-cols-3 border border-secondary shadow-inner shadow-secondary rounded-lg py-2 px-4 text-xl w-full outline-none"
            >
              {crawlingLog.result === "ok" &&
                (crawlingLog.title !== "db" ? (
                  <>
                    <p className="flex items-center">
                      <CheckCircleIcon className="h-[35px] mr-2 fill-green-500" />
                      {crawlingLog.message}
                    </p>
                    <p>{crawlingLog.title}</p>
                    <p>{crawlingLog.url}</p>
                  </>
                ) : (
                  <p className="flex items-center">
                    <CircleStackIcon className="h-[35px] mr-2 fill-yellow-500" />
                    {crawlingLog.message}
                  </p>
                ))}
              {crawlingLog.result === "ng" && (
                <p className="flex items-center">
                  <ExclamationTriangleIcon className="h-[35px] mr-2 fill-red-500" />
                  {crawlingLog.message}
                </p>
              )}
            </div>
          ))}
        {isCrawling && (
          <div className="grid gap-4 grid-cols-3 border border-secondary shadow-inner shadow-secondary rounded-lg py-2 px-4 text-xl w-full outline-none">
            <div className="flex items-center gap-x-2">
              <LoadingSpin />
              {isStopping ? stopMessage : "Scraping"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
