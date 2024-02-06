import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import throttle from "../../utils/throttle";

import Header from "../Header";
import SearchInput from "../SearchInput";
import VideoList from "../VideoList";
import Loading from "../shared/Loading";

const SCROLL_WAIT_TIME = 300;

function ResultPage() {
  const location = useLocation();
  const query = location.search.split("?search_query=")[1];

  async function fetchSearchResults(pageParam) {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/keywords/`,
      {
        userInput: query.split("+"),
        shouldSpellCheck: true,
        pageParam,
      },
    );

    return response.data;
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => fetchSearchResults(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const handleScrollThrottle = throttle(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 10 >=
      document.documentElement.offsetHeight
    ) {
      fetchNextPage();
    }
  }, SCROLL_WAIT_TIME);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollThrottle);
    return () => window.removeEventListener("scroll", handleScrollThrottle);
  }, []);

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center mt-10">
        <Header />
        <SearchInput />
        <Loading />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center mt-10">
        <Header />
        <SearchInput />
        <div className="mt-10 text-center font-bold">
          <div className="text-xl">No results found</div>
          <p className="mt-4">
            Try different keywords or remove search filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
      {data.pageParams.length !== 0 ? (
        <>
          {data.pages.map((group) =>
            group.videos.map((video) => {
              const youtubeVideoId = video[0];

              return (
                <VideoList
                  key={youtubeVideoId}
                  youtubeVideoId={youtubeVideoId}
                />
              );
            }),
          )}
          {isFetching && <Loading />}
          <div>{!hasNextPage ? "Nothing more to load" : "more..."}</div>
        </>
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
