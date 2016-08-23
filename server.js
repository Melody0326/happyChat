//����expressģ��
var express = require('express'),
    app = express(),
    //����һ��������
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),//����socket.ioģ�鲢�󶨵�������
    users = [];//���ڱ������������û����ǳ�
app.use('/', express.static(__dirname + '/www'));//ָ����̬HTML�ļ���λ��
//����80�˿�
server.listen(80);
//socket����
io.on('connection', function(socket){
    //�ǳ�����
    socket.on('login', function(nickname){
        if(users.indexOf(nickname) > -1){
            socket.emit('nickExisted');//socket.emit()������һ���¼�
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            //���������ӵ��������Ŀͻ��˷��͵�ǰ��½�û����ǳ�
            io.sockets.emit('system', nickname, users.length, 'login');
        }
    });
    //�Ͽ����ӵ��¼�
    socket.on('disconnect', function(){
        //���Ͽ����ӵ��û���users��ɾ��
        users.splice(socket.usersIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    socket.on('postMsg', function(msg, color){
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
});

