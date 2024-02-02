import { useRef, useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  function handleQueryChange(event) {
    setQuery(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleAutoCompletionClick(event) {
    setQuery(event.target.textContent);

    inputRef.current.disabled = false;
    inputRef.current.focus();
  }

  return (
    <>
      <p className="mt-4 text-base font-semibold">
        Search the video using Haystack!
      </p>
      <form
        className="flex flex-col w-96 mt-4 border-2 rounded-lg border-red-500"
        onSubmit={handleSubmit}
      >
        <input
          className="pl-2 rounded-md border-red-500 outline-none"
          type="text"
          placeholder="Haystack 검색"
          value={query}
          onChange={handleQueryChange}
          ref={inputRef}
          autoFocus
        />
        {query && (
          <button
            className="text-left"
            type="button"
            onClick={handleAutoCompletionClick}
          >
            <p className="pl-2 hover:bg-slate-300">자동완성 추천 1</p>
            <p className="pl-2 hover:bg-slate-300">자동완성 추천 2</p>
            <p className="pl-2 hover:bg-slate-300">자동완성 추천 3</p>
            <p className="pl-2 hover:bg-slate-300">자동완성 추천 4</p>
            <p className="pl-2 hover:bg-slate-300">자동완성 추천 5</p>
          </button>
        )}
      </form>
    </>
  );
}

export default SearchInput;
