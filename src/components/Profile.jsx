import React, { useState } from "react";
import { compressImage } from "../compressImage";
import { deleteFile, uploadFile } from "../utils";

const ProfileForm = ({ setEditProfile, user, toast, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [nnLength, setNNLength] = useState(10 - nickname.length);

  const handleProfilePicChange = async (event) => {
    const compressed = await compressImage(event.target.files[0]);
    setProfilePic(compressed);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const toastID = toast.loading("Saving...");
    if (profilePic) {
      if (user?.profile) {
        await deleteFile(user.profile);
      }
      await uploadFile(profilePic, user.name)
        .then((url) => {
          setUser({ ...user, profile: url, nickname });
          toast.success("Updated Successfully");
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
          toast.done(toastID);
        });
    } else {
      setUser({ ...user, nickname });
      toast.done(toastID);
      setLoading(false);
      toast.success("Updated Successfully");
    }
  };

  return (
    <div className="absolute inset-0 h-screen flex justify-center items-center overflow-hidden overflow-y-scroll scrollbar-hide">
      <div className="fixed w-full max-w-[600px] top-0 bg-purple-400 p-3 py-4 flex items-center font-bold gap-3 z-50">
        <button
          type="button"
          onClick={() => {
            setProfilePic(null);
            setNickname("");
            setEditProfile(false);
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
        <h1 className="text-lg">Profile</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="nickname"
          >
            Profile Pic
          </label>
          <input
            className="hidden"
            id="profile-pic"
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
          <div className="relative">
            <div className="relative">
              {profilePic ? (
                <div className="w-full cursor-pointer flex items-center justify-center flex-col gap-3">
                  <img
                    onClick={() => setProfilePic(null)}
                    className="w-full h-auto max-w-56 max-h-56 object-contain rounded-lg"
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile picture"
                  />
                  <h1 className="font-semibold">Click on pic to remove</h1>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  className="text-white h-36 w-36 rounded-full bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-300 p-4 px-8 shadow-md gap-3 m-auto flex items-center justify-center hover:bg-purple-800"
                  onClick={() => document.getElementById("profile-pic").click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10"
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
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4 relative">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="nickname"
          >
            Nickname
          </label>
          <input
            disabled={loading}
            name="nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNNLength(10 - e.target.value.length);
            }}
            type="text"
            placeholder="Enter nickname without spaces"
            className="block min-h-[auto] placeholder:text-gray-600 disabled:cursor-wait w-full rounded border-0 bg-transparent py-[0.32rem] outline-none"
            required
          />
          <span
            className={`absolute text-[10px] right-0 -bottom-5 ${
              nnLength >= 0
                ? "text-purple-700 font-light"
                : "text-red-600 font-semibold"
            }`}
          >
            char: {nnLength}
          </span>
        </div>
        <button
          disabled={loading}
          className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
