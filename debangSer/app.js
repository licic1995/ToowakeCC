const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const app = new Koa();

// =.=
const isProduction = process.env.NODE_ENV === 'production';



app.use(async (ctx, next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url}   ...`);
     var start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time',`${execTime}ms`);
});

app.use(bodyParser());
app.use(controller());




app.listen(3000);
console.log('app start at port 3000...');
