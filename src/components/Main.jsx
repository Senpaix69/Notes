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
} from "firebase/firestore";
import Header from "./Header";
import Cards from "./Cards";
import bg from "../images/bg1.jpg";
import plus from "../images/plus.png";
import AddCard from "./AddCard";
import ShowCard from "./ShowCard";
import Loading from "./Loading";
import SideMenu from "./SideMenu";

const Main = ({ logOut, user }) => {
  const date = new Date();
  const [cardShow, setCardShow] = useState(undefined);
  const [menu, setMenu] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [list, setList] = useState([true, false]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const collRef = collection(db, "notes");

  useEffect(() => setSearch(""), [list]);
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      query(collRef, orderBy("imp", "desc"), orderBy("date", "desc")),
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

  const deleteNote = (id) => {
    if (window.confirm("Confirm Delete?")) {
      deleteDoc(doc(collRef, `/${id}`))
        .then(() => {
          setCardShow(undefined);
        })
        .catch((err) => alert(err.message));
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
    setSortBy(ind === 0 ? "" : "senpai");
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
    return sortBy
      ? notes.filter(
          (card) =>
            card.data.name.toLowerCase().includes(sortBy) &&
            card.data.users?.includes(user.name)
        )
      : user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72"
      ? notes.filter((card) => card.data.uid === user.uid)
      : notes;
  };

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="h-screen bg-cover scroll-smooth overflow-hidden overflow-y-scroll scrollbar-hide"
      >
        <section hidden={addCard || cardShow === undefined}>
          <ShowCard
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
            setAddCard={setAddCard}
            user={{ uid: user.uid, name: user.name }}
            date={date}
            addDoc={addDoc}
            collRef={collRef}
          />
        </section>
        <div hidden={addCard || cardShow !== undefined}>
          <div
            onClick={() => setMenu(false)}
            className={`absolute top-0 backdrop-blur-sm w-full h-full transition-all ease-in-out duration-500 ${
              menu ? "z-40 opacity-100" : "opacity-0 -z-10"
            }`}
          ></div>
          <div
            className={`absolute top-0 w-full backdrop-blur-md max-w-[70%] z-50 transition-all ease-in-out duration-700 ${
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
            {user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72" && (
              <ul className="m-4 flex items-center justify-start gap-2">
                <button
                  disabled={list[0]}
                  type="button"
                  className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                    list[0] ? "bg-purple-800" : ""
                  }`}
                  onClick={() => switchList(0)}
                >
                  Your Notes
                </button>
                <button
                  type="button"
                  className={`text-[10px] cursor-pointer w-20 font-semibold py-2 px-1.5 text-white rounded leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg ${
                    list[1] ? "bg-purple-800" : ""
                  }`}
                  onClick={() => switchList(1)}
                >
                  Senpai Notes
                </button>
              </ul>
            )}
            <span className="w-full ml-2 p-2 font-light font-serif bg-inherit text-xs">
              Note: The notes are sorted by importance and date
            </span>
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
                {cards.length === 0 && (
                  <h2 className="mt-10 w-full text-center font-semibold">
                    Empty: Add Some Notes😃
                  </h2>
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
    </div>
  );
};

export default Main;
