"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEject = void 0;
const child_process_1 = require("child_process");
const handleEject = async ({ argv }) => {
    process.stdout.write(`\nLaunching eject using NPX.\n\n`);
    const npxExecutableName = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    (0, child_process_1.spawn)(npxExecutableName, [
        '-y',
        '@redocly/realm',
        'eject',
        `${argv.type}`,
        `${argv.path ?? ''}`,
        `-d=${argv['project-dir']}`,
        argv.force ? `--force=${argv.force}` : '',
    ], { stdio: 'inherit' });
};
exports.handleEject = handleEject;
