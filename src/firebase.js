import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6v-Fgngqvqv-vewL4a8tfzLN6r9xLUL4",
  authDomain: "screen-61f71.firebaseapp.com",
  projectId: "screen-61f71",
  storageBucket: "screen-61f71.appspot.com",
  messagingSenderId: "260339876418",
  appId: "1:260339876418:web:8e36be7d4a29bd0b2863db",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
