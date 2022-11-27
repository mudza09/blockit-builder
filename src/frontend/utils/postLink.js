export default function postLink(string) {
    const rawString = string.toLowerCase()
    const trimmedString = rawString.replace(/^(.{50}[^\s]*).*/, "$1").replace(/ /g,"-").replace(/[^a-zA-Z0-9_-]/g,'')

    return trimmedString
}