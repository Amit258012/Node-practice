// update data

import { showAlert } from "./alert.js";

export const updateSettings = async (data, type) => {
	try {
		const url =
			type === "password"
				? "http://localhost:8000/api/v1/users/updateMyPassword"
				: "http://localhost:8000/api/v1/users/updateMe";
		const res = await axios({
			method: "PATCH",
			url,
			data,
		});
		console.log(res, data, type);
		if (res.data.status === "success") {
			showAlert("success", `${type.toUpperCase()} updated successfully!`);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
