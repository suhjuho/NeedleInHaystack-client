import axios from "axios";
import { useEffect, useState } from "react";

import { LoadingSpin } from "../shared/Loading";

function AdminPage() {
  const [isCrawling, setIsCrawling] = useState(false);
  const [entryURL, setEntryURL] = useState("");
  const [crawlingLogList, setCrawlingLogList] = useState([]);

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
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/stopCrawling/`,
    );

    return response.data;
  }

  const handleStartCrawling = async (ev) => {
    ev.preventDefault();
    const response = await startCrawling(entryURL);
  };

  const handleStopCrawling = async (ev) => {
    ev.preventDefault();
    const response = await stopCrawling(entryURL);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1>Admin Page</h1>
      <form action="" className="flex items-center">
        <input
          onChange={(ev) => setEntryURL(ev.target.value)}
          className="w-[620px] h-[40px] m-2 border-2 border-sky-500"
          type="text"
        />
        <button
          onClick={handleStartCrawling}
          className="w-[60px] h-[40px] m-2 rounded-lg bg-blue-100"
        >
          start
        </button>
        <button onClick={handleStopCrawling}>stop</button>
        {isCrawling && <LoadingSpin />}
      </form>
      <div className="w-[800px] h-[800px] border-2 border-sky-500">
        {crawlingLogList.length !== 0 &&
          crawlingLogList.map((crawlingLog) => (
            <div key={crawlingLog.youtubeVideoId + Date.now()}>
              {crawlingLog.title}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AdminPage;
