const Launchpad = require("./launchpad.js")
const Lifegame = require("./lifegame.js")

// const launchpad = new Launchpad()
const lifegame = new Lifegame(8, 8)

lifegame.setRandom()

// lifegame.field[5][5].alive = true
// lifegame.field[6][5].alive = true
// lifegame.field[7][5].alive = true
// lifegame.field[5][6].alive = true
// lifegame.field[6][7].alive = true

console.log(lifegame.states + "\n")
setInterval(() => {
	lifegame.update()
	console.log(lifegame.states + "\n")
}, 500)

// console.log(lifegame.field.map(v => v.map(w => w.around.reduce((p, c) => (c ? 1 : 0) + p, 0)).join(", ")).join("\n"))
process.on("SIGINT", () => {
	launchpad.close()
	process.exit(0)
	// setTimeout(() => {
	// 	console.log("exit")
	// }, 1000)
})
