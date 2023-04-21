import {collection,onSnapshot,query,getDocs} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { db, getData } from "./firestore.config.js";
const q = query(collection(db,"recipes"))
const snapshot = onSnapshot(q,querySnapshot =>{
     querySnapshot.docChanges().forEach(change =>{
          console.log(change.doc.data());
     })
})

const data = await getData('recipes')
console.log(data);
