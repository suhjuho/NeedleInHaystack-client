import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BugAntIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

import axios from "axios";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import {
  useUserStore,
  useHeaderStateStore,
  useUserInputStore,
} from "../../store/store";

import SearchInput from "../SearchInput";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserStore();
  const { headerState } = useHeaderStateStore();
  const { setUserInput } = useUserInputStore();
  const [isUserIconClicked, setUserIconClicked] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/check`,
        {
          withCredentials: true,
        },
      );

      if (response.data.result) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      }

      return response.data;
    }

    checkLogin();
  }, []);

  async function logIn(userData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signIn`,
        userData,
        {
          headers: {
            "content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.data.result === "ok") {
        setIsLoggedIn(true);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogin() {
    try {
      const response = await signInWithPopup(auth, provider);
      const { user } = response;

      if (user) {
        logIn(user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleUserIconClick() {
    setUserIconClicked((isUserIconClicked) => !isUserIconClicked);
  }

  async function handleLogOut() {
    try {
      await signOut(auth);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/signOut`,
        { withCredentials: true },
      );
      if (response.data.result === "ok") {
        setIsLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogoClick() {
    setUserInput("");
  }

  return (
    <div className="flex justify-center sm:justify-between items-center w-screen shrink sticky top-0 gap-4 lg:gap-8 my-8 px-4 py-2 z-10 bg-white ">
      <div className="flex items-center">
        {headerState === "DetailPage" && (
          <button
            className="flex rounded-full hover:bg-sky-50"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ChevronLeftIcon className="w-6" alt="Back" />
          </button>
        )}
        {headerState !== "MainPage" && (
          <>
            <Link to="/">
              <div className="flex items-center justify-center text-center ">
                <img
                  className="w-6 mx-2"
                  src="/assets/LogoSample2.png"
                  alt="Logo"
                  onClick={handleLogoClick}
                  role="button"
                  tabIndex={0}
                />
                <div className="p-2 hidden text-xl font-bold">
                  Needle In Haystack
                </div>
              </div>
            </Link>
            {headerState !== "AdminPage" && <SearchInput />}
          </>
        )}
      </div>
      {!isLoggedIn ? (
        <div
          className="hidden sm:flex mr-4 ml-auto p-2 items-center border rounded-full hover:bg-sky-50 cursor-pointer"
          onClick={handleLogin}
          role="button"
          tabIndex={0}
        >
          <UserCircleIcon
            className="w-6 items-center fill-blue-300"
            alt="signIn"
          />
          <p className="px-1">Sign in</p>
        </div>
      ) : (
        <div className="flex flex-col mr-4 ml-auto items-center cursor-pointer">
          <div
            className="flex ml-auto items-center border rounded-full cursor-pointer"
            onClick={handleUserIconClick}
            role="button"
            tabIndex={0}
          >
            <img
              className="h-[51px] rounded-full"
              src={user?.photoURL}
              alt="signIn"
            />
          </div>
          {isUserIconClicked && (
            <div className="absolute top-20 right-3 flex flex-col rounded-md border-b shadow-md bg-white">
              <div className="flex">
                <img
                  className="h-[50px] justify-center items-center rounded-full m-3"
                  src={user?.photoURL}
                  alt="signIn"
                />
                <div className="flex flex-col justify-center mr-4">
                  <p>{user.displayName}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div
                className="flex items-center hover:bg-slate-100 cursor-pointer"
                role="button"
                onClick={() => {
                  navigate("/admin");
                }}
                tabIndex={0}
              >
                <BugAntIcon className="h-[25px] justify-center items-center m-3" />
                <p className="m-3">Crawler</p>
              </div>
              <div
                className="flex items-center hover:bg-slate-100 cursor-pointer"
                role="button"
                onClick={handleLogOut}
                tabIndex={0}
              >
                <ArrowRightStartOnRectangleIcon
                  className="h-[25px] justify-center items-center m-3"
                  alt="signOut"
                />
                <p className="m-3">Log out</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
