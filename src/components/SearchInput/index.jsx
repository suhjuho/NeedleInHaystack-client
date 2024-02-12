import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  function handleClick() {
    setShowSearchHistory(true);
    setShowAutoCompletions(true);
  }

  return (
    <div className="flex flex-col w-96 h-10 border-2 rounded-lg border-red-500">
      <input
        className="flex h-full pl-2 rounded-md border-red-500 outline-none"
        type="text"
        placeholder="Haystack 검색"
        value={userInput}
        onChange={handleUserInputChange}
        onKeyDown={handleKeyPress}
        onClick={handleClick}
        spellCheck="false"
        ref={inputRef}
        autoFocus
      />
      {autoCompletions.length > 0 && showAutoCompletions && (
        <button
          className="absolute w-96 mt-10 border-2 rounded-md border-red-500 bg-white text-left"
          onClick={handleAutoCompletionClick}
        >
          {autoCompletions.length > 0 &&
            autoCompletions.map((element, index) => (
              <div
                key={element}
                className={`flex items-center w-95 h-10 rounded-md ${Number(index) === selectedItemIndex ? "bg-slate-300" : ""}`}
                onMouseEnter={handleMouseHover}
                onMouseLeave={handleMouseHover}
                index={index}
              >
                <img
                  className="w-5 h-5 ml-2 mr-2"
                  src={`${isLoggedIn ? "/searchHistoryIcon.png" : "/searchIcon.png"}`}
                  alt="search history icon"
                />
                {element}
              </div>
            ))}
        </button>
      )}
    </div>
  );
}

export default SearchInput;
