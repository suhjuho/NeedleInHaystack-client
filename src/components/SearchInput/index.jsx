import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserInputStore from "../../store/store";

function SearchInput() {
  const { userInput, setUserInput } = useUserInputStore();
  const [autoCompletions, setAutoCompletions] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [showAutoCompletions, setShowAutoCompletions] = useState(false);

  const navigate = useNavigate();
  const arrowKeyPressed = useRef(false);

  useEffect(() => {
    async function getAutoCompletions(userInput) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auto-completions`,
          {
            params: { userInput },
          },
        );
        const { data } = response;

        setAutoCompletions(data);
      } catch (error) {
        console.log(error);
      }
    }

    if (!arrowKeyPressed.current) {
      getAutoCompletions(userInput);
    }
  }, [userInput, arrowKeyPressed]);

  function handleUserInputChange(event) {
    event.preventDefault();

    arrowKeyPressed.current = false;

    setUserInput(event.target.value);
    setShowAutoCompletions(true);
    setSelectedItemIndex(-1);
  }

  function handleKeyPress(event) {
    const pressedKey = event.key;

    if (pressedKey === "ArrowDown" || pressedKey === "ArrowUp") {
      arrowKeyPressed.current = true;

      if (!showAutoCompletions) {
        return setShowAutoCompletions(true);
      }
    }

    if (pressedKey === "ArrowDown") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex < autoCompletions.length - 1 ? prevIndex + 1 : 0,
      );
      setUserInput(
        autoCompletions[
          selectedItemIndex < autoCompletions.length - 1
            ? selectedItemIndex + 1
            : 0
        ],
      );
    } else if (pressedKey === "ArrowUp") {
      event.preventDefault();

      setShowAutoCompletions(true);
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : autoCompletions.length - 1,
      );
      setUserInput(
        autoCompletions[
          selectedItemIndex > 0
            ? selectedItemIndex - 1
            : autoCompletions.length - 1
        ],
      );
    } else if (pressedKey === "Escape") {
      setShowAutoCompletions(false);
      setSelectedItemIndex(-1);
    } else if (pressedKey === "Enter") {
      const keywords = userInput.replace(/\s+/g, " ").split(" ").join("+");

      setShowAutoCompletions(false);
      setSelectedItemIndex(-1);

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

  return (
    <>
      <p className="mt-4 text-base font-semibold">
        Search the video using Haystack!
      </p>
      <div className="flex flex-col w-96 h-10 mt-4 border-2 rounded-lg border-red-500">
        <input
          className="flex h-full pl-2 rounded-md border-red-500 outline-none"
          type="text"
          placeholder="Haystack 검색"
          value={userInput}
          onChange={handleUserInputChange}
          onKeyDown={handleKeyPress}
          autoFocus
        />
        {autoCompletions.length > 0 && showAutoCompletions && (
          <button
            className="absolute w-96 mt-10 rounded-md border-red-500 bg-white border-2 text-left"
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
                    src="/searchHistoryIcon.png"
                    alt="search history icon"
                  />
                  {element}
                </div>
              ))}
          </button>
        )}
      </div>
    </>
  );
}

export default SearchInput;
