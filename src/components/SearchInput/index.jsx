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
  const [referenceIndex, setReferenceIndex] = useState(10);

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
        setReferenceIndex(data.referenceIndex);
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

  function handleMouseEnter(event) {
    const index = Number(event.target.getAttribute("index"));

    setSelectedItemIndex(index);
  }

  function handleMouseLeave() {
    setSelectedItemIndex(-1);
  }

  function handleAutoCompletionClick() {
    const selectedKeyword = autoCompletions[selectedItemIndex];
    const keywords = selectedKeyword.replace(/\s+/g, " ").split(" ").join("+");

    setUserInput(selectedKeyword);
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

  function handleDeleteClick(event) {
    event.stopPropagation();
    const historyToDelete = autoCompletions[selectedItemIndex];
    const index = autoCompletions.indexOf(historyToDelete);

    setAutoCompletions((prev) => {
      const newArray = [...prev];

      newArray.splice(index, 1);

      return newArray;
    });

    async function deleteAutoCompletions(historyToDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/auto-completions`,
          {
            params: { historyToDelete },
            withCredentials: true,
          },
        );
      } catch (error) {
        console.error(error);
      }
    }

    deleteAutoCompletions(historyToDelete);
    setSelectedItemIndex((prev) => prev + 1);
  }

  return (
    <div className="relative flex flex-col gap-4 flex-grow max-w-[600px] items-center justify-center">
      <div className="flex flex-grow w-full">
        <input
          type="search"
          placeholder="Search Needle"
          className="rounded-l-full bg-white border border-secondary-border shadow-inner shadow-secondary py-2 px-4 text-2xl w-full focus:border-main outline-none"
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
              className={`flex items-center w-full py-3 text-xl rounded-md ${Number(index) === selectedItemIndex ? "bg-secondary-hover" : ""}
              ${index < referenceIndex ? "text-violet-600" : "text-black"}
              `}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleOptionClick}
              index={index}
              role="presentation"
            >
              {isLoggedIn && index < referenceIndex ? (
                <ClockIcon className="h-6 mx-2" />
              ) : (
                <MagnifyingGlassIcon className="h-6 mx-2" />
              )}
              {autoCompletion}
              <span
                className={`${(index < referenceIndex || userInput === "") && index === selectedItemIndex ? "block" : "hidden"} ml-auto mr-4 text-gray-500 hover:underline`}
                onClick={handleDeleteClick}
                role="presentation"
              >
                delete
              </span>
            </div>
          ))}
        </button>
      )}
    </div>
  );
}

export default SearchInput;
