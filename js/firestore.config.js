import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js'
import { getFirestore, getDocs, collection, onSnapshot, query } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
import { renderRecipe } from './ui.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxwH803Y4I0_SWyAoDc5KH66Gk8h1pQlw",
  authDomain: "pwa-cookbook-d20a2.firebaseapp.com",
  projectId: "pwa-cookbook-d20a2",
  storageBucket: "pwa-cookbook-d20a2.appspot.com",
  messagingSenderId: "326283947828",
  appId: "1:326283947828:web:fb7722901833a46a6a7f61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const getData = async collectionName => {
    const q = query(collection(db, collectionName))

    const snapshot = onSnapshot(q, querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
            if(change.type === "added") {
                renderRecipe(change.doc.data(), change.doc.id)
            }
            if(change.type === "removed") {
                
            }
        })
    })
}

export { db, getData }