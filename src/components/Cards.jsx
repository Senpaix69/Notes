import React from "react";
const Cards = ({ card, setCardShow, user }) => {
  const { data } = card;
  return (
    <div className="relative p-1 px-2 w-full backdrop-blur-sm">
      <button
        onClick={() => setCardShow(card)}
        className="w-full bg-slate-100 bg-opacity-50 py-3 px-4 rounded-lg"
      >
        <div className="flex items-start justify-start flex-col">
          <h1 className="font-bold text-purple-800 flex items-center justify-center gap-4">
            {data?.title}{" "}
            <span className="text-xs">
              {user === "6MiSvUG1upfAn5OVUyybiSaUnU72"
                ? "(" + data.name + ")"
                : ""}
            </span>
          </h1>
          <p className="text-sm font-semibold truncate max-w-[300px] text-slate-800">
            {data.text}
          </p>
          <div className="text-xs mt-1 text-slate-800 flex items-center justify-between w-full">
            <h6>{data?.date}</h6>
            <div className="flex items-center justify-center gap-2">
              <span>{data.attachment ? "Attachment" : ""}</span>
              <span>{data.users?.length !== 0 ? "Shared" : ""}</span>
              <span>
                {data.link ? (
                  <svg
                    className="h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path d="M562.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L405.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C189.5 251.2 196 330 246 380c56.5 56.5 148 56.5 204.5 0L562.8 267.7zM43.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C57 372 57 321 88.5 289.5L200.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C416.5 260.8 410 182 360 132c-56.5-56.5-148-56.5-204.5 0L43.2 244.3z" />
                  </svg>
                ) : null}
              </span>
            </div>
          </div>
        </div>
        {data?.imp && (
          <svg
            className="absolute right-6 top-5 h-4 fill-purple-800"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Cards;
