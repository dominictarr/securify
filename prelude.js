
//borrowed from browser-pack

(function(parent_req, modules, cache, entry) {
    function require(name){
        if(!cache[name]) {
            if(!modules[name]) {
                // if we cannot find the item within our internal map revert to parent
                if (parent_req) return parent_req(name);
                throw new Error('Cannot find module \'' + name + '\'');
            }
            var m = cache[name] = {exports:{}};
            modules[name][0](function(x){
                var id = modules[name][1][x];
                return require(id ? id : x);
            },m,m.exports);
        }
        return cache[name].exports
    }
    return require(entry[0])
})
//in this scheme, we'll always have an main require.
(require, {
