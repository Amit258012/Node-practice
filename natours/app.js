const express = require("express");
const fs = require("fs");
const app = express();

// app.get("/", (req, res) => {
// 	res.status(400).json({ message: "Hello World!", app: "Natour" });
// });

// app.post("/", (req, res) => {
// 	res.send("Send your message to this endpoint");
// });

// Topic: Handle Get requests

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
});

const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
