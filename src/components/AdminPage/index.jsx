import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingSpin } from "../shared/Loading";

function AdminPage() {
  const navigate = useNavigate();
  const [isCrawling, setIsCrawling] = useState(false);
  const [entryURL, setEntryURL] = useState("");
  const [crawlingLogList, setCrawlingLogList] = useState([]);
  const [isCorrectUrl, setIsCorrectUrl] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    async function checkLogin() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/check`,
        {
          withCredentials: true,
        },
      );

      if (!response.data.result) {
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
      eventSource.close();
    };
  }, []);

  async function startCrawling(entryURL) {
    if (!isCorrectUrl) {
      setInputMessage("check url first");
      return;
    }

    setIsCrawling((isCrawling) => !isCrawling);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/startCrawling/`,
      {
        params: {
          entryURL,
        },
      },
    );

    setIsCrawling((isCrawling) => !isCrawling);
    return response.data;
  }

  async function stopCrawling() {
    if (!isCrawling) {
      return;
    }

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
    <div className="flex flex-col justify-contents items-center w-full mt-10">
      <h1 className="text-2xl">Managing Web Crawler</h1>
      <form className="flex items-center w-full">
        <input
          onChange={handleInputChange}
          className="w-full h-[40px] m-2 border-2 border-sky-500"
          type="text"
        />
        <button
          onClick={handleCheckUrl}
          className={`w-[60px] h-[40px] m-2 rounded-lg ${!isCorrectUrl && !isCrawling ? "bg-orange-300" : "bg-orange-100"}`}
        >
          check
        </button>
        <button
          onClick={handleStartCrawling}
          className={`w-[60px] h-[40px] m-2 rounded-lg ${isCorrectUrl && !isCrawling ? "bg-blue-300" : "bg-blue-100"}`}
        >
          start
        </button>
        <button
          onClick={handleStopCrawling}
          className={`w-[60px] h-[40px] m-2 rounded-lg ${isCrawling ? "bg-red-300" : "bg-red-100"}`}
        >
          stop
        </button>
      </form>
      {inputMessage && <div>{inputMessage}</div>}
      <div className="w-full">
        <div className="h-[800px] m-2 border-2 border-sky-500">
          {crawlingLogList.length !== 0 &&
            crawlingLogList.map((crawlingLog) => (
              <div
                key={crawlingLog.youtubeVideoId + Date.now()}
                className="m-2"
              >
                {crawlingLog.title}
              </div>
            ))}
          {isCrawling && <LoadingSpin />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
