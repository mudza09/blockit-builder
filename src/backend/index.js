// Required plugins
import Compiler from './controllers/compiler.js';
import Server from './controllers/server.js';
import Utils from './controllers/utils.js';

// Environment
const env = 'DEV';

// Class init
const compiler = new Compiler(env);
const server = new Server(compiler, env);
const utils = new Utils();

const startBuild = async () => {
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
	utils.logHeading();
	server.run();
};

const startApp = () => process.argv.includes('--build') ? startBuild() : startBlockit();

startApp();
