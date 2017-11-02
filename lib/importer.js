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

var _jsdom = require('jsdom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { dialog } = _electron.remote;
const { Note } = inkdrop.models;

function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
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
  const dom = (0, _jsdom.jsdom)(html);
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
  const html = _fs2.default.readFileSync(fn, 'utf-8');
  const titleFromFileName = _path2.default.basename(fn, _path2.default.extname(fn));
  const body = convertToMarkdown(html);
  const { tags, createdAt, updatedAt, title } = getMetaFromHTML(html);

  const note = new Note({ title: title || titleFromFileName, body, tags, createdAt, updatedAt });
  note.bookId = destBookId;
  await note.save();
}

function convertToMarkdown(html) {
  const md = (0, _toMarkdown2.default)(html, {
    gfm: true,
    converters: [{
      filter: ['div', 'p', 'dt', 'dd', 'summary'],
      replacement(innerHTML) {
        return '\n' + innerHTML + '\n';
      }
    }, {
      filter: ['font', 'span', 'pre', 'article', 'section', 'nav', 'button', 'main', 'footer', 'header', 'aside', 'details', 'u', 'samp', 'var', 'kbd', 'legend', 'mark', 'output', 'small', 'sub', 'sup'],
      replacement(innerHTML) {
        return innerHTML;
      }
    }, {
      filter: ['input', 'form', 'iframe', 'canvas', 'embed', 'select', 'rt', 'wbr'],
      replacement(innerHTML) {
        return '';
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