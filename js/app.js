//GLOBAL VARIABLES//
let confettiFrame;
let luckStat;
let jumpStat;
let swimStat;
let points = 3;
let inventory = [];
let startButton = document.getElementById("start-button");
let introHeader = document.getElementById("h1");
let introText = document.getElementById("intro-text");
let gamePlayArea = document.getElementById("game-play");
let luckText = document.getElementById("luck");
let jumpText = document.getElementById("jump");
let swimText = document.getElementById("swim");
let pointsText = document.getElementById("points");
let sceneText = document.getElementById("story-text");
let buttonArea = document.getElementById("choice-buttons");


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
            { text: "Swim across", action: swimStatCheck },
            { text: "Look for a bridge", next: "riverBridge" },
            { text: "Wait for a boat", action: () => fiftyFiftyChance("riverBoatSuccess", "riverBoatFailure") }
        ]
    },
    riverSwimCross: {
        text: "You successfully make it across the river! You find yourself on the other side, but the path ahead is unclear.",
        choices: [
            {
                text: "Take a breather and continue",
                next: "path",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    riverSweptAway: {
        text: "You attempt to swim across the river, but the current is stronger than you anticipated. You are swept downstream but eventually wash up on the opposite bank.",
        choices: [
            {
                text: "Collapsing on the bank, you rest before starting again",
                next: "path",
                effects: [() => pointStatMath(-1)]
            }
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
            {
                text: "Wave bye to the ferryman!",
                next: "path",
                effects: [() => pointStatMath(1)]
            }
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
            {
                text: "Walk past",
                next: "path",
                effects: [() => pointStatMath(-2)]
            },
            {
                text: "Stop and admire flowers",
                next: "flowerAdmire",
                effects: [() => pointStatMath(1)]
            },
            {
                text: "Pick some flowers",
                action: () => twoThirdChance("flowerPickSuccess", "flowerPickFailure")
            }
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
            {
                text: "Continue journey",
                next: "path",
                effects: [
                    () => inventoryAdd("flowers"),
                    () => pointStatMath(2)
                ]
            }
        ]
    },
    flowerPickFailure: {
        text: "You try to pick some flowers, but a bee flies out and stings you. You feel a sharp pain and your throat swells up. You realize you are allergic to bee stings and you collapse.",
        choices: [
            { text: "You have met an untimely end", action: gameOver }
        ]
    },
    path: {
        text: "You walk the path for what feels like hours. You decide to talk to yourself to keep your spirits up, still unsure what you're searching for. Squinting, you see a castle in the distance.",
        choices: [
            { text: "Hurry up!", next: "castle" }
        ]
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
            {
                text: "Investigate the ajar door",
                next: "castleAjarDoor",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleLookAround: {
        text: "You try the door, but it is locked. Grumbling, you look around and notice a window, but you also see a tree nearby that could be a good hiding spot for a key. What do you do?",
        choices: [
            { text: "Head for the tree", next: "castleTree" },
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
            {
                text: "Use the key to open the door",
                next: "castleInside",
                effects: [() => pointStatMath(1)]
            }
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
            {
                text: "Pull yourself up",
                next: "castleInside",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleWindowJumpAgain: {
        text: "Biting your lip, you take a breath, and jump towards the ledge. You miss by a hair's breadth. Motivated, you shake it out and prepare to jump again. Grabbing the ledge this time, you smile in triumph.",
        choices: [
            {
                text: "Twice? Aren't you athletic. Now, pull yourself up.",
                next: "castleInside",
                effects: [() => pointStatMath(-1)]
            }
        ]
    },
    castleWindowJumpFailure: {
        text: "You jump and miss egregiously. Your stomach drops as you fall back towards the ground. You wonder at how silly your choice was before hitting your head on a rock.",
        choices: [
            { text: "You have met an untimely end.", action: gameOver }
        ]
    },
    castleUpstairs: {
        text: "Taking the winding staircase upstairs, you arrive on the second floor landing and begin your search. Each room is empty, and the back of your neck prickles like someone is watching you. Are you scared?",
        choices: [
            { text: "Yes", next: "castleHonestGoHome" },
            { text: "No", next: "castleLieGoHome" }
        ]
    },
    castleHonestGoHome: {
        text: "We knew it! You hightail it out of the castle without a second thought, quest forgotten.",
        choices: [
            { text: "Quest Failed", action: gameOver }
        ]
    },
    castleLieGoHome: {
        text: "Liar, liar, pants on fire. You search a few more rooms, but random sounds like eerie whispering and creaking floors get to you, and you run away.",
        choices: [
            { text: "Quest Failed", action: gameOver }
        ]
    },
    castleKitchen: {
        text: "Potraits line the hallway, and their eyes follow you. You end up in a kitchen. It's a mess. You see white powder on the counters and floors. Candles that have been abandoned and a mysterious liquid spilled on the floor. Keep Searching?",
        choices: [
            { text: "Go upstairs", next: "castleUpstairs" },
            {
                text: "Investigate the ajar door",
                next: "castleAjarDoor",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleAjarDoor: {
        text: "With a swallow, you tell yourself to be brave and open the door that first caught your attention when you walked in. You take the stairs one step at a time, heart pounding in your ears. When you make it all the way down, you find yourself in a dimly lit space with a table and some chairs. Feeling along the wall for a lightswitch, you flip it on, at the same time your friends jump out from behind the table. They begin to sing you happy birthday. Cake with lit candles, a punch bowl, and presents materialize on the table. What do you do?",
        choices: [
            { text: "Blow out your candles", action: () => happyBirthdayEnding() }
        ]
    }
};


//FUNCTIONS//
function setStats() {
    inventory = [];
    points = 3;
    luckStat = randomizeStat();
    jumpStat = randomizeStat();
    swimStat = randomizeStat();

    luckText.textContent = `Luck: ${luckStat}`;
    jumpText.textContent = `Jump: ${jumpStat}`;
    swimText.textContent = `Swim: ${swimStat}`;
    pointsText.textContent = `Points: ${points}`;

    return;
}

function randomizeStat() {
    return Math.floor(Math.random() * 10) + 1;
}

function pointStatMath(value) {
    points = Math.max(0, points + value);
    pointsText.textContent = `Points: ${points}`;
    return points;
}

function twoThirdChance(optionA, optionB) {
    return Math.random() < 0.66 ? optionA : optionB;
}

function fiftyFiftyChance(optionA, optionB) {
    return Math.random() < 0.5 ? optionA : optionB;
}

function inventoryAdd(item) {
    // console.log(`Added ${item} to inventory.`);
    inventory.push(item);
    return;
}

function swimStatCheck() {
    if (swimStat >= 7) {
        return "riverSwimCross";
    }
    if (swimStat >= 4) {
        return "riverSweptAway";
    }
    return "riverDrown";
}

function luckDoorCheck() {
    if (luckStat >= 6) {
        return "castleInside";
    }
    pointStatMath(-1);
    return "castleLookAround";
}

function luckKeyCheck() {
    if (luckStat >= 5) {
        return "castleKeyFound";
    }
    return "castleUnluckyTree";
}

function jumpStatCheck() {
    if (jumpStat >= 7) {
        return "castleWindowJumpSuccess";
    }
    if (jumpStat >= 4) {
        return "castleWindowJumpAgain";
    }
    return "castleWindowJumpFailure";
}

function startQuest() {
    // console.log("Quest started!");
    stopConfetti();
    introText.style.display = "none";
    introHeader.textContent = "Oh, just a chill hero?";
    startButton.disabled = true;
    startButton.textContent = "Questing...";
    gamePlayArea.style.display = "block";
    buttonArea.style.display = "block";

    setStats();
    showScene("start");
}

function gameOver() {
    alert("Game Over!");
    gamePlayArea.style.display = "none";
    introText.style.display = "block";
    startButton.disabled = false;
    startButton.textContent = "Try again?";
    introHeader.textContent = "Hey there, just a chill guy!";
}

function showEnding({ text, includeFlowers = false, wishPrompt = false }) {
    sceneText.textContent = text;

    if (includeFlowers && inventory.includes("flowers")) {
        sceneText.textContent +=
            " The flowers you picked will make a great bouquet. Raccoon takes them from you and puts them in a vase.";
    }

    if (wishPrompt) {
        let wish = prompt(
            "You have enough points to make a wish! What is your wish?"
        );

        if (wish !== null && wish.trim() !== "") {
            sceneText.textContent += ` Your wish: ${wish.trim()}.`;
        }
    }

    launchConfetti();
    buttonArea.style.display = "none";

    startButton.disabled = false;
    startButton.textContent = "Play again?";
}

function happyBirthdayEnding() {
    if (points >= 5) {
        secretEnding();
        return;
    }

    showEnding({
        text: "All your friends got together to wish you a happy birthday and celebrate how wonderful you are, fearless hero!",
        includeFlowers: true
    });
}

function secretEnding() {
    showEnding({
        text: "All your friends got together to wish you a happy birthday and celebrate how wonderful you are, fearless hero! Your thoughtful choices have earned you a special birthday wish.",
        includeFlowers: true,
        wishPrompt: true
    });
}

function showScene(sceneKey) {
    let scene = story[sceneKey];
    sceneText.innerText = scene.text;
    buttonArea.innerHTML = "";

    // Create a button for each choice
    scene.choices.forEach(function(choice) {
        let choiceBtn = document.createElement("button");
        choiceBtn.innerText = choice.text;

        choiceBtn.onclick = function() {
            if (choice.effects) {
                choice.effects.forEach(effect => effect());
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

        buttonArea.appendChild(choiceBtn);
    });
}

function launchConfetti() {
    // Do this for 20 seconds
    let duration = 20 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        // Launch a few confetti from the left edge
        confetti({
            particleCount: 35,
            angle: 60,
            spread: 255,
            origin: { x: 0 }
        });

        // Launch a few confetti from the right edge
        confetti({
            particleCount: 35,
            angle: 120,
            spread: 255,
            origin: { x: 1 }
        });

        // Keep going until we are out of time
        if (Date.now() < end) {
            confettiFrame = requestAnimationFrame(frame);
        } else {
            confettiFrame = null;
        }
    })();
}

function stopConfetti() {
    if (confettiFrame) {
        cancelAnimationFrame(confettiFrame);
        confettiFrame = null;
    }
    confetti.reset();
}


//EVENT LISTENERS//
startButton.addEventListener("click", startQuest);
