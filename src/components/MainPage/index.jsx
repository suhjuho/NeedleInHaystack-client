import { useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../Header";
import SearchInput from "../SearchInput";

import { useHeaderStateStore } from "../../store/store";

function MainPage() {
  const { setHeaderState } = useHeaderStateStore();

  useEffect(() => {
    setHeaderState("MainPage");
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <Link to="/">
        <div className="mt-10 max-w-full items-center text-center text-4xl font-bold">
          Needle In Haystack
        </div>
      </Link>
      <p className="my-2 text-center font-semibold">
        Search the video using Haystack!
      </p>
      <div className="flex justify-center items-center">
        <SearchInput />
      </div>
    </div>
  );
}

export default MainPage;
