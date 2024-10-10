#!/usr/bin/env node
const { reExport } = require("./re-export.js")

const args = process.argv.slice(2)

const options = {
	"-d": undefined,
	"-e": undefined,
	"-q": undefined,
	"-c": undefined,
	"--dir": undefined,
	"--ext": undefined,
	"--cjs": undefined,
	"--quiet": undefined,
}

let key

for (let i = 0; i < args.length; i++) {
	const arg = args[i]
	if (key) {
		options[key] = arg
		key = undefined
	} else {
		if (Object.hasOwn(options, arg)) {
			if (arg === "-q" || arg === "--quiet") options[arg] = true
			if (arg === "-c" || arg === "--cjs") options[arg] = true
			else key = arg
		} else throw Error(`Option "${arg}" not found.\n`)
	}
}

reExport({
	dir: options["-d"] ?? options["--dir"],
	ext: options["-e"] ?? options["--ext"],
	ext: options["-c"] ?? options["--cjs"],
	quiet: options["-q"] ?? options["--quiet"],
})
