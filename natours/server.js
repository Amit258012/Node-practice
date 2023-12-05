const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });

const app = require("./app");

// Starting Server
const port = process.env.port || 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
