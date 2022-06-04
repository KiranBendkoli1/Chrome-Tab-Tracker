/*global chrome*/
import { useEffect, useState } from "react";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, logInWithEmailAndPassword, logout } from "../src/firebase";
import { addDoc, collection } from "firebase/firestore";

function App() {
  const [url, setUrl] = useState("");
  const date = new Date();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const Upload = () => {
    chrome.storage.sync.get(["email"], function (result) {
      const queryInfo = { active: true };
      chrome.tabs &&
        chrome.tabs.query(queryInfo, (tabs) => {
          const url = tabs[0].url;
          setUrl(url!);
          const dt =
            date.toLocaleDateString() + "  " + date.toLocaleTimeString();
          try {
            addDoc(collection(db, result.email), {
              url: url,
              datetime: dt,
            });
          } catch (error) {
            alert(error!);
          }
        });
    });
  };
  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <button type="submit" className="btn btn-primary" onClick={logout}>
            Logout
          </button>
        ) : (
          <form>
            <div>
              <label htmlFor="email" className="form-label">
                <b>Email address</b>
              </label>
              <input
                type="email"
                className="form-control"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="email"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="form-label">
                <b>Password</b>
              </label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                id="password"
              />
            </div>
            <button
              type="submit"
              className="btn mt-2 btn-primary"
              onClick={(event) => {
                event.preventDefault();
                if (email.length == 0) {
                  alert("Please Email Address");
                  return;
                }
                if (password.length < 8) {
                  alert("Please Enter the Correct Password");
                  return;
                }
                chrome.storage.sync.set({ email: email }, function () {
                  console.log("Value is set to " + email);
                });
                // localStorage.setItem('email',email);
                logInWithEmailAndPassword(email, password);
              }}
            >
              Login
            </button>
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
