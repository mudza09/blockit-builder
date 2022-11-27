import ShortUniqueId from 'short-unique-id'

export default function uploadImage(options) {
    const element = options.inputEvent.closest(`.${options.selector}`).querySelector('img')
    const buffer = options.inputEvent.files[0]

    // id generator
    const uid = new ShortUniqueId({ length: 6 })

    let typeFile = ''

    if(options.favicon == true) {
        switch(buffer.type) {
            case 'image/x-icon':
                typeFile = 'ico'
                uploader()
                break
        }
    } else if(options.touchIcon == true) {
        switch(buffer.type) {
            case 'image/png':
                typeFile = 'png'
                uploader()
                break
        }
    } else {
        switch(buffer.type) {
            case 'image/jpeg':
                typeFile = 'jpg'
                uploader()
                break
            case 'image/png':
                typeFile = 'png'
                uploader()
                break
            case 'image/gif':
                typeFile = 'gif'
                uploader()
                break
            case 'image/svg+xml':
                typeFile = 'svg'
                uploader()
                break
        }
    }

    function uploader() {
        const nameFile = `${options.fileName}-${uid()}.${typeFile}`
        const reader = new FileReader()
    
        if(options.useButton == true) {
            reader.readAsArrayBuffer(buffer)
            reader.onload = async () => {
                if(options.loading !== undefined) options.loading(true)                

                ___browserSync___.socket.emit('assetsUpload', buffer, nameFile)
                await new Promise(resolve => ___browserSync___.socket.once('uploadDone', path => {
                    setTimeout(() => {
                        resolve(options.path(`http://localhost:3000/${path}`))
                    }, 300)
                }))

                if(options.loading !== undefined) options.loading(false)
            }
            reader.onerror = () => console.error(reader.error)
        } else {
            reader.readAsArrayBuffer(buffer)
            reader.onload = async () => {
                if(options.customClass !== undefined) element.parentElement.classList.add(options.customClass)
                if(options.loading !== undefined) options.loading(true)
    
                ___browserSync___.socket.emit('assetsUpload', buffer, nameFile)
                await new Promise(resolve => ___browserSync___.socket.once('uploadDone', path => {
                    setTimeout(() => {
                        if(options.customClass !== undefined) element.parentElement.classList.remove(options.customClass)
                        if(options.position !== undefined) {
                            resolve(options.path(`http://localhost:3000/${path}`, options.position))
                        } else {
                            resolve(options.path(`http://localhost:3000/${path}`))
                        }
                    }, 300)
                }))

                if(options.loading !== undefined) options.loading(false)
            }
            reader.onerror = () => console.error(reader.error)
        }
    }
}