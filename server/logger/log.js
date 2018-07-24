var log4js = require('log4js');
var path = require('path')
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require("nodemailer-wellknown");
var config_qq = wellknown("QQ");
config_qq.auth = {
    user:'6000329@qq.com',
    pass:'q217891qqqqhhq'
}
//log the cheese logger messages to a file, and the console ones as well.
//https://blog.csdn.net/u010528747/article/details/54603254
console.log(path.join(__dirname, '../logs/cheese2.log_2018-07-19'))
log4js.configure({
    appenders: {
        cheese: { type: 'file', filename: path.join(__dirname, '../logs/cheese.log'), maxLogSize: 1024, numBackups:10}
        ,chat: { type: 'dateFile', filename: path.join(__dirname, '../logs/cheese2.log'), pattern: "_yyyy-MM-dd", maxLogSize: 1024, numBackups:3, alwaysIncludePattern: true }
        ,email: {
            type: '@log4js-node/smtp',
            SMTP: smtpTransport(config_qq).options,
            recipients :"thinkive@163.com",
            subject: 'Latest logs11',
            sender :"6000329@qq.com",
            text: '这是一封来自 Node.js 的测试邮件', // plain text body
            html: '<b>这是一封来自 Node.js 的测试邮件</b>', // html body
            attachment: {
                enable: true, // 是否使用附件
                filename: path.join(__dirname, '../logs/cheese2.log_2018-07-19'), //将最新错误信息写进文件
                message: 'See the attachment for the latest logs' // 邮件文本内容
            },
            sendInterval: 1,
            shutdownTimeout: 5
        }
     },
    categories: {
        default: { appenders: ['cheese'], level: 'error' }
        ,chat: { appenders: [ 'chat' ], level: 'error' }
        ,email: { appenders: [ 'email' ], level: 'error' }
    }
});
var logger = log4js.getLogger('chat');
logger.error('this is test log info!');
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');
// var logger2 = log4js.getLogger('cheese');
// logger2.error('Cheese is too ripe2!');
//
// var email = log4js.getLogger('email');
// email.error('Cheese is too ripe email!');

// logger.level = info;//trace,debug，info,warn,error,fatal,只答应比设置级别高的日志
module.exports = logger
