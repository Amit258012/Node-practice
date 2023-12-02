const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");
const replaceTemplate = require("./utils/replaceTemplate");

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
// const server = http.createServer((req, res) => {
// 	const pathName = req.url;
// 	if (pathName === "/" || pathName === "/overview") {
// 		res.end("This is overview Page");
// 	} else if (pathName === "/product") {
// 		res.end("List of all products");
// 	} else {
// 		res.writeHead(404, {
// 			"Content-type": "text/html	",
// 			"my-own-header": "I'm sending Meta data",
// 		});
// 		res.end(`<h1>page not found!</h1>`);
// 	}
// });

// server.listen(8000, "127.0.0.1", () => {
// 	console.log("Server is live at 8000");
// });

// Topic (2.3): Building Simple API
// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// const productsData = JSON.parse(data);
// const server = http.createServer((req, res) => {
// 	const pathName = req.url;
// 	if (pathName === "/" || pathName === "/overview") {
// 		res.end("This is overview Page");
// 	} else if (pathName === "/product") {
// 		res.end("List of all products");
// 	} else if (pathName === "/api") {
// 		res.writeHead(200, { "Content-type": "application/json" });
// 		res.end(data);
// 	} else {
// 		res.writeHead(404, {
// 			"Content-type": "text/html	",
// 			"my-own-header": "I'm sending Meta data",
// 		});
// 		res.end(`<h1>page not found!</h1>`);
// 	}
// });

// server.listen(8000, "127.0.0.1", () => {
// 	console.log("Server is live at 8000");
// });

// Chapter [3]: Node Farm

// Topic (3.1): Building HTML Templates and Parsing Url
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/product.html`,
	"utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productsData = JSON.parse(data);

const slugs = productsData.map((el) =>
	slugify(el.productName, { lower: true })
);
console.log(slugs);

// server
const server = http.createServer((req, res) => {
	urlObj = JSON.parse(JSON.stringify(url.parse(req.url, true)));
	const { query, pathname } = urlObj;
	// overview Page
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "content-type": "text/html" });

		const cardsHtml = productsData
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		res.end(output);
	}

	// product page
	else if (pathname === "/product") {
		const product = productsData[query.id];
		res.writeHead(200, { "content-type": "text/html" });
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
	}
	// API page
	else if (pathname === "/api") {
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);
	}
	// Page Not Found
	else {
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

// Chapter [4]: npm cmds

//  Topics [4.1]: Important commands

/* 
	Initialize node_modules : npm init

	Install all node_modules from pacakge.json : npm i

	Install npm package : npm i <package> -g(optional)

	Install npm Package only for development (dev-dependencies) : npm i <package> --save-dev

	Install specific version : npm i <package>@1.0.0

	check for outdated packages : npm outdated

	Update npm package : npm update <package>

	Delete packages : npm uninstall <package>
*/
