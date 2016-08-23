//引入express模块
var express = require('express'),
    app = express(),
    //创建一个服务器
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),//引入socket.io模块并绑定到服务器
    users = [];//用于保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));//指定静态HTML文件的位置
//监听80端口
server.listen(80);
//socket部分
io.on('connection', function(socket){
    //昵称设置
    socket.on('login', function(nickname){
        if(users.indexOf(nickname) > -1){
            socket.emit('nickExisted');//socket.emit()来激发一个事件
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            //向所有连接到服务器的客户端发送当前登陆用户的昵称
            io.sockets.emit('system', nickname, users.length, 'login');
        }
    });
    //断开连接的事件
    socket.on('disconnect', function(){
        //将断开连接的用户从users中删除
        users.splice(socket.usersIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    socket.on('postMsg', function(msg, color){
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
});

