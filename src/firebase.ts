import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// create-react-app : process.env
// VITE + React + TS : import.meta.env 를 사용해 .env 환경 변수를 불러온다. VITE_ 라는 접두사를 붙여 나타낸다.

const firebaseConfig = {
    apiKey: "AIzaSyAgOxxGBonIKN5Umjks6V2-ctYxvgW9Vbo",
    authDomain: "clone-twitter-f6ad3.firebaseapp.com",
    projectId: "clone-twitter-f6ad3",
    storageBucket: "clone-twitter-f6ad3.appspot.com",
    messagingSenderId: "397160863202",
    appId: "1:397160863202:web:16bbe80e59e78c64f355bb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
