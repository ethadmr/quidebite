const inputsContainer = document.getElementById("InputsContainer");
const playButton = document.getElementById('PlayButton');
const buttonContainer = document.getElementById('ButtonContainer');

const backgroundMusic = document.getElementById('backgroundMusic'); // Récupérer l'élément audio de fond
const clickSound = document.getElementById('clickSound'); // Récupérer l'élément audio du clic

// Fonction pour jouer le son de clic
function playClickSound() {
    clickSound.currentTime = 0; // Réinitialiser le temps de lecture pour permettre la répétition rapide
    clickSound.play();
}

// Fonction pour mettre à jour le compteur et le texte affiché
function updateInputInfo() {
    const validInputCount = inputsContainer.querySelectorAll('input.ValidInput').length;
    document.getElementById("ValidInputCounterText").textContent = validInputCount;

    // Ajoute ou retire la classe InactiveButton en fonction du nombre d'inputs valides
    if (validInputCount < 2) {
        playButton.classList.add("InactiveButton");
    } else {
        playButton.classList.remove("InactiveButton");
    }
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
        playClickSound();
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
        
        // Faire défiler jusqu'en bas
        newInputBlock.scrollIntoView({ behavior: 'smooth' });
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

// Function to get a random image from the reactions folder
function getRandomReactionImage() {
    const imageCount = 5; // Total number of reaction images available
    const randomIndex = Math.floor(Math.random() * imageCount) + 1;
    return `img/reactions/reaction${randomIndex}.png`;
}

// Function to display the reaction image
function displayReaction() {
    const reactionImageSrc = getRandomReactionImage();

    const reactionDiv = document.createElement("div");
    reactionDiv.classList.add("reaction");

    const reactionImage = document.createElement("img");
    reactionImage.src = reactionImageSrc;
    reactionImage.alt = "Reaction Image";

    reactionDiv.appendChild(reactionImage);

    document.querySelector("#Page2").appendChild(reactionDiv);
}

// Le code JavaScript à exécuter une fois que le DOM est chargé
playButton.addEventListener('click', function() {
    saveValidInputsToLocalStorage();
    document.querySelector('#Page1').classList.add('none');
    document.querySelector('body').classList.add('bodyPage2');

    // Récupérer les données du localStorage
    const savedInputs = JSON.parse(localStorage.getItem("savedValidInputs"));
    
    // Afficher les données dans le modèle HTML
    const outputDiv = document.getElementById("Page2");
    outputDiv.innerHTML = ""; // Efface le contenu précédent

    savedInputs.forEach(function(inputValue) {
        const template = document.querySelector("#card").content.cloneNode(true);
        template.querySelector("h2").textContent = inputValue;
        outputDiv.appendChild(template);
    });

    // Animer les cartes pour le chargement avec un délai plus long
    const cards = document.querySelectorAll(".cardDesign");
    cards.forEach((card, index) => {
        card.style.zIndex = savedInputs.length - index; // Superposer les cartes
        card.style.transition = "transform 1s, opacity 0.3s";
        setTimeout(() => {
            card.style.transform = `translate(-70vw, ${index * 5}px)`;
        }, index * 100 + 600); // Déplacer à gauche avec un délai plus long pour l'effet de vague
    });

    // Revenir au centre après le chargement
    setTimeout(() => {
        cards.forEach((card, index) => {
            card.style.transform = `translate(-50vw, ${index * 10}px)`;
        });

        // Sélectionner une carte aléatoire après le chargement
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            cards.forEach((card, index) => {
                if (index === randomIndex) {
                    card.style.zIndex = savedInputs.length + 1; // Mettre la carte sélectionnée au-dessus des autres
                    card.style.transform = "translate(0, 0) scale(1.2)";
                    card.style.opacity = "1";
                } else {
                    card.style.transition = "opacity 0.5s";
                    card.style.opacity = "0";
                }
            });

            // Supprimer les cartes non sélectionnées après l'animation de disparition
            setTimeout(() => {
                cards.forEach((card, index) => {
                    if (index !== randomIndex) {
                        card.remove();
                    }
                });

                // Display the reaction image after removing non-selected cards
                displayReaction();

            }, 500); // Attendre que l'animation de disparition soit terminée avant de supprimer

            // Rendre le ButtonContainer visible en même temps que la carte apparaît
            buttonContainer.style.display = 'flex';

            // Jouer la musique de fond
            backgroundMusic.play();

        }, 3000); // Attendre 3 secondes avant de sélectionner une carte

    }, cards.length * 500 + 1500); // Délai initial plus long pour commencer l'animation après le rendu des cartes

    // Jouer le son de clic pour le bouton de lecture
    playClickSound();
});

// Ajout des gestionnaires d'événements
inputsContainer.addEventListener("input", handleInput);
inputsContainer.addEventListener("click", handleIconClick);
inputsContainer.addEventListener("keydown", handleKeyDown);
inputsContainer.addEventListener("focusout", handleInputFocusOut);

// Ajout d'un gestionnaire de clics pour tous les boutons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
});
