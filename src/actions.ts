import * as vscode from "vscode";

export async function createFile(configFilePath: string) {
  const wsedit = new vscode.WorkspaceEdit();
  const filePath = vscode.Uri.file(configFilePath);
  wsedit.createFile(filePath);
  await vscode.workspace.applyEdit(wsedit);
  const configFileEditor = await vscode.window.showTextDocument(filePath);
  configFileEditor
    .edit((editBuilder) => {
      const fileText = {
        tabs: [
          {
            tabName: "Custom tab name",
            commands: ["echo 'Hello World'"]
          }
        ]
      };
      editBuilder.insert(new vscode.Position(0, 0), JSON.stringify(fileText, null, 2));
    })
    .then(() => {
      vscode.window.showInformationMessage("waiter.config.json created.");
    });
}

export function dontAskProject(context: vscode.ExtensionContext, path: string) {
  const store = context.globalState;
  const currentDirectories: string[] = store.get("ignoreProjects") || [];
  currentDirectories.push(path);
  store.update("ignoreProjects", currentDirectories);
}
