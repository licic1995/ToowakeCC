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

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect:'mysql',
    pool:{
        max: 10,
        min: 0,
        idle: 30000
    }
});

var Mission = sequelize.define('mission',{
    MID:{
        type:Sequelize.INTEGER(5),
        primaryKey:true,
        notNull: true,
        autoIncrement:true
    },
    UID:{
        type:Sequelize.INTEGER(5),
        notNull: true,
    },
    detail:{
        type:Sequelize.STRING(200),
        notNull: true,
    },
    value:{
        type:Sequelize.STRING(50),
        notNull: true,
    },
    status:{
        type:Sequelize.BOOLEAN,
        notNull: true,
    },
    target:{
        type:Sequelize.INTEGER(5),
        notNull:false
    },
    time:{
        type:Sequelize.DATE,
        notNull:true
    }
},{
    timestamps: false
});



/**
 * 发布任务
 * Request Method : POST /debangMissionRelease
 * Post Prop : 
 *      UID : 发布者ID
 *      detail : 任务描述
 *      value : 任务代价
 *      status : 任务是否被接取(一般情况下设置为（默认）false)
 * Return :
 *      Type : JSON
 *      Prop : {
 *          status : suc / err
 *          mission: Info of mission / NULL
 *          Info   : NULL
 *      }
 */
var missionRelease = (async(ctx, next) => {
    var UID = ctx.request.body.UID || 0,
        detail = ctx.request.body.detail || '',
        value = ctx.request.body.value || '',
        status = ctx.request.body.status || false;
    
    //检测是否重复
    var result1 = await Mission.findAll({
        where: {
            UID:UID,
            detail:detail,
            value:value,
            status:status
        }
    });
    if(result1.length == 0)
    {
        console.log('\nMission Release data create:');
        var result = await Mission.create({
            UID:UID,
            detail:detail,
            value:value,
            status:status,
        });
        console.log(`\nMission Release data findAll(UID:${UID}):`);
        var u = await Mission.findAll({
            where: {
                UID:UID,
                detail:detail,
                value:value,
                status:status
            }
        });
        if(u.length > 0){
            ctx.response.body=[{
                "status":"suc",
                "mission": u
            }];
        } else {
            //入库失败
            ctx.response.body=[{
                "status":"err"
            }];
        }
    } else {
        //重复发布
        ctx.response.body=[{
            "status":"err"
        }];
    }
});

/**
 * 任务接取
 * Request : POST /debangMissionAccept
 * POST Prop:
 *      MID : 接取任务的ID
 *      UID : 接取者的ID
 * Return :
 *      Type : JSON
 *      Prop : {
 *          status : suc / err
 *          mission: Info of mission / NULL
 *          Info   : not accept(接取失败) / not found(任务不存在或者已被接取)
 *      }
 */
var missionAccept = (async(ctx, next) => {
    var MID = ctx.request.body.MID || '';
    var UID = ctx.request.body.UID || '';

    console.log(`\nMission Accpet data findAll(MID:${MID}):`);
    var result = await Mission.findAll({
        where: {
            MID:MID,
        }
    });
    //上下段 定任务存在且没被接取
    if(result.length > 0 && JSON.parse(result).status == false){
        console.log(`\nMission Accpet data updata(UID:${UID}):`);
        await Mission.update({
            status:true,
            target:UID
        },{
            where: {
                MID:MID
            }
        });
        console.log(`\nMission Accpet data findAll(MID:${MID}):`);
        var u = await Mission.findAll({
            where: {
                MID:MID,
                target:UID
            }
        });
        //上下段 确定任务成功被接取
        if(u.length>0){
            ctx.response.body = [{
                "status":"suc",
                "mission":u
            }];
        } else {
            //任务接取失败。。
            ctx.response.body = [{
                "status":"err",
                "info":"not accept"
            }];
        }
    } else {
        // 任务被接取或没找到
        ctx.response.body = [{
            "status":"err",
            "info":"not found"
        }];
    }
});

/**
 * 获取任务列表
 * Request : GET /debangMissionShow
 * Return :
 *      Type : JSON
 *      Prop : Mission(s)
 */
var missionShow = (async(ctx, next) => {
    console.log(`\nMission Show data findAll:`);
    var u = await Mission.findAll();
    ctx.response.body = [u];
});

module.exports={
    "POST /debangMissionRelease":missionRelease,
    "POST /debangMissionAccept":missionAccept,
    "GET /debangMissionRelease":missionRelease,
    "GET /debangMissionAccept":missionAccept,
    "GET /debangMissionShow": missionShow
};