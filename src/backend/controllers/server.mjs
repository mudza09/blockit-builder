// method and socket controllers
import MethodLibrary from './methods.mjs'
import SocketLibrary from './sockets.mjs'

// browsersync
import browserSync from 'browser-sync'
import historyApiFallback from 'connect-history-api-fallback'

// compiler controllers
import * as compiler from './compiler.mjs'

const frontEnd = browserSync.create()
const backEnd = browserSync.create()

// browsersync init
const runBlockit = () => {
    frontEnd.init({
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
                compiler.blockitWatch()
            }
        }
    })

    backEnd.init({
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
                    const blockit = new MethodLibrary(socket)
                    const connect = new SocketLibrary(blockit)

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

export default runBlockit;