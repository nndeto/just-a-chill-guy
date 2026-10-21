//GLOBAL VARIABLES//
let startButton = document.getElementById("start-button");
let introText = document.getElementById("intro-text");
let gamePlayArea = document.getElementById("game-play");
let luckStat;
let jumpStat;
let swimStat;
let inventory = [];
let points = 5;



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
            { text: "Wait for a boat", action: () => fiftyFiftyChance("riverBoatSuccess", "riverBoatFailure")},
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
    castle: {
        text: "You arrive at the castle, gazing up at its stone walls covered in ivy. You notice a door and a window. Which do you approach?",
        choices: [
            { text: "Try the door", action: () => luckDoorCheck() },
            { text: "Check out the window", next: "castleWindow" }
        ]
    },
    castleInside: {
        text: "You successfully enter the castle. Inside, you find a grand hall with a staircase leading up, a hallway leading to other rooms, and a slightly ajar door. Where do you go?",
        choices: [ 
            { text: "Go up the staircase", next: "castleStairs" },
            { text: "Take the hallway", next: "castleKitchen" },
            { text: "Investigate the ajar door", next: "castleAjarDoor" }
        ]
    },
    castleLookAround: {
        text: "You try the door, but it is locked. Grumbling, you look around and notice a window, but you also see a tree nearby that could be a good hiding spot for a key. What do you do?",
        choices: [
            { text: "Head for the tree", next: "castleTree"},
            { text: "Head for the window", next: "castleWindow" }
        ]
    },
    castleTree: {
        text: "You approach the tree and and walk around it, wondering where a key could be hidden. You notice a small hole in the trunk.",
        choices: [
            { text: "Reach inside the hole", action: () => luckKeyCheck() }
        ]
    },
    castleKeyFound: {
        text: "You reach inside the hole and feel around. Your hand brushes against something cold and metallic. You pull out a small key, covered in dirt but still intact. You take it and head back to the door.",
        choices: [
            { text: "Use the key to open the door", next: "castleInside" }
        ]
    },
    castleUnluckyTree: {
        text: "You reach inside the hole but come up empty-handed. Shaking your head, you laught at how silly you are for thinking there would be a key there. Perhaps you should try a different approach.",
        choices: [
            { text: "Head for the window", next: "castleWindow" }
        ]
    },
    castleWindow: {
        text: "You approach the window and notice that it is slightly open. You can see a ledge outside, but it looks like a drop to the ground below which has rocks scattered around. What do you do?",
        choices: [
            { text: "Jump towards the ledge", action: () => jumpingStatCheck() },
            { text: "But, seriously, you have to jump.", action: () => jumpingStatCheck() }
        ]
    },
    castleWindowJumpSuccess: {
        text: "You take a deep breath and jump towards the ledge. You manage to grab onto it!",
        choices: [
            { text: "Pull yourself up", next: "castleInside"}
        ]
    },
    castleWindowJumpAgain: {
        text: "Biting your lip, you take a breath, and jump towards the ledge. You miss by a hair's breadth. Motivated, you shake it out and prepare to jump again. Grabbing the ledge this time, you smile in triumph.",
        choices: [
            { text: "Twice? Aren't you athletic. Now, pull yourself up. ", next: "castleInside"}
        ]
    },
    castleWindowJumpFailure: {
        text: "You jump and miss egregiously. Your stomach drops as you fall back towards the ground. You wonder at how silly your choice was before hitting your head on a rock.",
        choices: [
            {text: "You have met an untimely end.", action: gameOver}
        ]
    
    }
};

//FUNCTIONS//
function startQuest() {
    console.log("Quest started!");
    startButton.disabled = true; // Disable the start button after starting
    startButton.textContent = "Questing..."
    introText.style.display = "none"; // Hide the intro text
    luckStat = randomizeStat();
    jumpStat = randomizeStat();
    swimStat = randomizeStat();
    inventory = [];
    points = 5;
    showScene("start");
    gamePlayArea.style.display = "block"; // Show the game play area
}

function randomizeStat () {
    return Math.floor(Math.random() * 10) + 1
}

function pointStatMath(value) { //TBC
    return `Points: ${points + value}`
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

function luckDoorCheck() {
    if (luckStat >= 6) {
        return "castleInside"; }
    return "castleLookAround";     
}

function luckKeyCheck() {
    if (luckStat >= 5) {
        return "castleKeyFound"; }
    return "castleUnluckyTree";     
}

function jumpingStatCheck() {
    if (jumpStat >= 7) {
        return "castleWindowJumpSuccess"; }
    if (jumpStat >= 4) {
        return "castleWindowJumpAgain"; }
    return "castleWindowJumpFailure";     
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

        let btn = document.createElement("button");
        btn.innerText = choice.text;

        btn.onclick = function() {
            if (choice.inventory) {
                choice.inventory(); //call inventory if choice has one
            }
            if (choice.action) {
                let nextScene = choice.action();
                if (nextScene) {
                    showScene(nextScene);
                }
            } else {
                showScene(choice.next);
            }
        };
        buttonArea.appendChild(btn);
    });
}

//EVENT LISTENERS//
startButton.addEventListener("click", startQuest);
