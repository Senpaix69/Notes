import React, { useEffect, useRef, useState } from "react";

const Form = (props) => {
  const refInput = useRef();
  const [imageRead, setImageRead] = useState(false);
  const [addLink, setAddLink] = useState(false);

  useEffect(() => {
    let fileReader;
    let isCancel = false;
    if (props.attachment) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          props.setFormData((prevFormData) => ({
            ...prevFormData,
            attachment: result,
          }));
          setImageRead(true);
        }
      };
      fileReader.readAsDataURL(props.attachment);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === FileReader.LOADING) {
        fileReader.abort();
      }
    };
  }, [props.attachment]);

  useEffect(() => {
    setAddLink(false);
    setImageRead(false);
  }, [props.backCall]);

  const removeAttachment = () => {
    props.setFormData({ ...props.formData, attachment: "" });
    setImageRead(false);
  };

  const removeLink = () => {
    props.setFormData({ ...props.formData, label: "", link: "" });
    setAddLink(false);
  };

  const handleChange = (e) => {
    props.setFormData({ ...props.formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form onSubmit={(e) => props.handleSubmit(e)}>
        <div className="relative mt-4" data-te-input-wrapper-init>
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
            onFocus={() => props.setTitleActive(true)}
            onBlur={() => {
              !props.formData?.title && props.setTitleActive(false);
            }}
            name="title"
            value={props.formData.title || ""}
            onChange={(e) => handleChange(e)}
            type="text"
            className="block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
            required
          />
        </div>
        <div className="mx-2 border-2 border-purple-500"></div>
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
            onFocus={() => props.setTextActive(true)}
            onBlur={() => {
              !props.formData?.text && props.setTextActive(false);
            }}
            name="text"
            value={props.formData.text || ""}
            onChange={(e) => handleChange(e)}
            rows={4}
            type="text"
            className="bg-slate-100 scrollbar-hide bg-opacity-30 resize-none min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
            required
          />
        </div>
        <div className="mx-2 border-2 border-purple-500"></div>
        <div className="flex gap-3 items-center justify-start m-2 mb-4 text-sm text-purple-900 font-semibold">
          <input
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
                name="label"
                value={props.formData.label || ""}
                onChange={(e) => handleChange(e)}
                type="text"
                className="block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
                required
              />
            </div>
            <div className="mx-2 border-2 border-purple-500"></div>
            <div className="relative mt-8">
              <span className="absolute text-sm top-2 left-2 text-purple-700 -translate-y-6 scale-90">
                Link
              </span>
              <input
                name="link"
                value={props.formData.link || ""}
                onChange={(e) => handleChange(e)}
                type="text"
                className="block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 outline-none"
                required
              />
            </div>
            <div className="mx-2 border-2 border-purple-500"></div>
            <button
              onClick={removeLink}
              type="button"
              className="ml-2 mt-5 bg-purple-500 text-white rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
            >
              Remove
            </button>
          </div>
        )}
        <input
          ref={refInput}
          hidden
          type="file"
          accept="image"
          onChange={(e) => props.setAttachment(e.target.files[0])}
        />
        {!imageRead ? (
          <div className="mt-2 w-full flex text-white">
            <button
              type="button"
              disabled={props.loading}
              onClick={() => refInput.current.click()}
              className="bg-purple-500 p-2 px-4 shadow-md rounded-lg gap-3 m-auto flex items-center justify-center hover:bg-purple-800"
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
        ) : (
          <div className="flex items-center justify-center flex-col gap-3">
            <img
              onClick={removeAttachment}
              src={props.formData.attachment}
              alt="pic"
              className="h-40 cursor-pointer"
            />
            <span className="text-sm font-semibold">
              click on image to remove
            </span>
          </div>
        )}
        <button
          disabled={props.loading}
          type="submit"
          className="ml-2 mt-5 bg-purple-500 text-white rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg hover:bg-purple-800"
        >
          {props.loading ? "Saving..." : "Save"}
        </button>
      </form>
    </>
  );
};

export default Form;
