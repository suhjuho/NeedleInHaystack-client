import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import CONSTANT from "../constants/constant";

function useFetchAllVideos(query, shouldCheckSpell = true) {
  async function fetchAllVideos({ pageParam }) {
    const fetchStartTime = Date.now();
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/keywords/`,
      {
        userInput: query.split("+"),
        shouldCheckSpell,
        pageParam,
      },
    );
    const fetchEndTime = Date.now();
    const videosFetchTime =
      Math.floor(((fetchEndTime - fetchStartTime) / 1000) * 100) / 100;

    response.data.videosFetchTime = videosFetchTime;

    return response.data;
  }

  return useInfiniteQuery({
    queryKey: ["search", query, shouldCheckSpell],
    queryFn: fetchAllVideos,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: CONSTANT.FIVE_MINUTE_IN_MILLISECONDS,
  });
}

export default useFetchAllVideos;
