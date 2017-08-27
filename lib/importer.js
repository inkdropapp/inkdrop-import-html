'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openImportDialog = openImportDialog;
exports.importHTMLFromMultipleFiles = importHTMLFromMultipleFiles;
exports.importHTMLFromFile = importHTMLFromFile;
exports.convertToMarkdown = convertToMarkdown;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _electron = require('electron');

var _toMarkdown = require('to-markdown');

var _toMarkdown2 = _interopRequireDefault(_toMarkdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { dialog } = _electron.remote;
const { Note } = inkdrop.models;

function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['multiSelections'],
    filters: [{ name: 'HTML Files', extensions: ['html'] }]
  });
}

async function importHTMLFromMultipleFiles(files, destBookId) {
  try {
    for (let i = 0; i < files.length; ++i) {
      await importHTMLFromFile(files[i], destBookId);
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the HTML file', { detail: e.stack, dismissable: true });
  }
}

async function importHTMLFromFile(fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.');
  }
  const html = _fs2.default.readFileSync(fn, 'utf-8');
  const title = _path2.default.basename(fn, _path2.default.extname(fn));
  const body = convertToMarkdown(html);
  const note = new Note({ title, body });
  note.bookId = destBookId;
  await note.save();
}

function convertToMarkdown(html) {
  const md = (0, _toMarkdown2.default)(html, {
    gfm: true,
    converters: [{
      filter: ['div', 'p'],
      replacement(innerHTML) {
        return '\n' + innerHTML + '\n';
      }
    }, {
      filter: ['span'],
      replacement(innerHTML) {
        return innerHTML;
      }
    }, {
      filter: ['img'],
      replacement(innerHTML, node) {
        return ''; // not supported, yet
      }
    }]
  });
  return md;
}