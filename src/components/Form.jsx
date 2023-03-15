import React, { useEffect, useRef, useState } from "react";
import loadingImg from "../images/loadingImg.gif";
import { compressImage } from "../compressImage";

const Form = (props) => {
  const refInput = useRef();
  const [addLink, setAddLink] = useState(false);
  const [shareWith, setShareWith] = useState("");
  const [loadImg, setLoadImg] = useState(true);
  const [link, setLink] = useState(null);
  const [titleLength, setTitleLength] = useState(
    20 - (props.formData.title?.length || 0)
  );
  const [textLength, setTextLength] = useState(
    1000 - (props.formData.text?.length || 0)
  );
  const [previews, setPreviews] = useState([]);

  useEffect(() => setPreviews([]), [props.formData?.attachment]);
  useEffect(() => {
    let fileReaders = [];
    const compressedAttachments = [];
    const compressAndSetAttachment = async (attachment, index) => {
      try {
        const compressed = await compressImage(attachment);
        compressedAttachments[index] = compressed;
        if (compressedAttachments.length === props.attachment.length) {
          props.setNewImages([...compressedAttachments]);
          props.setAttachment([]);
        }
      } catch (err) {
        alert(err.message);
      }
    };
    for (let i = 0; i < props?.attachment?.length; i++) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(props?.attachment[i]);
      fileReader.onloadend = () => {
        setPreviews((prevPreviews) => [...prevPreviews, fileReader.result]);
        fileReaders[i] = fileReader;
        compressAndSetAttachment(props?.attachment[i], i);
      };
      fileReaders[i] = fileReader;
    }
    return () => {
      fileReaders.forEach((fileReader) => {
        if (fileReader && fileReader.readyState === FileReader.LOADING) {
          fileReader.abort();
        }
      });
    };
  }, [props.attachment]);

  useEffect(() => {
    setAddLink(false);
    props.setAttachment([]);
  }, [props.backCall]);

  const removeAttachment = (index, preview) => {
    if (preview) {
      setPreviews((prev) => prev.filter((_, ind) => ind !== index));
      previews.length === 0 && props.setAttachment([]);
    } else {
      const newAttachments = props.formData.attachment.filter(
        (_, ind) => ind !== index
      );
      props.setFormData((prevFormData) => ({
        ...prevFormData,
        attachment: newAttachments,
      }));
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "title") {
      setTitleLength(20 - e.target.value.length);
    } else if (e.target.name === "text") {
      setTextLength(1000 - e.target.value.length);
    }
    props.setFormData({ ...props.formData, [e.target.name]: e.target.value });
  };

  const handleShareWith = (ind) => {
    const newUsers =
      ind !== undefined
        ? (props.formData?.users || []).filter((_, i) => i !== ind)
        : [
            ...(props.formData?.users || []),
            shareWith?.split()?.join("")?.toLowerCase(),
          ];
    props.setFormData((formData) => ({ ...formData, users: newUsers }));
    setShareWith("");
  };

  const checkValidation = (e) => {
    e.preventDefault();
    if (textLength < 0) {
      props.toast.error("Text length exceeded limit");
      return;
    } else if (titleLength < 0) {
      props.toast.error("Title length exceeded limit");
      return;
    }
    props.handleSubmit();
  };

  const handleLinks = (ind) => {
    const newLinks =
      ind !== undefined
        ? (props.formData?.links || []).filter((_, i) => i !== ind)
        : [...(props.formData?.links || []), link];
    props.setFormData((formData) => ({ ...formData, links: newLinks }));
    setAddLink(false);
    setLink(null);
  };

  return (
    <div className="mx-2">
      <form onSubmit={(e) => checkValidation(e)}>
        <div className="relative mt-4">
          <span
            className={`absolute text-sm top-2 left-2 text-purple-700 transition-all duration-150 ${
              props.titleActive
                ? "-translate-y-6 scale-90"
                : "translate-y-0 scale-100"
            }`}
          >
            Title
          </span>
          <input
            disabled={props.loading}
            onFocus={() => props.setTitleActive(true)}
            onBlur={() => {
              !props.formData?.title && props.setTitleActive(false);
            }}
            name="title"
            value={props.formData.title || ""}
            onChange={(e) => handleChange(e)}
            type="text"
            className="block min-h-[auto] disabled:cursor-wait w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
            required
          />
          <span
            className={`absolute text-[10px] right-0 -bottom-5 ${
              titleLength >= 0
                ? "text-purple-700 font-light"
                : "text-red-600 font-semibold"
            }`}
          >
            char: {titleLength}
          </span>
        </div>
        <div className="border-2 border-purple-500"></div>
        <div className="relative mt-8">
          <span
            className={`absolute text-sm top-2 left-2 text-purple-700 transition-all duration-150 ${
              props.textActive
                ? "-translate-y-6 scale-90"
                : "translate-y-0 scale-100"
            }`}
          >
            Text
          </span>
          <textarea
            disabled={props.loading}
            onFocus={() => props.setTextActive(true)}
            onBlur={() => {
              !props.formData?.text && props.setTextActive(false);
            }}
            name="text"
            value={props.formData.text || ""}
            onChange={(e) => handleChange(e)}
            rows={4}
            type="text"
            className="bg-slate-100 disabled:cursor-wait scrollbar-hide bg-opacity-30 resize-none min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
            required
          />
          <span
            className={`absolute text-[10px] right-0 -bottom-5 ${
              textLength >= 0
                ? "text-purple-700 font-light"
                : "text-red-600 font-semibold"
            }`}
          >
            char: {textLength}
          </span>
        </div>
        <div className="border-2 border-purple-500"></div>
        {props.formData?.attachment?.length > 0 && (
          <h1 className="font-semibold text-xs mt-3">Saved Images: </h1>
        )}
        <div className="overflow-x-scroll flex flex-nowrap items-center scrollbar-hide">
          {props.formData?.attachment?.map((cardImage, index) => (
            <button
              type="button"
              disabled={props.loading}
              onClick={() => removeAttachment(index)}
              key={index}
              className="h-[150px] min-w-[150px] relative mx-1 rounded-lg border-2 border-purple-200 shadow-md p-2"
            >
              <img
                src={loadingImg}
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
                className={`object-cover w-full h-full rounded-lg shadow-lg m-auto transition-opacity duration-300 ${
                  loadImg ? "opacity-0" : "opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
        {previews.length > 0 && (
          <h1 className="font-semibold text-xs mt-3">New Added: </h1>
        )}
        <div className="overflow-x-scroll flex flex-nowrap items-center scrollbar-hide">
          {previews.map((cardImage, index) => (
            <button
              type="button"
              disabled={props.loading}
              onClick={() => removeAttachment(index, "preview")}
              key={index}
              className="h-[150px] min-w-[150px] relative mx-1 rounded-lg border-2 border-purple-200 shadow-md p-2 mt-4"
            >
              <img
                placeholder={loadingImg}
                onLoad={() => setLoadImg(false)}
                src={cardImage}
                alt="pic"
                loading="lazy"
                className={`object-cover w-full h-full rounded-lg shadow-lg m-auto transition-opacity duration-300 ${
                  loadImg ? "opacity-0" : "opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
        {(previews.length > 0 || props.formData?.attachment?.length > 1) && (
          <h6 className="rounded-lg mt-2 font-semibold cursor-default p-2 m-auto ring-1 ring-purple-400 text-center text-purple-700 text-sm">
            Click On Image To Remove
          </h6>
        )}

        {props.formData?.users?.length > 0 && (
          <div className="flex items-start justify-center flex-col mt-1">
            <h1 className="font-semibold text-sm my-2">Sharing with: </h1>
            {props.formData.users?.map((user, ind) => (
              <div
                key={ind}
                className="ml-4 mt-1 text-sm flex items-center justify-between gap-2"
              >
                <button
                  disabled={props.loading}
                  type="button"
                  onClick={() => handleShareWith(ind)}
                  className="bg-purple-500 disabled:bg-purple-300 disabled:cursor-wait text-white rounded bg-primary px-2 py-1 text-[9px] font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
                >
                  Remove
                </button>
                <h1 className="font-semibold">{user}</h1>
              </div>
            ))}
          </div>
        )}
        {props.formData?.links?.length > 0 && (
          <div className="flex items-start justify-center flex-col mt-1">
            <h1 className="font-semibold text-sm my-2">Links Added: </h1>
            {props.formData.links?.map((link, ind) => (
              <div
                key={ind}
                className="ml-4 mt-1 text-sm flex items-center justify-between gap-2"
              >
                <button
                  disabled={props.loading}
                  type="button"
                  onClick={() => handleLinks(ind)}
                  className="bg-purple-500 disabled:bg-purple-300 disabled:cursor-wait text-white rounded bg-primary px-2 py-1 text-[9px] font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
                >
                  Remove
                </button>
                <a
                  href={link.src}
                  className="font-semibold text-blue-800 underline"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="relative">
            <span className="absolute text-xs top-2 -left-1 text-purple-700 -translate-y-6 scale-90">
              {"Date (optional)"}
            </span>
            <input
              disabled={props.loading}
              name="date"
              value={props.formData.date || ""}
              onChange={(e) => handleChange(e)}
              type="date"
              className="block min-h-[auto] disabled:cursor-wait text-sm max-w-[120px] rounded border-0 bg-transparent py-[0.32rem] outline-none"
            />
            <div className="mb-4 border-2 max-w-[120px] border-purple-500"></div>
          </div>
          <div className="relative">
            <span className="absolute text-xs top-2 -left-1 text-purple-700 -translate-y-6 scale-90">
              {"Share Note (optional)"}
            </span>
            <div className="relative max-w-[140px] md:max-w-full">
              <input
                disabled={props.loading}
                name="shareWith"
                value={shareWith}
                onChange={(e) => setShareWith(e.target.value)}
                type="text"
                placeholder="username"
                className="block min-h-[auto] disabled:cursor-wait placeholder:text-black text-sm rounded border-0 bg-transparent py-[0.32rem] px-1 outline-none"
              />
              <button
                onClick={() => handleShareWith()}
                disabled={shareWith === ""}
                type="button"
                className="absolute top-[2.5px] right-0 bg-purple-500 disabled:bg-purple-300 text-white rounded bg-primary px-2 py-1 text-[9px] font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
              >
                ADD
              </button>
            </div>

            <div className="mb-4 border-2 border-purple-500"></div>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-start m-2 mb-4 text-sm text-purple-900 font-semibold">
          <input
            disabled={props.loading}
            type="checkbox"
            className="mt-[3px] scale-125"
            checked={props.formData.imp || false}
            onChange={() =>
              props.setFormData({ ...props.formData, imp: !props.formData.imp })
            }
            name="imp"
          />
          <h2 className="text-black">Important Note?</h2>
          <button
            disabled={props.loading}
            hidden={addLink}
            onClick={() => setAddLink(true)}
            type="button"
          >
            Add Link
          </button>
        </div>
        {addLink && (
          <div className="border-[3px] border-purple-500 my-6 py-2 px-3 pb-6 rounded-md shadow-md">
            <div className="relative mt-4">
              <span className="absolute text-sm top-2 left-2 text-purple-700 -translate-y-6 scale-90">
                Label
              </span>
              <input
                disabled={props.loading}
                name="label"
                value={link?.label || ""}
                onChange={(e) => setLink({ ...link, label: e.target.value })}
                type="text"
                className="block min-h-[auto] disabled:cursor-wait w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
                required
              />
            </div>
            <div className="border-2 border-purple-500"></div>
            <div className="relative mt-8">
              <span className="absolute text-sm top-2 left-2 text-purple-700 -translate-y-6 scale-90">
                Link
              </span>
              <input
                disabled={props.loading}
                name="link"
                value={link?.src || ""}
                onChange={(e) => setLink({ ...link, src: e.target.value })}
                type="text"
                className="block min-h-[auto] disabled:cursor-wait w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
                required
              />
            </div>
            <div className="border-2 border-purple-500"></div>
            <div className="mx-2 mt-5 flex items-center justify-between">
              <button
                disabled={props.loading}
                onClick={() => handleLinks(undefined)}
                type="button"
                className="disabled:cursor-not-allowed disabled:bg-purple-300 bg-purple-500 text-white rounded bg-primary w-24 px-6 py-2.5 text-[10px] font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
              >
                Add
              </button>
              <button
                disabled={props.loading}
                onClick={() => setAddLink(false)}
                type="button"
                className="disabled:cursor-not-allowed disabled:bg-purple-300 bg-purple-500 text-white rounded bg-primary w-24 px-6 py-2.5 text-[10px] font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <input
          ref={refInput}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => props.setAttachment(e.target.files)}
        />
        <div className="mt-2 w-full flex text-white">
          <button
            type="button"
            disabled={props.loading}
            onClick={() => refInput.current.click()}
            className="bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-300 p-2 px-4 shadow-md rounded-lg gap-3 m-auto flex items-center justify-center hover:bg-purple-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
            <h2>Add Picture</h2>
          </button>
        </div>
        <div className="flex items-center justify-center flex-col gap-3"></div>
        <button
          disabled={props.loading}
          type="submit"
          className="ml-2 mt-5 bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-300 text-white rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
        >
          {props.loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Form;
