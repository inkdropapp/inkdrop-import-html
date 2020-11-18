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

var _lodash = _interopRequireDefault(require("lodash.escaperegexp"));

var _inkdropImportUtils = require("inkdrop-import-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  dialog
} = _electron.remote;
const {
  Note,
  File: IDFile
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
/**
 * Import images from given Markdown data with the specified base path
 *
 * @param {string} md - The Markdown content
 * @param {string} basePath - The base path to the Markdown file
 * @returns {string} The modified Markdown with attachment images
 */


async function importImages(md, basePath) {
  const images = (0, _inkdropImportUtils.extractImages)(md);

  for (const image of images) {
    const imagePath = _path.default.resolve(basePath, image.url);

    if (_fs.default.existsSync(imagePath)) {
      try {
        const imageData = _electron.nativeImage.createFromPath(imagePath);

        const fileTitle = _path.default.basename(imagePath);

        const file = await IDFile.createFromNativeImage(imageData, fileTitle);
        const imageRegex = new RegExp((0, _lodash.default)(`![${image.alt}](${image.url})`), 'g');
        md = md.replace(imageRegex, `![${image.alt}](inkdrop://${file._id})`);
      } catch (e) {
        inkdrop.notifications.addError('Failed to import an image', {
          detail: `${imagePath}: ${e.message}`,
          dismissable: true
        });
      }
    }
  }

  return md;
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
  } = (0, _inkdrop.extractMetaFromHtml)(html);

  const basePath = _path.default.dirname(fn);

  const bodyWithImages = await importImages(body, basePath);
  const note = new Note({
    title: title || titleFromFileName,
    body: bodyWithImages,
    tags,
    createdAt,
    updatedAt
  });
  note.bookId = destBookId;
  await note.save();
}