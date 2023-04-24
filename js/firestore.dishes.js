import { db, getData } from "./firestore.config.js";
import { collection, addDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'


const data = await getData('recipes')

// Tilføj nye opskrifter
const form = document.querySelector('form')

form.addEventListener('submit', async evt => {
    evt.preventDefault()

    await addDoc(collection(db, 'recipes'),
    {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    ).catch(err => console.log({err}))

    form.title.value = ''
    form.ingredients.value = ''

})

// Slet en opskrift
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', async evt => {
    if(evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        await deleteDoc(doc(db, 'recipes', id))
    }
})
