const fs = require("fs");

// Chapter [1]: Event-loop

// Question (1.1) : Find the order of execution?

setTimeout(() => {
	console.log("Timer 1 finished");
}, 0);
setImmediate(() => {
	console.log("Immediate 1 finished");
});

fs.readFile("text-file.txt", () => {
	console.log("I/O finished");
	console.log("---------------------");
	setTimeout(() => {
		console.log("Timer 2 finished");
	}, 0);
	setTimeout(() => {
		console.log("Timer 3 finished");
	}, 3000);
	setImmediate(() => {
		console.log("Immediate 2 finished");
	});
	process.nextTick(() => {
		console.log("Process.nextTick()");
	});
});

console.log("Hello from top-levl code");

// Answer : The output will be

/* 
1) "Hello from top-levl code"
2) "Timer 1 finished"
3) "I/O finished"
4) "Process.nextTick()"
5) "Immediate 1 finished"
6) "Immediate 2 finished"
7) "Timer 2 finished"
8) "Timer 3 finished"
*/
