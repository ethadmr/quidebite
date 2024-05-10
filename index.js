const inputsContainer = document.getElementById("InputsContainer");

// Fonction pour mettre à jour le compteur et le texte affiché
function updateInputInfo() {
    const validInputCount = inputsContainer.querySelectorAll('input.ValidInput').length;
    document.getElementById("ValidInputCounterText").textContent = validInputCount;
}

// Function to save valid inputs to local storage
function saveValidInputsToLocalStorage() {
    const inputs = document.querySelectorAll(".AddPlayerOut.ValidInput");
    const inputValues = Array.from(inputs).map(input => input.value);
    localStorage.setItem("savedValidInputs", JSON.stringify(inputValues));
}

// Function to handle icon click (for input deletion)
function handleIconClick(evt) {
    if (evt.target.classList.contains("InputIcon")) {
        evt.target.parentNode.remove(); // Supprimer le parent de l'icône (c'est-à-dire la div InputBlock)
        updateInputInfo();
    }
}

// Ajoute un nouvel input ou ajuste les classes basé sur l'état du contenu
function handleInput(evt) {
    const inputs = Array.from(inputsContainer.querySelectorAll(".InputBlock"));
    const lastInputBlock = inputs[inputs.length - 1];
    const currentInput = evt.target;

    // Gestion de la duplication d'une div InputBlock existante
    if (currentInput === lastInputBlock.querySelector(".AddPlayerOut") && currentInput.value.trim()) {
        const newInputBlock = lastInputBlock.cloneNode(true); // Clone la div InputBlock existante
        newInputBlock.querySelector(".AddPlayerOut").value = ""; // Vider le nouvel input
        inputsContainer.appendChild(newInputBlock);
    }

    // Gestion des classes ValidInput
    if (currentInput.value.trim().length > 2) {
        currentInput.classList.add("ValidInput");
    } else {
        currentInput.classList.remove("ValidInput");
    }
    
    updateInputInfo();
}

// Gestion de la navigation au clavier
function handleKeyDown(evt) {
    if (evt.key === "Enter") {
        const inputs = Array.from(inputsContainer.querySelectorAll(".AddPlayerOut"));
        const currentIndex = inputs.indexOf(evt.target);
        evt.preventDefault();
        inputs[currentIndex + 1]?.focus();
    }
}

// Gestion de la suppression des inputs vides lorsque l'input perd le focus
function handleInputFocusOut(evt) {
    const currentInput = evt.target;
    const inputBlocks = inputsContainer.querySelectorAll(".InputBlock");
    const lastInputBlock = inputBlocks[inputBlocks.length - 1];

    // Vérifie si l'input n'est pas le dernier et s'il est vide
    if (inputBlocks.length > 1 && currentInput.value.trim() === "") {
        if (currentInput.parentNode !== lastInputBlock) {
            currentInput.parentNode.remove(); // Supprimer le parent de l'input (c'est-à-dire la div InputBlock)
            updateInputInfo();
        }
    }
}
// document.getElementById('PlayButton').addEventListener('click', function(){
//     saveValidInputsToLocalStorage()
//     console.log(':)')
// })
// Save all inputs data in local storage
document.addEventListener("DOMContentLoaded", function() {
    // Le code JavaScript à exécuter une fois que le DOM est chargé
    document.getElementById('PlayButton').addEventListener('click', function(){
        saveValidInputsToLocalStorage();
        console.log(':)');
    });
});

// Ajout des gestionnaires d'événements
inputsContainer.addEventListener("input", handleInput);
inputsContainer.addEventListener("click", handleIconClick);
inputsContainer.addEventListener("keydown", handleKeyDown);
inputsContainer.addEventListener("focusout", handleInputFocusOut); // Utiliser focusout au lieu de blur
