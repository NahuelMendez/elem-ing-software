exports.setTimeout = function() {
    return global.setTimeout.apply(global, arguments);
}