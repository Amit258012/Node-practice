const fs = require("fs");
const http = require("http");
// const url = require("url");

// Chapter [1]: Files

// Topic (1.1): Blocking or Synchronous way
/*
const textIp = fs.readFileSync("./txt/input.txt", "utf-8");

console.log(textIp);
console.log("-----------------------------------------");

const textOut = `${textIp} and I wanted to join good product based company`;

fs.writeFileSync("./txt/input.txt", textOut);

console.log("File updated");
*/

// Topic (1.2): Non-Blocking or Asynchronous way

/* fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
		console.log(data2);
		fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
			console.log(data3);
			fs.writeFile(
				"./txt/final.txt",
				`${data2}\n${data3}`,
				"utf-8",
				(err) => {
					console.log("File has been updated");
				}
			);
		});
	});
});
console.log("Will read file"); */

// Chapter [2]: Server

// Topic (2.1): Creating server
// const server = http.createServer((req, res) => {
// 	// console.log(req.url);
// 	res.end("Hello Amit!");
// });

// server.listen(8000, "127.0.0.1", () => {
// 	console.log("Listening on port 8000");
// });

// Topic (2.2): Routing
const server = http.createServer((req, res) => {
	const pathName = req.url;
	if (pathName === "/" || pathName === "/overview") {
		res.end("This is overview Page");
	} else if (pathName === "/product") {
		res.end("List of all products");
	} else {
		res.writeHead(404, {
			"Content-type": "text/html	",
			"my-own-header": "I'm sending Meta data",
		});
		res.end(`<h1>page not found!</h1>`);
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Server is live at 8000");
});

// Topic (2.3):
