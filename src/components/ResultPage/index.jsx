import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import Header from "../Header";
import SearchInput from "../SearchInput";
import VideoList from "../VideoList";
import { useVideoStore } from "../../store/store";

function ResultPage() {
  const { videos, setVideos } = useVideoStore();
  const location = useLocation();
  const query = location.search.split("?search_query=")[1];

  useEffect(() => {
    async function searchKeywords() {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/keywords/`,
        {
          userInput: query.split("+"),
          shouldSpellCheck: true,
        },
      );

      if (response.data.result === "ok") {
        setVideos(response.data.videos);
      }
    }

    searchKeywords();
  }, [query]);

  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
      {videos.map((video) => {
        const youtubeVideId = video[0];
        return <VideoList key={youtubeVideId} youtubeVideId={youtubeVideId} />;
      })}
    </div>
  );
}

export default ResultPage;
