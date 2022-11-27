module.exports = function(obj1, obj2, options) {
    if(obj1 == false && obj2 == false) {
        return options.inverse(this)
    } else if(obj1 == true && obj2 == false) {
        return options.fn(this)
    } else if(obj1 == false && obj2 == true) {
        return options.fn(this)
    } else {
        return options.fn(this)
    }
}