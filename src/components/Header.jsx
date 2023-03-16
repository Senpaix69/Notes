import React from "react";

const Header = ({ user, setMenu, search, setSearch }) => {
  return (
    <div className="relative max-w-[600px] rounded-b-lg min-w-[340px] p-2 bg-purple-900 text-white">
      <div className="pl-2 py-3 flex justify-left items-center gap-2">
        <button type="button">
          <svg
            onClick={() => setMenu(true)}
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 bg-opacity-20 rounded-full p-1 border-2 border-gray-500 shadow-md"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>
        <h1 className="text-fuchsia-400 font-bold text-[1.2rem] font-serif">
          {user.nickname || user.name}'s{" "}
          <span className="text-white">Notes</span>
        </h1>
      </div>

      {/* Search */}

      <div className="relative flex items-center backdrop-blur-sm">
        <div className="absolute text-gray-200 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          value={search}
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="ring-2 ring-purple-500 outline-none bg-transparent placeholder:text-gray-200 text-sm rounded-lg font-semibold block w-full pl-10 p-2.5"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default Header;
