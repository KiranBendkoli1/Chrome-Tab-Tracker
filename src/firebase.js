import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCJlwsLQV02GmY_wW4HmNz5wWWycMU5WLI",
  authDomain: "tab-tracker-ext.firebaseapp.com",
  projectId: "tab-tracker-ext",
  storageBucket: "tab-tracker-ext.appspot.com",
  messagingSenderId: "602617968248",
  appId: "1:602617968248:web:0a7e1bd0f5ebb962f41f8d"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

const storage = getStorage(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      authProvider: "local",
      email: email,
    });
  } catch (err) {
    alert(err.message);
  }
};

const sendPasswordReset = async (email)=>{
  try{
    await sendPasswordResetEmail(auth, email);
    alert('Passoword reset link sent!')

  }catch(err){
    console.error(err)
    alert(err.message)
  }
}

const logout = () =>{
  signOut(auth)
}

const uploadLink = async (path, ulink,utime)=>{
  try{
    await addDoc(collection(db, path), {
      'link':ulink,
      'time':utime
    });
  }catch(error){
    alert(error.message);
  }
}


signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  // ...
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});



export {auth, db, storage,logInWithEmailAndPassword, registerWithEmailAndPassword, uploadLink, sendPasswordReset, logout, signInWithPopup }
