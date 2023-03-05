import React from "react";
import cardImg from "../images/cardImg.png";
const Cards = ({ card, id, setIndex, user }) => {
  return (
    <div className="relative p-1 px-2 w-full backdrop-blur-sm">
      <button
        onClick={() =>
          setIndex(id, card.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72")
        }
        className="w-full bg-slate-100 bg-opacity-50 py-3 px-4 rounded-lg"
      >
        <div className="flex items-start justify-start flex-col">
          <h1 className="font-bold text-purple-800 flex items-center justify-center gap-4">
            {card?.title}{" "}
            <span className="text-xs">
              {user === "6MiSvUG1upfAn5OVUyybiSaUnU72"
                ? "(" + card.name + ")"
                : ""}
            </span>
          </h1>
          <p className="text-sm font-semibold truncate max-w-[300px] text-slate-800">
            {card.text}
          </p>
          <h6 className="text-xs mt-1 text-slate-800">{card?.date}</h6>
        </div>
        {card?.imp && (
          <img
            src={cardImg}
            alt="card"
            className="absolute w-24 top-6 right-0"
          />
        )}
      </button>
    </div>
  );
};

export default Cards;
