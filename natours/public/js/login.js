// login.js
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
			window.setTimeout(() => {
				location.assign("/");
			}, 1500);
		} else {
			console.error("Login failed. Please check your credentials.");
		}
	} catch (err) {
		console.error(err.message);
	}
};
