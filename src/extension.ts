import path = require('path');
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('waiter.startEnvironment', () => {
    if (vscode.workspace.rootPath === undefined) {
      return;
    }
    let configFilePath = path.join(vscode.workspace.rootPath, 'waiter.config.json');
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
      async (error: Error) => {
        let action = await vscode.window.showErrorMessage('Could not find waiter.config.json.', 'Create File');
        if (action === 'Create File') {
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
                    tabName: 'Custom tab name',
                    commands: ["echo 'Hello World'"]
                  }
                ]
              };
              editBuilder.insert(new vscode.Position(0, 0), JSON.stringify(fileText, null, 2));
            })
            .then(() => {
              vscode.window.showInformationMessage('waiter.config.json created.');
            });
        }
      }
    );
  });

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand('waiter.startEnvironment');
}

export function deactivate() {}
