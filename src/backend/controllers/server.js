// Required plugins
import Methods from './methods.js';
import Sockets from './sockets.js';
import browserSync from 'browser-sync';

export default class Server {
	constructor(compiler, env) {
		this.preview = browserSync.create();
		this.builder = browserSync.create();
		this.compiler = compiler;
		this.env = env;
	}

	run = () => {
		this.preview.init({
			port: this.env.port.frontend,
			ui: false,
			notify: false,
			open: false,
			server: './dist',
			callbacks: {
				ready: (err, bs) => {
					bs.addMiddleware('*', (req, res) => {
						res.writeHead(302, {location: '/404.html'});
						res.end('Redirecting!');
					});
					this.compiler.previewWatch(this.preview);
				},
			},
		});

		this.builder.init({
			port: this.env.port.backend,
			ui: false,
			notify: false,
			server: './node_modules/blockit-builder',
			single: true,
			snippetOptions: {
				rule: {
					match: /<\/head>/i,
					fn(snippet, match) {
						const {src} = /script.src = '(?<src>[^']+)'/u.exec(snippet).groups;
						return `<script id="__bs_script__">//<![CDATA[ \n document.write("<script src='\\${src}'><\\/script>".replace("HOST", location.hostname)); \n //]]></script>${match}`;
					},
				},
			},
			logLevel: 'silent',
			callbacks: {
				ready: (err, bs) => {
					bs.io.sockets.on('connection', socket => {
						// Run blockit methods
						const blockit = new Methods(socket);
						const connect = new Sockets(blockit);

						// Run blockit sockets
						connect.dashboardSocket(socket);
						connect.pagesSocket(socket);
						connect.navigationSocket(socket);
						connect.postsSocket(socket);
						connect.componentsSocket(socket);
						connect.settingsSocket(socket);
					});
					this.compiler.builderWatch(this.builder, this.env);
				},
			},
		});
	};
}
