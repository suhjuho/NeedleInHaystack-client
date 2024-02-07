import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import CONSTANT from "../constants/constant";

function useFetchSingleVideo(youtubeVideoId) {
  async function fetchVideo() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/videos/${youtubeVideoId}`,
    );

    return response.data.video;
  }

  return useQuery({
    queryKey: ["youtubeVideoId", youtubeVideoId],
    queryFn: () => fetchVideo(),
    staleTime: CONSTANT.FIVE_MINUTE_IN_MILLISECONDS,
  });
}

export default useFetchSingleVideo;
