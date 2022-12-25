import * as vscode from "vscode";
import { startEnvironment, deleteIgnoredPaths } from "./actions";

export function activate(context: vscode.ExtensionContext) {
  generateCommands(context);

  vscode.commands.executeCommand("waiter.startEnvironment");
}

function generateCommands(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("waiter.startEnvironment", () => startEnvironment(context));
  vscode.commands.registerCommand("waiter.deleteIgnoredPaths", () => deleteIgnoredPaths(context));
}

export function deactivate() {}
