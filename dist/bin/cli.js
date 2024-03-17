#!/usr/bin/env node

import {execSync} from 'child_process';
import path from 'path';

const runCommand = command => {
	try {
		execSync(`${command}`, {stdio: 'inherit'});
		return true;
	} catch (err) {
		console.error(`Failed to execute ${command}`, err);
		return false;
	}
};

const dirName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/mudza09/blockit-starter ${dirName}`;
const npmInstallCommand = `cd ${dirName} && npm install && rm -rf .git* bin`;

// Create new blockit starter
console.log(`Creating a new Blockit starter in \x1b[36m${path.resolve(process.cwd(), dirName)}\x1b[0m\n`);
const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) {
	process.exit(1);
}

// Install dependencies
console.log(`\nInstalling dependencies. This might take a couple of minutes`);
const installedDeps = runCommand(npmInstallCommand);

if (!installedDeps) {
	process.exit(-1);
}

// Inform success and commands to run blockit builder or build
console.log(`\nSuccess! '${dirName}' Created at \x1b[36m${path.resolve(process.cwd(), dirName)}\x1b[0m`);
console.log(`Inside '${dirName}' directory, you can run several commands:\n`);
console.log(`  \x1b[35mnpm run blockit\x1b[0m`);
console.log(`    Starts the Blockit builder\n`);
console.log(`  \x1b[35mnpm run build\x1b[0m`);
console.log(`    Bundles the site into static files for production`);
console.log(`\nWe suggest that you begin by typing:\n`);
console.log(`  \x1b[35mcd\x1b[0m ${dirName}`);
console.log(`  \x1b[35mnpm run blockit\x1b[0m`);
console.log(`\nEnjoy it!\n`);