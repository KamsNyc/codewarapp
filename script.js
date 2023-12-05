import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const appSettings = {
        databaseURL: "https://test-f2492-default-rtdb.firebaseio.com/"
    }

    const app = initializeApp(appSettings)
    const database = getDatabase(app)

    const shoppingListInDB = ref(database, 'ShoppingList')

    const inputField = document.getElementById('input-field')
    const button = document.getElementById('add-button')
    const shoppingList = document.getElementById('list-items')

    function reset() {
        inputField.value = ''
    }

    function clearShoppingList() {
        shoppingList.innerHTML = ''
    }

    function appendItemToList(inputVal, currentItemID) {
        let newElm = document.createElement("li")
        newElm.textContent = inputVal

        let deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete-button")
        deleteButton.addEventListener("click", () => {
            deleteItemFromDatabase(currentItemID)
            deleteElementFromList(newElm)
        })

        newElm.appendChild(deleteButton)
        shoppingList.appendChild(newElm)
    }

    function deleteItemFromDatabase(itemId) {
        remove(ref(database, `ShoppingList/${itemId}`))
    }

    function deleteElementFromList(element) {
        element.remove()
    }

    button.addEventListener('click', () => {
        let inputVal = inputField.value

        push(shoppingListInDB, inputVal)
        reset()
    })

    onValue(shoppingListInDB, function(snapshot) {
        let currentsnap = Object.entries(snapshot.val())

        clearShoppingList()
        for (let i = 0; i < currentsnap.length; i++) { 
            let currentsnapshot = currentsnap[i] 
            let currentItemID = currentsnapshot[0]
            let currentItemValue = currentsnapshot[1]

            appendItemToList(currentItemValue, currentItemID)
        }  
    })
});
