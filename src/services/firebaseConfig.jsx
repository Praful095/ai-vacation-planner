
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA2jktNCDxB5Dj_7tb2LfNjRGEp93p4VRE",
  authDomain: "ai-vacation-planner-8299d.firebaseapp.com",
  projectId: "ai-vacation-planner-8299d",
  storageBucket: "ai-vacation-planner-8299d.firebasestorage.app",
  messagingSenderId: "766950870985",
  appId: "1:766950870985:web:08a14f64f7fcbd7bb1a218",
  measurementId: "G-YBRYCYGZC1"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
 export const db = getFirestore(app);