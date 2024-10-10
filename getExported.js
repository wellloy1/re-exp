const fs = require("fs")
const recast = require("recast")
const babelParser = require("@babel/parser")

function getExportedNames(filepath) {
	const fileContent = fs.readFileSync(filepath, "utf-8")

	const ast = recast.parse(fileContent, {
		parser: {
			parse(source) {
				return babelParser.parse(source, {
					sourceType: "module",
					plugins: ["jsx", "typescript", "classProperties"],
				})
			},
		},
	})

	const exportedNames = []

	recast.visit(ast, {
		visitExportNamedDeclaration(path) {
			const declaration = path.node.declaration
			if (declaration) {
				if (declaration.declarations) {
					declaration.declarations.forEach((decl) => {
						if (decl.id && decl.id.name) {
							exportedNames.push(decl.id.name)
						}
					})
				} else if (declaration.id && declaration.id.name) {
					exportedNames.push(declaration.id.name)
				}
			}

			if (path.node.specifiers) {
				path.node.specifiers.forEach((specifier) => {
					exportedNames.push(specifier.exported.name)
				})
			}

			this.traverse(path)
		},
		visitExportDefaultDeclaration(path) {
			exportedNames.push("default")
			this.traverse(path)
		},
		visitExportAllDeclaration(path) {
			exportedNames.push("*: " + path.node.source.value)
			this.traverse(path)
		},
	})

	return exportedNames
}

module.exports = { getExportedNames }
