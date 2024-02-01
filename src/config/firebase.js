// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyAiy7GZn2WFEMMaDKqR_IlnKSb4oRprHFM",
  // authDomain: "pedwuma-a471c.firebaseapp.com",
  // projectId: "pedwuma-a471c",
  // storageBucket: "pedwuma-a471c.appspot.com",
  // messagingSenderId: "929723458806",
  // appId: "1:929723458806:web:2de7e5c508fb87cd3db8d7",
  // measurementId: "G-SDSTW61NSV"

  apiKey: "AIzaSyDpldsoSGkGyaGymys8B0EZRzwfd1FD0Ms",
  authDomain: "pedwumafinal.firebaseapp.com",
  projectId: "pedwumafinal",
  storageBucket: "pedwumafinal.appspot.com",
  messagingSenderId: "793795607414",
  appId: "1:793795607414:web:3bbdaad003fd5f84461857",
  measurementId: "G-G3KPC03KCE"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);