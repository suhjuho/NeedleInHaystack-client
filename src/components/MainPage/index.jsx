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
        <div className="flex justify-center items-center max-w-full my-32 sm:my-10 text-center">
          <img
            className="absolute sm:relative w-32 sm:w-10 mx-2 opacity-30 sm:opacity-100"
            src="/assets/LogoSample2.png"
            alt="Logo"
          />
          <div className="text-4xl font-bold z-10">Needle In Haystack</div>
        </div>
      </Link>
      <p className="hidden sm:block mb-12 text-secondary-text text-center font-semibold">
        Search the video using Haystack!
      </p>
      <div className="flex justify-center items-center">
        <SearchInput />
      </div>
    </div>
  );
}

export default MainPage;
