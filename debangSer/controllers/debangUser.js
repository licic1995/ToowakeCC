var Sequelize = require('sequelize');

/**
 * 
 * 以下为Sequelize 和 相关数据库信息 的初始化
 * 
 * **/
var config = {
    database:'licic',
    username:'root',
    password:'',
    host:'localhost',
    port:'3306'
}
//TODO: WARNING!!! Create mysql modul. 
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect:'mysql',
    pool:{
        max: 10,
        min: 0,
        idle: 30000
    }
});

var User = sequelize.define('user',{
    UID:{
        type:Sequelize.INTEGER(5),
        primaryKey:true,
        notNull: true,
        autoIncrement:true
    },
    username:{
        type:Sequelize.STRING(40),
        notNull: true,
    },
    password:{
        type:Sequelize.STRING(32),
        notNull: true,
    },
    phone:{
        type:Sequelize.STRING(15),
        notNull: true,
    },
    email:{
        type:Sequelize.STRING(50),
        notNull: true,
    }
},{
    timestamps: false
});

/**
 * 用户注册
 * Request Method : POST /debangUserSignIn
 * Post Prop : 
 *      username : 用户名
 *      password : 密码（加密后)
 * Return :
 *      Type : JSON
 *      Prop : {
 *          status : suc / err
 *          user   : Info of user / NULL
 *      }
 */
var signInUser = (async(ctx, next) => {
    var userName = ctx.request.body.username || '';
    var passWord = ctx.request.body.password || '';
    var u = await User.findAll({
            where: {
                username:userName,
                password:passWord
            }
        });
    console.log(`signInUser :  result :${u}`);  
    if(u.length > 0){
         ctx.response.body = [{
            "status":"suc",
            "user":u
        }];
    }else{
        ctx.response.body = [{
            "status":"err"
        }]
    }
});

/**
 * 用户注册
 * Request Method : POST /debangUserSignUp
 * Post Prop : 
 *      username : 用户名
 *      password : 密码（加密后）
 *      phone : 电话号码
 *      email : 邮件地址
 * Return :
 *      Type : JSON
 *      Prop : {
 *          status : suc / err
 *          user   : Info of user / NULL
 *      }
 */
var signUpUser = (async(ctx, next) => {
    var userName = ctx.request.body.username || `defult`;
    var passWord = ctx.request.body.password || `defult`;
    var pHone = ctx.request.body.phone || `defult`;
    var eMail = ctx.request.body.email || `defult`;
    var result = await User.findAll({
        where: {
            username:userName,
            password:passWord
            //password : password
            //same name is ok
        }
    });
    console.log(`signUpUser :  check :${result}`);
    if(result.length == 0){            
        var u = await User.create({
            username:userName,
            password:passWord,
            phone:pHone,
            email:eMail
        });
        console.log(`signUpUser :  created` + JSON.stringify(u));
        ctx.response.body=[{
            "status":"suc",
            "user":u
        }];
    }else{
        ctx.response.body=[{"status":"exist"}];
    }
});
module.exports={
    "POST /debangUserSignIn":signInUser,
    "POST /debangUserSignUp":signUpUser,
    "GET /debangUserSignIn":signInUser,
    "GET /debangUserSignUp":signUpUser
};