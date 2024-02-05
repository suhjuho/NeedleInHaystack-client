import ReactPlayer from "react-player/youtube";

function Video({ video }) {
  const youtubeURL = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;
  return (
    <>
      <ReactPlayer
        style={{
          marginTop: 80,
          marginLeft: 16,
          borderWidth: 2,
          borderColor: "rgb(100 116 139)",
        }}
        width={800}
        height={450}
        url={youtubeURL}
        controls="true"
      />
      <div className="flex flex-col w-[800px] mt-2 ml-4 mb-4 p-2 border-2 border-slate-500">
        <div className="border font-bold">제목: {video.title}</div>
        <div className="border">설명: {video.description}</div>
        <div className="border">채널명: {video.channel}</div>
        <div className="border">태그: {video.tag}</div>
      </div>
    </>
  );
}

export default Video;
