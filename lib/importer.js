"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      extensions: ['html']
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

function parseMetaTag(dom, metaName) {
  if (!dom) {
    throw new Error('Invalid DOM');
  }

  const meta = dom.querySelector(`meta[name=${metaName}]`);

  if (meta) {
    const content = meta.attributes['content'];

    if (content) {
      return content.value;
    }
  }

  return false;
}

function getMetaFromHTML(html) {
  const dom = new _jsdom.JSDOM(html).window.document;
  const meta = {
    tags: [],
    createdAt: +new Date(),
    updatedAt: +new Date()
  };
  const keywords = parseMetaTag(dom, 'keywords');

  if (keywords) {
    meta.tags = keywords.split(',').map(tag => tag.trim());
  }

  const created = parseMetaTag(dom, 'created');

  if (created) {
    meta.createdAt = +new Date(created);
  }

  const updated = parseMetaTag(dom, 'updated');

  if (updated) {
    meta.updatedAt = +new Date(updated);
  }

  const titleTag = dom.querySelector('title');

  if (titleTag) {
    meta.title = titleTag.text;
  }

  return meta;
}

async function importHTMLFromFile(fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.');
  }

  if (!destBookId.startsWith('book:')) {
    throw new Error('Invalid destination notebook ID specified: ' + destBookId);
  }

  const html = _fs.default.readFileSync(fn, 'utf-8');

  const titleFromFileName = _path.default.basename(fn, _path.default.extname(fn));

  const body = (0, _inkdrop.html2markdown)(html);
  const {
    tags,
    createdAt,
    updatedAt,
    title
  } = getMetaFromHTML(html);
  console.log('bosy:', body);
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