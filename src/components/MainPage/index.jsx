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
        <div className="my-10 flex max-w-full items-center justify-center text-center ">
          <img className="w-10 mx-2" src="/assets/LogoSample2.png" alt="Logo" />
          <div className="text-4xl font-bold">Needle In Haystack</div>
        </div>
      </Link>
      <p className="mb-10 text-center font-semibold">
        Search the video using Haystack!
      </p>
      <div className="flex justify-center items-center">
        <SearchInput />
      </div>
    </div>
  );
}

export default MainPage;
