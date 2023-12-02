const EventEmitter = require("events");
const http = require("http");

// Chapter 1: Event Driven Architecture

// const myEmitter = new EventEmitter();

// myEmitter.on("newSale", () => {
// 	console.log("There is a sale!");
// });
// myEmitter.on("newSale", (offer) => {
// 	console.log(`with ${offer}% off`);
// });

// myEmitter.emit("newSale", 20);

//? Best Practices

// class Sales extends EventEmitter {
// 	constructor() {
// 		super();
// 	}
// }
// const myEmitter = new Sales();

// myEmitter.on("newSale", () => {
// 	console.log("There is a sale!");
// });
// myEmitter.on("newSale", (offer) => {
// 	console.log(`with ${offer}% off`);
// });

// myEmitter.emit("newSale", 20);

// Chapter 2: Auto emitter by brower

const server = http.createServer();

server.on("request", (req, res) => {
	console.log("req recieved");
	res.end("req recieved");
});
server.on("request", (req, res) => {
	console.log("Another req recieved");
});
server.on("close", () => {
	console.log("closed");
});
server.listen(8000, "127.0.0.1", () => console.log("listening on port 8000"));
