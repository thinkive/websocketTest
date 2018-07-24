var  nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require("nodemailer-wellknown");
var config_qq = wellknown("QQ");
var config_163 = wellknown("163");
var path = require('path')
config_qq.auth = {
    user:'6000329@qq.com',
    pass:'q217891qqqqhhq'
}
config_163.auth = {
    user:'thinkive@163.com',
    pass:'217891qqqq'
}
console.log(smtpTransport(config_qq))
// qq --->163
var transporterQQ = nodemailer.createTransport(smtpTransport(config_qq));

var mailQQOptions = {
    from:"name<6000329@qq.com>",
    to:"thinkive@163.com",
    subject:"test",
    text: '这是一封来自 Node.js 的测试邮件', // plain text body
    html: '<b>这是一封来自 Node.js 的测试邮件</b>', // html body
    // 下面是发送附件，不需要就注释掉
    attachments: [{
        filename: path.join(__dirname, 'server.crt')
    },
    {
        filename: '脚本.txt',
        content: '发送内容'
    }
    ]
};

// send mail with defined transport object
transporterQQ.sendMail(mailQQOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});

// 163 --->1qq
var transporter163 = nodemailer.createTransport(smtpTransport(config_163));

var mail163Options = {
    from:"name<thinkive@163.com>",
    to:"6000329@qq.com",
    subject:"test",
    text: '这是一封来自 Node.js 的测试邮件', // plain text body
    html: '<b>这是一封来自 Node.js 的测试邮件</b>', // html body
    // 下面是发送附件，不需要就注释掉
    attachments: [{
        filename: path.join(__dirname, 'server.crt')
    },
        {
            filename: '脚本.txt',
            content: '发送内容'
        }
    ]
};

// send mail with defined transport object
transporter163.sendMail(mail163Options, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});