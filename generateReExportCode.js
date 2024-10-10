function generateReExportCode(filename, exportedNames, extension, cjs) {
	let exportDefaultStatement = ""
	let exported = []
	let exportString = ""
	let ext = ["js", "mjs"].includes(extension) && !cjs ? `.${extension}` : ""

	if (exportedNames.includes("default") && exportedNames.includes(filename)) {
		return `export * as ${filename} from './${filename}${ext}'\n`
	}

	if (!exportedNames.includes("default") && !exportedNames.includes(filename) && exportedNames.length > 1) {
		return `export * as ${filename} from './${filename}${ext}'\n`
	}

	exportedNames.forEach((exportedName) => {
		if (exportedName === "default") {
			exportDefaultStatement = `export { default as ${filename} } from './${filename}${ext}'`
		} else {
			exported.push(exportedName)
		}
	})

	exportString = exportDefaultStatement
	if (exportString !== "" && exported.length > 0) exportString += "\n"
	if (exported.length > 0) exportString += `export { ${exported.join(", ")} } from './${filename}${ext}'`
	if (exportString !== "") exportString += "\n"

	return exportString
}

function generateReExportCodeCJS(filename, exportedNames, extension, cjs) {
	let exportDefaultStatement = ""
	let exported = []
	let exportString = ""
	let ext = ""

	if (exportedNames.includes("default") && exportedNames.includes(filename)) {
		return `module.exports.${filename} = require('./${filename}${ext}');\n`
	}

	if (!exportedNames.includes("default") && !exportedNames.includes(filename) && exportedNames.length > 1) {
		return `module.exports.${filename} = require('./${filename}${ext}');\n`
	}

	exportedNames.forEach((exportedName) => {
		if (exportedName === "default") {
			exportDefaultStatement = `module.exports.${filename} = require('./${filename}${ext}').default`
		} else {
			exported.push(exportedName)
		}
	})

	exportString = exportDefaultStatement
	if (exportString !== "" && exported.length > 0) exportString += ";\n"
	if (exported.length > 0) {
		exportString += `const { ${exported.join(", ")} } = require('./${filename}${ext}');\n`
		exportString += `module.exports = { `
		if (exportDefaultStatement) {
			exportString += `...module.exports, `
		}
		exportString += `${exported.join(", ")} }`
	}
	if (exportString !== "") exportString += ";\n"

	return exportString
}
module.exports = { generateReExportCode, generateReExportCodeCJS }
