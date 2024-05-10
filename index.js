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


// Ajoute un nouvel input ou ajuste les classes basé sur l'état du contenu
function handleInput(evt) {
    const inputs = Array.from(inputsContainer.querySelectorAll(".AddPlayerOut"));
    const lastInput = inputs[inputs.length - 1];
    const currentInput = evt.target;

    // Gestion de la création d'un nouvel input
    if (currentInput === lastInput && currentInput.value.trim()) {
        const newInputBlock = document.createElement("div");
        newInputBlock.className = "InputBlock";
        newInputBlock.innerHTML = '<input type="text" placeholder="Ajouter un joueur" class="AddPlayerOut">' +
                                  '<span class="InputIcon"></span>';
        inputsContainer.appendChild(newInputBlock);
    }
    
    

    // Gestion des classes ValidInput
    if (currentInput.value.trim().length > 2) {
        currentInput.classList.add("ValidInput");
    } else {
        currentInput.classList.remove("ValidInput");
    }

    // Suppression des inputs vides inutiles, sauf le dernier
    const emptyInputs = inputs.filter(input => !input.value.trim());
    if (emptyInputs.length > 1) {
        emptyInputs.slice(0, -1).forEach(input => input.parentElement.remove());
    }

    updateInputInfo();
}

// Suppression de l'input lorsque l'icône poubelle est cliquée
function handleIconClick(evt) {
    if (evt.target.classList.contains("InputIcon")) {
        evt.target.parentElement.remove();
        updateInputInfo();
    }
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

// Ajout des gestionnaires d'événements
inputsContainer.addEventListener("input", handleInput);
inputsContainer.addEventListener("click", handleIconClick);
inputsContainer.addEventListener("keydown", handleKeyDown);
