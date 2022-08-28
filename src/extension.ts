import path = require("path");
import * as vscode from "vscode";
import { createFile, deleteIgnoredPaths, dontAskProject } from "./actions";

export function activate(context: vscode.ExtensionContext) {
  generateCommands(context);
  let disposable = vscode.commands.registerCommand("waiter.startEnvironment", () => {
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
  });

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("waiter.startEnvironment");
}

function shouldIgnoreProject(context: vscode.ExtensionContext, projectPath: string): boolean {
  if (projectPath === undefined) {
    return true;
  }
  const store = context.globalState;
  const ignoreProjects: string[] = store.get("ignoreProjects") || [];
  return ignoreProjects.includes(projectPath);
}

function generateCommands(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("waiter.deleteIgnoredPaths", () => deleteIgnoredPaths(context));
}

export function deactivate() {}
