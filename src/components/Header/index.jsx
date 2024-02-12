import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BugAntIcon } from "@heroicons/react/24/solid";

import axios from "axios";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { useUserStore } from "../../store/store";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserStore();
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
    <div>
      <div className="flex">
        <Link to="/">
          <div className="mt-4 text-4xl font-bold">Needle In Haystack</div>
        </Link>
        {!isLoggedIn ? (
          <div
            className="flex items-center absolute mt-6 right-20 px-4 py-2 border-2 hover:bg-sky-50 rounded-full cursor-pointer bg-white"
            onClick={handleLogin}
            role="button"
            tabIndex={0}
          >
            <img
              className="h-[50px] justify-center items-center"
              src="/userIcon.png"
              alt="signIn"
            />
            <p className="ml-2">Sign in</p>
          </div>
        ) : (
          <div>
            <div
              className="absolute mt-6 right-20"
              onClick={handleUserIconClick}
              role="button"
              tabIndex={0}
            >
              <img
                className="h-[50px] justify-center items-center rounded-full"
                src={user?.photoURL}
                alt="signIn"
              />
            </div>
            {isUserIconClicked && (
              <div className="absolute mt-20 right-20  rounded-md shadow-md bg-white">
                <div className="flex border-b">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
