//Create Variables
const InputsContainer = document.getElementById("InputsContainer");

let ValidInputCounter = 0;

// Function to update ValidInputCounter
function updateValidInputCounter() {
    ValidInputCounter = InputsContainer.querySelectorAll('input.ValidInput').length;
}
// Fonction pour mettre à jour la valeur affichée dans le span
function updateCounterText() {
    document.getElementById("ValidInputCounterText").textContent = ValidInputCounter;
}

//Ajoute un nouvel input quand on commence à écrire dans le dernier
InputsContainer.addEventListener("input", (evt) => {
    const inputs = InputsContainer.querySelectorAll(".AddPlayerOut");
    const lastInput = inputs[inputs.length - 1];
    if (evt.target === lastInput) {
        const newInputBlock = document.createElement("div");
        newInputBlock.className = "InputBlock";

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.placeholder = "Ajouter un joueur";
        newInput.className = "AddPlayerOut";

        const newSpan = document.createElement("span");
        newSpan.className = "InputIcon";

        newInputBlock.appendChild(newInput);
        newInputBlock.appendChild(newSpan);
        
        InputsContainer.appendChild(newInputBlock);
    }

    updateValidInputCounter(); // Update the ValidInputCounter
    updateCounterText();
});


// Ajoute la classe ValidInput quand il y a du texte dedans et fait en sorte qu'il n'y ait pas plus de 1 input vide en tout
InputsContainer.addEventListener("input", (evt) => {
    // Vérifie si la saisie a du texte
    if (evt.target.value.trim().length > 2) {
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
                const inputBlock = input.parentElement;
                inputBlock.remove(); // Supprime le div parent, qui contient à la fois l'input et le span
            }
        });
    }

    updateValidInputCounter();
    updateCounterText();
});
//delete the input when clicking on the icon trash
InputsContainer.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("InputIcon")) {
        const inputBlock = evt.target.parentElement;
        inputBlock.remove(); // Supprime le div parent contenant l'input et le span
        updateValidInputCounter();
        updateCounterText();
    }
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
// Function to save valid inputs to local storage
function saveToLocalStorage() {
    const validInputs = InputsContainer.querySelectorAll('input.ValidInput');
    let data = {};  // Initialize an object to store input data
    validInputs.forEach((input, index) => {
        data[`input${index}`] = input.value;  // Use a key with the index or another identifier
    });
    localStorage.setItem('ValidInputs', JSON.stringify(data));
}

// Function to load valid inputs from local storage
function loadFromLocalStorage() {
    const savedInputs = JSON.parse(localStorage.getItem('ValidInputs'));
    if (savedInputs) {
        Object.values(savedInputs).forEach((value, index) => {
            // Only create inputs if there's a saved value
            if (value) {
                const newInputBlock = document.createElement("div");
                newInputBlock.className = "InputBlock";

                const newInput = document.createElement("input");
                newInput.type = "text";
                newInput.value = value;  // Set the value from storage
                newInput.className = "AddPlayerOut ValidInput";  // Restore valid input class

                const newSpan = document.createElement("span");
                newSpan.className = "InputIcon";

                newInputBlock.appendChild(newInput);
                newInputBlock.appendChild(newSpan);

                InputsContainer.appendChild(newInputBlock);
            }
        });

        // Update the counter based on the number of loaded valid inputs
        ValidInputCounter = Object.keys(savedInputs).length;
        updateCounterText();  // Update the counter display
    }
}

// Add event listeners for saving and loading from local storage
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
InputsContainer.addEventListener("input", saveToLocalStorage);
InputsContainer.addEventListener("click", saveToLocalStorage);
InputsContainer.addEventListener("keydown", saveToLocalStorage);

