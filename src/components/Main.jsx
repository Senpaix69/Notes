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
import bg from "../images/bg3.jpg";
import plus from "../images/plus.png";
import AddCard from "./AddCard";
import ShowCard from "./ShowCard";

const Main = ({ logOut, user }) => {
  const date = new Date();
  const [index, setIndex] = useState(-1);
  const [addCard, setAddCard] = useState(false);
  const [cards, setCards] = useState([]);
  const [senpaiNotes, setSenpaiNotes] = useState([]);
  const [isNoteEditable, setIsNoteEditable] = useState(false);
  const collRef = collection(db, "notes");

  useEffect(() => {
    let unsub;
    if (user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72") {
      unsub = onSnapshot(
        query(
          collRef,
          orderBy("date", "desc"),
          where("uid", "==", "6MiSvUG1upfAn5OVUyybiSaUnU72")
        ),
        (res) => {
          const data = res.docs?.map((doc) => ({
            data: doc.data(),
            id: doc.id,
          }));
          setSenpaiNotes(data);
        },
        (error) => alert(error.message)
      );
    }
    return () => {
      unsub && unsub();
    };
  }, []);

  useEffect(() => {
    const senpai = user.uid === "6MiSvUG1upfAn5OVUyybiSaUnU72";
    const refQuery = senpai
      ? query(collRef, orderBy("date", "desc"))
      : query(collRef, orderBy("date", "desc"), where("uid", "==", user?.uid));
    const unsub = onSnapshot(
      refQuery,
      (res) => {
        const data = res.docs?.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setCards(data);
      },
      (error) => alert(error.message)
    );
    return () => unsub();
  }, []);

  const deleteNote = (id) => {
    if (window.confirm("Confirm Delete?")) {
      deleteDoc(doc(collRef, `/${id}`))
        .then(() => {
          setIndex(-1);
        })
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

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="h-screen bg-cover overflow-hidden overflow-y-scroll scrollbar-hide"
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
          <section className="fixed top-0 w-full z-30">
            <Header user={user} logOut={logOut} />
          </section>

          <section className="mt-32">
            {user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72" && (
              <h1 className="p-1 px-3 font-bold">Notes by Senpai</h1>
            )}
            {user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72" &&
              senpaiNotes?.map((card, index) => (
                <Cards
                  key={card.id}
                  id={index}
                  card={card.data}
                  setIndex={handleIndex}
                />
              ))}
            {senpaiNotes.length === 0 &&
              user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72" && (
                <h2 className="w-full text-center font-semibold">
                  Empty: No Notes Available😶
                </h2>
              )}
            <h1 className="p-1 px-3 font-bold">
              {user.uid !== "6MiSvUG1upfAn5OVUyybiSaUnU72"
                ? "Your Notes"
                : "All Notes"}
            </h1>
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
              <h2 className="w-full text-center font-semibold">
                Empty: Add Some Notes😃
              </h2>
            )}
          </section>
        </div>
      </div>

      <button
        hidden={addCard || index !== -1}
        onClick={() => setAddCard(true)}
        className="absolute z-50 bottom-5 right-8"
      >
        <img src={plus} alt="plus" className="h-14 bg-white rounded-full" />
      </button>
    </div>
  );
};

export default Main;
