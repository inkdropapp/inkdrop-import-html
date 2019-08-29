"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openImportDialog = openImportDialog;
exports.importHTMLFromMultipleFiles = importHTMLFromMultipleFiles;
exports.importHTMLFromFile = importHTMLFromFile;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _electron = require("electron");

var _inkdrop = require("inkdrop");

var _jsdom = require("jsdom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

const {
  dialog
} = _electron.remote;
const {
  Note
} = _inkdrop.models;

function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
    filters: [{
      name: 'HTML Files',
      extensions: ['html', 'htm']
    }]
  });
}

async function importHTMLFromMultipleFiles(files, destBookId) {
  try {
    for (let i = 0; i < files.length; ++i) {
      await importHTMLFromFile(files[i], destBookId);
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the HTML file', {
      detail: e.stack,
      dismissable: true
    });
  }
}

async function importHTMLFromFile(fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.');
  }

  if (!destBookId.startsWith('book:')) {
    throw new Error('Invalid destination notebook ID specified: ' + destBookId);
  }

  const html = _fs["default"].readFileSync(fn, 'utf-8');

  const titleFromFileName = _path["default"].basename(fn, _path["default"].extname(fn));

  const body = (0, _inkdrop.html2markdown)(html);
  const {
    tags,
    createdAt,
    updatedAt,
    title
  } = (0, _inkdrop.extractMetaFromHtml)(html);
  const note = new Note({
    title: title || titleFromFileName,
    body,
    tags,
    createdAt,
    updatedAt
  });
  note.bookId = destBookId;
  await note.save();
}