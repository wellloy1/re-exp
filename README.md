# re-exp

[npm](https://img.shields.io/npm/v/re-exp)
[node](https://img.shields.io/node/v/re-exp)
[license](https://img.shields.io/npm/l/re-exp)

## Overview

`re-exp` is a command-line tool designed to simplify the project structuring process by automatically creating index files that re-export variables and functions from modules within a directory. This is particularly useful for JavaScript and TypeScript projects where maintaining clean and organized exports is crucial.
The tool supports different file extensions including `.js`, `.ts`, `.jsx`, and `.tsx`, making it versatile enough for a variety of frontend and backend development setups.

## Features

- **Automatic Index Creation**: Seamlessly generate an index file for your modules.
- **Re-Export All**: Automatically re-export all named exports from files in a directory.
- **Flexible Configuration**: Specify directory and file extensions through command-line arguments.
- **Extensive Support for File Types**: Works with JavaScript and TypeScript files including JS, TS, JSX, and TSX extensions.
- **Silent Mode**: Option to run the tool quietly without console output.

## Installation

To install `re-exp`, you'll need [Node.js](https://nodejs.org/) installed on your system. It is recommended to install `re-exp` globally to have easy access via command line:

```bash
npm install -g re-exp
```

## Usage

To use `re-exp`, simply navigate to the directory for which you want to create an index file and execute the command:
```bash
re-exp -d [directory_path] -e [extension]
```

### Options
- `-d, --dir`: **Required**. Specifies the directory to process.
- `-e, --ext`: **Required**. Specifies the file extension to consider (e.g., `js`, `ts`, `jsx`, `tsx`).
- `-q, --quiet`: Runs the command in quiet mode with no console output.

### Example

Suppose you have a directory `src/components` with various `.tsx` files. To create an index file with re-exports, you would run:

```bash
re-exp --dir ./src/components --ext tsx
```

If you prefer less verbose output, you can add the silent option:
```bash
re-exp --dir ./src/components --ext tsx --quiet
```

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests via [GitHub](https://github.com/wellloy1/re-exp).
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
## Support
For any inquiries or issues, please contact the author Max Shane at [wellloy1@gmail.com](mailto:wellloy1@gmail.com). 
Alternatively, you can open issues on the [GitHub Issues](https://github.com/wellloy1/re-exp/issues) page.

