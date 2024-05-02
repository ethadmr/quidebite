console.log('Bababoy')

//Create Variables
const InputsContainer = document.getElementById("InputsContainer");
let ValidInputCounter = 0;

// Fonction pour mettre à jour la valeur affichée dans le span
function updateCounterText() {
    document.getElementById("ValidInputCounterText").textContent = ValidInputCounter;
}
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
});

// Ajoute la classe ValidInput quand il y a du texte dedans et fait en sorte qu'il n'y ai pas plus de 1 input vide en tout
InputsContainer.addEventListener("input", (evt) => {
    // Vérifie si la saisie a du texte
    if (evt.target.value.trim() !== "") {
        // Ajoute la classe ValidInput si du texte est présent
        evt.target.classList.add("ValidInput");
    } else {
        // Supprime la classe ValidInput si aucun texte n'est présent
        evt.target.classList.remove("ValidInput");
    }

    // Compte le nombre d'entrées sans la classe ValidInput
    const inputsWithoutValidClass = InputsContainer.querySelectorAll('input:not(.ValidInput)');
    const numberOfInvalidInputs = inputsWithoutValidClass.length;

    // Si plus de 1 entrées n'ont pas la classe ValidInput
    if (numberOfInvalidInputs > 1) {
        // Supprime toutes les entrées sans la classe ValidInput, sauf la dernière
        for (let i = 0; i < numberOfInvalidInputs - 1; i++) {
            inputsWithoutValidClass[i].remove();
        }
    }
});

 // Faire en sorte que la touche enter nous fasse aller au prochaine input
 // Il faudrait l'optimiser ça em semble très long
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
console.log(ValidInputCounter)