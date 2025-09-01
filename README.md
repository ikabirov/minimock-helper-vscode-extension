# Minimock Helper VS Code Extension

Minimock Helper is an extension for Visual Studio Code that adds the ability to quickly generate mocks using [minimock](https://github.com/gojuno/minimock) from the context menu of .go files.

## Features

- Generate mocks for specified interface from selected file via the context menu.
- Seamless integration with minimock for Go projects.
- Save time when writing tests.

## How to Use

### Option 1: Context Menu

1. Right-click on the desired .go file in your project.
2. In the context menu, select **"minimock: Generate mock file"**.
3. The extension will generate mocks for the specified interface from the selected file.

### Option 2: Command Palette (Cmd+P)

1. Open the .go file you want to generate mocks for in the editor.
2. Select the interface name in the editor (or place the cursor on it).
3. Press `Cmd+P` (or `Ctrl+P` on Windows/Linux), then type and select **"Minimock: Generate mock file"**.
4. By default, the extension will use the selected text in the editor as the interface name for mock generation.
5. The extension will generate mocks for the interface in the currently open file.

## Requirements

- [minimock](https://github.com/gojuno/minimock) installed on your system (`go install github.com/gojuno/minimock/v3/cmd/minimock@latest`).
- Go project.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions section.
3. Find "Minimock Helper" and install it.

## Settings

The extension supports two options for configuring the output folder for generated mocks:

### 1. `mockFolder`

Use this option if you want all mocks to be generated in a single output folder for the entire project.

**Example:**

```json
{
  "minimock-helper.mockFolder": "test/mocks"
}
```

### 2. `mockFolderMap`

Use this option if you want to specify different output folders depending on the path to the file. This is useful for monorepos or projects with multiple modules.

**Example:**

```json
{
  "minimock-helper.mockFolderMap": {
    "pkg/serviceA": "test/serviceA/mocks",
    "pkg/serviceB": "test/serviceB/mocks"
  }
}
```

If the file path starts with a key in `mockFolderMap`, the corresponding output folder will be used. Otherwise, the value from `mockFolder` will be used as a fallback.

You can configure these options in your VS Code `settings.json`.

## License

MIT
