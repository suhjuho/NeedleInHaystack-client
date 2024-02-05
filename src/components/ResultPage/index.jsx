import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../Header";
import SearchInput from "../SearchInput";
import VideoList from "../VideoList";
import Loading from "../shared/Loading";
import ErrorPage from "../ErrorPage";

function ResultPage() {
  const location = useLocation();
  const query = location.search.split("?search_query=")[1];

  async function fetchSearchResults() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/keywords/`,
      {
        userInput: query.split("+"),
        shouldSpellCheck: true,
      },
    );

    return response.data.videos;
  }

  const {
    data: videos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-10">
        <Header />
        <SearchInput />
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
      {videos.length !== 0 ? (
        videos.map((video) => {
          const youtubeVideoId = video[0];
          return (
            <VideoList key={youtubeVideoId} youtubeVideoId={youtubeVideoId} />
          );
        })
      ) : (
        <div className="mt-10 text-center font-bold">
          <div className="text-xl">No results found</div>
          <p className="mt-4">
            Try different keywords or remove search filters
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
