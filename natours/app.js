const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.status(400).json({ message: "Hello World!", app: "Natour" });
});

app.post("/", (req, res) => {
	res.send("Send your message to this endpoint");
});

const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
