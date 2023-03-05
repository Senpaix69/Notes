import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Main from "./components/Main";
import { auth, signOut } from "./firebaseConfig";

const App = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    let User = localStorage.getItem("cred");
    setUser(JSON.parse(User));
  }, []);

  const logOut = () => {
    if (window.confirm("Do you want to logout?")) {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("cred");
          setUser("");
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <div className="relative h-screen max-w-[600px] min-w-[340px] m-auto scrollbar-hide">
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <Main logOut={logOut} user={user} />
      )}
    </div>
  );
};

export default App;
