const fs = require("fs")
const path = require("path")
const { getExportedNames } = require("./getExported")
const { generateReExportCode } = require("./generateReExportCode")

async function reExport({ dir, ext = "js", quiet }) {
	const dirPath = path.join(process.cwd(), dir)
	const files = await fs.promises.readdir(dirPath)

	const { count, exportStr } = await exportFunction({ dirPath, files, ext, quiet })

	if (count === 0) {
		console.log(`Nothing found as exports in dir "${dir}" for .${ext} extension`)
		return
	}

	const indexPath = path.join(dirPath, `index.${ext}`)
	await fs.promises.writeFile(indexPath, exportStr)

	const noun = count === 1 ? "file" : "files"
	console.log(`Created "${dir}/index.${ext}" file with exports from ${count} ${noun} in "${dir}" dir`)
}

async function exportFunction({ dirPath, files, ext, quiet }) {
	const exports = {}
	for (const file of files) {
		const filePath = path.join(dirPath, file)
		if (filePath === path.join(dirPath, `index.${ext}`)) continue
		const stats = await fs.promises.stat(filePath)
		if (stats.isFile() && path.extname(file) === `.${ext}`) {
			const moduleExports = getExportedNames(filePath)
			exports[path.parse(file).name] = moduleExports
		}
	}

	let count = 0

	let exportStr = ""
	if (!quiet) console.log(`Re-exported:\n`)
	Object.entries(exports).forEach(([key, arr]) => {
		count++
		exportStr += generateReExportCode(key, arr, ext)
		if (!quiet) console.log(exportStr + "\n")
	})

	return { count, exportStr }
}

module.exports = { reExport }
