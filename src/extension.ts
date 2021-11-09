import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('Waiter is up and running!');

	let disposable = vscode.commands.registerCommand('waiter.startEnvironment', () => {
		const terminal = vscode.window.createTerminal('Waiter');
		terminal.sendText("echo 'New terminal created'");
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
