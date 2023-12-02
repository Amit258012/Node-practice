const ps = require("prompt-sync");
const prompt = ps({ sigint: true });

let name = prompt("Enter your name: ");
let age = prompt("Enter your age: ");
console.log(`Hi ${name}, you are now ${age} year old. That's great🥳`);
