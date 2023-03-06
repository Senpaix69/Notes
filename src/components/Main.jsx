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
  where,
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
  const [index, setIndex] = useState(-1);
  const [menu, setMenu] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [list, setList] = useState([true, false]);
  const [loading, setLoading] = useState([false, false]);
  const [cards, setCards] = useState([]);
  const [senpaiNotes, setSenpaiNotes] = useState([]);
  const [isNoteEditable, setIsNoteEditable] = useState(false);
  const collRef = collection(db, "notes");

  const triggerLoading = (index, value) => {
    setLoading((prev) => prev.map((_, i) => (i === index ? value : false)));
  };

  useEffect(() => {
    let unsub;
    if (user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72") {
      triggerLoading(1, true);
      unsub = onSnapshot(
        query(
          collRef,
          orderBy("imp", "desc"),
          orderBy("date", "desc"),
          where("uid", "==", "6MiSvUG1upfAn5OVUyybiSaUnU72")
        ),
        (res) => {
          const data = res.docs?.map((doc) => ({
            data: doc.data(),
            id: doc.id,
          }));
          setSenpaiNotes(data);
          triggerLoading(1, false);
        },
        (error) => {
          triggerLoading(1, false);
          alert(error.message);
        }
      );
    }
    return () => {
      unsub && unsub();
    };
  }, []);

  useEffect(() => {
    triggerLoading(0, true);
    const senpai = user.uid === "6MiSvUG1upfAn5OVUyybiSaUnU72";
    const refQuery = senpai
      ? query(collRef, orderBy("imp", "desc"), orderBy("date", "desc"))
      : query(
          collRef,
          orderBy("imp", "desc"),
          orderBy("date", "desc"),
          where("uid", "==", user?.uid)
        );
    const unsub = onSnapshot(
      refQuery,
      (res) => {
        const data = res.docs?.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setCards(data);
        triggerLoading(0, false);
      },
      (error) => {
        triggerLoading(0, false);
        alert(error.message);
      }
    );
    return () => unsub();
  }, []);

  const deleteNote = (id) => {
    if (window.confirm("Confirm Delete?")) {
      setIndex(-1);
      deleteDoc(doc(collRef, `/${id}`))
        .then(() => {})
        .catch((err) => alert(err.message));
    }
  };

  const updateNote = (id, formData, setLoading, setEditNote) => {
    updateDoc(doc(collRef, `/${id}`), formData)
      .then(() => {
        setLoading && setLoading(false);
        setEditNote && setEditNote(false);
      })
      .catch((err) => alert(err.message));
  };

  const handleIndex = (index, isNoteEditable) => {
    setIndex(index);
    setIsNoteEditable(
      isNoteEditable || user.uid === "6MiSvUG1upfAn5OVUyybiSaUnU72"
    );
  };

  const switchList = (ind) => {
    setList(list.map((_, i) => (i === ind ? true : false)));
  };

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="h-screen bg-cover scroll-smooth overflow-hidden overflow-y-scroll scrollbar-hide"
      >
        <section hidden={addCard || index === -1}>
          <ShowCard
            deleteNote={deleteNote}
            notEditable={isNoteEditable}
            setIsNoteEditable={setIsNoteEditable}
            setIndex={setIndex}
            card={
              isNoteEditable
                ? cards[index]?.data
                : user.uid === "6MiSvUG1upfAn5OVUyybiSaUnU72"
                ? cards[index]?.data
                : senpaiNotes[index]?.data
            }
            id={
              isNoteEditable
                ? cards[index]?.id
                : user.uid === "6MiSvUG1upfAn5OVUyybiSaUnU72"
                ? cards[index]?.id
                : senpaiNotes[index]?.id
            }
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
        <div hidden={addCard || index !== -1}>
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
            <Header user={user} setMenu={setMenu} menu={menu} />
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

            {list[1] &&
              user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72" &&
              (!loading[1] ? (
                <>
                  {senpaiNotes?.map((card, index) => (
                    <Cards
                      key={card.id}
                      id={index}
                      card={card.data}
                      setIndex={handleIndex}
                    />
                  ))}
                  {senpaiNotes.length === 0 && (
                    <h2 className="mt-10 w-full text-center font-semibold">
                      Empty: No Notes Available😶
                    </h2>
                  )}
                </>
              ) : (
                <Loading />
              ))}

            {list[0] &&
              (!loading[0] ? (
                <>
                  {cards?.map((card, index) => (
                    <Cards
                      user={user.uid}
                      key={card.id}
                      id={index}
                      card={card.data}
                      setIndex={handleIndex}
                    />
                  ))}
                  {cards.length === 0 && (
                    <h2 className="mt-10 w-full text-center font-semibold">
                      Empty: Add Some Notes😃
                    </h2>
                  )}
                </>
              ) : (
                <Loading />
              ))}
          </section>
        </div>
      </div>

      <button
        hidden={addCard || index !== -1}
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
