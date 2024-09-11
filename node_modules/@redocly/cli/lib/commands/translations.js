"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTranslations = void 0;
const child_process_1 = require("child_process");
const handleTranslations = async ({ argv }) => {
    process.stdout.write(`\nLaunching translate using NPX.\n\n`);
    const npxExecutableName = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    (0, child_process_1.spawn)(npxExecutableName, ['-y', '@redocly/realm', 'translate', argv.locale, `-d=${argv['project-dir']}`], { stdio: 'inherit' });
};
exports.handleTranslations = handleTranslations;
