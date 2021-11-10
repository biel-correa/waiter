import * as vscode from 'vscode';

interface ConfigFile {
	tabs: Tab[]
}

interface Tab {
	tabName: string
	commands: string[]
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('waiter.startEnvironment', () => {
		//search for file
		let configFilePath = vscode.workspace.rootPath + '\\waiter.config.json';
		vscode.workspace.openTextDocument(configFilePath).then(doc => {
			//load config
			let config: ConfigFile = JSON.parse(doc.getText());
			config.tabs.forEach((tab: Tab) => {
				let terminal = vscode.window.createTerminal(tab.tabName);
				tab.commands.forEach((command: string) => {
					terminal.sendText(command);
				});
			});
		}, async (error: Error) => {
			//create file when it doesn't exist
			let action = await vscode.window.showErrorMessage("Could not find waiter.config.json.", 'Create File');
			if (action === 'Create File') {
				var setting: vscode.Uri = vscode.Uri.parse("untitled:" + configFilePath);
				vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
					vscode.window.showTextDocument(a, 1, false).then(e => {
						e.edit(edit => {
							edit.insert(new vscode.Position(0, 0), '{\n\t"tabs": [\n\t\t{\n\t\t\t"tabName": "Custom tab name",\n\t\t\t"commands" : [\n\t\t\t\t"echo \'Hello world\'"\n\t\t\t]\n\t\t}\n\t]\n}');
						});
					});
				});
			}
		});
	});

	context.subscriptions.push(disposable);
	vscode.commands.executeCommand('waiter.startEnvironment');
}

// this method is called when your extension is deactivated
export function deactivate() {}
