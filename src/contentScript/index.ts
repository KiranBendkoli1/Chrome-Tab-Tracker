/*global chrome*/

import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

Upload();
export default async function Upload() {
  const date = new Date();
  const email = await localStorage.getItem("email");
  const myemail = auth.currentUser;
  const dt = date.toLocaleDateString() + "  " + date.toLocaleTimeString();
  console.log("email : ", email);
  console.log("my email : ", myemail);
  const url = window.location.href;
  console.log(url);
  chrome.storage.sync.get(["email"], function (result) {
    try {
      addDoc(collection(db, result.email), {
        url: url,
        datetime: dt,
      });
    } catch (error) {
      alert(error!);
    }
  });
}
