//Create Variables
const InputsContainer = document.getElementById("InputsContainer");

let ValidInputCounter = 0;

// Fonction pour mettre à jour la valeur affichée dans le span
function updateCounterText() {
    document.getElementById("ValidInputCounterText").textContent = ValidInputCounter;
}
// Function to update ValidInputCounter
function updateValidInputCounter() {
    ValidInputCounter = InputsContainer.querySelectorAll('input.ValidInput').length;
}
updateValidInputCounter();
updateCounterText();

//Ajoute un nouvel input quand on commence à écrire dans le dernier
InputsContainer.addEventListener("input", (evt) => {
    const inputs = InputsContainer.querySelectorAll(".AddPlayerOut");
    const lastInput = inputs[inputs.length - 1];
    if (evt.target === lastInput) {
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.placeholder = "Ajouter un joueur";
        newInput.className = "AddPlayerOut";
        InputsContainer.appendChild(newInput);
    }

    updateValidInputCounter(); // Update the ValidInputCounter
    updateCounterText();
});

// Ajoute la classe ValidInput quand il y a du texte dedans et fait en sorte qu'il n'y ait pas plus de 1 input vide en tout
InputsContainer.addEventListener("input", (evt) => {
    // Vérifie si la saisie a du texte
    if (evt.target.value.trim() !== "") {
        // Ajoute la classe ValidInput si du texte est présent
        evt.target.classList.add("ValidInput");
    } else {
        // Supprime la classe ValidInput si aucun texte n'est présent
        evt.target.classList.remove("ValidInput");
    }

    // Récupère tous les inputs dans InputsContainer
    const inputs = InputsContainer.querySelectorAll(".AddPlayerOut");
    let emptyInputs = 0;

    // Parcours tous les inputs pour compter les inputs vides
    inputs.forEach((input) => {
        if (input.value.trim() === "") {
            emptyInputs++;
        }
    });

    // Si plus de 1 entrées sont vides
    if (emptyInputs > 1) {
        // Parcours tous les inputs pour supprimer tous les inputs vides, sauf le dernier
        inputs.forEach((input, index) => {
            if (input.value.trim() === "" && index !== inputs.length - 1) {
                input.remove();
            }
        });
    }

    updateValidInputCounter(); // Update the ValidInputCounter
    updateCounterText();
});

// Faire en sorte que la touche enter nous fasse aller au prochaine input
// Il faudrait l'optimiser ça me semble très long
InputsContainer.addEventListener("keydown", (evt) => {
    // Check if the pressed key is "Enter"
    if (evt.key === "Enter") {
        const inputs = InputsContainer.querySelectorAll(".AddPlayerOut");
        const currentIndex = Array.from(inputs).indexOf(evt.target);

        // If the current input is not the last one
        if (currentIndex !== inputs.length - 1) {
            // Prevent the default "Enter" behavior (form submission)
            evt.preventDefault();
            // Focus on the next input
            inputs[currentIndex + 1].focus();
        }
    }
});

