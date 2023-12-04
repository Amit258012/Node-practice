const app = require("./app");

// Starting Server
const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
