import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import Header from "./Header";
import Cards from "./Cards";
import bg from "../images/bg1.jpg";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plus from "../images/plus.png";
import AddCard from "./AddCard";
import ShowCard from "./ShowCard";
import Loading from "./Loading";
import SideMenu from "./SideMenu";
import { deleteFile, formatDate } from "../utils";

const Main = ({ logOut, user }) => {
  const [cardShow, setCardShow] = useState(undefined);
  const [menu, setMenu] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [list, setList] = useState([true, false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(0);
  const collRef = collection(db, "notes");

  useEffect(() => {
    const userRef = doc(
      db,
      `users/${(user.name + "-" + user.uid).toLowerCase()}`
    );
    const data = { user, online: formatDate(undefined) };
    setDoc(userRef, data, { merge: true }).catch((err) => alert(err.message));
  }, [user]);

  useEffect(() => setSearch(""), [list]);
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      query(
        collection(db, "notes"),
        orderBy("imp", "desc"),
        orderBy("date", "desc")
      ),
      (res) => {
        const data = res.docs?.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setCards(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        alert(error.message);
      }
    );
    return () => unsub();
  }, []);

  const deleteNote = async (id, attachments) => {
    if (window.confirm("Confirm Delete?")) {
      const toastId = toast.loading("Deleting...");
      if (attachments) {
        for (const attachment of attachments || []) {
          await deleteFile(attachment);
        }
      }
      deleteDoc(doc(collRef, `/${id}`))
        .then(() => {
          toast.done(toastId);
          toast.success("Deleted note successfully");
          setCardShow(undefined);
        })
        .catch((err) => {
          toast.done(toastId);
          toast.error(err.message);
        });
    }
  };

  const updateNote = (id, formData, setLoading, setEditNote) => {
    updateDoc(doc(collRef, `/${id}`), formData)
      .then(() => {
        setCardShow({ data: formData, id: id });
        setLoading && setLoading(false);
        setEditNote && setEditNote(false);
      })
      .catch((err) => alert(err.message));
  };

  const switchList = (ind) => {
    setSortBy(ind);
    setList(list.map((_, i) => (i === ind ? true : false)));
  };

  const filteredNotesBySearch = (notes) => {
    return notes.filter(
      (card) =>
        card.data.name.toLowerCase().includes(search.toLowerCase()) ||
        card.data.text.toLowerCase().includes(search.toLowerCase()) ||
        card.data.date.toLowerCase().includes(search.toLowerCase()) ||
        card.data.title.toLowerCase().includes(search.toLowerCase()) ||
        card.data.link.toLowerCase().includes(search.toLowerCase()) ||
        card.data.label.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredNotesByName = (notes) => {
    const isSenpai = user.uid !== "FmxmGuIQ75dvrYhTbk1E0bH0YJW2";
    const lowerCaseName = user.name.toLowerCase();

    return notes.filter((card) => {
      if (sortBy === 1) {
        return card.data.users?.some((u) =>
          u.toLowerCase().includes(lowerCaseName)
        );
      } else if (sortBy === 0) {
        return card.data.uid === user.uid || !isSenpai;
      } else if (sortBy === 2) {
        return (
          card.data.attachment && (card.data.uid === user.uid || !isSenpai)
        );
      } else if (sortBy === 3) {
        return card.data.link && (card.data.uid === user.uid || !isSenpai);
      } else if (sortBy === 4) {
        return (
          card.data.users?.length !== 0 &&
          (card.data.uid === user.uid || !isSenpai)
        );
      } else {
        return false;
      }
    });
  };

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="h-screen bg-cover scroll-smooth overflow-hidden overflow-y-scroll scrollbar-hide"
      >
        <section hidden={addCard || cardShow === undefined}>
          <ShowCard
            toast={toast}
            user={user.uid}
            deleteNote={deleteNote}
            setCardShow={setCardShow}
            card={cardShow?.data}
            id={cardShow?.id}
            updateNote={updateNote}
          />
        </section>

        <section hidden={!addCard}>
          <AddCard
            toast={toast}
            setAddCard={setAddCard}
            user={{ uid: user.uid, name: user.name }}
            addDoc={addDoc}
            collRef={collRef}
          />
        </section>
        <div hidden={addCard || cardShow !== undefined}>
          <div
            onClick={() => setMenu(false)}
            className={`absolute top-0 backdrop-blur-sm w-full h-full transition-all ease-in-out duration-300 ${
              menu ? "z-40 opacity-100" : "opacity-0 -z-10"
            }`}
          ></div>
          <div
            className={`absolute top-0 w-full backdrop-blur-md max-w-[70%] z-50 transition-all ease-in-out duration-300 ${
              menu
                ? "translate-x-0 opacity-100"
                : "w-0 h-0 -translate-x-full opacity-0"
            }`}
          >
            <SideMenu user={user} logOut={logOut} />
          </div>
          <section className="fixed top-0 w-full z-30">
            <Header
              user={user}
              setMenu={setMenu}
              search={search}
              setSearch={setSearch}
            />
          </section>

          <section className="mt-32 mb-4">
            <ul className="m-4 flex items-center justify-start gap-2">
              <button
                disabled={list[0]}
                type="button"
                className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                  list[0] ? "bg-purple-800" : ""
                }`}
                onClick={() => switchList(0)}
              >
                Notes
              </button>
              <button
                type="button"
                className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                  list[1] ? "bg-purple-800" : ""
                }`}
                onClick={() => switchList(1)}
              >
                Recieved
              </button>
              <button
                type="button"
                className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                  list[2] ? "bg-purple-800" : ""
                }`}
                onClick={() => switchList(2)}
              >
                Attachments
              </button>
              <button
                type="button"
                className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                  list[3] ? "bg-purple-800" : ""
                }`}
                onClick={() => switchList(3)}
              >
                Links
              </button>
              <button
                type="button"
                className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                  list[4] ? "bg-purple-800" : ""
                }`}
                onClick={() => switchList(4)}
              >
                Shared
              </button>
            </ul>
            <p className="bg-purple-200 p-2 px-4 text-sm mx-2 rounded-md">
              <span className="font-semibold text-purple-900">Note:</span> I'm
              Optimizing the app before I add some new features {"<3"}
            </p>
            {!loading ? (
              <>
                {filteredNotesBySearch(filteredNotesByName(cards))?.map(
                  (card, index) => (
                    <Cards
                      key={index}
                      user={user.uid}
                      card={card}
                      setCardShow={setCardShow}
                    />
                  )
                )}
              </>
            ) : (
              <Loading />
            )}
          </section>
        </div>
      </div>

      <button
        hidden={addCard || cardShow !== undefined}
        onClick={() => setAddCard(true)}
        className="absolute bottom-5 right-8"
      >
        <img
          src={plus}
          alt="plus"
          className={`transition-opacity duration-500 ${
            menu ? "opacity-0 -z-10" : "opacity-100 z-20"
          } h-14 bg-white rounded-full`}
        />
      </button>
      <ToastContainer
        position="top-left"
        limit={2}
        autoClose={3000}
        hideProgressBar={true}
        transition={Slide}
        closeButton={false}
      />
    </div>
  );
};

export default Main;
