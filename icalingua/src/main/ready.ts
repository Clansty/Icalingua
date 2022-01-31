import {app, protocol} from 'electron'
import {destroyWindow, showWindow} from './utils/windowManager'
import {createBot, logOut} from './ipc/botAndStorage'
import repl from 'repl'

require('./utils/configManager')
require('./ipc/system')
require('./ipc/botAndStorage')
require('./ipc/openImage')
protocol.registerBufferProtocol('jsbridge', () => {
})
if (process.env.NODE_ENV === 'development')
    protocol.registerFileProtocol('file', (request, cb) => {
        const pathname = request.url.replace('file:///', '')
        cb(pathname)
    })
createBot(null)
app.on('window-all-closed', () => {
    logOut()
    setTimeout(() => {
        app.quit()
    }, 1000)
})

app.on('second-instance', showWindow)

app.on('before-quit', () => {
    logOut()
    destroyWindow()
})

app.on('will-quit', () => {
    logOut()
    destroyWindow()
})

repl.start('icalingua> ')
