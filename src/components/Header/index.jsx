import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BugAntIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

import axios from "axios";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { useUserStore, useHeaderStateStore } from "../../store/store";

import SearchInput from "../SearchInput";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserStore();
  const { headerState } = useHeaderStateStore();
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

  return (
    <div className="flex py-4 gap-10 lg:gap-20 justify-between items-center sticky top-0 z-10 bg-white ">
      <div className="flex mr-auto ml-4 gap-4 items-center flex-shrink-0">
        {headerState === "DetailPage" && (
          <button
            className="flex p-3 rounded-full hover:bg-sky-50"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowUturnLeftIcon
              className="h-[25px] justify-center items-center"
              alt="Back"
            />
          </button>
        )}
        {headerState !== "MainPage" && (
          <>
            <Link to="/">
              <div className="p-2 text-xl font-bold rounded-full hover:bg-sky-50">
                Needle In Haystack
              </div>
            </Link>
            <SearchInput />
          </>
        )}
      </div>
      {!isLoggedIn ? (
        <div
          className="flex mr-4 ml-auto p-2 items-center flex-shrink-0 border rounded-full hover:bg-sky-50 cursor-pointer"
          onClick={handleLogin}
          role="button"
          tabIndex={0}
        >
          <img className="h-[30px]" src="/userIcon.png" alt="signIn" />
          <p className="ml-2">Sign in</p>
        </div>
      ) : (
        <div className="flex flex-col mr-4 ml-auto items-center flex-shrink-0 cursor-pointer">
          <div
            className="flex ml-auto items-center flex-shrink-0 border rounded-full cursor-pointer"
            onClick={handleUserIconClick}
            role="button"
            tabIndex={0}
          >
            <img
              className="h-[50px] rounded-full"
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
                <img
                  className="h-[25px] justify-center items-center m-3"
                  src="signOutIcon.png"
                  alt="signOutIcon"
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
