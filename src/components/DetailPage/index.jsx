import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import Video from "../Video";
import VideoScript from "../VideoScript";

function DetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <>
      <button
        className="absolute top-[52px] left-[400px] w-32 h-14 inline-block border-2 rounded-lg bg-blue-300"
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로가기
      </button>
      <div className="flex justify-center mt-10">
        <Header />
      </div>
      <Video video={state.video} />
      <VideoScript transcript={state.video.transcript} />
    </>
  );
}

export default DetailPage;
