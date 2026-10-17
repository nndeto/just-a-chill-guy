//GLOBAL VARIABLES//
let startButton = document.getElementById("start-button");
let introText = document.getElementById("intro-text");

// Each scene has text and choices
let story = {
  start: {
    text: "You actually started the quest?! Brave soul. You find yourself before a split path",
    choices: [
      { text: "Go left", next: "river" },
      { text: "Go right", next: "flowerField" }
    ]
  },
  river: {
    text: "You follow the left path and arrive at a river. The water is moves quickly and the other side is a ways off.",
    choices: [
      { text: "Swim across", next: "light" },
      { text: "Look for a bridge", next: "start" },
      { text: "Wait for a boat", next: "start" }
    ]
  },
  flowerField: {
    text: "You find yourself in a beautiful field of flowers. A path leads to a small cottage.",
  }    
};



//FUNCTIONS//
function startQuest() {
    startButton.disabled = true; // Disable the start button after starting
    startButton.textContent = "Questing..."
    introText.style.display = "none"; // Hide the intro text
    showScene("start")
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
