import React, { useEffect, useState } from "react";
import butterFly from "../images/butterfly.png";
import Form from "./Form";

const ShowCard = ({
  setIndex,
  id,
  card,
  deleteNote,
  updateNote,
  notEditable,
  setIsNoteEditable,
}) => {
  const [dropDown, setDropDown] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const [backCall, setBackCall] = useState(false);
  const [formData, setFormData] = useState({});
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    setFormData({
      uid: card?.uid,
      title: card?.title,
      text: card?.text,
      imp: card?.imp,
      attachment: card?.attachment,
      label: card?.label,
      link: card?.link,
      date: card?.date,
    });
    setTitleActive(true);
    setTextActive(true);
  }, [card]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateNote(id, formData, setLoading, setEditNote);
  };

  const important = () => {
    updateNote(id, { ...formData, imp: !formData.imp });
  };

  return (
    <div>
      <div className="fixed w-full max-w-[600px] top-0 bg-purple-400 p-3 py-4 flex items-center font-bold gap-3 z-50">
        <svg
          onClick={() => {
            setIndex(-1);
            setBackCall((prev) => !prev);
            setDropDown(false);
            setEditNote(false);
            setIsNoteEditable(false);
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 ml-3 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
        </svg>
        <h1 className="text-lg">Note</h1>
      </div>

      <div className="mt-32 mb-8 p-4 relative">
        <div className="absolute w-full max-w-[600px] left-0 -top-5 flex items-center justify-center">
          <img
            src={butterFly}
            alt="butterfly"
            className="h-16 bg-purple-800 rounded-full z-10"
          />

          <div
            className={`absolute right-5 top-10 z-20 ${
              notEditable ? "" : "hidden"
            }`}
          >
            <div className="relative inline-block text-left">
              <div>
                <button
                  onClick={() => setDropDown((prev) => !prev)}
                  type="button"
                  className="p-2 text-sm font-semibold rounded-full"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <svg
                    className="h-7 w-7 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {dropDown && (
                <div
                  className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md backdrop-blur-sm shadow-lg ring-2 ring-purple-900 ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={() => {
                        setDropDown(false);
                        editNote ? setEditNote(false) : setEditNote(true);
                      }}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-300 w-full text-left"
                      tabIndex="-1"
                      id="menu-item-0"
                    >
                      {editNote ? "Cancel Editing" : "Edit Note"}
                    </button>
                    <button
                      onClick={() => {
                        setDropDown(false);
                        deleteNote(id);
                      }}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-300 w-full text-left"
                      tabIndex="-1"
                      id="menu-item-0"
                    >
                      Delete Note
                    </button>
                    <button
                      onClick={() => {
                        setDropDown(false);
                        important();
                      }}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-300 w-full text-left"
                      tabIndex="-1"
                      id="menu-item-0"
                    >
                      {card.imp ? "Not Important" : "Important"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-100 bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
          {card && (
            <div className="mt-4 mx-2 flex justify-start items-start flex-col">
              {!editNote ? (
                <>
                  <h1 className="font-bold text-lg text-purple-800">
                    {card.title}
                  </h1>
                  <div className="border-2 border-purple-500 w-full"></div>
                  <div className="mt-6">
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                      className="mt-2 text-sm font-sans"
                    >
                      {card.text}
                    </p>
                    {card.attachment && (
                      <div className="rounded-lg border-2 border-purple-200 shadow-md p-2 mt-4">
                        <img
                          src={card.attachment}
                          alt="pic"
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    {card.link && (
                      <div className="my-4 flex items-start justify-start gap-2 text-sm">
                        <h1 className="font-bold">Link:</h1>
                        <a
                          className="hover:text-blue-800 underline underline-offset-2"
                          href={card.link}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {card.label}
                        </a>
                      </div>
                    )}
                    <p className="mt-8 text-xs">
                      <span className="font-semibold">date:</span> {card.date}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <Form
                    backCall={backCall}
                    formData={formData}
                    titleActive={titleActive}
                    textActive={textActive}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    setTextActive={setTextActive}
                    setTitleActive={setTitleActive}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
