export default function hbsTemplate() {
    const string = {}

    // send trigger to host
    ___browserSync___.socket.emit('triggerTagSources', 'empty')

    // receive syntax source data
    ___browserSync___.socket.once('tagSourcesData', async data => {
        const result = await data
        Object.assign(string, result)
    })

    return string
}