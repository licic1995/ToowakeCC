var fs = require('fs');


function addMapping(router, mapping){
    for(var url in mapping){
        console.log(`what the url:${url}`);
        if(url.startsWith('GET ')){
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir){
    var files = fs.readdirSync(__dirname + '/' + dir);
    var js_files = files.filter((x)=>{
        return x.endsWith('.js');
    }, files);


    for(var f of js_files){
        console.log(`process controller: ${f}...`);
        var mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function(dir){
    var controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router,controllers_dir);
    return router.routes();
}