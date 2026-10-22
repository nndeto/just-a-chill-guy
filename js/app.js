//GLOBAL VARIABLES//
let luckStat;
let jumpStat;
let swimStat;
let points = 5;
let inventory = [];
let startButton = document.getElementById("start-button");
let introText = document.getElementById("intro-text");
let gamePlayArea = document.getElementById("game-play");
let luckText = document.getElementById("luck")
let jumpText = document.getElementById("jump")
let swimText = document.getElementById("swim")
let pointsText = document.getElementById("points")
let sceneText = document.getElementById("story")


//STORY SCENES//
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
            { text: "Go up the staircase", next: "castleUpstairs" },
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
            { text: "Jump towards the ledge", action: () => jumpStatCheck() },
            { text: "But, seriously, you have to jump.", action: () => jumpStatCheck() }
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
    },
    castleUpstairs: {
        text: "Taking the winding staircase upstairs, you arrive on the second floor landing and begin your search. Each room is empty, and the back of your neck prickles like someone is watching you. Are you scared?",
        choices: [
            {text: "Yes", next: "castleHonestGoHome"},
            {text: "No", next: "castleLieGoHome"}
        ]
    },
    castleHonestGoHome: {
        text: "We knew it! You hightail it out of the castle without a second thought, quest forgotten.",
        choices: [
            {text: "Quest Failed", action: gameOver}
        ]
    },
    castleLieGoHome: {
        text: "Liar, liar, pants on fire. You search a few more rooms, but random sounds like eerie whispering and creaking floors get to you, and you run away.",
        choices: [
            {text: "Quest Failed", action: gameOver}
        ]
    },
    castleKitchen: {
        text: "Potraits line the hallway, and their eyes follow you. You end up in a kitchen. It's a mess. You see white powder on the counters and floors. Candles that have been abandoned and a mysterious liquid spilled on the floor. Keep Searching?",
        choices: [
            {text: "Go upstairs", next: "castleUpstairs"},
            {text: "Investigate the ajar door", next: "castleAjarDoor"}
        ]
    },
    castleAjarDoor: {
        text: "With a swallow, you tell yourself to be brave and open the door that first caught your attention when you walked in. You take the stairs one step at a time, heart pounding in your ears. When you make it all the way down, you find yourself in a dimly lit space with a table and some chairs. Feeling along the wall for a lightswitch, you flip it on, at the same time your friends jump out from behind the table. They begin to sing you happy birthday. Cake with lit candles, a punch bowl, and presents materialize on the table. What do you do?",
        choices: [
            {text: "Blow out your candles", action: () => happyBirthdayEnding()}
        ]
    }
};

//FUNCTIONS//
function setStats() {
    inventory = [];
    points = 5;
    luckStat = randomizeStat();
    jumpStat = randomizeStat();
    swimStat = randomizeStat();
    luckText.textContent = `Luck: ${luckStat}`;
    jumpText.textContent = `Jump: ${jumpStat}`;
    swimText.textContent = `Swim: ${swimStat}`;
    pointsText.textContent = `Points: ${points}`;
    return;
}

function randomizeStat () {
    return Math.floor(Math.random() * 10) + 1
}

function pointStatMath(value) {
    if (points === 0) {
        console.log("You've reached zero points.")
        return
    }
    points = points +value
    return points
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

function jumpStatCheck() {
    if (jumpStat >= 7) {
        return "castleWindowJumpSuccess"; }
    if (jumpStat >= 4) {
        return "castleWindowJumpAgain"; }
    return "castleWindowJumpFailure";     
}

function startQuest() {
    console.log("Quest started!");
    startButton.disabled = true; // Disable the start button after starting
    startButton.textContent = "Questing..."
    introText.style.display = "none"; // Hide the intro text
    setStats()
    showScene("start");
    gamePlayArea.style.display = "block"; // Show the game play area
}

function gameOver() {
    alert("Game Over!");
    gamePlayArea.style.display = "none"; // Hide the game play area
    introText.style.display = "block"; // Show the intro text again
    startButton.disabled = false; // Re-enable the start button
    startButton.textContent = "Try again?"; // Reset button text
}

function happyBirthdayEnding() {
    sceneText.textContent = "All your friends got together to wish you a happy birthday and celebrate how wonderful you are, fearless hero!"
    //if bouquet in inventory add it into a flower vase
    //here is where confetti pops
    //idea: alert input box with what is your wish
    startButton.disabled = false; // Re-enable the start button
    startButton.textContent = "Play again?"; // Reset button text
}

function showScene(sceneKey) {
    let scene = story[sceneKey];
    // Display the story text
    sceneText.innerText = scene.text;
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
