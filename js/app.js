//GLOBAL VARIABLES//
let startButton = document.getElementById("start-button");
let introText = document.getElementById("intro-text");
let gamePlayArea = document.getElementById("game-play");
let intelligenceStat = 5;
let jumpingStat = 6;
let swimStat = 3;
let inventory = [];
let points = 0;



// Each scene has text and choices
let story = {
    start: {
        text: "You actually started the quest?! Brave soul. You find yourself before a split path. Which way do you go?",
        choices: [
            { text: "Go left", next: "river" },
            { text: "Go right", next: "flowerField" }
        ]
    },
    river: {
        text: "You follow the left path and arrive at a sparkling blue river. The water moves quickly, and it's hard for you to guage how far off the other side is. How will you cross?",
        choices: [
            { text: "Swim across", action: swimStatCheck},
            { text: "Look for a bridge", next: "riverBridge" },
            { text: "Wait for a boat", action: () => fiftyFifty("riverBoatSuccess", "riverBoatFailure")},
        ],
    },
    riverSwimCross: {
        text: "You successfully make it across the river! You find yourself on the other side, but the path ahead is unclear.",
        choices: [
            { text: "Take a breather and continue", next: "path" }
        ]
    },
    riverSweptAway: {
        text: "You attempt to swim across the river, but the current is stronger than you anticipated. You are swept downstream but eventually wash up on the opposite bank.",
        choices: [
            { text: "Collapsing on the bank, you rest before starting again", next: "path" }
        ]
    },
    riverDrown: {
        text: "You attempt to swim across the river, but the current is too strong. You are swept away. You struggle to keep your head above water, but eventually you succumb to the river's pull and drown.",
        choices: [
            { text: "You have met an untimely end", action: gameOver }
        ]
    },
    riverBridge: {
        text: "You decide to look for a bridge. After a short walk, you find a sturdy wooden bridge that allows you to cross the river safely.",
        choices: [
            { text: "Continue journey", next: "path" }
        ]
    },
    riverBoatSuccess: {
        text: "You decide to wait for a boat. After a while, a small boat appears and ferries you across the river safely. You eye the path ahead, anxious to continue.",
        choices: [
            { text: "Wave bye to the ferryman!", next: "path" }
        ]
    },
    riverBoatFailure: {
        text: "You decide to wait for a boat. After a long, long, long wait, no boat comes. Your stomach growls, and you realize you have no food or water. You decide to go home.",
        choices: [
            { text: "Going home? What a quitter.", action: gameOver }
        ]
    },
    flowerField: {
        text: "You follow the right path and find yourself in a beautiful field of flowers. What do you do?",   
        choices: [
            { text: "Continue journey", next: "path" },
            { text: "Stop and admire flowers", next: "flowerAdmire" },
            { text: "Pick some flowers", action: () => twoThirdChance("flowerPickSuccess", "flowerPickFailure")  }
        ]
    },
    flowerAdmire: {
        text: "You stop to admire the flowers. The colors are mesmerizing, the scents are intoxicating and you feel a deep connection to nature.",
        choices: [
            { text: "Continue journey", next: "path" }
        ]
    },
    flowerPickSuccess: {
        text: "You pick some flowers and they smell wonderful. You add them to your bag and continue your journey.",
        choices: [
            { text: "Continue journey", next: "path", inventory: () => inventoryAdd("flowers")}
        ]
    },
    flowerPickFailure: {
        text: "You try to pick some flowers, but a bee flies out and stings you. You feel a sharp pain and your throat swells up. You realize you are allergic to bee stings and you collapse.",
        choices: [
            { text: "You have met an untimely end", action: gameOver}
        ]
    },
    path: {
        text: "You walk the path for what feels like hours. You decide to talk to yourself to keep your spirits up, still unsure what you're searching for. Squinting, you see a castle in the distance.",
        choices: [
            { text: "Hurry up!", next: "castle" }
        ],
    },   
};

//FUNCTIONS//
function startQuest() {
    console.log("Quest started!");
    startButton.disabled = true; // Disable the start button after starting
    startButton.textContent = "Questing..."
    introText.style.display = "none"; // Hide the intro text
    showScene("start")
    gamePlayArea.style.display = "block"; // Show the game play area
}

function twoThirdChance(optionA, optionB) {
    return Math.random() < 0.66 ? optionA : optionB;
}

 function fiftyFiftyChance(optionA, optionB) {
    return Math.random() < 0.5 ? optionA : optionB;
}

function inventoryAdd(item) {
    // Add the item to the inventory (this is a placeholder, implement as needed)
    console.log(`Added ${item} to inventory.`);
    inventory.push(item);
    return 
}

function swimStatCheck() {
    if (swimStat >=7) {
        return "riverSwimCross"; }
    if (swimStat >= 4) {
        return "riverSweptAway"; }
    return "riverDrown";     
}

function intelligenceDoorCheck() {
    if (intelligenceStat >= 6) {
        return "insideCastle"; }
    return "lookAroundCastle";     
}

function jumpingStatCheck() {
    if (jumpingStat >= 7) {
        return "castleJumpSuccess"; }
    if (jumpingStat >= 4) {
        return "castleJumpAgain"; }
    return "castleJumpFailure";     
}

function gameOver(){
    alert("Game Over!");
    gamePlayArea.style.display = "none"; // Hide the game play area
    introText.style.display = "block"; // Show the intro text again
    startButton.disabled = false; // Re-enable the start button
    startButton.textContent = "Try again?"; // Reset button text
}

function showScene(sceneKey) {
    let scene = story[sceneKey];
    // Display the story text
    document.getElementById("story").innerText = scene.text;
    // Clear old buttons
    let buttonArea = document.getElementById("choices");

    buttonArea.innerHTML = "";

    // Create a button for each choice
    scene.choices.forEach(function(choice) {
        choice.inventory ? choice.inventory() : null; //call inventory if choice has one

        let btn = document.createElement("button");
        btn.innerText = choice.text;

        btn.onclick = function() {
            if (choice.action) {
                showScene(choice.action());
            } else {
                showScene(choice.next);
            }
        };
        buttonArea.appendChild(btn);
    });
}

//EVENT LISTENERS//
startButton.addEventListener("click", startQuest);
