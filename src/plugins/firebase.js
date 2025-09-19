import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAY3IsvQqu-21zD8B0fcnumBy17jD0OXhE",
    authDomain: "webrtc-8f718.firebaseapp.com",
    databaseURL:
        "https://webrtc-8f718-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "webrtc-8f718",
    storageBucket: "webrtc-8f718.firebasestorage.app",
    messagingSenderId: "941768345652",
    appId: "1:941768345652:web:658f55fb2763556e67a261",
    measurementId: "G-7DDVQDV65M",
};

const app = initializeApp(firebaseConfig);
console.log(getDatabase(app));
