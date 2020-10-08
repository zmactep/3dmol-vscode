import { readFile } from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const indexPath = path.join(context.extensionPath, "web", "index.html");
	const errorPath = path.join(context.extensionPath, "web", "error.html");
	const js3dmolPath = path.join(context.extensionPath, "node_modules", "3dmol", "build", "3Dmol-min.js");

	const indexView = fs.readFileSync(indexPath, 'utf-8');
	const errorView = fs.readFileSync(errorPath, 'utf-8');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('3dmol-vscode.show', () => {
		const panel = vscode.window.createWebviewPanel("3dmol", "3DMol View", 
													   vscode.ViewColumn.Three,
													   {
														   enableScripts: true
													   });
		const pdbUri = panel.webview.asWebviewUri(vscode.window.activeTextEditor?.document.uri!);
		const js3dmolUri = panel.webview.asWebviewUri(vscode.Uri.file(js3dmolPath));

		panel.webview.html = get3DMolWebviewContent(pdbUri, js3dmolUri);
	});

	context.subscriptions.push(disposable);

	function get3DMolWebviewContent(pdbUri: vscode.Uri, js3dmolUri: vscode.Uri) {
		const format = pdbUri.path.split(".").pop();
		console.log(format);

		switch (format) {
			case "pdb":
				return indexView.replace("${js3dmolUri}", js3dmolUri.toString()).replace("${pdbUri}", pdbUri.toString());
			default:
				return errorView.replace("${errorMsg}", "wrong file format");
		}
	}
}

export function deactivate() {}
