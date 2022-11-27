// required plugins
import Methods from './methods.mjs'
import Sockets from './sockets.mjs'
import browserSync from 'browser-sync'
import historyApiFallback from 'connect-history-api-fallback'

export default class Server {
    constructor(compiler) {
        this.frontEnd = browserSync.create()
        this.backEnd = browserSync.create()
        this.compiler = compiler
    }

    serverInit = () => {
        this.frontEnd.init({
            port: 3000,
            ui: false,
            notify: false,
            watch: true,
            open: false,
            server: '../../dist',
            cors: true,
            reloadDebounce: 800,
            callbacks: {
                ready: (err, bs) => {
                    bs.addMiddleware('*', (req, res) => {
                        res.writeHead(302, {location: '/404.html'})
                        res.end('Redirecting!')
                    })
                    this.compiler.blockitWatch()
                }
            }
        })

        this.backEnd.init({
            port: 3001,
            ui: false,
            notify: false,
            watch: true,
            startPath: 'dashboard',
            server: 'views',
            middleware: [ historyApiFallback() ],
            snippetOptions: { async: false },
            logPrefix: 'Blockit',
            logLevel: 'silent',
            callbacks: {
                ready: (err, bs) => {
                    bs.io.sockets.on('connection', socket => {
                        // run blockit methods
                        const blockit = new Methods(socket)
                        const connect = new Sockets(blockit)

                        // run blockit sockets
                        connect.dashboardSocket(socket)
                        connect.pagesSocket(socket)
                        connect.navigationSocket(socket)
                        connect.postsSocket(socket)
                        connect.componentsSocket(socket)
                        connect.settingsSocket(socket)
                    })
                }
            }
        })
    }
}