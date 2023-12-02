const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
	// Answer [1]: load complete data and then show
	/* 	
	fs.readFile("./test-file.txt", (err, data) => {
		if (err) console.log(err);
		res.end(data);
	}); 
*/
	// Answer [2]: streams

	/* 	
	const readable = fs.createReadStream("./test-file.txt");
	readable.on("data", (chunk) => {
		res.write(chunk);
	});
	readable.on("end", () => {
		res.end();
	});
	readable.on("error", (err) => {
		res.statusCode = 500;
		res.end("File not found!");
	}); 
*/

	// Question: It is reading file super fast but not writing fast?
	// Answer [3]: Best solution

	const readable = fs.createReadStream("./test-file.txt");
	// readableSource.pipe(writeableDestination)
	readable.pipe(res);
});

server.listen("8000", "127.0.0.1", () => {
	console.log("listening....");
});
