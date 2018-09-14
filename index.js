const midi = require("midi")
const robot = require("robotjs")
 
const input = new midi.input()
const output = new midi.output()
 
input.getPortCount()
output.getPortCount()
console.log(` input target: ${ input.getPortName(0) }`)
console.log(`output target: ${ output.getPortName(0) }`)

// Launchpad note numbers
//	0	1	2	3	4	5	6	7
//	16	17	18	19	20	21	22	23
//	32	33	34	35	36	37	38	39
//	48	49	50	51	52	53	54	55
//	64	65	66	67	68	69	70	71
//	80	81	82	83	84	85	86	87
//	96	97	98	99	100	101	102	103
//	112	113	114	115	116	117	118	119
//
// send [1, { note number }, 127] to put the LED on
// send [1, { note number }, 0] to put the LED off


input.on("message", function(deltaTime, message) {
	if(!message[2]) return
	console.log("m:" + message + " d:" + deltaTime)
	console.log(String.fromCharCode(message[1]))
	// robot.typeString("Hello, World!")
	output.sendMessage([144, message[1], 15])
})

// input.on("message", () => {
// 	console.log(JSON.stringify(input, null, "\t"))
// })

input.openPort(0)
output.openPort(0)
output.sendMessage([176, 0, 0])
// setTimeout(() => { output.sendMessage([144, 0, 15]) }, 1000)

input.ignoreTypes(false, false, false)

process.on("SIGINT", () => {
	output.sendMessage([176, 0, 0])
	input.closePort()
	output.closePort()
	process.exit(0)
	// setTimeout(() => {
	// 	console.log("exit")
	// }, 1000)
})
