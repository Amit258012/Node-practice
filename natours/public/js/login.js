// login.js
import { showAlert } from "./alert.js";
export const login = async (email, password) => {
	try {
		const res = await axios({
			method: "POST",
			url: "http://localhost:8000/api/v1/users/login",
			data: {
				email,
				password,
			},
		});
		if (res?.data?.status === "success") {
			showAlert("success", "Logged in successfully!");
			window.setTimeout(() => {
				location.assign("/");
			}, 750);
		} else {
			showAlert("error", "Login failed. Please check your credentials.");
		}
	} catch (err) {
		showAlert("error", err.response.data.message);
	}
};

export const logout = async () => {
	try {
		const res = await axios({
			method: "GET",
			url: "http://localhost:8000/api/v1/users/logout",
		});
		if (res?.data?.status === "success") {
			showAlert("success", "Logged out successfully!");
			location.reload(true);
			location.assign("/");
		} else {
			showAlert("error", "Error logging out! Try again.");
		}
	} catch (err) {
		showAlert("error", "Error logging out! Try again.");
	}
};
