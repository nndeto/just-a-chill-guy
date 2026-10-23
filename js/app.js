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
        text: "You follow the left path and arrive at a sparkling blue river. The water moves quickly, and it's hard for you to guage how far the other side is. How will you cross?",
        choices: [
            { text: "Swim across", action: swimStatCheck },
            { text: "Find a bridge", next: "riverBridge" },
            { text: "Wait for a boat", action: () => fiftyFiftyChance("riverBoatSuccess", "riverBoatFailure") }
        ]
    },
    riverSwimCross: {
        text: "You successfully make it across! Shaking the water off, you're already gazing ahead at the unclear path.",
        choices: [
            {
                text: "Finish drying",
                next: "path",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    riverSweptAway: {
        text: "You attempt to swim across the river, but the current is stronger than you thought! You are swept downstream but wash ashore on the opposite bank. Catch your breath, before continuing.",
        choices: [
            {
                text: "Onward",
                next: "path",
                effects: [() => pointStatMath(-1)]
            }
        ]
    },
    riverDrown: {
        text: "You attempt to swim across the river, but the current is too strong! You are swept away. Struggling in vain, you succumb to the river's pull and drown.",
        choices: [
            { text: "You have met an untimely end", action: gameOver }
        ]
    },
    riverBridge: {
        text: "You decide to look for a bridge. After a short walk, you find a sturdy wooden bridge that allows you to cross the river safely.",
        choices: [
            { text: "Onward", next: "path" }
        ]
    },
    riverBoatSuccess: {
        text: "You decide to wait for a boat. After a while, a small boat appears and ferries you across the river. Warily, you eye the path ahead, anxious to continue.",
        choices: [
            {
                text: "Wave bye to the ferryman",
                next: "path",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    riverBoatFailure: {
        text: "You decide to wait for a boat. After a long, long, longgggg wait, no boat comes. Stomach growling, you realize you have no provisions. You return home.",
        choices: [
            { text: "Done already? What a quitter.", action: gameOver }
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
                text: "Admire the flowers",
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
        text: "You stop to admire the flowers, mesmerized by their colors. Breathing deeply, their intoxicating scent makes you feel light and hopeful.",
        choices: [
            { text: "Onward", next: "path" }
        ]
    },
    flowerPickSuccess: {
        text: "You take your time to pick the flowers that catch your eye. Careful to not disturb the bees collecting nectar. Smiling, you add your whimsical bouquet to your bag. ",
        choices: [
            {
                text: "Onward",
                next: "path",
                effects: [
                    () => inventoryAdd("flowers"),
                    () => pointStatMath(2)
                ]
            }
        ]
    },
    flowerPickFailure: {
        text: "Oh, no! As you pick the flowers, a bee flies out and stings you. You feel a sharp pain, and your throat swells up. You realize you are allergic and collapse.",
        choices: [
            { text: "You have met an untimely end", action: gameOver }
        ]
    },
    path: {
        text: "It feels like you've been walking the path for hours. To keep your spirits up, you start whistling to yourself. You're still unsure what you're searching for, but the questions fade as a castle appears on the horizon.",
        choices: [
            { text: "Hurry up!", next: "castle" }
        ]
    },
    castle: {
        text: "You arrive at the castle. It's ancient and mysterious, with stone walls covered in ivy. You notice a door and a window. Which do you approach?",
        choices: [
            { text: "The door", action: () => luckDoorCheck() },
            { text: "The window", next: "castleWindow" }
        ]
    },
    castleInside: {
        text: "You make it inside the castle and find yourself in the foyer. An ornate staircase leads up to a second landing, a hallway lined with portraits spans before you, and tucked in the right-corner is a slightly ajar door. Which way do you go?",
        choices: [
            { text: "Up the stairs", next: "castleUpstairs" },
            { text: "Down the hall", next: "castleKitchen" },
            {
                text: "Investigate the door",
                next: "castleAjarDoor",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleLookAround: {
        text: "Jiggling the handle, you grumble as the door stays put. You glance at the window, but also see a tree nearby. Something about the tree piques your curiosity. Where do you go?",
        choices: [
            { text: "To the tree", next: "castleTree" },
            { text: "To the window", next: "castleWindow" }
        ]
    },
    castleTree: {
        text: "Walking around the tree, you notice a small hollow in the trunk. Hm, could a key be hidden in there?",
        choices: [
            { text: "Check the abyss", action: () => luckKeyCheck() }
        ]
    },
    castleKeyFound: {
        text: "The inside of the hole is damp and cobwebby, but your hand brushes against something cold and metallic. You pull out a small key.",
        choices: [
            {
                text: "Unlock the door",
                next: "castleInside",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleUnluckyTree: {
        text: "The inside of the hole is damp, cobwebby, and empty. You pull your hand out, shake it, and laugh at how silly you are for thinking a key would be in there. Perhaps you should try a different approach?",
        choices: [
            { text: "Go to the window", next: "castleWindow" }
        ]
    },
    castleWindow: {
        text: "You approach the window. Noticing it is slighly open, you eye the outside ledge and guage the distance from it to the ground. Ignoring the jagged rocks below. What do you do?",
        choices: [
            { text: "Jump", action: () => jumpStatCheck() },
            { text: "But, seriously, you have to jump.", action: () => jumpStatCheck() }
        ]
    },
    castleWindowJumpSuccess: {
        text: "Taking a deep breath, you spring up and reach towards the ledge. You manage to grab hold!",
        choices: [
            {
                text: "Pull yourself up",
                next: "castleInside",
                effects: [() => pointStatMath(1)]
            }
        ]
    },
    castleWindowJumpAgain: {
        text: "Taking a deep breath, you spring up and reach towards the ledge. You miss by an inch. You shake yourself out and jump again. Success! You've grabbed the ledge.",
        choices: [
            {
                text: "Twice? Aren't you athletic. Now, pull!",
                next: "castleInside",
                effects: [() => pointStatMath(-1)]
            }
        ]
    },
    castleWindowJumpFailure: {
        text: "You jump, you soar, you miss. You fall backwards, stomach dropping, remembering the scattered rocks, before you hit your head on one.",
        choices: [
            { text: "You have met an untimely end.", action: gameOver }
        ]
    },
    castleUpstairs: {
        text: "You arrive on the second floor. The back of your neck prickles like someone is watching you, and the floor creaks benath your steps. Each room you search is empty and uneasiness washes over you. Are you scared?",
        choices: [
            { text: "Yes", next: "castleHonestGoHome" },
            { text: "No", next: "castleLieGoHome" }
        ]
    },
    castleHonestGoHome: {
        text: "We knew it! You run out of the castle, without a backwards glance, quest abandoned.",
        choices: [
            { text: "Quest Failed", action: gameOver }
        ]
    },
    castleLieGoHome: {
        text: "Liar, liar, pants on fire. Before you can search another room, you hear whispering and pounding feet below. You shiver, goosebumps forming on your arms, and run out of the castle.",
        choices: [
            { text: "Quest Failed", action: gameOver }
        ]
    },
    castleKitchen: {
        text: "Avoiding the eyes of the portraits, you walk down the hall and end up in a kitchen. It's a mess. White powder covers the walls, abandoned candles roll across the counters, and there's a mysterious red puddle on the floor. You decide to search somewhere else.",
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
        text: "Slowly opening the door the rest of the way, you realize it leads to a basement. Heart pounding, you take the stairs one at a time. You find yourself in a dimly lit space, barely able to make out chairs and a table. What do you do?", 
        choices: [
            { text: "Find a lightswitch", action: () => happyBirthdayEnding() }
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
            " The flowers you picked will make a great bouquet. Raccoon takes them from you, puts them in a vase, and adds them to the table.";
    }

    launchConfetti();
    buttonArea.style.display = "none";

    startButton.disabled = false;
    startButton.textContent = "Play again?";

    if (wishPrompt) {
        setTimeout(() => {
            let wish = prompt(
                "You have enough points to make a wish! What is your wish?"
            );

            if (wish !== null && wish.trim() !== "") {
                sceneText.textContent += ` I hope your wish comes true!`;
            }
        }, 2500);
    }
}

function happyBirthdayEnding() {
    if (points >= 5) {
        secretEnding();
        return;
    }

    showEnding({
        text: "Your fingers brush against a switch, and you flip it. When the lights flicker on, you see the table is set with a cake with unlit candles and a bowl of fruit punch. Your friends Raccoon, Anomalocaris, and Cat jump out from behind the table. They've all gathered to wish you a happy birthday and celebrate how wonderful you are, fearless hero!",
        includeFlowers: true
    });
}

function secretEnding() {
    showEnding({
        text: "Your fingers brush against a switch, and you flip it. When the lights flicker on, you see the table is set with a cake with unlit candles and a bowl of fruit punch. Your friends Raccoon, Anomalocaris, and Cat jump out from behind the table. They've all gathered to wish you a happy birthday and celebrate how wonderful you are, fearless hero! You've also unlocked a secret ending.",
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
