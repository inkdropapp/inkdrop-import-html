"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHTMLWizardDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const env_js_1 = require("./env.js");
const import_wizard_notebook_step_js_1 = require("./import-wizard-notebook-step.js");
const import_wizard_progress_step_js_1 = require("./import-wizard-progress-step.js");
const ImportHTMLWizardDialog = ({ modal, step, status, selectedBookId, importingFilePath, importError, onSelectNotebook, onImport }) => {
    const Dialog = (0, env_js_1.getEnv)().components.classes.Dialog;
    return ((0, jsx_runtime_1.jsxs)(Dialog, { ...modal.state, large: true, onBackdropClick: modal.close, onEscKeyDown: modal.close, className: `import-html-wizard-dialog import-html-wizard-dialog--${step}`, children: [(0, jsx_runtime_1.jsx)(Dialog.Title, { children: "Import Notes from HTML" }), step === 'notebook' && ((0, jsx_runtime_1.jsx)(import_wizard_notebook_step_js_1.ImportWizardNotebookStep, { selectedBookId: selectedBookId, onSelectNotebook: onSelectNotebook, onCancel: modal.close, onImport: onImport })), step === 'progress' && ((0, jsx_runtime_1.jsx)(import_wizard_progress_step_js_1.ImportWizardProgressStep, { status: status, importingFilePath: importingFilePath, importError: importError, onClose: modal.close }))] }));
};
exports.ImportHTMLWizardDialog = ImportHTMLWizardDialog;
