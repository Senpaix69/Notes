import React from "react";
import { auth, provider, signInWithPopup } from "../firebaseConfig";
import logo from "../images/login.png";
import chromeLogo from "../images/chrome.png";
import notice from "../images/notice.png";

const Login = ({ setUser }) => {
  const logIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        if (res.user) {
          const user = {
            uid: res.user.uid,
            name: res.user.displayName,
            username: res.user.displayName
              .split(" ")
              .join("")
              .toLocaleLowerCase(),
            email: res.user.email,
            phoneNo: res.user.phoneNumber,
            profilePic: res.user.photoURL,
          };
          setUser(user);
          localStorage.setItem("cred", JSON.stringify(user));
        }
      })
      .catch((err) => alert(err.message));
  };

  return (
    <section className="relative overflow-hidden h-screen w-full bg-gradient-to-b from-purple-300 flex items-center justify-center scrollbar-hide">
      <div className="bg-opacity-20 text-bold md:h-4/5 h-4/5 w-5/6 rounded-lg shadow-md max-w-[600px]">
        <div className="h-full flex items-center justify-center relative">
          <img src={logo} alt="logo-img" />
          <img
            src={notice}
            alt="notice-logo-img"
            className="absolute w-40 right-8"
          />
          <button
            onClick={logIn}
            className="flex items-center gap-2 cursor-pointer bg-purple-500 p-2 absolute text-white font-semibold rounded-md bottom-14 hover:bg-white hover:text-purple-500 shadow-md"
          >
            <img
              src={chromeLogo}
              alt="chrome-logo-img"
              className="w-5 animate-pulse duration-75"
            />
            LogIn With Google
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
