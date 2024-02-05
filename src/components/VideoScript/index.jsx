function VideoScript({ transcript }) {
  return (
    <div>
      {transcript === " " || (
        <div className="absolute top-[176px] left-[830px] h-[610px] mr-4 p-2 border-2 border-slate-500 text-justify overflow-scroll">
          {transcript}
        </div>
      )}
    </div>
  );
}

export default VideoScript;
