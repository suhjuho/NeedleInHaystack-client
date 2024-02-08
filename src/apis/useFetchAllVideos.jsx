import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import CONSTANT from "../constants/constant";

function useFetchAllVideos(query, shouldCheckSpell = true) {
  async function fetchAllVideos({ pageParam }) {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/keywords/`,
      {
        userInput: query.split("+"),
        shouldCheckSpell,
        pageParam,
      },
    );

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
