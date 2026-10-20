//GLOBAL VARIABLES//
let startButton = document.getElementById("start-button");
let introText = document.getElementById("intro-text");

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
      { text: "Swim across", next: "" },
      { text: "Look for a bridge", next: "riverBridge" },
      { text: "Wait for a boat", next: fiftyFifty("riverBoatSuccess", "riverBoatFailure") 
      }
    ]
  },
  riverSwimCross: {
    text: "You successfully make it across the river! You find yourself on the other side, but the path ahead is unclear.",
    choices: [
      { text: "Take a breather and continue", next: "path" }
    ]
},
  riverSweptAway: {
    text: "You attempt to swim across the river, but the current is stronger than you anticipated. You are swept downstream but eventually wash up on the opposite bank",
    choices: [
      { text: "Collapsing on the bank you take awhile to get started again", next: "path" }
    ]
},
  riverDrown: {
    text: "You attempt to swim across the river, but the current is too strong. You are swept away. You struggle to keep your head above water, but eventually you succumb to the river's pull and drown.",
    action: gameOver(),
},
  riverBridge: {
    text: "You decide to look for a bridge. After a short walk, you find a sturdy wooden bridge that allows you to cross the river safely.",
    choices: [
      { text: "Once across, you eye the path ahead", next: "path" }
    ]
},
  riverBoatSuccess: {
    text: "You decide to wait for a boat. After a while, a small boat appears and ferries you across the river safely.",
    choices: [
      { text: "Waving bye to the ferryman, you continue onward", next: "path" }
    ]
},
  riverBoatFailure: {
    text: "You decide to wait for a boat. After a long, long, long wait, no boat comes. Your stomach growls, and you realize you have no food or water. You decide to go home.  Better luck next time.",
    choices: [
      { text: "You decide to go home.", next: gameOver() }
    ]
},
  flowerField: {
    text: "You find yourself in a beautiful field of flowers. A path leads to a small cottage.",   
    choices: [
      { text: "Follow the path", next: "path" },
      { text: "Pick some flowers", next: "start" }
    ]
  },
  path: {
    text: "You follow the path and arrive at a small cottage. The door is slightly ajar.",
    choices: [
      { text: "Enter the cottage", next: "cottage" },
      { text: "Knock on the door", next: "start" }
    ],
},   
};



//FUNCTIONS//
function startQuest() {
    startButton.disabled = true; // Disable the start button after starting
    startButton.textContent = "Questing..."
    introText.style.display = "none"; // Hide the intro text
    showScene("start")
}

const fiftyFifty = (nextA, nextB) => Math.random() < 0.5 ? nextA : nextB;

const gameOver = () => {
  alert("Game Over! You have met an untimely end.");
  startButton.disabled = false; // Re-enable the start button
  startButton.textContent = "Try again?"; // Reset button text
  introText.style.display = "block"; // Show the intro text again
  showScene("start"); // Reset to the start scene
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
      showScene(choice.next);
    };
    buttonArea.appendChild(btn);
  });
}


//EVENT LISTENERS//
 startButton.addEventListener("click", startQuest);
