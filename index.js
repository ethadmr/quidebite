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

// Le code JavaScript à exécuter une fois que le DOM est chargé
document.getElementById('PlayButton').addEventListener('click', function() {
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

    // Animer les cartes pour le chargement
    const cards = document.querySelectorAll(".cardDesign");
    const animationDuration = 3000; // Réduire la durée totale de l'animation
    const animationDelay = 1000; // Réduire le délai avant le début de l'animation
    const waveOffset = 10; // Réduire le décalage initial pour l'effet de vague

    // Délai pour le démarrage de l'animation
    setTimeout(() => {
        // Faire avancer chaque carte pour créer une vague
        cards.forEach((card, index) => {
            const waveDelay = index * 250; // Réduire le délai pour chaque carte
            setTimeout(() => {
                card.style.transition = `transform ${animationDuration}ms, opacity ${animationDuration}ms`;
                card.style.transform = `translateX(-${index * 10}px) translateY(${index * 10}px)`; // Déplacement vers la gauche et effet de vague
            }, waveDelay);
        });
        
        // Sélectionner une carte aléatoire après l'animation
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            cards.forEach((card, index) => {
                if (index === randomIndex) {
                    card.style.transform = "translate(0, 0) scale(1.1)";
                    card.style.opacity = "1";
                } else {
                    card.style.opacity = "0";
                }
            });
            // Afficher le texte et les boutons lorsque la carte gagnante est affichée
            const winnerCard = document.querySelector(".cardDesign:nth-child(" + (randomIndex + 1) + ")");
            winnerCard.id = "WinnerCard";
            document.getElementById('WinnerInfoContainer').classList.remove('none');
            document.getElementById('ButtonContainer').classList.remove('none');
        }, animationDuration);
    }, animationDelay);
});

// Ajout des gestionnaires d'événements
inputsContainer.addEventListener("input", handleInput);
inputsContainer.addEventListener("click", handleIconClick);
inputsContainer.addEventListener("keydown", handleKeyDown);
inputsContainer.addEventListener("focusout", handleInputFocusOut); // Utiliser focusout au lieu de blur

// Ajout des gestionnaires d'événements pour les nouveaux boutons
document.getElementById('RestartButton').addEventListener('click', function() {
    // Code pour recommencer le tirage au sort
});

document.getElementById('NewGameButton').addEventListener('click', function() {
    location.reload(); // Recharger la page pour commencer une nouvelle partie
});
