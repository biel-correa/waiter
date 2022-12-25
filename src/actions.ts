import * as vscode from "vscode";
import path = require("path");

export function startEnvironment(context: vscode.ExtensionContext) {
  const projectPath = vscode.workspace.rootPath;
  if (projectPath === undefined || shouldIgnoreProject(context, projectPath)) {
    return;
  }
  const configFilePath = path.join(projectPath, "waiter.config.json");
  vscode.workspace.openTextDocument(configFilePath).then(
    (doc) => {
      let config: ConfigFile = JSON.parse(doc.getText());
      config.tabs.forEach((tab: Tab) => {
        let terminal = vscode.window.createTerminal(tab.tabName);
        tab.commands.forEach((command: string) => {
          terminal.sendText(command);
        });
      });
    },
    async () => {
      const itens: string[] = ["Create File", "Don't ask for this project"];
      const action = await vscode.window.showErrorMessage("Config file not found", ...itens);
      switch (action) {
        case "Create File":
          createFile(configFilePath);
          break;
        case "Don't ask for this project":
          dontAskProject(context, projectPath);
          break;
      }
    }
  );
}

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

export function deleteIgnoredPaths(context: vscode.ExtensionContext) {
  const store = context.globalState;
  let paths: string[] = store.get("ignoreProjects") || [];
  if (paths.length === 0) {
    vscode.window.showInformationMessage("You haven't ignored any project yet.");
    return;
  }
  vscode.window.showQuickPick(paths, { placeHolder: "Select a project path" }).then((path) => {
    if (!path) {
      vscode.window.showInformationMessage("Didn't choose any project path.");
      return;
    }
    paths.splice(paths.indexOf(path), 1);
    store.update("ignoreProjects", paths);
    vscode.window.showInformationMessage("Project path deleted.");
  });
  return;
}

function shouldIgnoreProject(context: vscode.ExtensionContext, projectPath: string): boolean {
  if (projectPath === undefined) {
    return true;
  }
  const store = context.globalState;
  const ignoreProjects: string[] = store.get("ignoreProjects") || [];
  return ignoreProjects.includes(projectPath);
}
