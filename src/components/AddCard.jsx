import React, { useState } from "react";
import butterFly from "../images/butterfly.png";
import Form from "./Form";

const AddCard = ({ setAddCard, user, date, addDoc, collRef }) => {
  const [loading, setLoading] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const [backCall, setBackCall] = useState(false);
  const [formData, setFormData] = useState({});
  const [attachment, setAttachment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    addDoc(collRef, {
      uid: user.uid,
      name: user.name,
      title: formData.title,
      label: formData.label || "",
      link: formData.link || "",
      text: formData.text,
      imp: formData.imp || false,
      users: [],
      attachment: formData.attachment || "",
      date: formData.date
        ? formData.date + ", " + date.toLocaleTimeString()
        : date.toLocaleString(),
    })
      .then(() => {
        setFormData({});
        setAttachment("");
        setAddCard(false);
        setTextActive(false);
        setBackCall((prev) => !prev);
        setTitleActive(false);
        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };
  return (
    <div>
      <div className="fixed w-full max-w-[600px] top-0 bg-purple-400 p-3 py-4 flex items-center font-bold gap-3 z-50">
        <svg
          onClick={() => {
            setAddCard(false);
            setBackCall((prev) => !prev);
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
        <h1 className="text-lg">Add Note</h1>
      </div>

      <div className="mt-32 mb-8 p-2 relative">
        <div className="absolute w-full max-w-[600px] left-0 -top-6 flex items-center justify-center">
          <img
            src={butterFly}
            alt="butterfly"
            className="h-16 bg-purple-800 rounded-full z-10"
          />
        </div>
        <div className="bg-slate-100 bg-opacity-50 backdrop-blur-sm rounded-lg px-2 py-6">
          <Form
            backCall={backCall}
            formData={formData}
            attachment={attachment}
            titleActive={titleActive}
            textActive={textActive}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            setTextActive={setTextActive}
            setTitleActive={setTitleActive}
            setAttachment={setAttachment}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCard;
