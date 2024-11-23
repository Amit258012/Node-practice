// index.js
import { login, logout } from "./login.js";
import { displayMap } from "./maplibre.js";
import { updateSettings } from "./updateSettings.js";

// Parse the locations data from the dataset
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");
const logOutBtn = document.querySelector(".nav__el--logout");

const userPasswordForm = document.querySelector(".form-user-password");
const userDataForm = document.querySelector(".form-user-data");

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

if (logOutBtn) {
	logOutBtn.addEventListener("click", (e) => {
		e.preventDefault();
		logout();
	});
}

if (userDataForm) {
	userDataForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		updateSettings({ name, email }, "data");
	});
}

if (userPasswordForm) {
	userPasswordForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		document.querySelector(".btn--save-password").textContent =
			"Updating...";
		const passwordCurrent =
			document.getElementById("password-current").value;
		const password = document.getElementById("password").value;
		const passwordConfirm =
			document.getElementById("password-confirm").value;
		console.log(passwordCurrent, password, passwordConfirm);
		await updateSettings(
			{ passwordCurrent, password, passwordConfirm },
			"password"
		);
		document.querySelector(".btn--save-password").textContent =
			"Save Password";
		document.getElementById("password-current").value = "";
		document.getElementById("password").value = "";
		document.getElementById("password-confirm").value = "";
	});
}
