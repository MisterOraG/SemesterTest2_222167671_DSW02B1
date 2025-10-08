// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics" ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDysQaHwgw1_kymIYEhCjP44BFZ-EZXsbg",
  authDomain: "shopez-85997.firebaseapp.com",
  projectId: "shopez-85997",
  storageBucket: "shopez-85997.firebasestorage.app",
  messagingSenderId: "445572304535",
  appId: "1:445572304535:web:1d54f9cf6fdab00980a3d2",
  measurementId: "G-Z9JWPJK6L8"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

