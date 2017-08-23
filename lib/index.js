'use strict';

var _selectBookDialog = require('./select-book-dialog');

var _selectBookDialog2 = _interopRequireDefault(_selectBookDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  activate() {
    inkdrop.components.registerClass(_selectBookDialog2.default);
    inkdrop.layouts.addComponentToLayout('modals', 'SelectBookDialog');
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout('modals', 'SelectBookDialog');
    inkdrop.components.deleteClass(_selectBookDialog2.default);
  }
};