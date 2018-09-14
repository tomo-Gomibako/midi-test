const Launchpad = require("./launchpad.js")
const Lifegame = require("./lifegame.js")

const launchpad = new Launchpad()

launchpad.on((d, m) => {
	if(!m[2]) return
	console.log(String.fromCharCode(m[1]))
})
setTimeout(() => {
	console.log("reset!")
	launchpad.reset()
	launchpad.on((d, m) => {
		if(!m[2]) return
		console.log(m[1])
	})
}, 5000)

process.on("SIGINT", () => {
	launchpad.close()
	process.exit(0)
	// setTimeout(() => {
	// 	console.log("exit")
	// }, 1000)
})
