import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserInputStore from "../../store/store";

function SearchInput() {
  const { userInput, setUserInput } = useUserInputStore();
  const [autoCompletions, setAutoCompletions] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  function handleUserInputChange(event) {
    setUserInput(event.target.value);
  }

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

    getAutoCompletions(userInput);
  }, [userInput]);

  function handleArrowKeyPress(event) {
    const pressedKey = event.key;

    if (
      pressedKey !== "ArrowUp" &&
      pressedKey !== "ArrowDown" &&
      pressedKey !== "Escape"
    ) {
      return;
    }

    event.preventDefault();

    if (pressedKey === "ArrowDown") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex < autoCompletions.length - 1 ? prevIndex + 1 : 0,
      );
    } else if (pressedKey === "ArrowUp") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : autoCompletions.length - 1,
      );
    } else if (pressedKey === "Escape") {
      setAutoCompletions(() => []);
    }
  }

  function handleMouseHover(event) {
    const index = Number(event.target.getAttribute("index"));

    setSelectedItemIndex(index);
  }

  function handleAutoCompletionClick(event) {
    setUserInput(event.target.textContent);

    inputRef.current.disabled = false;
    inputRef.current.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const keywords = userInput.replace(/\s+/g, " ").split(" ").join("+");

    navigate(`/results?search_query=${keywords}`);
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
          value={userInput}
          onChange={handleUserInputChange}
          onKeyDown={handleArrowKeyPress}
          ref={inputRef}
          autoFocus
        />
        {userInput && (
          <div>
            <button
              className={`text-left absolute w-96 rounded-md ${autoCompletions.length ? "border-red-500  bg-white border-2" : ""} mt-1`}
              type="button"
              onClick={handleAutoCompletionClick}
            >
              {autoCompletions.map((element, index) => (
                <p
                  key={element}
                  index={index}
                  className={`pl-2 ${Number(index) === selectedItemIndex ? "bg-slate-300" : ""}`}
                  onMouseEnter={handleMouseHover}
                  onMouseLeave={handleMouseHover}
                >
                  {element}
                </p>
              ))}
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default SearchInput;
