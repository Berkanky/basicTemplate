// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVzrVoW_X2gIE5M1tkh4NcXp3wJvmtNTU",
  authDomain: "projectvolthird.firebaseapp.com",
  projectId: "projectvolthird",
  storageBucket: "projectvolthird.appspot.com",
  messagingSenderId: "503052932488",
  appId: "1:503052932488:web:763fb00a158d02d2ecd63d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {
  auth,
}
