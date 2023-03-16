import React from "react";

const SideMenu = ({ user, logOut, handleProfile }) => {
  return (
    <div className="h-screen relative rounded-r-lg bg-purple-300 bg-opacity-80">
      <div className="p-6">
        <div className="flex items-center justify-start gap-2">
          <img
            src={user.profile || user.profilePic}
            alt="profile"
            className="rounded-full h-12 w-12 border-2 border-purple-900 p-[1px]"
          />
          <div className="-space-y-1">
            <h1 className="text-lg font-bold">{user.nickname || user.name}</h1>
            <h1 className="text-xs font-light">
              @{user.username || "Please login again"}
            </h1>
          </div>
        </div>
        <div className="my-2 border-2 border-purple-500"></div>
        <h6 className="text-sm px-2 pt-2 w-full text-center">
          You Can Edit Profile and LogOut For Now (●'◡'●)
        </h6>
        <ul className="mt-6 flex flex-col items-start justify-start gap-1 text-md">
          <button
            onClick={() => handleProfile()}
            type="button"
            className="hover:bg-purple-600 hover:text-white w-full text-left p-2 rounded-md"
          >
            Edit Profile
          </button>
          <button
            type="button"
            className="hover:bg-purple-600 hover:text-white w-full text-left p-2 rounded-md"
          >
            Special Note
          </button>
          <button
            type="button"
            className="hover:bg-purple-600 hover:text-white w-full text-left p-2 rounded-md"
          >
            Deleted Notes
          </button>
          <button
            onClick={logOut}
            type="button"
            className="hover:bg-purple-600 hover:text-white w-full text-left p-2 rounded-md"
          >
            Logout
          </button>
        </ul>
      </div>
      <h1 className="absolute bottom-0 p-3 w-full text-center font-sans text-purple-200 text-sm">
        MADE BY SENPAI
      </h1>
    </div>
  );
};

export default SideMenu;
