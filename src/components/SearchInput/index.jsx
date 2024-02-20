import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import axios from "axios";

import {
  useUserInputStore,
  useCheckSpellStore,
  useUserStore,
} from "../../store/store";

function SearchInput() {
  const { userInput, setUserInput } = useUserInputStore();
  const { shouldCheckSpell, setShouldCheckSpell } = useCheckSpellStore();
  const { isLoggedIn } = useUserStore();
  const [autoCompletions, setAutoCompletions] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [showAutoCompletions, setShowAutoCompletions] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const arrowKeyPressed = useRef(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowAutoCompletions(false);
        setShowSearchHistory(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function getAutoCompletions(userInput) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auto-completions`,
          {
            params: { userInput },
            withCredentials: true,
          },
        );
        const { data } = response;

        setAutoCompletions(data.searchHistories);
      } catch (error) {
        console.error(error);
      }
    }

    if (userInput !== "" && !arrowKeyPressed.current) {
      getAutoCompletions(userInput);
    }

    if (showSearchHistory) {
      getAutoCompletions(userInput);
    }

    if (userInput.length === 0) {
      getAutoCompletions(userInput);
    }
  }, [userInput, arrowKeyPressed, showSearchHistory]);

  function handleUserInputChange(event) {
    event.preventDefault();

    arrowKeyPressed.current = false;

    setUserInput(event.target.value);
    setShowAutoCompletions(true);
    setSelectedItemIndex(-1);
  }

  function handleKeyPress(event) {
    const pressedKey = event.key;

    setShowSearchHistory(false);

    if (pressedKey === "ArrowDown" || pressedKey === "ArrowUp") {
      if (autoCompletions.length === 0) {
        return;
      }

      arrowKeyPressed.current = true;
      event.preventDefault();
      if (!showAutoCompletions) {
        return setShowAutoCompletions(true);
      }
    }

    if (pressedKey === "ArrowDown") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex < autoCompletions.length - 1 ? prevIndex + 1 : 0,
      );

      const index =
        selectedItemIndex < autoCompletions.length - 1
          ? selectedItemIndex + 1
          : 0;

      setUserInput(autoCompletions[index]);
    } else if (pressedKey === "ArrowUp") {
      setShowAutoCompletions(true);
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : autoCompletions.length - 1,
      );

      const index =
        selectedItemIndex > 0
          ? selectedItemIndex - 1
          : autoCompletions.length - 1;

      setUserInput(autoCompletions[index]);
    } else if (pressedKey === "Escape") {
      setShowAutoCompletions(false);
      setSelectedItemIndex(-1);
    } else if (pressedKey === "Enter") {
      const keywords = userInput.replace(/\s+/g, " ").split(" ").join("+");

      if (keywords === "") {
        return;
      }

      setSelectedItemIndex(-1);

      if (!shouldCheckSpell) {
        setShouldCheckSpell(true);
      }

      navigate(`/results?search_query=${keywords}`);
    }
  }

  function handleMouseHover(event) {
    const index = Number(event.target.getAttribute("index"));

    setSelectedItemIndex(index);
  }

  function handleAutoCompletionClick(event) {
    const selectedKeyword = autoCompletions[selectedItemIndex];
    const keywords = selectedKeyword.replace(/\s+/g, " ").split(" ").join("+");

    setUserInput(event.target.textContent);
    setShowAutoCompletions(false);

    navigate(`/results?search_query=${keywords}`);
  }

  function handleInputClick() {
    setShowSearchHistory(true);
    setShowAutoCompletions(true);
  }

  function handleGlassIconClick() {
    const keywords = userInput.replace(/\s+/g, " ").split(" ").join("+");

    if (keywords === "") {
      return;
    }

    setSelectedItemIndex(-1);

    if (!shouldCheckSpell) {
      setShouldCheckSpell(true);
    }

    navigate(`/results?search_query=${keywords}`);
  }

  function handleOptionClick(event) {
    const selectedKeyword = autoCompletions[selectedItemIndex];
    const keywords = selectedKeyword.replace(/\s+/g, " ").split(" ").join("+");

    setUserInput(event.target.textContent);
    setShowAutoCompletions(false);

    navigate(`/results?search_query=${keywords}`);
  }

  return (
    <div className="relative flex flex-col gap-4 flex-grow max-w-[600px] items-center justify-center">
      <div className="flex flex-grow w-full">
        <input
          type="search"
          placeholder="Search Needle"
          className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-2 px-4 text-xl w-full focus:border-blue-500 outline-none"
          value={userInput}
          onChange={handleUserInputChange}
          onKeyDown={handleKeyPress}
          onClick={handleInputClick}
          spellCheck="false"
          ref={inputRef}
          autoFocus
        />
        <button
          onClick={handleGlassIconClick}
          aria-label="Search"
          className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 shrink flex items-center justify-center bg-secondary hover:bg-secondary-hover"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>
      {autoCompletions.length > 0 && showAutoCompletions && (
        <button
          className="absolute top-14 w-full rounded-md border border-secondary-border bg-white shadow-inner shadow-secondary text-left z-10"
          onClick={handleAutoCompletionClick}
        >
          {autoCompletions.map((autoCompletion, index) => (
            <div
              key={autoCompletion}
              className={`flex items-center w-full h-10 py-2 text-xl rounded-md ${Number(index) === selectedItemIndex ? "bg-secondary-hover" : ""}`}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseHover}
              onClick={handleOptionClick}
              index={index}
              role="presentation"
            >
              {isLoggedIn ? (
                <ClockIcon className="h-6 mx-2" />
              ) : (
                <MagnifyingGlassIcon className="h-6 mx-2" />
              )}
              {autoCompletion}
            </div>
          ))}
        </button>
      )}
    </div>
  );
}

export default SearchInput;
