"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openImportDialog = openImportDialog;
exports.importHTMLFromMultipleFiles = importHTMLFromMultipleFiles;
exports.importHTMLFromFile = importHTMLFromFile;
const inkdrop_1 = require("inkdrop");
const env_js_1 = require("./env.js");
function openImportDialog() {
    return (0, env_js_1.getEnv)().dialog.showOpenDialog({
        title: 'Open HTML file',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
    });
}
async function importHTMLFromMultipleFiles(files, destBookId, progressCallback) {
    for (const fp of files) {
        progressCallback?.(fp);
        await importHTMLFromFile(fp, destBookId);
    }
}
async function importHTMLFromFile(fn, destBookId) {
    return inkdrop_1.importUtils.importHtmlFile(fn, destBookId);
}
