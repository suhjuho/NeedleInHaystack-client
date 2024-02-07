function LoadingSpin() {
  return (
    <div className="w-8 h-8 relative animate-spin">
      <div className="border-4 border-white border-solid rounded-full absolute top-0 bottom-0 left-0 right-0 animate-spin"></div>
      <div className="border-4 border-blue border-dashed rounded-full absolute top-0 bottom-0 left-0 right-0 animate-spin-reverse"></div>
    </div>
  );
}

function Loading() {
  return (
    <div className="fixed flex justify-center items-center left-0 right-0 top-0 bottom-0 bg-black-bg bg-opacity-50 z-1">
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8">
        <div className="w-8 h-8 relative animate-spin">
          <div className="border-4 border-white border-solid rounded-full absolute top-0 bottom-0 left-0 right-0 animate-spin"></div>
          <div className="border-4 border-blue border-dashed rounded-full absolute top-0 bottom-0 left-0 right-0 animate-spin-reverse"></div>
        </div>
        <p className="text-gray-800 font-semibold mt-4">Loading...</p>
      </div>
    </div>
  );
}

export { Loading, LoadingSpin };
