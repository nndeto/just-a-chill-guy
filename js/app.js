// Each scene has text and choices
let story = {
  start: {
    text: "You find yourself at the edge of a dark forest. What do you do?",
    choices: [
      { text: "Enter the forest", next: "forest" },
      { text: "Walk along the river", next: "river" }
    ]
  },
  forest: {
    text: "The trees close in around you. A glowing light appears ahead.",
    choices: [
      { text: "Follow the light", next: "light" },
      { text: "Turn back", next: "start" }
    ]
  }
};