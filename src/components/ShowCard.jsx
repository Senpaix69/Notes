import React, { useEffect, useState } from "react";
import { formatDate, uploadFile, getUnread } from "../utils";
import butterFly from "../images/butterfly.png";
import loadingImg from "../images/loadingImg.gif";
import Form from "./Form";

const ShowCard = ({
  setCardShow,
  id,
  toast,
  card,
  deleteNote,
  updateNote,
  user,
}) => {
  const [dropDown, setDropDown] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const [loadImg, setLoadImg] = useState(true);
  const [backCall, setBackCall] = useState(false);
  const [formData, setFormData] = useState({});
  const [attachment, setAttachment] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (card) {
      setFormData(card);
      setTitleActive(true);
      setTextActive(true);
      if (getUnread(card.users, user.name)) {
        updateNote(id, {
          ...card,
          users: card.users.map((cuser) => {
            if (cuser.name === user.name.toLowerCase()) {
              return {
                ...cuser,
                read: true,
              };
            }
            return cuser;
          }),
        });
      }
    }
  }, [card]);

  const handleSubmit = async () => {
    const username = card.name.split(" ").join("").toLowerCase();
    setLoading(true);
    const toastId = toast.loading("Updating Note...");
    const attachmentURLs = [];
    try {
      // const deletedAttachments = card.attachment.filter(
      //   (a) => !formData.attachment.includes(a)
      // );
      // await Promise.all(deletedAttachments.map((a) => deleteFile(a)));

      for (let i = 0; i < formData.attachment.length; i++) {
        const attachment = formData.attachment[i];
        if (!card.attachment.includes(attachment)) {
          const attachmentURL = await uploadFile(attachment, username);
          attachmentURLs.push(attachmentURL);
        } else {
          attachmentURLs.push(attachment);
        }
      }
      for (const attachment of newImages || []) {
        attachmentURLs.push(await uploadFile(attachment, username));
      }
    } catch (error) {
      toast.done(toastId);
      toast.error(error.message);
      setAttachment([]);
      setLoading(false);
      return;
    }
    updateNote(
      id,
      {
        ...formData,
        attachment: attachmentURLs,
        date: formData?.date.includes("M")
          ? formData?.date
          : formatDate(formData?.date),
      },
      setLoading,
      setEditNote
    );
    setAttachment([]);
    toast.dismiss(toastId);
    toast.success("Updating Successfull");
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteNote(
      id,
      card?.attachment?.length > 0 ? card.attachment : undefined
    );
    setLoading(false);
  };
  return (
    <div className="h-screen overflow-hidden overflow-y-scroll scrollbar-hide">
      <div className="fixed w-full max-w-[600px] top-0 bg-purple-400 px-3 py-4 flex items-center font-bold gap-3 z-50">
        <button
          type="button"
          onClick={() => {
            setCardShow(undefined);
            setBackCall((prev) => !prev);
            setDropDown(false);
            setEditNote(false);
            setLoadImg(true);
            setZoom(false);
          }}
          disabled={loading}
          className="disabled:cursor-wait"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 ml-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </button>
        <h1 className="text-lg">Note</h1>
      </div>

      <div className="mt-32 mb-8 p-2 relative">
        <div className="absolute w-full max-w-[600px] left-0 -top-6 flex items-center justify-center">
          <img
            src={butterFly}
            alt="butterfly"
            className="h-16 bg-purple-800 rounded-full z-20"
          />
        </div>
        <div
          className={`absolute right-5 top-4 z-10 ${
            card?.uid === user.uid ||
            user.uid === "FmxmGuIQ75dvrYhTbk1E0bH0YJW2"
              ? ""
              : "hidden"
          }`}
        >
          <div className="relative inline-block text-left">
            <div>
              <button
                disabled={loading}
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
                className="absolute right-0 bg-purple-200 font-semibold z-10 mt-1 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-purple-900 ring-opacity-40 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => {
                      setDropDown(false);
                      setAttachment([]);
                      setNewImages([]);
                      editNote ? setEditNote(false) : setEditNote(true);
                    }}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-600 hover:text-white w-full text-left"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    {editNote ? "Cancel Editing" : "Edit Note"}
                  </button>
                  <button
                    onClick={() => {
                      setDropDown(false);
                      handleDelete();
                    }}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-600 hover:text-white w-full text-left"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    Delete Note
                  </button>
                  <button
                    onClick={() => {
                      setDropDown(false);
                      updateNote(id, { ...formData, imp: !formData.imp });
                    }}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-purple-600 hover:text-white w-full text-left"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    {card?.imp ? "Not Important" : "Important"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-100 bg-opacity-50 backdrop-blur-sm rounded-lg py-6 px-2">
          {card && (
            <div className="mt-4 mx-2 flex justify-start items-start flex-col">
              {!editNote ? (
                <>
                  <h1 className="font-bold text-lg text-purple-800">
                    {card.title}
                  </h1>
                  <div className="border-2 border-purple-500 w-full"></div>
                  <div className="mt-6 w-full">
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                      className="mt-2 text-sm font-sans"
                    >
                      {card.text}
                    </p>
                    {card.attachment?.length > 0 && (
                      <div
                        className={`p-1 shadow-md my-4 rounded-lg border-2 border-purple-200  overflow-x-scroll flex flex-nowrap items-center scrollbar-hide ${
                          card.attachment.length > 1 ? "" : "justify-center"
                        }`}
                      >
                        {card.attachment.map((cardImage, index) => (
                          <div
                            key={index}
                            className={`min-w-[200px] w-full h-[200px] relative mx-1 rounded-lg ${
                              !zoom ? "" : "min-w-[350px] min-h-[400px]"
                            }`}
                          >
                            <img
                              src={loadingImg}
                              onClick={() => setZoom((prev) => !prev)}
                              alt="pic"
                              className={`absolute inset-0 object-cover w-full h-full rounded-lg shadow-lg m-auto transition-opacity duration-150 ${
                                loadImg ? "opacity-100" : "opacity-0 p-2"
                              }`}
                            />
                            <img
                              placeholder={loadingImg}
                              onLoad={() => setLoadImg(false)}
                              src={cardImage}
                              alt="pic"
                              loading="lazy"
                              className={`object-contain w-full h-full rounded-lg shadow-lg m-auto transition-opacity duration-300 ${
                                loadImg ? "opacity-0" : "opacity-100"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {card?.links?.length > 0 && (
                      <div className="my-4 flex items-start justify-start flex-col gap-1 text-sm">
                        {card.links.map((link, ind) => (
                          <div
                            className="flex items-start justify-start gap-2"
                            key={ind}
                          >
                            <h1 className="font-bold">Link {ind + 1}:</h1>
                            <a
                              className="text-blue-700 underline underline-offset-2"
                              href={link.src}
                              target="_top"
                              rel="noreferrer"
                            >
                              {link.label}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {card?.users?.length > 0 &&
                      (card?.uid === user.uid ||
                        user.uid === "FmxmGuIQ75dvrYhTbk1E0bH0YJW2") && (
                        <div className="my-4 text-sm font-semibold shadow-sm border-2 p-2 border-purple-200 rounded-md">
                          <h1>Sharing with users</h1>
                          <div className="flex flex-col">
                            <div className="flex font-semibold">
                              <div className="w-1/2">User</div>
                              <div className="w-1/2">Status</div>
                            </div>
                            {card.users?.map((curUser, ind) => (
                              <div
                                key={ind}
                                className="flex justify-between items-center"
                              >
                                <div className="w-1/2">
                                  <h6 className="text-xs lowercase">
                                    {curUser?.name || curUser}
                                  </h6>
                                </div>
                                <div className="w-1/2">
                                  {curUser.read !== undefined && (
                                    <h6
                                      className={`text-xs lowercase ${
                                        curUser.read
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {curUser.read ? "Read" : "Unread"}
                                    </h6>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {card?.imp && (
                      <svg
                        className="absolute right-6 bottom-6 h-4 fill-purple-800"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                    )}
                    <p className="mt-8 font-semibol text-xs flex items-center flex-col">
                      {(card.uid !== user ||
                        card?.uid === "FmxmGuIQ75dvrYhTbk1E0bH0YJW2") && (
                        <span>From: {card.name}</span>
                      )}
                      <span>Date: {card.date}</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <Form
                    toast={toast}
                    backCall={backCall}
                    formData={formData}
                    titleActive={titleActive}
                    textActive={textActive}
                    newImages={newImages}
                    setNewImages={setNewImages}
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
