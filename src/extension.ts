// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import path from "path"
import fs from "fs"
import { exec } from "child_process"

// "minimock-helper": {
//     "mockFolder": "mocks",
//     "mockFolderMap": {
//       "cart": "cart/internal/minimock",
//     }
//   }

function toAbsolutePath(relativePath?: string): string {
  if (!relativePath) {
    return ""
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    return ""
  }
  return path.join(workspaceFolder.uri.fsPath, relativePath)
}

async function getOutputFolder(filePath: string) {
  const config = vscode.workspace.getConfiguration("minimock-helper")

  if (config.mockFolder) {
    return toAbsolutePath(config.mockFolder)
  }

  if (config.mockFolderMap) {
    for (let key in config.mockFolderMap) {
      if (filePath.startsWith(key)) {
        return toAbsolutePath(config.mockFolderMap[key])
      }
    }
  }

  const res = await vscode.window.showInputBox({
    prompt: `Output folder`,
    // validateInput: (value) => {
    //   return value.trim() === '' ? 'Поле не может быть пустым' : null;
    // }
  })

  return toAbsolutePath(res)
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "minimock-helper.generateMock",
    async (uri: vscode.Uri) => {
      let defaultInterfaceName = ""

      if (!uri) {
        const editor = vscode.window.activeTextEditor
        const editorUri = editor?.document.uri
        if (!editor || !editorUri || !editorUri.fsPath.endsWith(".go")) {
          vscode.window.showErrorMessage("Please select a .go file.")
          return
        }

        uri = editor.document.uri
        const selection = editor.selection
        defaultInterfaceName = editor.document.getText(selection)
      }

      if (!uri) {
        return
      }

      const folderPath = path.dirname(uri.fsPath)

      let interfaceName = await vscode.window.showInputBox({
        prompt: `Interface name`,
        placeHolder: defaultInterfaceName,
        // validateInput: (value) => {
        //   return value.trim() === '' ? 'Поле не может быть пустым' : null;
        // }
      })

      if (!interfaceName) {
        interfaceName = defaultInterfaceName
      }

      if (!interfaceName) {
        vscode.window.showErrorMessage("Interface name is required.")
        return
      }

      const relativePath = vscode.workspace.asRelativePath(folderPath, false)
      const outputFolder = await getOutputFolder(relativePath)

      try {
        fs.mkdirSync(outputFolder, { recursive: true })

        let cmd = `minimock -o ${outputFolder} -s "_mock.go" -i ${interfaceName}`

        exec(cmd, { cwd: folderPath }, (err, stdout) => {
          if (err) {
            vscode.window.showErrorMessage(err.message)
          }
          console.log(stdout)
        })
      } catch (err) {
        vscode.window.showErrorMessage("Can not create folder")
      }
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
