import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyC6qa35AYnOrjJmzCgbg04ae2Rr3IPztOY",
    authDomain: "react-chat-firebase-f6a28.firebaseapp.com",
    databaseURL: "https://react-chat-firebase-f6a28.firebaseio.com",
    projectId: "react-chat-firebase-f6a28",
    storageBucket: "react-chat-firebase-f6a28.appspot.com",
    messagingSenderId: "671153335104",
    appId: "1:671153335104:web:be4adb1801f529c9"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

//   service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }

  export default firebase;