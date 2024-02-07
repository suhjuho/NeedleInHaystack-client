import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Header from "../Header";
import SearchInput from "../SearchInput";
import VideoList from "../VideoList";
import { Loading, LoadingSpin } from "../shared/Loading";

import useFetchAllVideos from "../../apis/useFetchAllVideos";

function ResultPage() {
  const location = useLocation();
  const query = location.search.split("?search_query=")[1];
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useFetchAllVideos(query);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
      {status === "pending" && <Loading />}
      {status === "error" && (
        <div className="mt-10 text-center font-bold">
          <div className="text-xl">No results found</div>
          <p className="mt-4">
            Try different keywords or remove search filters
          </p>
        </div>
      )}
      {status === "success" && data.pages[0].result !== "null" ? (
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
          {isFetchingNextPage && <LoadingSpin />}
          <div ref={ref}>
            {!hasNextPage ? "Nothing more to load" : "more..."}
          </div>
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
