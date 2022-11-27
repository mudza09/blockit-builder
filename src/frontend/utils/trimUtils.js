export default function trimTitle(string) {
    let cut = string.indexOf(' ', 50)
    if(cut == -1) return string
    return string.substring(0, cut) + ' ...'
}