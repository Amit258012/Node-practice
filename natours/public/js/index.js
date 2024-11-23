// index.js
import { login } from "./login.js";
import { displayMap } from "./maplibre.js";

// Parse the locations data from the dataset
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");

if (mapBox) {
	try {
		const locations = JSON.parse(mapBox.dataset.locations);
		if (locations.length > 0) {
			displayMap(locations);
		} else {
			console.warn("No locations to display on the map.");
		}
	} catch (error) {
		console.error("Error parsing locations data:", error.message);
	}
}

if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		login(email, password);
	});
}
