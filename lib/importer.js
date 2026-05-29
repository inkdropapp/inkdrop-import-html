"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openImportDialog = openImportDialog;
exports.importHTMLFromMultipleFiles = importHTMLFromMultipleFiles;
exports.importHTMLFromFile = importHTMLFromFile;
const inkdrop_1 = require("inkdrop");
function openImportDialog() {
    return inkdrop.dialog.showOpenDialog({
        title: 'Open HTML file',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
    });
}
async function importHTMLFromMultipleFiles(files, destBookId) {
    try {
        for (let i = 0; i < files.length; ++i) {
            await importHTMLFromFile(files[i], destBookId);
        }
    }
    catch (e) {
        inkdrop.notifications.addError('Failed to import the HTML file', {
            detail: e instanceof Error ? e.stack : String(e),
            dismissable: true
        });
    }
}
async function importHTMLFromFile(fn, destBookId) {
    return inkdrop_1.importUtils.importHtmlFile(fn, destBookId);
}
