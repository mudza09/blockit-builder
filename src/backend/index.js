// Required plugins
import fs from 'fs';
import Compiler from './controllers/compiler.js';
import Server from './controllers/server.js';
import Utils from './controllers/utils.js';

// Utilities init
const utils = new Utils();

// Environment
const serverPort = JSON.parse(fs.readFileSync(utils.checkBlockitConfig(), 'utf8')).port;
export const env = {
	host: utils.getServerIp(),
	port: {
		backend: serverPort === undefined ? '3001' : serverPort.backend,
		frontend: serverPort === undefined ? '3000' : serverPort.frontend,
	},
	mode: 'DEV',
};

// Class init
const compiler = new Compiler(env);
const server = new Server(compiler, env);

const startBuild = async () => {
	utils.checkDataFolder();
	utils.logHeading();
	compiler.buildClean();
	compiler.buildHtml();
	compiler.buildCss();
	compiler.buildJs();
	await compiler.buildImg();
	compiler.buildStatic();
	utils.logMessage('completed');
};

const startBlockit = () => {
	utils.checkDataFolder();
	utils.logHeading();
	utils.hookSections();
	server.run();
};

const startApp = () => process.argv.includes('--build') ? startBuild() : startBlockit();

startApp();
