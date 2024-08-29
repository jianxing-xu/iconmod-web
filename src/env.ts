export const isVSCode = location.protocol === 'vscode-webview:'

export const basePath = isVSCode ? window.baseURI : '/'